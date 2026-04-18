package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "templates")
@Data
@NoArgsConstructor
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code; // e.g., 'restaurant-deluxe', 'tech-saas'
    private String name;
    private String category;
    private String description;
    private String defaultColorPalette;
    private String defaultTypography;
}
