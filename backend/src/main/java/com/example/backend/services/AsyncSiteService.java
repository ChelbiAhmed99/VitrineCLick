package com.example.backend.services;

import com.example.backend.models.Site;
import com.example.backend.repositories.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class AsyncSiteService {

    @Autowired
    private AiIntegrationService aiIntegrationService;

    @org.springframework.beans.factory.annotation.Value("${ai.service.url}")
    private String aiServiceUrl;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private NotificationService notificationService;

    @Async
    public void generateAiContent(Long siteId, String primaryColor, String font, String style) {
        Site site = siteRepository.findById(siteId).orElseThrow();
        Long userId = site.getOwner().getId();

        try {
            // Step 1: Generate Logo
            site.setGenerationStatus("GENERATING_LOGO");
            siteRepository.save(site);
            notificationService.sendNotification(userId, Map.of(
                "type", "SITE_STATUS",
                "siteId", siteId,
                "status", "GENERATING_LOGO",
                "message", "Génération du logo..."
            ));

            String logoPrompt = "Professional logo for " + site.getCompanyName() + ", " + site.getDescription();
            String logoUrl = aiIntegrationService.generateLogo(logoPrompt, "modern", "vector");
            
            if (logoUrl != null) {
                if (logoUrl.startsWith("/static/")) {
                    logoUrl = aiServiceUrl + logoUrl;
                }
                site.setLogoUrl(logoUrl);
                siteRepository.save(site);
                notificationService.sendNotification(userId, Map.of(
                    "type", "SITE_STATUS",
                    "siteId", siteId,
                    "logoUrl", logoUrl,
                    "status", "GENERATING_CONTENT",
                    "message", "Logo généré ! Génération du contenu..."
                ));
            }

            // Step 2: Generate Site Content
            site.setGenerationStatus("GENERATING_CONTENT");
            siteRepository.save(site);

            String jsonContent = aiIntegrationService.generateSiteContent(
                site.getCompanyName(), 
                site.getDescription(), 
                site.getCategory(),
                primaryColor,
                font,
                style,
                site.getAddress(),
                site.getPhone(),
                site.getEmail()
            );

            if (jsonContent != null) {
                site.setGeneratedVisuals(jsonContent);
                site.setPublished(true);
                site.setGenerationStatus("COMPLETED");
                siteRepository.save(site);
                
                notificationService.sendNotification(userId, Map.of(
                    "type", "SITE_STATUS",
                    "siteId", siteId,
                    "status", "COMPLETED",
                    "message", "Votre vitrine est prête !"
                ));
            } else {
                site.setGenerationStatus("FAILED");
                siteRepository.save(site);
            }

        } catch (Exception e) {
            site.setGenerationStatus("FAILED");
            siteRepository.save(site);
            notificationService.sendNotification(userId, Map.of(
                "type", "SITE_STATUS",
                "siteId", siteId,
                "status", "FAILED",
                "message", "Échec de la génération IA."
            ));
        }
    }
}
