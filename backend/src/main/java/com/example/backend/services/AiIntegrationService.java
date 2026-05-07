package com.example.backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(AiIntegrationService.class);

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    public String generateLogo(String prompt, String color, String style) {
        String url = aiServiceUrl + "/generate";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("prompt", prompt);
        requestBody.put("color", color);
        requestBody.put("style", style);
        requestBody.put("batchSize", 1);
        requestBody.put("simulate", false); // Production mode

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                @SuppressWarnings("unchecked")
                List<String> imageUrls = (List<String>) response.get("imageUrls");
                if (imageUrls != null && !imageUrls.isEmpty()) {
                    return imageUrls.get(0);
                }
            }
        } catch (Exception e) {
            logger.error("Error communicating with AI Service: {}", e.getMessage());
        }
        return null;
    }

    public String generateSiteContent(String companyName, String description, String category, String primaryColor, String font, String style, String address, String phone, String email) {
        String url = aiServiceUrl + "/generate-copy";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("companyName", companyName);
        requestBody.put("description", description);
        requestBody.put("category", category);
        requestBody.put("primaryColor", primaryColor != null ? primaryColor : "#2B3970");
        requestBody.put("font", font != null ? font : "Inter");
        requestBody.put("style", style != null ? style : "premium");
        requestBody.put("address", address);
        requestBody.put("phone", phone);
        requestBody.put("email", email);
        requestBody.put("simulate", false); // Production mode

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                Object content = response.get("content");
                if (content != null) {
                    // Convert map back to JSON string for storage
                    try {
                        return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(content);
                    } catch (Exception e) {
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error communicating with AI Service for content: {}", e.getMessage());
        }
        return null;
    }
}
