package com.example.backend.controllers;

import com.example.backend.dto.MessageResponse;
import com.example.backend.dto.SiteRequest;
import com.example.backend.models.Site;
import com.example.backend.models.Template;
import com.example.backend.models.User;
import com.example.backend.repositories.SiteRepository;
import com.example.backend.repositories.TemplateRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.services.AiIntegrationService;
import com.example.backend.services.AsyncSiteService;
import com.example.backend.services.NotificationService;
import com.example.backend.services.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sites")
public class SiteController {

    @Autowired
    SiteRepository siteRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TemplateRepository templateRepository;
    
    @Autowired
    AiIntegrationService aiIntegrationService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    AsyncSiteService asyncSiteService;

    @Autowired
    PlanService planService;

    @GetMapping
    public ResponseEntity<List<Site>> getUserSites() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Site> sites = siteRepository.findByOwnerId(userDetails.getId());
        return ResponseEntity.ok(sites);
    }

    @PostMapping
    public ResponseEntity<?> createSite(@RequestBody SiteRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow();

        // ── Plan limit: max sites ─────────────────────────────────────────
        long siteCount = siteRepository.findByOwnerId(userDetails.getId()).size();
        if (!planService.canCreateSite(userDetails.getId(), siteCount)) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                "error", "PLAN_LIMIT_REACHED",
                "feature", PlanService.F_MULTI_SITES,
                "message", "Votre plan Basic est limité à 1 vitrine. Passez au plan Pro pour en créer plus."
            ));
        }

        // ── Plan limit: premium templates ─────────────────────────────────
        if (request.getTemplateId() != null && request.getTemplateId() > 2
                && !planService.hasFeature(userDetails.getId(), PlanService.F_PREMIUM_TEMPLATES)) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                "error", "PLAN_LIMIT_REACHED",
                "feature", PlanService.F_PREMIUM_TEMPLATES,
                "message", "Les templates premium sont réservés aux plans Pro et Business."
            ));
        }

        Site site = new Site();
        site.setCompanyName(request.getCompanyName());
        site.setDescription(request.getDescription());
        site.setCategory(request.getCategory());
        site.setAddress(request.getAddress());
        site.setPhone(request.getPhone());
        site.setEmail(request.getEmail());
        
        // Default to a sanitized company name if no subdomain provided
        String sub = request.getSubdomain() != null ? request.getSubdomain() : request.getCompanyName().replaceAll("\\s+", "").toLowerCase();
        
        if (request.getSubdomain() == null && siteRepository.findBySubdomain(sub).isPresent()) {
            // Append random suffix
            sub = sub + "-" + (int)(Math.random() * 1000);
        }
        
        site.setSubdomain(sub);
        
        if (request.getTemplateId() != null) {
            Optional<Template> tmpl = templateRepository.findById(request.getTemplateId());
            tmpl.ifPresent(site::setTemplate);
        }
        
        if (request.getTemplateConfig() != null) {
            site.setTemplateConfig(request.getTemplateConfig());
        }
        if (request.getTemplateIdString() != null) {
            site.setColorTheme(request.getTemplateIdString());
        }

        // Mapping SEO & advanced settings
        site.setMetaTitle(request.getMetaTitle());
        site.setMetaDescription(request.getMetaDescription());

        site.setOwner(currentUser);

        // Set initial status
        site.setGenerationStatus("INITIALIZING");
        site.setPublished(false);
        
        // Save initially to get an ID and allow frontend to see it
        Site savedSite = siteRepository.save(site);
        
        // ── AI generation ─────────────────────────────────────────────────
        if (request.isAiMode()) {
            if (!planService.hasFeature(userDetails.getId(), PlanService.F_AI_BASIC)) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "error", "PLAN_LIMIT_REACHED",
                    "feature", PlanService.F_AI_BASIC,
                    "message", "La génération IA n'est pas disponible sur votre plan."
                ));
            }
            if (!planService.canUseAi(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "error", "AI_QUOTA_EXCEEDED",
                    "feature", PlanService.F_AI_ADVANCED,
                    "message", "Quota IA atteint. Passez au plan Pro pour 100 générations/mois."
                ));
            }
            planService.incrementAiUsage(userDetails.getId());
            asyncSiteService.generateAiContent(
                savedSite.getId(),
                request.getPrimaryColor(),
                request.getFont(),
                request.getStyle()
            );
        } else {
            savedSite.setGenerationStatus("COMPLETED");
            siteRepository.save(savedSite);
        }

        notificationService.sendNotification(userDetails.getId(), Map.of(
            "type", "SITE_CREATED",
            "siteId", savedSite.getId(),
            "message", "La création de votre site '" + site.getCompanyName() + "' a débuté !"
        ));

        return ResponseEntity.ok(savedSite);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSite(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Site> site = siteRepository.findById(id);
        
        if (site.isPresent() && site.get().getOwner().getId().equals(userDetails.getId())) {
            return ResponseEntity.ok(site.get());
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Site not found or unauthorized"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSite(@PathVariable Long id, @RequestBody SiteRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Site site = siteRepository.findById(id).orElseThrow();

        if (!site.getOwner().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized"));
        }

        site.setCompanyName(request.getCompanyName());
        site.setDescription(request.getDescription());
        site.setCategory(request.getCategory());
        site.setPhone(request.getPhone());
        site.setEmail(request.getEmail());
        site.setAddress(request.getAddress());
        site.setPublished(request.isPublished());

        if (request.getTemplateId() != null) {
            Optional<Template> tmpl = templateRepository.findById(request.getTemplateId());
            tmpl.ifPresent(site::setTemplate);
        }
        if (request.getTemplateConfig() != null) {
            site.setTemplateConfig(request.getTemplateConfig());
        }
        if (request.getTemplateIdString() != null) {
            site.setColorTheme(request.getTemplateIdString());
        }
        
        site.setMetaTitle(request.getMetaTitle());
        site.setMetaDescription(request.getMetaDescription());

        siteRepository.save(site);
        notificationService.sendNotification(userDetails.getId(), Map.of(
            "type", "SITE_UPDATE",
            "message", "Le site '" + site.getCompanyName() + "' a été mis à jour."
        ));
        return ResponseEntity.ok(site);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSite(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Site site = siteRepository.findById(id).orElseThrow();

        if (!site.getOwner().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized"));
        }

        siteRepository.delete(site);
        notificationService.sendNotification(userDetails.getId(), Map.of(
            "type", "SITE_DELETE",
            "siteId", id,
            "message", "Le site a été supprimé."
        ));
        return ResponseEntity.ok(new MessageResponse("Site deleted successfully"));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<?> togglePublish(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Site site = siteRepository.findById(id).orElseThrow();

        if (!site.getOwner().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Unauthorized"));
        }

        site.setPublished(!site.isPublished());
        siteRepository.save(site);
        notificationService.sendNotification(userDetails.getId(), Map.of(
            "type", "SITE_PUBLISH_TOGGLE",
            "siteId", site.getId(),
            "published", site.isPublished(),
            "message", "Visibilité du site '" + site.getCompanyName() + "' modifiée."
        ));
        return ResponseEntity.ok(site);
    }

    @PostMapping("/{id}/visit")
    public ResponseEntity<?> recordVisit(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return siteRepository.findById(id).map(site -> {
            if (site.getVisits() == null) site.setVisits(0L);
            site.setVisits(site.getVisits() + 1);
            
            if(payload != null && payload.containsKey("retention")) {
                if (site.getRetentionTimeSeconds() == null) site.setRetentionTimeSeconds(0L);
                site.setRetentionTimeSeconds(site.getRetentionTimeSeconds() + Long.valueOf(payload.get("retention").toString()));
            }
            if (site.getAiScore() == null || site.getAiScore() == 0.0) site.setAiScore(75.5);
            
            // Randomly increase or decrease score for simulation, max 100
            double variation = (Math.random() - 0.2); // slight upwards bias
            site.setAiScore(Math.min(100.0, Math.max(0.0, site.getAiScore() + variation)));
            
            siteRepository.save(site);
            
            try {
                notificationService.sendNotification(site.getOwner().getId(), Map.of(
                    "type", "SITE_UPDATE", 
                    "siteId", site.getId(),
                    "visits", site.getVisits(),
                    "retention", site.getRetentionTimeSeconds(),
                    "aiScore", site.getAiScore()
                ));
                // Send dummy admin notification for global update
                notificationService.sendNotification(1L, Map.of("type", "GLOBAL_UPDATE"));
            } catch(Exception e) {}

            return ResponseEntity.ok(Map.of("message", "Visit recorded"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
