package com.example.backend.controllers;

import com.example.backend.models.Site;
import com.example.backend.models.Subscription;
import com.example.backend.models.User;
import com.example.backend.repositories.SiteRepository;
import com.example.backend.repositories.SubscriptionRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SiteRepository siteRepository;

    @Autowired
    SubscriptionRepository subscriptionRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalSites", siteRepository.count());
        stats.put("totalSubscriptions", subscriptionRepository.count());
        
        long activeSubs = subscriptionRepository.findAll().stream()
                .filter(s -> "ACTIVE".equals(s.getStatus()))
                .count();
        stats.put("activeSubscriptions", activeSubs);
        stats.put("activeSubscriptions", activeSubs);

        List<Site> allSites = siteRepository.findAll();
        double avgHealth = allSites.stream()
                .mapToDouble(s -> s.getAiScore() == null ? 0.0 : s.getAiScore())
                .average()
                .orElse(0.0);
        
        stats.put("healthScore", avgHealth);
        stats.put("growthRate", 0.0); // Historical DB tables missing, real growth 0% pour l'instant

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/sites")
    public ResponseEntity<List<Site>> getAllSites() {
        return ResponseEntity.ok(siteRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/sites/{id}")
    public ResponseEntity<?> deleteSite(@PathVariable Long id) {
        siteRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/sites/{id}/toggle-publish")
    public ResponseEntity<?> toggleSitePublish(@PathVariable Long id) {
        return siteRepository.findById(id).map(site -> {
            site.setPublished(!site.isPublished());
            siteRepository.save(site);
            return ResponseEntity.ok(site);
        }).orElse(ResponseEntity.notFound().build());
    }
}
