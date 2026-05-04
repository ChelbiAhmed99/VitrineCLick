package com.example.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    /** Billing cycle: MONTHLY or ANNUAL */
    private String plan;

    /** Plan tier: BASIC, PRO, BUSINESS */
    private String planTier;

    /** Status: ACTIVE, CANCELLED, EXPIRED */
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    /** AI generation usage counter */
    private Integer aiUsage = 0;
}
