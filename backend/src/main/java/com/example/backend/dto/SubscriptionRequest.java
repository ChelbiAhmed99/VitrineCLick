package com.example.backend.dto;

import lombok.Data;

@Data
public class SubscriptionRequest {
    private String plan; // e.g., "MONTHLY", "ANNUALLY"
    // In a real app, this would include a payment token (Stripe, Paypal)
    private String paymentToken; 
}
