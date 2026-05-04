import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, Plan } from '../services/subscription.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2 class="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3">Tarification</h2>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Prêt à lancer votre <span class="text-indigo-600">vitrine ?</span>
          </h1>
          <p class="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Choisissez le plan qui correspond le mieux à vos besoins. Aucun frais caché, annulation possible à tout moment.
          </p>

          <!-- Toggle (Simulated) -->
          <div class="mt-10 flex items-center justify-center gap-4">
            <span [class.text-indigo-600]="!isYearly" class="font-bold text-sm">Mensuel</span>
            <button (click)="isYearly = !isYearly" class="w-14 h-7 bg-indigo-600 rounded-full relative p-1 transition-all">
              <div class="w-5 h-5 bg-white rounded-full transition-all" [class.translate-x-7]="isYearly"></div>
            </button>
            <span [class.text-indigo-600]="isYearly" class="font-bold text-sm flex items-center gap-2">
              Annuel <span class="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-black">-20%</span>
            </span>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div *ngFor="let plan of plans" 
            class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col relative overflow-hidden"
            [class.ring-2]="plan.popular" [class.ring-indigo-600]="plan.popular">
            
            <div *ngIf="plan.popular" class="absolute top-6 right-[-35px] bg-indigo-600 text-white py-1 px-10 rotate-45 text-[10px] font-black uppercase tracking-widest shadow-lg">
              Populaire
            </div>

            <div class="mb-8">
              <h3 class="text-xl font-black text-slate-900 mb-2">{{ plan.name }}</h3>
              <p class="text-slate-400 text-sm font-medium">{{ plan.description }}</p>
            </div>

            <div class="mb-8">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-slate-900">{{ isYearly ? plan.yearlyPrice : plan.monthlyPrice }}€</span>
                <span class="text-slate-400 font-bold">/{{ isYearly ? 'an' : 'mois' }}</span>
              </div>
            </div>

            <button (click)="selectPlan(plan)"
              class="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mb-10"
              [class]="plan.tier === currentTier ? 'bg-slate-100 text-slate-400 cursor-default' : (plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-white hover:bg-slate-800')">
              {{ plan.tier === currentTier ? 'Plan Actuel' : (plan.monthlyPrice === 0 ? 'Commencer' : 'S\'abonner') }}
            </button>

            <div class="space-y-4">
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Inclus dans ce plan :</p>
              <div *ngFor="let feature of plan.features" class="flex items-center gap-3">
                <div class="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="text-sm font-bold text-slate-600">{{ formatFeatureName(feature) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout Loading Overlay -->
      <div *ngIf="processing" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center">
        <div class="bg-white p-10 rounded-[40px] text-center max-w-sm">
          <div class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 class="text-xl font-black text-slate-900 mb-2">Sécurisation du paiement</h3>
          <p class="text-slate-500 font-medium">Nous traitons votre demande auprès de notre partenaire bancaire...</p>
        </div>
      </div>
    </div>
  `
})
export class PricingComponent implements OnInit {
  plans: Plan[] = [];
  isYearly = false;
  currentTier = 'BASIC';
  processing = false;

  constructor(private subService: SubscriptionService, private router: Router) {}

  ngOnInit() {
    this.subService.getPlans().subscribe(plans => this.plans = plans);
    this.subService.status$.subscribe(s => this.currentTier = s.planTier);
  }

  selectPlan(plan: Plan) {
    if (plan.tier === this.currentTier) return;
    
    this.processing = true;
    setTimeout(() => {
      this.subService.checkout(plan.tier, this.isYearly ? 'ANNUAL' : 'MONTHLY').subscribe({
        next: () => {
          this.processing = false;
          this.router.navigate(['/user']);
        },
        error: () => this.processing = false
      });
    }, 1500);
  }

  formatFeatureName(key: string): string {
    const map: any = {
      CREATE_SITE: 'Création de vitrine',
      MULTI_SITES: 'Vitrines illimitées',
      PREMIUM_TEMPLATES: 'Templates Premium',
      AI_BASIC: 'Génération IA Standard',
      AI_ADVANCED: 'IA Avancée (100+ req/mois)',
      AI_LOGOS: 'Logos IA illimités',
      DOWNLOAD_ASSETS: 'Téléchargement Assets HD',
      CUSTOM_DOMAIN: 'Domaine Personnalisé',
      SEO_ADVANCED: 'SEO Avancé',
      ANALYTICS_BASIC: 'Stats Visites simples',
      ANALYTICS_REALTIME: 'Analytics Temps Réel',
      ANALYTICS_ADVANCED: 'Stats Multi-sites',
      TEAM_MANAGEMENT: 'Gestion d\'équipe',
      WHITE_LABEL: 'Marque Blanche',
      API_ACCESS: 'Accès API',
      EXPORT_DATA: 'Export Données',
      FAST_DEPLOY: 'Déploiement Rapide',
      PRIORITY_SUPPORT: 'Support Prioritaire',
      PREMIUM_SUPPORT: 'Support Dédié 24/7',
      CLIENT_MANAGEMENT: 'Dashboard Clients'
    };
    return map[key] || key;
  }
}
