package com.example.backend.dto;

import lombok.Data;

@Data
public class SiteRequest {
    private String companyName;
    private String description;
    private String category;
    private String address;
    private String phone;
    private String email;
    private String subdomain;
    private Long templateId;
    private boolean published;
    
    // For AI generation
    private String aiPrompt;
    private String defaultColor;
    private String defaultStyle;
    private String templateIdString;
    private String templateConfig;
    private String metaTitle;
    private String metaDescription;
    private boolean aiMode;
    private String primaryColor;
    private String font;
    private String style;
}
