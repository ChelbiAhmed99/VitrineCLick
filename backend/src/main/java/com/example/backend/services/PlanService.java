package com.example.backend.services;

import com.example.backend.models.Subscription;
import com.example.backend.repositories.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Central service for plan-feature enforcement.
 * All feature-gate checks go through here.
 */
@Service
public class PlanService {

    @Autowired
    SubscriptionRepository subscriptionRepository;

    // ─── Plan constants ────────────────────────────────────────────────────
    public static final String BASIC    = "BASIC";
    public static final String PRO      = "PRO";
    public static final String BUSINESS = "BUSINESS";

    // ─── Feature keys (used in frontend too) ──────────────────────────────
    public static final String F_CREATE_SITE          = "CREATE_SITE";
    public static final String F_MULTI_SITES          = "MULTI_SITES";
    public static final String F_PREMIUM_TEMPLATES    = "PREMIUM_TEMPLATES";
    public static final String F_AI_BASIC             = "AI_BASIC";
    public static final String F_AI_ADVANCED          = "AI_ADVANCED";
    public static final String F_AI_LOGOS             = "AI_LOGOS";
    public static final String F_DOWNLOAD_ASSETS      = "DOWNLOAD_ASSETS";
    public static final String F_CUSTOM_DOMAIN        = "CUSTOM_DOMAIN";
    public static final String F_SEO_ADVANCED         = "SEO_ADVANCED";
    public static final String F_ANALYTICS_BASIC      = "ANALYTICS_BASIC";
    public static final String F_ANALYTICS_REALTIME   = "ANALYTICS_REALTIME";
    public static final String F_ANALYTICS_ADVANCED   = "ANALYTICS_ADVANCED";
    public static final String F_TEAM_MANAGEMENT      = "TEAM_MANAGEMENT";
    public static final String F_WHITE_LABEL          = "WHITE_LABEL";
    public static final String F_API_ACCESS           = "API_ACCESS";
    public static final String F_EXPORT_DATA          = "EXPORT_DATA";
    public static final String F_FAST_DEPLOY          = "FAST_DEPLOY";
    public static final String F_PRIORITY_SUPPORT     = "PRIORITY_SUPPORT";
    public static final String F_PREMIUM_SUPPORT      = "PREMIUM_SUPPORT";
    public static final String F_CLIENT_MANAGEMENT    = "CLIENT_MANAGEMENT";

    // ─── Features per plan ─────────────────────────────────────────────────
    private static final Map<String, Set<String>> PLAN_FEATURES = new LinkedHashMap<>();

    static {
        // BASIC
        PLAN_FEATURES.put(BASIC, new HashSet<>(Arrays.asList(
            F_CREATE_SITE, F_AI_BASIC, F_ANALYTICS_BASIC
        )));

        // PRO  (superset of BASIC)
        Set<String> pro = new HashSet<>(PLAN_FEATURES.get(BASIC));
        pro.addAll(Arrays.asList(
            F_MULTI_SITES, F_PREMIUM_TEMPLATES, F_AI_ADVANCED, F_AI_LOGOS,
            F_DOWNLOAD_ASSETS, F_CUSTOM_DOMAIN, F_SEO_ADVANCED,
            F_ANALYTICS_REALTIME, F_FAST_DEPLOY, F_PRIORITY_SUPPORT
        ));
        PLAN_FEATURES.put(PRO, pro);

        // BUSINESS  (superset of PRO)
        Set<String> business = new HashSet<>(PLAN_FEATURES.get(PRO));
        business.addAll(Arrays.asList(
            F_TEAM_MANAGEMENT, F_WHITE_LABEL, F_API_ACCESS, F_EXPORT_DATA,
            F_ANALYTICS_ADVANCED, F_PREMIUM_SUPPORT, F_CLIENT_MANAGEMENT
        ));
        PLAN_FEATURES.put(BUSINESS, business);
    }

    // ─── Limits per plan ───────────────────────────────────────────────────
    private static final Map<String, Integer> MAX_SITES = Map.of(
        BASIC, 1,
        PRO, Integer.MAX_VALUE,
        BUSINESS, Integer.MAX_VALUE
    );

    private static final Map<String, Integer> MAX_AI_CALLS = Map.of(
        BASIC, 10,
        PRO, 100,
        BUSINESS, Integer.MAX_VALUE
    );

    // ─── Public API ────────────────────────────────────────────────────────

    /** Returns the active plan tier for a user, defaulting to BASIC. */
    public String getUserPlanTier(Long userId) {
        return subscriptionRepository
            .findFirstByUserIdAndStatus(userId, "ACTIVE")
            .map(sub -> sub.getPlanTier() != null ? sub.getPlanTier().toUpperCase() : BASIC)
            .orElse(BASIC);
    }

    /** Returns the active subscription for a user (or empty). */
    public Optional<Subscription> getActiveSubscription(Long userId) {
        return subscriptionRepository.findFirstByUserIdAndStatus(userId, "ACTIVE");
    }

    /** Returns true if the user's plan includes the given feature. */
    public boolean hasFeature(Long userId, String feature) {
        String tier = getUserPlanTier(userId);
        return PLAN_FEATURES.getOrDefault(tier, Collections.emptySet()).contains(feature);
    }

    /** Returns all features available to a user. */
    public Set<String> getUserFeatures(Long userId) {
        String tier = getUserPlanTier(userId);
        return PLAN_FEATURES.getOrDefault(tier, Collections.emptySet());
    }

    /** Returns all features for a given plan tier (static lookup, no DB). */
    public Set<String> getFeaturesForPlan(String tier) {
        return PLAN_FEATURES.getOrDefault(tier.toUpperCase(), Collections.emptySet());
    }

    /** Checks if user can still create a new site. */
    public boolean canCreateSite(Long userId, long currentSiteCount) {
        String tier = getUserPlanTier(userId);
        int max = MAX_SITES.getOrDefault(tier, 1);
        return currentSiteCount < max;
    }

    /** Checks if user can still call AI generation. */
    public boolean canUseAi(Long userId) {
        String tier = getUserPlanTier(userId);
        int maxCalls = MAX_AI_CALLS.getOrDefault(tier, 10);
        if (maxCalls == Integer.MAX_VALUE) return true;
        int used = subscriptionRepository
            .findFirstByUserIdAndStatus(userId, "ACTIVE")
            .map(sub -> sub.getAiUsage() != null ? sub.getAiUsage() : 0)
            .orElse(0);
        return used < maxCalls;
    }

    /** Increments the AI usage counter. */
    public void incrementAiUsage(Long userId) {
        subscriptionRepository.findFirstByUserIdAndStatus(userId, "ACTIVE")
            .ifPresent(sub -> {
                sub.setAiUsage((sub.getAiUsage() != null ? sub.getAiUsage() : 0) + 1);
                subscriptionRepository.save(sub);
            });
    }

    /** Returns the max sites allowed for a user. */
    public int getMaxSites(Long userId) {
        String tier = getUserPlanTier(userId);
        return MAX_SITES.getOrDefault(tier, 1);
    }

    /** Returns the max AI calls allowed for a user. */
    public int getMaxAiCalls(Long userId) {
        String tier = getUserPlanTier(userId);
        return MAX_AI_CALLS.getOrDefault(tier, 10);
    }

    /** Returns a plan-info map for the pricing page (static). */
    public static List<Map<String, Object>> getAllPlans() {
        List<Map<String, Object>> plans = new ArrayList<>();

        plans.add(Map.of(
            "tier", BASIC,
            "name", "Basic",
            "monthlyPrice", 0,
            "yearlyPrice", 0,
            "popular", false,
            "features", PLAN_FEATURES.get(BASIC),
            "maxSites", 1,
            "maxAiCalls", 10,
            "description", "Idéal pour démarrer votre première vitrine en ligne"
        ));

        plans.add(Map.of(
            "tier", PRO,
            "name", "Pro",
            "monthlyPrice", 29,
            "yearlyPrice", 290,
            "popular", true,
            "features", PLAN_FEATURES.get(PRO),
            "maxSites", -1,
            "maxAiCalls", 100,
            "description", "Pour les entrepreneurs qui veulent aller plus loin"
        ));

        plans.add(Map.of(
            "tier", BUSINESS,
            "name", "Business",
            "monthlyPrice", 99,
            "yearlyPrice", 990,
            "popular", false,
            "features", PLAN_FEATURES.get(BUSINESS),
            "maxSites", -1,
            "maxAiCalls", -1,
            "description", "La puissance complète pour les équipes et agences"
        ));

        return plans;
    }
}
