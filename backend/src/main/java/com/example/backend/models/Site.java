package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sites")
@Data
@NoArgsConstructor
public class Site {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String description;
    private String category;
    private String address;
    private String phone;
    private String email;
    private String subdomain;
    private String logoUrl;
    private String generationStatus; // "INITIALIZING", "GENERATING_LOGO", "GENERATING_CONTENT", "COMPLETED"
    
    // JSON or separate strings for generated visuals / theme customization
    @Column(columnDefinition = "TEXT")
    private String generatedVisuals; // e.g., banner urls JSON
    
    private String colorTheme;
    private String typography;

    @Column(columnDefinition = "TEXT")
    private String templateConfig;

    @ManyToOne
    @JoinColumn(name = "template_id")
    private Template template;

    private boolean published = false;

    // SEO & Advanced Theme Settings
    private String metaTitle;
    @Column(columnDefinition = "TEXT")
    private String metaDescription;
    
    @Column(columnDefinition = "TEXT")
    private String themeSettings; // JSON for typography, font-sizes, etc.

    // Real-time Analytics Fields
    @Column(nullable = false, columnDefinition = "bigint default 0")
    private Long visits = 0L;

    @Column(nullable = false, columnDefinition = "float default 0.0")
    private Double aiScore = 0.0;

    @Column(nullable = false, columnDefinition = "bigint default 0")
    private Long retentionTimeSeconds = 0L;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
