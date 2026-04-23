package com.example.backend.controllers;

import com.example.backend.models.Subscription;
import com.example.backend.models.User;
import com.example.backend.repositories.SubscriptionRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    SubscriptionRepository subscriptionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    NotificationService notificationService;

    @GetMapping("/status")
    public ResponseEntity<?> getSubscriptionStatus() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Subscription> sub = subscriptionRepository.findFirstByUserIdAndStatus(userDetails.getId(), "ACTIVE");
        
        if (sub.isPresent()) {
            return ResponseEntity.ok(sub.get());
        }
        return ResponseEntity.ok(Map.of("status", "INACTIVE"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> simulateCheckout(@RequestBody Map<String, String> request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        String plan = request.getOrDefault("plan", "MONTHLY");
        
        // Deactivate existing subscriptions
        subscriptionRepository.findFirstByUserIdAndStatus(user.getId(), "ACTIVE")
                .ifPresent(s -> {
                    s.setStatus("CANCELLED");
                    subscriptionRepository.save(s);
                });

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setStatus("ACTIVE");
        sub.setStartDate(LocalDateTime.now());
        
        if ("ANNUAL".equalsIgnoreCase(plan)) {
            sub.setEndDate(LocalDateTime.now().plusYears(1));
        } else {
            sub.setEndDate(LocalDateTime.now().plusMonths(1));
        }

        subscriptionRepository.save(sub);
        notificationService.sendNotification(userDetails.getId(), Map.of(
            "type", "SUBSCRIPTION_UPDATE",
            "message", "Félicitations ! Votre abonnement " + plan + " est maintenant actif."
        ));

        return ResponseEntity.ok(sub);
    }
}
