package com.example.backend.controllers;

import com.example.backend.models.Template;
import com.example.backend.repositories.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public/templates")
public class TemplateController {

    @Autowired
    TemplateRepository templateRepository;

    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates() {
        return ResponseEntity.ok(templateRepository.findAll());
    }
    
    // Additional admin endpoints to add templates can go here
}
