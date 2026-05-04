package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;
    
    public enum ERole {
        ROLE_CLIENT,
        ROLE_CLIENT_PRO,
        ROLE_CLIENT_BUSINESS,
        ROLE_ADMIN
    }
}
