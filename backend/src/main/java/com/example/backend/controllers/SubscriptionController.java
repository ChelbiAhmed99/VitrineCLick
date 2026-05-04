package com.example.backend.controllers;

import com.example.backend.models.Role;
import com.example.backend.models.Subscription;
import com.example.backend.models.User;
import com.example.backend.repositories.RoleRepository;
import com.example.backend.repositories.SiteRepository;
import com.example.backend.repositories.SubscriptionRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.services.NotificationService;
import com.example.backend.services.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired SubscriptionRepository subscriptionRepository;
    @Autowired UserRepository userRepository;
    @Autowired RoleRepository roleRepository;
    @Autowired SiteRepository siteRepository;
    @Autowired NotificationService notificationService;
    @Autowired PlanService planService;

    // ── GET /api/subscriptions/status ──────────────────────────────────────
    @GetMapping("/status")
    public ResponseEntity<?> getSubscriptionStatus() {
        UserDetailsImpl userDetails = getCurrentUser();
        Long userId = userDetails.getId();
        User user = userRepository.findById(userId).orElseThrow();

        Optional<Subscription> sub = subscriptionRepository.findFirstByUserIdAndStatus(userId, "ACTIVE");
        String tier = planService.getUserPlanTier(userId);
        long siteCount = siteRepository.findByOwnerId(userId).size();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("planTier", tier);
        response.put("features", planService.getUserFeatures(userId));
        response.put("maxSites", planService.getMaxSites(userId));
        response.put("maxAiCalls", planService.getMaxAiCalls(userId));
        response.put("siteCount", siteCount);

        sub.ifPresentOrElse(s -> {
            response.put("status", s.getStatus());
            response.put("billingCycle", s.getPlan());
            response.put("startDate", s.getStartDate());
            response.put("endDate", s.getEndDate());
            response.put("aiUsage", s.getAiUsage() != null ? s.getAiUsage() : 0);
        }, () -> {
            response.put("status", "FREE");
            response.put("billingCycle", "NONE");
            response.put("aiUsage", 0);
        });

        return ResponseEntity.ok(response);
    }

    // ── POST /api/subscriptions/checkout ──────────────────────────────────
    /**
     * Simulates a plan checkout / upgrade.
     * Body: { "planTier": "PRO", "billingCycle": "MONTHLY" }
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> simulateCheckout(@RequestBody Map<String, String> request) {
        UserDetailsImpl userDetails = getCurrentUser();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        String tier         = request.getOrDefault("planTier", "BASIC").toUpperCase();
        String billingCycle = request.getOrDefault("billingCycle", "MONTHLY").toUpperCase();

        if (!List.of("BASIC", "PRO", "BUSINESS").contains(tier)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid plan tier"));
        }

        // Cancel existing active subscription
        subscriptionRepository.findFirstByUserIdAndStatus(user.getId(), "ACTIVE")
            .ifPresent(s -> { s.setStatus("CANCELLED"); subscriptionRepository.save(s); });

        // Create new subscription
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlanTier(tier);
        sub.setPlan(billingCycle);
        sub.setStatus("ACTIVE");
        sub.setStartDate(LocalDateTime.now());
        sub.setAiUsage(0);

        if ("ANNUAL".equalsIgnoreCase(billingCycle)) {
            sub.setEndDate(LocalDateTime.now().plusYears(1));
        } else {
            sub.setEndDate(LocalDateTime.now().plusMonths(1));
        }
        subscriptionRepository.save(sub);

        // Update user role to match the tier
        updateUserRole(user, tier);

        notificationService.sendNotification(userDetails.getId(), Map.of(
            "type", "SUBSCRIPTION_UPDATE",
            "message", "🎉 Félicitations ! Votre abonnement " + tier + " est maintenant actif.",
            "planTier", tier
        ));

        return ResponseEntity.ok(Map.of(
            "message", "Abonnement " + tier + " activé avec succès",
            "planTier", tier,
            "billingCycle", billingCycle,
            "endDate", sub.getEndDate()
        ));
    }

    // ── GET /api/subscriptions/plans ──────────────────────────────────────
    /** Returns all available plans (public, no auth needed). */
    @GetMapping("/plans")
    public ResponseEntity<?> getPlans() {
        return ResponseEntity.ok(PlanService.getAllPlans());
    }

    // ── GET /api/subscriptions/check/{feature} ────────────────────────────
    /** Checks if the current user has access to a given feature. */
    @GetMapping("/check/{feature}")
    public ResponseEntity<?> checkFeature(@PathVariable String feature) {
        UserDetailsImpl userDetails = getCurrentUser();
        boolean allowed = planService.hasFeature(userDetails.getId(), feature);
        String tier = planService.getUserPlanTier(userDetails.getId());
        return ResponseEntity.ok(Map.of(
            "feature", feature,
            "allowed", allowed,
            "planTier", tier
        ));
    }

    // ── GET /api/subscriptions/admin/all ─────────────────────────────────
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionRepository.findAll());
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * Updates the Spring Security role of the user in the DB
     * to match their new plan tier.
     */
    private void updateUserRole(User user, String tier) {
        Role.ERole eName = switch (tier) {
            case "PRO"      -> Role.ERole.ROLE_CLIENT_PRO;
            case "BUSINESS" -> Role.ERole.ROLE_CLIENT_BUSINESS;
            default         -> Role.ERole.ROLE_CLIENT;
        };

        roleRepository.findByName(eName).ifPresent(role -> {
            Set<Role> roles = user.getRoles();
            // Remove existing CLIENT roles, keep ADMIN if any
            roles.removeIf(r ->
                r.getName() == Role.ERole.ROLE_CLIENT ||
                r.getName() == Role.ERole.ROLE_CLIENT_PRO ||
                r.getName() == Role.ERole.ROLE_CLIENT_BUSINESS
            );
            roles.add(role);
            user.setRoles(roles);
            userRepository.save(user);
        });
    }
}
