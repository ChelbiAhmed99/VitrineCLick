package com.example.backend.controllers;

import com.example.backend.dto.MessageResponse;
import com.example.backend.models.Site;
import com.example.backend.repositories.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public/sites")
public class PublicSiteController {

    @Autowired
    SiteRepository siteRepository;

    @GetMapping("/subdomain/{subdomain}")
    public ResponseEntity<?> getSiteBySubdomain(@PathVariable String subdomain) {
        Optional<Site> site = siteRepository.findBySubdomain(subdomain);
        if (site.isPresent() && site.get().isPublished()) {
            return ResponseEntity.ok(site.get());
        } else if (site.isPresent() && !site.get().isPublished()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Site is not published yet."));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getPublicStats() {
        java.util.List<Site> allSites = siteRepository.findAll();
        long publishedCount = allSites.stream().filter(Site::isPublished).count();
        double avgAiScore = allSites.stream().mapToDouble(s -> s.getAiScore() != null ? s.getAiScore() : 0.0).average().orElse(95.0);
        long totalVisits = allSites.stream().mapToLong(s -> s.getVisits() != null ? s.getVisits() : 0).sum();
        
        long totalRetention = allSites.stream().mapToLong(s -> s.getRetentionTimeSeconds() != null ? s.getRetentionTimeSeconds() : 0).sum();
        long avgRetention = publishedCount > 0 ? totalRetention / publishedCount : 0;

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("sitesCount", publishedCount);
        stats.put("totalVisits", totalVisits);
        stats.put("aiScore", Math.round(avgAiScore * 10) / 10.0);
        stats.put("avgRetention", avgRetention);
        
        return ResponseEntity.ok(stats);
    }
}
