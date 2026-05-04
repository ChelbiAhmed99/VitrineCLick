import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { SubscriptionService, PlanStatus, FEATURES } from '../services/subscription.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-700 pb-20 md:pb-0">

      <!-- ======================== SIDEBAR (DESKTOP) ======================== -->
      <aside class="hidden md:flex w-72 bg-gradient-to-b from-[#1e2852] via-[#243060] to-[#2B3970] flex-col h-screen sticky top-0 z-20 shadow-[4px_0_40px_rgba(0,0,0,0.15)] flex-shrink-0">
      <!-- Logo -->
      <div class="px-8 py-7 border-b border-white/8">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 rotate-3 flex-shrink-0 overflow-hidden">
            <img src="/d.png" class="w-8 h-8 object-contain" alt="VitrineClick Logo">
          </div>
          <div>
            <span class="text-xl font-black text-white tracking-tight">User<span class="text-[#FF6B2C]">Panel</span></span>
            <p class="text-[9px] font-bold text-white/25 uppercase tracking-[0.35em]">Identity Studio</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="px-4 py-6 flex-grow space-y-1">
        <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.45em] px-4 mb-5">Gestionnaire</p>

        <button (click)="setTab('sites')"
          class="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden"
          [class]="activeTab==='sites' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
          <span *ngIf="activeTab==='sites'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#FF6B2C] rounded-r-full"></span>
          <svg class="w-5 h-5 flex-shrink-0" [class]="activeTab==='sites'?'text-[#FF6B2C]':'text-white/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Mes Vitrines
          <span class="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full transition-all" [class]="activeTab==='sites' ? 'bg-[#FF6B2C] text-white' : 'bg-white/10 text-white/50'">{{sites.length}}</span>
        </button>

        <button (click)="setTab('assets')"
          class="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden"
          [class]="activeTab==='assets' ? 'bg-white/12 text-white shadow-lg' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
          <span *ngIf="activeTab==='assets'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#FF6B2C] rounded-r-full"></span>
          <svg class="w-5 h-5 flex-shrink-0" [class]="activeTab==='assets'?'text-[#FF6B2C]':'text-white/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Assets IA
        </button>

        <button (click)="setTab('analytics')"
          class="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden"
          [class]="activeTab==='analytics' ? 'bg-white/12 text-white shadow-lg' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
          <span *ngIf="activeTab==='analytics'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#FF6B2C] rounded-r-full"></span>
          <svg class="w-5 h-5 flex-shrink-0" [class]="activeTab==='analytics'?'text-[#FF6B2C]':'text-white/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Statistiques IA
        </button>

        <div class="pt-4 border-t border-white/8 mt-4">
          <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.45em] px-4 mb-5">Compte</p>
          <button (click)="setTab('settings')"
            class="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden"
            [class]="activeTab==='settings' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
            <span *ngIf="activeTab==='settings'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#FF6B2C] rounded-r-full"></span>
            <svg class="w-5 h-5 flex-shrink-0" [class]="activeTab==='settings'?'text-[#FF6B2C]':'text-white/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
            Paramètres
          </button>
        </div>
      </nav>

      <!-- Quick action -->
      <div class="px-4 pb-4">
        <button (click)="openCreateWizard()" class="w-full py-3.5 bg-[#FF6B2C] hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B2C]/25 transition-all hover:-translate-y-0.5 active:translate-y-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
          Nouvelle Vitrine
        </button>
      </div>

      <!-- User Profile Footer -->
      <div class="p-6 border-t border-white/10">
        <div class="flex items-center gap-3 bg-white/5 rounded-2xl p-4 mb-4">
          <div class="w-10 h-10 rounded-xl bg-[#FF6B2C]/20 text-[#FF6B2C] flex items-center justify-center font-black text-sm uppercase flex-shrink-0">
            {{username ? username.charAt(0) : 'U'}}
          </div>
          <div class="overflow-hidden">
            <p class="font-black text-white text-sm truncate">{{username ? '@'+username : 'Studio Client'}}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span class="text-[9px] font-bold text-emerald-400/80 uppercase tracking-wider">Plan {{ subService.getPlanLabel() }} · Actif</span>
            </div>
          </div>
        </div>
        <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-[#FF6B2C]/70 hover:text-[#FF6B2C] hover:bg-white/5 font-bold text-xs uppercase tracking-widest rounded-xl transition-all group">
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- ======================== MAIN ======================== -->
    <main class="flex-1 flex flex-col relative overflow-hidden">
      <!-- Ambient BG -->
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B2C]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2B3970]/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <!-- Header -->
      <header class="bg-white/95 backdrop-blur-xl px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-100/80 shadow-[0_2px_24px_rgba(0,0,0,0.05)]">
        <div class="flex items-center gap-4">
          <div class="hidden md:flex w-10 h-10 rounded-2xl bg-white border border-slate-100 items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
            <img src="/d.png" class="w-7 h-7 object-contain" alt="Logo">
          </div>
          <div>
            <h1 class="text-lg md:text-xl font-black text-[#2B3970] tracking-tight leading-none">
              {{ activeTab === 'sites' ? 'Mes Vitrines' : activeTab === 'assets' ? 'Assets IA' : activeTab === 'analytics' ? 'Analytiques' : 'Paramètres' }}
            </h1>
            <p class="hidden sm:block text-slate-400 text-[11px] font-semibold mt-0.5">
              {{ getGreeting() }} &mdash; {{ getTabSubtitle() }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> En ligne
          </span>
          <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</span>
            <span class="text-[10px] font-black text-[#FF6B2C] uppercase tracking-widest">{{ subService.getPlanLabel() }}</span>
          </div>
          <button (click)="openCreateWizard()" class="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B2C] hover:bg-orange-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
            Nouvelle Vitrine
          </button>
        </div>
      </header>

      <!-- ===== CREATE WIZARD OVERLAY ===== -->
      <div *ngIf="showCreateWizard" class="fixed inset-0 z-[100] bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 sm:pb-6 overflow-hidden transition-all animate-fade-in">
        <div class="bg-white w-full max-w-3xl rounded-[40px] shadow-[0_0_80px_-20px_rgba(255,107,44,0.3)] border border-slate-100/50 overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/20">

          <!-- Wizard Header -->
          <div class="bg-gradient-to-br from-[#1e2852] via-[#2B3970] to-[#1a2450] p-6 lg:p-8 relative overflow-hidden shrink-0">
            <!-- Decorative Elements -->
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#FF6B2C]/30 to-rose-500/10 rounded-full blur-3xl mix-blend-screen"></div>
            <div class="absolute top-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl mix-blend-screen animate-pulse"></div>
            
            <button (click)="showCreateWizard=false" class="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-lg font-bold transition-all shadow-lg backdrop-blur-md z-10">&#x2715;</button>
            
            <!-- Step Indicator -->
            <div class="flex items-center gap-2 mb-6 relative z-10">
              <div class="w-10 h-1.5 rounded-full" [class]="wizardStep >= 1 ? 'bg-[#FF6B2C]' : 'bg-white/10'"></div>
              <div class="w-10 h-1.5 rounded-full" [class]="wizardStep >= 2 ? 'bg-[#FF6B2C]' : 'bg-white/10'"></div>
              <div class="w-10 h-1.5 rounded-full" [class]="wizardStep >= 3 ? 'bg-[#FF6B2C]' : 'bg-white/10'"></div>
            </div>
            
            <div class="flex items-center gap-5 relative z-10">
              <div class="relative group">
                <div class="absolute inset-0 bg-[#FF6B2C] blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-2xl"></div>
                <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl relative z-10 border border-white/10 overflow-hidden">
                  <img src="/d.png" class="w-10 h-10 object-contain" alt="Identify Logo">
                </div>
              </div>
              <div>
                <h2 class="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  Identify Gen<span class="text-[10px] bg-[#FF6B2C] px-2 py-0.5 rounded-md text-white font-black uppercase tracking-widest relative -top-2">Beta</span>
                </h2>
                <p class="text-blue-100/60 text-xs font-bold uppercase tracking-widest mt-1">L'atelier de conception IA</p>
              </div>
            </div>
          </div>

          <!-- WIZARD BODY (SCROLLABLE) -->
          <div class="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors">
            
            <!-- STEP 1: Mode Selection -->
            <div *ngIf="wizardStep === 1" class="p-6 md:p-10">
              <h3 class="text-xl font-black text-[#2B3970] mb-2">Choisissez votre mode de création</h3>
            <p class="text-slate-400 text-sm font-medium mb-8">Comment souhaitez-vous construire votre vitrine ?</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- AI Full Mode -->
              <button (click)="selectMode('ai')"
                class="group text-left border-2 rounded-3xl transition-all relative overflow-hidden"
                [class]="creationMode === 'ai' ? 'border-[#FF6B2C] shadow-[0_20px_60px_rgba(255,107,44,0.15)]' : 'border-slate-100 bg-white hover:border-[#FF6B2C]/50 hover:shadow-xl'">
                
                <!-- Mini site preview (hero) -->
                <div class="h-40 relative overflow-hidden bg-[#0f172a]">
                  <!-- Simulated Browser Bar -->
                  <div class="absolute top-0 left-0 right-0 h-5 bg-[#1e293b] flex items-center px-2 gap-1 z-20">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-400 opacity-70"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70"></div>
                    <div class="mx-auto w-32 h-2 bg-[#334155] rounded-full"></div>
                  </div>
                  <!-- Simulated Navbar -->
                  <div class="absolute top-5 left-0 right-0 h-6 bg-[#1e293b]/90 flex items-center px-3 justify-between z-10">
                    <div class="flex items-center gap-1.5">
                      <div class="w-3 h-3 rounded bg-[#FF6B2C]"></div>
                      <div class="w-10 h-1.5 bg-white/40 rounded-full"></div>
                    </div>
                    <div class="flex gap-2">
                      <div class="w-6 h-1 bg-white/20 rounded-full"></div>
                      <div class="w-6 h-1 bg-white/20 rounded-full"></div>
                      <div class="w-8 h-2 bg-[#FF6B2C] rounded-full"></div>
                    </div>
                  </div>
                  <!-- Simulated Hero Section -->
                  <div class="absolute top-11 left-0 right-0 bottom-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col items-start justify-center px-4">
                    <div class="absolute right-0 top-0 w-24 h-24 bg-[#FF6B2C]/20 rounded-full blur-2xl"></div>
                    <div class="w-20 h-2.5 bg-[#FF6B2C] rounded-full mb-2"></div>
                    <div class="w-32 h-1.5 bg-white/30 rounded-full mb-1"></div>
                    <div class="w-28 h-1.5 bg-white/20 rounded-full mb-3"></div>
                    <div class="flex gap-1.5">
                      <div class="w-10 h-3 bg-[#FF6B2C] rounded-full"></div>
                      <div class="w-10 h-3 bg-white/10 border border-white/20 rounded-full"></div>
                    </div>
                  </div>
                  <!-- AI badge overlay -->
                  <div class="absolute top-7 right-2 z-20 bg-[#FF6B2C] text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wide">IA</div>
                  <!-- Hover state -->
                  <div class="absolute inset-0 bg-[#FF6B2C]/0 group-hover:bg-[#FF6B2C]/5 transition-colors duration-300"></div>
                </div>
                
                <!-- Card Body -->
                <div class="p-5" [class]="creationMode === 'ai' ? 'bg-orange-50' : 'bg-white group-hover:bg-orange-50/30 transition-colors'">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-6 h-6 bg-[#FF6B2C] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h4 class="font-black text-[#2B3970] text-base">Génération IA Complète</h4>
                  </div>
                  <p class="text-slate-500 text-xs font-medium leading-relaxed mb-3">Laissez l'IA concevoir l'intégralité de votre vitrine — logo, design et contenu — à partir d'un simple prompt.</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="px-2 py-0.5 bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 rounded-md text-[8px] font-black uppercase tracking-widest">Logo IA</span>
                    <span class="px-2 py-0.5 bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 rounded-md text-[8px] font-black uppercase tracking-widest">Templates</span>
                    <span class="px-2 py-0.5 bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 rounded-md text-[8px] font-black uppercase tracking-widest">Contenu Auto</span>
                  </div>
                </div>
              </button>

              <!-- Manual Mode -->
              <button (click)="selectMode('manual')"
                class="group text-left border-2 rounded-3xl p-7 transition-all relative overflow-hidden"
                [class]="creationMode === 'manual' ? 'border-[#2B3970] bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-[#2B3970]/40 hover:bg-blue-50/30'">
                <div class="absolute -top-6 -right-6 w-24 h-24 bg-[#2B3970]/5 rounded-full"></div>
                <div class="w-12 h-12 bg-[#2B3970]/10 rounded-2xl flex items-center justify-center text-[#2B3970] mb-5">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </div>
                <h4 class="font-black text-[#2B3970] text-base mb-2">Édition Personnalisée</h4>
                <p class="text-slate-500 text-sm font-medium leading-relaxed">Configurez manuellement chaque élément de votre vitrine. Nom, couleurs, textes et logo selon vos spécifications.</p>
                <div class="mt-5 flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 bg-[#2B3970]/10 text-[#2B3970] rounded-lg text-[9px] font-black uppercase tracking-widest">Logo Upload</span>
                  <span class="px-2.5 py-1 bg-[#2B3970]/10 text-[#2B3970] rounded-lg text-[9px] font-black uppercase tracking-widest">Contrôle Total</span>
                  <span class="px-2.5 py-1 bg-[#2B3970]/10 text-[#2B3970] rounded-lg text-[9px] font-black uppercase tracking-widest">Couleurs</span>
                </div>
              </button>
            </div>

            <button (click)="nextWizardStep()" [disabled]="!creationMode"
              class="w-full mt-8 py-4 font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              [class]="creationMode === 'ai' ? 'bg-[#FF6B2C] hover:bg-orange-600 text-white shadow-[#FF6B2C]/20' : (creationMode === 'manual' ? 'bg-[#2B3970] hover:bg-[#1a2450] text-white shadow-[#2B3970]/20' : 'bg-slate-100 text-slate-400')">
              Continuer &rarr;
            </button>
          </div>

          <!-- STEP 2a: AI Template Selection & Information -->
          <div *ngIf="wizardStep === 2 && creationMode === 'ai'" class="flex flex-col max-h-[80vh]">
            <div class="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
              
              <!-- Section 1 : Identité & Visuel -->
              <div>
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-8 h-8 bg-[#FF6B2C] rounded-xl flex items-center justify-center text-white font-black text-xs">1</div>
                  <div>
                    <h3 class="text-lg font-black text-[#2B3970] leading-none">Identité & Visuel</h3>
                    <p class="text-slate-400 text-xs font-medium mt-0.5">Définissez la base de votre vitrine.</p>
                  </div>
                </div>

                <!-- Name + Domain + Sector -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Nom de l'Entité</label>
                    <input [(ngModel)]="newSite.companyName" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="Ex: Studio Alpha">
                  </div>
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Sous-domaine</label>
                    <input [(ngModel)]="newSite.subdomain" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="studio-alpha">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Secteur d'Activité</label>
                    <select [(ngModel)]="newSite.category" (ngModelChange)="onCategoryChange()" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all cursor-pointer appearance-none">
                      <option *ngFor="let s of sectors" [value]="s.value">{{s.label}}</option>
                    </select>
                  </div>
                </div>

                <!-- ── TYPOGRAPHY PICKER ── -->
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-3">
                    <label class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Typographie</label>
                    <span class="text-[9px] font-black text-[#FF6B2C] uppercase tracking-widest">6 Combinaisons disponibles</span>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button *ngFor="let f of fontPairs"
                      (click)="selectedFont = f.id; newSite.fontFamily = f.id"
                      class="relative group text-left rounded-2xl border-2 p-4 transition-all duration-200 overflow-hidden"
                      [class]="selectedFont === f.id
                        ? 'border-[#FF6B2C] bg-orange-50 shadow-[0_4px_20px_rgba(255,107,44,0.15)] -translate-y-0.5'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'">

                      <!-- Selected glow -->
                      <div *ngIf="selectedFont === f.id"
                        class="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl pointer-events-none"
                        [style.background]="(newSite.primaryColor || '#FF6B2C') + '30'"></div>

                      <!-- Tag badge -->
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mb-2 transition-colors"
                        [class]="selectedFont === f.id ? 'bg-[#FF6B2C] text-white' : 'bg-slate-100 text-slate-400'">
                        {{ f.tag }}
                      </span>

                      <!-- Font heading preview -->
                      <p class="font-black text-[18px] leading-tight text-[#2B3970] mb-0.5 truncate"
                        [style.fontFamily]="f.heading + ', sans-serif'">
                        {{ newSite.companyName || 'Votre Marque' }}
                      </p>

                      <!-- Font body preview -->
                      <p class="text-[10px] text-slate-400 leading-relaxed mb-2"
                        [style.fontFamily]="f.body + ', sans-serif'">
                        Texte de corps fluide et lisible.
                      </p>

                      <!-- Font labels -->
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="px-1.5 py-0.5 bg-[#2B3970]/8 text-[#2B3970] rounded text-[8px] font-black">{{ f.heading }}</span>
                        <span class="text-slate-300 text-[8px]">+</span>
                        <span class="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black">{{ f.body }}</span>
                      </div>

                      <!-- Selected check -->
                      <div *ngIf="selectedFont === f.id"
                        class="absolute top-2 right-2 w-5 h-5 bg-[#FF6B2C] rounded-full flex items-center justify-center shadow-md">
                        <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- ── COLOR PALETTE PICKER ── -->
                <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Palette de Couleurs</label>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Primary color -->
                    <div>
                      <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full border-2 border-slate-300 inline-block" [style.background]="newSite.primaryColor"></span>
                        Couleur Principale
                      </p>
                      <div class="flex flex-wrap gap-2 mb-3">
                        <button *ngFor="let c of brandColors"
                          (click)="newSite.primaryColor = c.hex"
                          class="w-8 h-8 rounded-xl border-2 transition-all flex-shrink-0 relative group/swatch"
                          [style.background]="c.hex"
                          [class]="newSite.primaryColor === c.hex ? 'border-slate-700 scale-110 shadow-lg ring-2 ring-offset-1 ring-slate-400' : 'border-white hover:scale-110 hover:shadow-md'"
                          [title]="c.name">
                          <!-- Tooltip -->
                          <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#2B3970] text-white text-[7px] font-black rounded whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none">{{c.name}}</span>
                        </button>
                        <!-- Custom hex -->
                        <label class="w-8 h-8 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-slate-400 hover:scale-110 transition-all relative overflow-hidden" title="Couleur personnalisée">
                          <svg class="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                          <input type="color" [(ngModel)]="newSite.primaryColor" class="absolute inset-0 opacity-0 w-full h-full cursor-pointer">
                        </label>
                      </div>
                      <!-- Hex display -->
                      <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-100">
                        <div class="w-4 h-4 rounded-md flex-shrink-0 shadow-sm" [style.background]="newSite.primaryColor"></div>
                        <span class="text-xs font-black text-[#2B3970] uppercase tracking-widest">{{ newSite.primaryColor }}</span>
                      </div>
                    </div>

                    <!-- Secondary color -->
                    <div>
                      <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full border-2 border-slate-300 inline-block" [style.background]="newSite.secondaryColor || '#0f172a'"></span>
                        Couleur de Fond / Accent
                      </p>
                      <div class="flex flex-wrap gap-2 mb-3">
                        <button *ngFor="let c of secondaryColors"
                          (click)="newSite.secondaryColor = c.hex"
                          class="w-8 h-8 rounded-xl border-2 transition-all flex-shrink-0 relative group/swatch"
                          [style.background]="c.hex"
                          [class]="newSite.secondaryColor === c.hex ? 'border-slate-700 scale-110 shadow-lg ring-2 ring-offset-1 ring-slate-400' : 'border-slate-200 hover:scale-110 hover:shadow-md'"
                          [title]="c.name">
                          <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#2B3970] text-white text-[7px] font-black rounded whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none">{{c.name}}</span>
                        </button>
                        <label class="w-8 h-8 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-slate-400 hover:scale-110 transition-all relative overflow-hidden" title="Couleur personnalisée">
                          <svg class="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                          <input type="color" [(ngModel)]="newSite.secondaryColor" class="absolute inset-0 opacity-0 w-full h-full cursor-pointer">
                        </label>
                      </div>
                      <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-100">
                        <div class="w-4 h-4 rounded-md flex-shrink-0 shadow-sm border border-slate-200" [style.background]="newSite.secondaryColor || '#0f172a'"></div>
                        <span class="text-xs font-black text-[#2B3970] uppercase tracking-widest">{{ newSite.secondaryColor || '#0f172a' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Live mini preview -->
                  <div class="mt-5 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <div class="h-5 flex items-center px-3 gap-1.5" [style.background]="newSite.secondaryColor || '#0f172a'">
                      <div class="w-1.5 h-1.5 rounded-full bg-red-400/70"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-yellow-400/70"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-green-400/70"></div>
                      <div class="mx-auto w-20 h-1.5 bg-white/10 rounded-full"></div>
                    </div>
                    <div class="p-4 flex items-center justify-between" [style.background]="newSite.secondaryColor || '#0f172a'">
                      <div>
                        <p class="text-[8px] font-black uppercase tracking-widest mb-1" [style.color]="newSite.primaryColor">
                          {{ newSite.category || 'Secteur' }}
                        </p>
                        <p class="font-black text-white text-sm leading-tight"
                          [style.font-family]="selectedFontHeading">
                          {{ newSite.companyName || 'Votre Marque' }}
                        </p>
                        <p class="text-white/40 text-[8px] mt-0.5">Slogan de votre entreprise ici</p>
                      </div>
                      <div class="px-3 py-1.5 rounded-lg text-[8px] font-black text-white shadow-lg flex-shrink-0"
                        [style.background]="newSite.primaryColor">
                        Découvrir →
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2 : Coordonnées -->
              <div>
                <h3 class="text-xl font-black text-[#2B3970] mb-2">2. Coordonnées</h3>
                <p class="text-slate-400 text-sm font-medium mb-6">Ces informations seront intégrées par l'IA sur votre site.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Email Pro</label>
                    <input [(ngModel)]="newSite.email" type="email" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="contact@studio-alpha.com">
                  </div>
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Téléphone</label>
                    <input [(ngModel)]="newSite.phone" type="tel" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="+33 1 23 45 67 89">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Adresse / Emplacement</label>
                    <input [(ngModel)]="newSite.address" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="123 Avenue des Champs-Élysées, Paris">
                  </div>
                </div>
              </div>

              <!-- Section 3 : Design & Template -->
              <div>
                <h3 class="text-xl font-black text-[#2B3970] mb-1">3. Design & Structure</h3>
                <p class="text-slate-400 text-sm font-medium mb-5">Choisissez un design. L'IA l'adaptera à votre secteur.</p>

                <!-- ===== MARKETPLACE TEMPLATE GRID ===== -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                  <button *ngFor="let t of marketplaceTemplates" (click)="selectedTemplate = t.id"
                    class="group relative flex flex-col cursor-pointer outline-none bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300"
                    [class]="selectedTemplate === t.id
                      ? 'border-[#FF6B2C] shadow-[0_8px_32px_rgba(255,107,44,0.22)] -translate-y-0.5'
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5'">

                    <!-- Photo Thumbnail -->
                    <div class="relative w-full overflow-hidden" style="height:150px">
                      <img [src]="t.photo" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" [alt]="t.name">

                      <!-- Gradient overlay at bottom -->
                      <div class="absolute inset-0" style="background:linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25) 100%)"></div>

                      <!-- Popular badge -->
                      <div *ngIf="t.popular"
                        class="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider shadow-lg"
                        style="background:#FF6B2C">
                        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        Populaire
                      </div>

                      <!-- Selected checkmark overlay -->
                      <div *ngIf="selectedTemplate === t.id"
                        class="absolute inset-0 flex items-center justify-center"
                        style="background:rgba(255,107,44,0.15)">
                        <div class="w-10 h-10 bg-[#FF6B2C] rounded-full flex items-center justify-center shadow-xl">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- Card Footer -->
                    <div class="px-3.5 py-3 flex flex-col gap-1.5">
                      <!-- Name + accent dot -->
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <h4 class="font-black text-[13px] text-[#2B3970] truncate leading-tight">{{t.name}}</h4>
                        </div>
                        <div class="w-3 h-3 rounded-full flex-shrink-0 shadow ring-2 ring-white"
                          [style.background]="t.accent"></div>
                      </div>

                      <!-- Category label -->
                      <span class="text-[10px] text-slate-400 font-semibold">{{t.categoryLabel}}</span>

                      <!-- Star rating + score -->
                      <div class="flex items-center justify-between pt-1.5 border-t border-slate-100 mt-0.5">
                        <div class="flex items-center gap-1">
                          <div class="flex items-center gap-0.5">
                            <svg *ngFor="let star of getStars(t.rating)" class="w-3 h-3"
                              [style.color]="star === 'full' ? '#FF6B2C' : (star === 'half' ? '#FF6B2C' : '#e2e8f0')"
                              fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          </div>
                          <span class="text-[10px] font-black text-slate-500">{{t.rating}}</span>
                        </div>
                        <!-- Selected indicator or hover hint -->
                        <span *ngIf="selectedTemplate === t.id"
                          class="text-[9px] font-black text-[#FF6B2C] uppercase tracking-wide">Sélectionné ✓</span>
                        <span *ngIf="selectedTemplate !== t.id"
                          class="text-[9px] font-black text-slate-300 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                          Choisir →
                        </span>
                      </div>
                    </div>

                    <!-- Bottom accent bar -->
                    <div class="h-0.5 w-full transition-all duration-300"
                      [style.background]="selectedTemplate === t.id ? t.accent : 'transparent'"
                      [class]="'group-hover:opacity-100 ' + (selectedTemplate !== t.id ? 'opacity-0' : '')">
                    </div>
                  </button>
                </div>

                <!-- No results -->
                <div *ngIf="marketplaceTemplates.length === 0"
                  class="text-center py-12 text-slate-300 font-bold text-sm">
                  Aucun template trouvé pour ce filtre.
                </div>
              </div>


            <!-- Section 4 : Le Prompt Magique -->
              <div>
                <h3 class="text-xl font-black text-[#2B3970] mb-2">4. La Touche Magique (Prompt)</h3>
                <p class="text-slate-400 text-sm font-medium mb-6">Décrivez ce que vous souhaitez accomplir, le ton, le style...</p>
                <div class="relative group">
                  <textarea [(ngModel)]="newSite.description" rows="4" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl pl-14 pr-5 py-4 font-bold text-[#2B3970] focus:border-[#FF6B2C] focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10 outline-none transition-all resize-none placeholder:text-slate-300 shadow-sm" placeholder="Je veux une vitrine minimaliste et élégante, avec un ton très professionnel. Mettez en avant notre service de consulting..."></textarea>
                  <svg class="absolute top-4 left-5 w-6 h-6 text-slate-300 group-focus-within:text-[#FF6B2C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              </div>
            </div>

            <!-- Wizard Footer Action -->
            <div class="p-6 bg-white border-t border-slate-100 flex gap-3 z-10 shrink-0">
              <button (click)="prevWizardStep()" class="px-8 py-3.5 border-2 border-slate-100 text-slate-500 font-black text-xs rounded-2xl hover:bg-slate-50 transition-all">&larr; Retour</button>
              <button (click)="submitCreateSite()" [disabled]="!newSite.description || !selectedTemplate || !newSite.companyName"
                class="flex-1 py-3.5 bg-[#FF6B2C] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-[#FF6B2C]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Générer (Identify Gen™)
              </button>
            </div>
          </div>
          
          <!-- STEP 2b: Manual Edit -->
          <div *ngIf="wizardStep === 2 && creationMode === 'manual'" class="flex flex-col max-h-[90vh]">
            <div class="flex-1 overflow-y-auto p-10">
              <h3 class="text-xl font-black text-[#2B3970] mb-2">Configuration Personnalisée</h3>
              <p class="text-slate-400 text-sm font-medium mb-8">Renseignez chaque élément de votre vitrine manuellement.</p>

              <div class="space-y-5">
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Nom de l'Entité *</label>
                  <input [(ngModel)]="newSite.companyName" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 font-bold text-[#2B3970] focus:border-[#2B3970] outline-none transition-all placeholder:text-slate-300" placeholder="Ex: Maison Rivière">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Secteur</label>
                    <select [(ngModel)]="newSite.category" (ngModelChange)="onCategoryChange()" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 font-bold text-[#2B3970] focus:border-[#2B3970] outline-none cursor-pointer appearance-none transition-all">
                      <option *ngFor="let s of sectors" [value]="s.value">{{s.label}}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Sous-domaine</label>
                    <input [(ngModel)]="newSite.subdomain" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 font-bold text-[#2B3970] focus:border-[#2B3970] outline-none transition-all placeholder:text-slate-300" placeholder="ma-marque">
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Tagline / Slogan</label>
                  <input [(ngModel)]="newSite.description" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 font-bold text-[#2B3970] focus:border-[#2B3970] outline-none transition-all placeholder:text-slate-300" placeholder="Ex: L'excellence artisanale depuis 1990">
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Couleur Primaire</label>
                  <div class="flex gap-3 flex-wrap">
                    <button *ngFor="let c of brandColors" (click)="newSite.primaryColor = c.hex"
                      class="w-10 h-10 rounded-xl border-2 transition-all"
                      [style.background]="c.hex"
                      [class]="newSite.primaryColor === c.hex ? 'border-slate-700 scale-110 shadow-lg' : 'border-transparent hover:scale-105'"
                      [title]="c.name">
                    </button>
                    <label class="w-10 h-10 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-400 transition-all" title="Personnalisé">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                      <input type="color" [(ngModel)]="newSite.primaryColor" class="absolute opacity-0 w-0 h-0">
                    </label>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-8">
                <button (click)="prevWizardStep()" class="px-6 py-4 border-2 border-slate-100 text-slate-500 font-black text-xs rounded-2xl hover:bg-slate-50 transition-all">&larr; Retour</button>
                <button (click)="submitCreateSite()" [disabled]="!newSite.companyName"
                  class="flex-1 py-4 bg-[#2B3970] hover:bg-[#1a2450] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-[#2B3970]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Créer en mode Manuel
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 3: Generation Status (Enhanced with Live Preview) -->
          <div *ngIf="wizardStep === 3" class="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-[500px]" [style.background]="isGenerating ? '#0f172a' : '#f0fdf4'">

             <!-- Star particles -->
             <div *ngIf="isGenerating" class="absolute inset-0 overflow-hidden pointer-events-none">
               <div class="absolute top-12 left-1/4 w-1 h-1 bg-[#FF6B2C] rounded-full animate-ping" style="animation-delay:0s"></div>
               <div class="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style="animation-delay:0.7s"></div>
               <div class="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#FF6B2C]/70 rounded-full animate-ping" style="animation-delay:1.4s"></div>
             </div>

             <!-- GENERATING STATE -->
             <ng-container *ngIf="isGenerating">
               <div class="z-10 w-full max-w-md text-center mb-8">
                 <div class="relative w-20 h-20 mx-auto mb-5">
                   <svg class="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                     <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,107,44,0.12)" stroke-width="4"/>
                     <circle cx="40" cy="40" r="36" fill="none" stroke="#FF6B2C" stroke-width="4"
                       stroke-linecap="round" stroke-dasharray="226"
                       [style.stroke-dashoffset]="226 - (progressPercent/100)*226"
                       style="transition: stroke-dashoffset 0.8s ease"/>
                   </svg>
                   <div class="absolute inset-0 flex items-center justify-center">
                     <div class="w-11 h-11 bg-gradient-to-br from-[#FF6B2C] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6B2C]/30">
                       <svg class="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                     </div>
                   </div>
                 </div>
                 <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Identify Gen™ A.I.</p>
                 <h3 class="text-lg font-black text-white tracking-tight">{{progressText}}</h3>
                 <p class="text-white/30 text-xs font-semibold mt-1">{{progressPercent}}% complété</p>
               </div>

               <div class="z-10 w-full max-w-md space-y-2 mb-8">
                 <div *ngFor="let step of generationSteps; let i = index"
                      class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500"
                      [class.bg-white]="i === currentStepIndex"
                      [class.bg-white/0]="i !== currentStepIndex">
                   <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        [class.bg-emerald-500]="i < currentStepIndex"
                        [class.bg-[#FF6B2C]]="i === currentStepIndex"
                        [class.bg-white/10]="i > currentStepIndex">
                     <svg *ngIf="i < currentStepIndex" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                     <div *ngIf="i === currentStepIndex" class="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                   <span class="text-xs font-semibold"
                     [class.text-[#2B3970]]="i === currentStepIndex"
                     [class.text-white/50]="i !== currentStepIndex">{{step}}</span>
                   <span *ngIf="i < currentStepIndex" class="ml-auto text-[9px] text-emerald-400 font-black">✓</span>
                 </div>
               </div>

               <!-- Live mini preview -->
               <div *ngIf="liveContent?.theme" class="z-10 w-full max-w-md rounded-2xl overflow-hidden border border-white/10">
                 <div class="h-5 bg-[#1e293b] flex items-center px-3 gap-1.5 border-b border-white/5">
                   <div class="w-1.5 h-1.5 rounded-full bg-red-400/60"></div>
                   <div class="w-1.5 h-1.5 rounded-full bg-yellow-400/60"></div>
                   <div class="w-1.5 h-1.5 rounded-full bg-green-400/60"></div>
                   <span class="mx-auto text-[7px] text-white/20 font-mono">{{newSite.subdomain || 'votre-site'}}.vitrineclick.com</span>
                 </div>
                 <div class="bg-[#0f172a] p-4">
                   <div class="flex items-center gap-2 mb-3">
                     <div class="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black text-white" [style.background]="liveContent.theme.primary">{{newSite.companyName?.charAt(0)}}</div>
                     <span class="text-[8px] font-black text-white/60">{{newSite.companyName}}</span>
                     <div class="ml-auto flex gap-2">
                       <div class="h-1 w-5 rounded-full bg-white/10"></div>
                       <div class="h-1 w-5 rounded-full bg-white/10"></div>
                     </div>
                   </div>
                   <div class="text-[8px] font-black uppercase tracking-wider mb-1" [style.color]="liveContent.theme.primary">{{newSite.category}}</div>
                   <div class="text-sm font-black text-white leading-tight mb-2">{{liveContent.heroText || newSite.companyName}}</div>
                   <div class="text-[8px] text-white/30 mb-4 leading-relaxed">{{liveContent.heroSubtext?.substring(0,70)}}</div>
                   <div class="flex gap-2">
                     <div class="h-6 px-3 rounded-lg text-[8px] flex items-center text-white font-black" [style.background]="liveContent.theme.primary">Découvrir</div>
                     <div class="h-6 px-3 rounded-lg text-[8px] flex items-center text-white/40 border border-white/10">En savoir +</div>
                   </div>
                 </div>
               </div>
             </ng-container>

             <!-- SUCCESS STATE -->
             <ng-container *ngIf="!isGenerating && progressPercent === 100">
               <div class="z-10 text-center">
                 <div class="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center mx-auto mb-5 shadow-lg">
                   <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </div>
                 <h3 class="text-2xl font-black text-emerald-700 mb-2">Vitrine Générée !</h3>
                 <p class="text-slate-500 text-sm">Votre site est prêt dans votre tableau de bord.</p>
               </div>
             </ng-container>
          </div>
          </div>

        </div>
      </div>
      <!-- ===== SCROLLABLE CONTENT ===== -->
      <div class="flex-1 overflow-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 relative z-10 w-full">

        <!-- Loading Skeleton -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3]" class="bg-white rounded-[28px] border border-slate-100 overflow-hidden">
            <div class="skeleton h-44"></div>
            <div class="p-6 space-y-3">
              <div class="skeleton h-6 rounded-lg w-3/4"></div>
              <div class="skeleton h-4 rounded-lg w-1/2"></div>
              <div class="mt-6 pt-6 border-t border-slate-50 skeleton h-10 rounded-xl"></div>
            </div>
          </div>
        </div>

        <!-- =================== TAB: VITRINES =================== -->
        <div *ngIf="!loading && activeTab==='sites'" class="space-y-8 tab-enter">

          <!-- Stats Bar -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-in">
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Sites Total</p>
              <p class="text-3xl font-black text-[#2B3970] group-hover:text-[#FF6B2C] transition-colors">{{sites.length}}</p>
              <div class="mt-2 h-0.5 w-8 bg-[#2B3970]/20 rounded-full group-hover:w-full transition-all duration-500"></div>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Publiés</p>
              <p class="text-3xl font-black text-emerald-500">{{publishedCount}}</p>
              <div class="mt-2 h-0.5 w-8 bg-emerald-200 rounded-full group-hover:w-full transition-all duration-500"></div>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Brouillons</p>
              <p class="text-3xl font-black text-[#FF6B2C]">{{sites.length - publishedCount}}</p>
              <div class="mt-2 h-0.5 w-8 bg-[#FF6B2C]/25 rounded-full group-hover:w-full transition-all duration-500"></div>
            </div>
            <div class="bg-gradient-to-br from-[#2B3970] to-[#1a2450] border border-white/10 rounded-2xl p-5 shadow-[0_8px_20px_rgba(43,57,112,0.2)] hover:shadow-[0_12px_30px_rgba(43,57,112,0.3)] hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.15em] mb-2">Plan Actif</p>
              <p class="text-3xl font-black text-white">{{ subService.getPlanLabel() }}</p>
              <div class="mt-2 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse"></span>
                <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">Studio</span>
              </div>
            </div>
          </div>

          <!-- Empty State (Interactive Premium Banner) -->
          <div *ngIf="sites.length === 0" class="bg-[#0f172a] rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 flex flex-col items-center text-center relative overflow-hidden group">
            <!-- Grid & Glows -->
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div class="absolute -right-40 -top-40 w-96 h-96 bg-[#FF6B2C]/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div class="absolute -left-40 -bottom-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div class="p-10 pt-20 relative z-10 flex flex-col items-center w-full bg-gradient-to-b from-[#0f172a] to-transparent">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-lg">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse"></span>
                <span class="text-[9px] text-white/70 font-black uppercase tracking-widest">Identify Gen™ Beta</span>
              </div>
              <h2 class="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight max-w-2xl px-4">
                Le futur de votre <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B2C] to-orange-400">identité digitale</span>
              </h2>
              <p class="text-slate-400 mb-12 max-w-lg text-sm md:text-base leading-relaxed px-6">
                Laissez l'IA concevoir, designer et déployer votre première vitrine haute performance en moins de 60 secondes.
              </p>
              
              <button (click)="openCreateWizard()" class="relative group/btn cursor-pointer">
                <div class="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C] to-rose-500 rounded-3xl blur opacity-60 group-hover/btn:opacity-100 transition duration-500 group-active/btn:opacity-40"></div>
                <div class="relative px-8 py-4 bg-[#0f172a] ring-1 ring-white/20 rounded-3xl flex items-center justify-center gap-4 transition-transform group-hover/btn:-translate-y-1 group-active/btn:translate-y-0">
                  <div class="w-10 h-10 bg-[#FF6B2C] rounded-2xl flex items-center justify-center shadow-inner shadow-white/20 relative overflow-hidden group-hover/btn:rotate-180 transition-transform duration-700">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <span class="text-white font-black uppercase tracking-widest text-xs">Générer par IA</span>
                </div>
              </button>
            </div>
            
            <!-- Browser mockup illustration at bottom -->
            <div class="w-full max-w-3xl px-6 md:px-16 relative z-10 translate-y-16 group-hover:translate-y-10 transition-transform duration-700 ease-out">
              <div class="bg-[#1e293b] rounded-t-3xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] p-4 overflow-hidden relative">
                <div class="absolute top-0 left-0 right-0 h-4 bg-white/5 flex items-center px-4 gap-1.5 border-b border-white/5">
                  <div class="w-2 h-2 rounded-full bg-red-400/80"></div>
                  <div class="w-2 h-2 rounded-full bg-yellow-400/80"></div>
                  <div class="w-2 h-2 rounded-full bg-green-400/80"></div>
                  <div class="ml-4 h-1.5 w-32 bg-white/10 rounded-full"></div>
                </div>
                <div class="mt-6 flex flex-col gap-4 opacity-50 px-2 min-h-[150px]">
                   <div class="flex items-center justify-between">
                     <div class="h-4 w-20 bg-white/10 rounded-full"></div>
                     <div class="flex gap-2">
                       <div class="h-1.5 w-8 bg-white/10 rounded-full"></div>
                       <div class="h-1.5 w-8 bg-white/10 rounded-full"></div>
                     </div>
                   </div>
                   <div class="h-32 bg-white/5 rounded-2xl mt-4 w-full relative overflow-hidden">
                     <div class="absolute top-4 left-4 h-3 w-16 bg-white/10 rounded-full"></div>
                     <div class="absolute top-10 left-4 h-2 w-32 bg-white/10 rounded-full"></div>
                     <div class="absolute right-4 top-4 w-16 h-16 bg-white/5 rounded-xl"></div>
                   </div>
                </div>
              </div>
            </div>
            <!-- Bottom fade -->
            <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent z-20 pointer-events-none"></div>
          </div>

          <!-- Sites Grid -->
          <div *ngIf="sites.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-in">
            <!-- Site Card -->
            <div *ngFor="let site of sites" class="card-lift group bg-white rounded-[28px] border border-slate-100 flex flex-col overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <!-- Card Header — colored gradient preview -->
              <div class="h-40 relative overflow-hidden" [style.background]="'linear-gradient(135deg,' + (site.primaryColor || '#2B3970') + '22 0%, ' + (site.primaryColor || '#2B3970') + '10 100%)'">
                <!-- Accent orb -->
                <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl" [style.background]="(site.primaryColor || '#2B3970') + '40'"></div>
                <div class="absolute top-4 left-4 z-10">
                  <span class="px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 backdrop-blur-sm"
                    [class]="site.generationStatus === 'COMPLETED' ? (site.published ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100' : 'bg-white/80 text-orange-500 border-orange-100') : 'bg-blue-50/90 text-blue-600 border-blue-100'">
                    <span class="w-1.5 h-1.5 rounded-full" 
                      [class]="site.generationStatus === 'COMPLETED' ? (site.published ? 'bg-emerald-500 animate-pulse' : 'bg-orange-400') : 'bg-blue-500 animate-spin'"></span>
                    {{site.generationStatus === 'COMPLETED' ? (site.published ? 'En ligne' : 'Brouillon') : 
                      site.generationStatus === 'GENERATING_LOGO' ? 'Logo...' : 
                      site.generationStatus === 'GENERATING_CONTENT' ? 'Contenu...' : 'Initialisation...'}}
                  </span>
                </div>
                <!-- Hover actions -->
                <div class="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                  <button (click)="previewSite(site)" title="Consulter le site"
                    class="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center text-slate-500 hover:text-[#2B3970] hover:shadow-lg transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </button>
                  <button (click)="deleteSite(site.id)" title="Supprimer"
                    class="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center text-slate-500 hover:text-red-500 hover:shadow-lg transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
                <!-- Logo circle -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-20 h-20 bg-white rounded-2xl shadow-md border border-white/60 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
                    <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-full h-full object-contain p-2" [alt]="site.companyName">
                    <span *ngIf="!site.logoUrl" class="text-3xl font-black" [style.color]="site.primaryColor || '#2B3970'">{{site.companyName?.charAt(0)}}</span>
                  </div>
                </div>
                <!-- Bottom shimmer line -->
                <div class="absolute bottom-0 left-0 right-0 h-px" [style.background]="'linear-gradient(90deg, transparent, ' + (site.primaryColor || '#2B3970') + '40, transparent)'"></div>
              </div>
              <!-- Card Body -->
              <div class="p-5 flex-grow flex flex-col">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="font-black text-[#2B3970] text-base leading-snug group-hover:text-[#FF6B2C] transition-colors duration-200">{{site.companyName}}</h3>
                    <p class="text-[10px] text-slate-400 font-bold mt-0.5">{{site.subdomain}}.vitrineclick.com</p>
                  </div>
                  <span class="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg flex-shrink-0 ml-2 border"
                    [style.background]="(site.primaryColor || '#2B3970') + '12'" [style.color]="site.primaryColor || '#2B3970'" [style.border-color]="(site.primaryColor || '#2B3970') + '25'">{{site.category}}</span>
                </div>
                <div class="flex items-center gap-3 mt-1.5">
                  <span [class]="subService.getPlanColor()" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">{{ subService.getPlanLabel() }}</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span class="text-emerald-500 font-black text-[9px] uppercase tracking-wider">Actif</span>
                </div>
                <p *ngIf="site.description" class="text-slate-400 text-xs font-medium leading-relaxed flex-grow line-clamp-2 mb-3">{{site.description}}</p>
                <!-- Mini stats bar -->
                <div class="flex items-center gap-3 pt-3 border-t border-slate-50">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm font-black text-[#2B3970]">{{site.published ? (site.visits || 0) : '—'}}</span>
                    <span class="text-[9px] text-slate-400 font-medium">visites</span>
                  </div>
                  <div class="w-px h-4 bg-slate-100"></div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm font-black" [class]="site.published ? 'text-[#FF6B2C]' : 'text-slate-300'">{{site.published ? (site.aiScore || 0) + '%' : '—'}}</span>
                    <span class="text-[9px] text-slate-400 font-medium">Score IA</span>
                  </div>
                </div>
              </div>
              <!-- Card Footer -->
              <div class="px-5 pb-5 pt-3">
                <div class="flex items-center gap-2">
                  <button (click)="editSite(site)" class="flex-1 py-3 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-white group/studio"
                    [style.background]="site.primaryColor || '#2B3970'">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/50 group-hover/studio:bg-white group-hover/studio:animate-pulse transition-colors"></span>
                    Accéder au Studio
                  </button>
                  <button (click)="setTab('analytics')" class="w-11 h-11 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" title="Analytiques">
                    <svg class="w-4 h-4 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Add Card -->
            <button (click)="openCreateWizard()" class="bg-white border-2 border-dashed border-slate-200 rounded-[28px] p-8 flex flex-col items-center justify-center gap-4 group hover:border-[#FF6B2C]/40 hover:bg-orange-50/30 transition-all min-h-[260px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md">
              <div class="w-14 h-14 bg-slate-50 group-hover:bg-[#FF6B2C] rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-[#FF6B2C]/25 group-hover:-translate-y-1">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
              </div>
              <div class="text-center">
                <p class="font-black text-slate-400 group-hover:text-[#2B3970] text-sm transition-colors">Nouvelle Vitrine</p>
                <p class="text-[10px] text-slate-300 font-medium mt-0.5">Créer avec l'IA en 60s</p>
              </div>
            </button>
          </div>
        </div>
          <!-- TAB ASSETS: IDENTIFY GEN™ -->
          <div *ngIf="!loading && activeTab==='assets'" class="tab-enter space-y-10">
            
            <!-- PREMIUM DASHBOARD HEADER -->
            <div class="relative overflow-hidden rounded-[40px] bg-[#0f172a] border border-white/10 shadow-2xl">
              <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <div class="absolute -left-20 -bottom-20 w-60 h-60 bg-[#FF6B2C]/20 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
              
              <div class="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div class="text-center md:text-left">
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span class="text-[9px] text-white/70 font-black uppercase tracking-wider">Studio Graphique IA</span>
                  </div>
                  <h2 class="text-4xl font-black text-white tracking-tight mb-2">Identify Gen<span class="text-[#FF6B2C]">™</span> Assets</h2>
                  <p class="text-slate-400 font-medium max-w-md">Exploitez vos ressources visuelles générées. Exportez vos logos, bannières et kits de marque en un clic.</p>
                </div>
                
                <div class="flex items-center gap-4">
                  <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl text-center min-w-[120px]">
                    <p class="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Assets Disponibles</p>
                    <p class="text-2xl font-black text-white">{{sites.length * 4}}</p>
                  </div>
                  <button (click)="openCreateWizard()" class="h-16 px-8 bg-[#FF6B2C] hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-3xl flex items-center gap-3 shadow-xl shadow-[#FF6B2C]/20 transition-all hover:-translate-y-1 active:translate-y-0 group">
                    <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                    Nouveau Kit IA
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-10">
              <!-- ASSET CATEGORIES SIDENAV -->
              <div class="w-full lg:w-64 shrink-0 space-y-6">
                <div class="relative group">
                  <input type="text" placeholder="Rechercher un asset..." class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all shadow-sm">
                  <svg class="absolute right-4 top-3.5 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>

                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 mb-4">Bibliothèque</p>
                  <div class="space-y-1">
                    <button class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs transition-all shadow-lg border border-white/5">
                      <div class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                        Toutes les Vitrines
                      </div>
                      <span class="text-[9px] bg-white/10 px-2 py-0.5 rounded-md">{{sites.length}}</span>
                    </button>
                    <button class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-[#2B3970] font-bold text-xs transition-all group">
                      <div class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-slate-300 group-hover:text-[#2B3970]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                        Logotypes HD
                      </div>
                      <span class="text-[9px] bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-white transition-colors">{{sites.length}}</span>
                    </button>
                    <button class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-[#2B3970] font-bold text-xs transition-all group">
                      <div class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-slate-300 group-hover:text-[#2B3970]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM3 7l9 6 9-6"/></svg>
                        Kits Sociaux
                      </div>
                      <span class="text-[9px] bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-white transition-colors">{{sites.length * 2}}</span>
                    </button>
                    <button class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-[#2B3970] font-bold text-xs transition-all group">
                      <div class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-slate-300 group-hover:text-[#2B3970]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Bannières & Favicons
                      </div>
                    </button>
                  </div>
                </div>

                <div class="p-6 bg-gradient-to-br from-[#2B3970] to-[#1a2450] rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
                  <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-[#FF6B2C]/20 rounded-full blur-xl"></div>
                  <div class="relative z-10">
                    <p class="text-[9px] font-black text-white/40 uppercase tracking-widest mb-4">Stockage Cloud IA</p>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-black text-white">840 MB / 2 GB</span>
                      <span class="text-[9px] text-[#FF6B2C] font-black uppercase">42%</span>
                    </div>
                    <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-5">
                      <div class="h-full bg-[#FF6B2C] w-[42%]"></div>
                    </div>
                    <button class="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 transition-all">Nettoyer les assets</button>
                  </div>
                </div>
              </div>

              <!-- ASSET GRID (MOCKUP CARDS) -->
              <div class="flex-1">
                <!-- Empty Assets State -->
                <div *ngIf="sites.length === 0" class="bg-white rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-20 flex flex-col items-center text-center">
                  <div class="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-8 border border-slate-200/50 shadow-inner -rotate-6">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <h2 class="text-2xl font-black text-[#2B3970] mb-3">Votre atelier est vide</h2>
                  <p class="text-slate-500 mb-8 max-w-sm">Chaque vitrine générée crée automatiquement un kit complet d'assets haute définition.</p>
                  <button (click)="openCreateWizard()" class="px-8 py-4 bg-[#2B3970] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg">Générer ma première vitrine</button>
                </div>

                <div *ngIf="sites.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 stagger-in">
                  <div *ngFor="let site of sites" class="group relative flex flex-col cursor-pointer outline-none">
                    
                    <!-- MOCKUP STACK CONTAINER -->
                    <div class="relative h-64 w-full mb-4">
                      <!-- Layer 1: Dark Preview (Back Layer) -->
                      <div class="absolute inset-0 bg-[#1e293b] rounded-[32px] scale-[0.9] -translate-y-8 translate-x-4 opacity-40 blur-[1px] group-hover:scale-[0.95] group-hover:-translate-y-12 transition-all duration-500 shadow-xl border border-white/5"></div>
                      
                      <!-- Layer 2: Business Card Mockup (Middle Layer) -->
                      <div class="absolute inset-0 bg-white rounded-[32px] scale-[0.95] -translate-y-4 translate-x-2 shadow-2xl skew-x-1 group-hover:scale-100 group-hover:-translate-y-6 transition-all duration-500 overflow-hidden border border-slate-100">
                        <div class="absolute inset-0 flex items-center justify-center p-8 opacity-20">
                          <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-full h-full object-contain grayscale blur-sm">
                        </div>
                        <div class="absolute bottom-6 left-6 flex flex-col gap-1">
                          <div class="w-12 h-1 bg-slate-100 rounded-full"></div>
                          <div class="w-8 h-1 bg-slate-100 rounded-full"></div>
                        </div>
                      </div>

                      <!-- Layer 3: Main Asset Card (Top Layer) -->
                      <div class="absolute inset-0 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-all duration-500 overflow-hidden">
                        <!-- Branding display -->
                        <div class="flex-1 relative flex items-center justify-center p-10 group-hover:bg-slate-50/50 transition-colors">
                          <div class="absolute inset-0 opacity-[0.03]" [style.background-color]="site.primaryColor"></div>
                          
                          <!-- Dynamic Logo / Initial -->
                          <div class="w-28 h-28 rounded-[32px] flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 overflow-hidden border-4 border-white" 
                            [style.background-color]="site.primaryColor">
                            <div *ngIf="site.generationStatus === 'GENERATING_LOGO' || site.generationStatus === 'INITIALIZING'" class="absolute inset-0 bg-white/20 animate-pulse flex items-center justify-center">
                              <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            </div>
                            <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-20 h-20 object-contain p-2" [alt]="site.companyName">
                            <span *ngIf="!site.logoUrl && site.generationStatus === 'COMPLETED'" class="text-5xl font-black text-white mix-blend-overlay">{{ site.companyName.charAt(0).toUpperCase() }}</span>
                          </div>

                          <!-- Download Quick Actions -->
                          <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/95 backdrop-blur-md border-t border-slate-100 flex gap-2">
                            <button class="flex-1 py-3 text-[10px] font-black uppercase text-[#2B3970] bg-slate-100 rounded-xl hover:bg-[#2B3970] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                              PNG
                            </button>
                            <button class="flex-1 py-3 text-[10px] font-black uppercase text-[#FF6B2C] bg-orange-50 rounded-xl hover:bg-[#FF6B2C] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                              SVG
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- CARD BOTTOM INFO -->
                    <div class="px-2">
                       <div class="flex items-center justify-between mb-1">
                         <h3 class="font-black text-[#2B3970] text-sm tracking-tight">{{site.companyName}} Identity Kit</h3>
                         <div class="flex gap-1">
                           <span class="w-2 h-2 rounded-full" [style.background-color]="site.primaryColor"></span>
                           <span class="w-2 h-2 rounded-full bg-slate-100"></span>
                         </div>
                       </div>
                       <div class="flex items-center gap-3 mt-1">
                         <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{site.category}}</p>
                         <span class="w-1 h-1 rounded-full bg-slate-200"></span>
                         <p class="text-[10px] text-[#FF6B2C] font-black uppercase tracking-widest">v1.2 Gen</p>
                       </div>
                    </div>

                    <button class="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-[#FF6B2C] hover:scale-110 transition-all z-20">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- =================== TAB: ANALYTICS =================== -->
        <div *ngIf="!loading && activeTab==='analytics'" class="space-y-8 tab-enter">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative overflow-hidden group">
              <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500"></div>
              <div class="flex items-start justify-between mb-6 relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#2B3970] shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <div class="flex flex-col items-end">
                  <span class="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 rounded-xl text-[#FF6B2C] font-black text-xs shadow-sm mb-1">
                    <span class="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
                    Live
                  </span>
                  <span class="text-[9px] font-bold text-emerald-500">+12% vs last week</span>
                </div>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-slate-100 pb-3 inline-block">Impact d'Audience</p>
                <div class="flex items-baseline gap-3">
                  <p class="text-5xl font-black text-[#2B3970] tracking-tight">{{ totalVisits | number:'1.0-0' }}</p>
                  <p class="text-xs text-slate-400 font-bold mb-1">Visiteurs</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-[#2B3970] to-[#1a2450] border border-white/10 rounded-[32px] p-8 shadow-[0_10px_40px_rgba(43,57,112,0.3)] relative overflow-hidden group">
              <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FF6B2C]/20 rounded-full blur-3xl group-hover:bg-[#FF6B2C]/30 transition-colors duration-500"></div>
              <div class="flex items-start justify-between mb-6 relative z-10">
                <div class="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-[#FF6B2C] shadow-inner backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <span class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-white font-black text-xs shadow-sm backdrop-blur-sm">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span> IA Optimisé
                </span>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3 border-b border-white/10 pb-3 inline-block">Score d'Identité IA</p>
                <div class="flex items-baseline gap-3">
                  <p class="text-5xl font-black text-white tracking-tight">{{ avgAiScore | number:'1.0-0' }}<span class="text-3xl text-white/70">%</span></p>
                  <p class="text-xs text-white/50 font-bold mb-1">Efficacité</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative overflow-hidden group">
              <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors duration-500"></div>
              <div class="flex items-start justify-between mb-6 relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 rounded-2xl flex items-center justify-center text-[#FF6B2C] shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div class="flex flex-col items-end text-right">
                  <p class="text-[9px] font-black text-[#FF6B2C] uppercase tracking-widest mb-1">Engagement Moyen</p>
                  <div class="flex items-center gap-1">
                    <div class="w-1 h-3 bg-emerald-400 rounded-full"></div>
                    <div class="w-1 h-4 bg-emerald-400 rounded-full"></div>
                    <div class="w-1 h-2 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-slate-100 pb-3 inline-block">Temps de Session</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-5xl font-black text-[#2B3970] tracking-tight">{{ mathClass.floor(avgRetention/60) }}<span class="text-3xl text-slate-400">m</span> {{ avgRetention % 60 }}<span class="text-3xl text-slate-400">s</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Activity Chart -->
            <div class="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
              <div class="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-black text-[#2B3970] tracking-tight">Activité Hebdomadaire</h3>
                  <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">Données agrégées de vos vitrines actives</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex -space-x-2">
                    <div *ngFor="let i of [1,2,3]" class="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">V{{i}}</div>
                  </div>
                </div>
              </div>
              <div class="p-10">
                <div class="relative h-64 mb-10 group">
                  <svg class="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#FF6B2C" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#FF6B2C" stop-opacity="0" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <path d="M0,180 L0,180 C50,150 100,100 150,120 C200,140 250,60 300,80 C350,100 400,160 450,140 C500,120 550,70 600,90 C650,110 700,50 700,50 V200 H0 Z" fill="url(#premiumGradient)" />
                    <path d="M0,180 C50,150 100,100 150,120 C200,140 250,60 300,80 C350,100 400,160 450,140 C500,120 550,70 600,90 C650,110 700,50" 
                          fill="none" stroke="#FF6B2C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
                          filter="url(#glow)" />
                  </svg>

                  <div class="absolute inset-0 flex justify-between px-4 items-end pointer-events-none">
                    <div *ngFor="let point of chartData" class="flex-1 flex flex-col items-center group/p pointer-events-auto">
                      <div class="mb-4 opacity-0 group-hover/p:opacity-100 transition-all bg-[#2B3970] text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl translate-y-2 group-hover/p:translate-y-0 relative z-20">
                        {{point.value * 15}} Hits
                      </div>
                      <div class="w-5 h-5 rounded-full border-[5px] border-white shadow-2xl transition-all relative z-10"
                           [class]="point.isToday ? 'bg-[#FF6B2C] scale-150' : 'bg-slate-300 group-hover/p:bg-[#2B3970] group-hover/p:scale-125'"
                           [style.bottom.%]="point.value">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between px-2">
                  <span *ngFor="let bar of chartData"
                    class="flex-1 text-center text-[10px] font-black uppercase tracking-[0.2em]"
                    [class]="bar.isToday ? 'text-[#FF6B2C]' : 'text-slate-300'">{{bar.day}}</span>
                </div>
              </div>
            </div>

            <!-- Device/Source Distribution -->
            <div class="bg-white border border-slate-100 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-8 flex flex-col">
              <h3 class="text-lg font-black text-[#2B3970] mb-8">Canaux d'Origine</h3>
              <div class="flex-1 space-y-6">
                <div>
                  <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span class="text-slate-400">Direct / Recherche</span>
                    <span class="text-[#2B3970]">65%</span>
                  </div>
                  <div class="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                    <div class="h-full bg-[#2B3970] w-[65%]"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span class="text-slate-400">Réseaux Sociaux</span>
                    <span class="text-[#FF6B2C]">24%</span>
                  </div>
                  <div class="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                    <div class="h-full bg-[#FF6B2C] w-[24%]"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span class="text-slate-400">Référencement</span>
                    <span class="text-emerald-500">11%</span>
                  </div>
                  <div class="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 w-[11%]"></div>
                  </div>
                </div>
              </div>
              
              <div class="mt-8 pt-8 border-t border-slate-50">
                <div class="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                   <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full"></div>
                   <p class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Conseil IA</p>
                   <p class="text-xs font-bold leading-relaxed">Boostez votre score d'identité sur mobile pour gagner +15% de conversion.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sites Performance Table -->
          <div *ngIf="sites.length > 0" class="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
            <div class="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 class="font-black text-[#2B3970] text-lg">Performance Détaillée</h3>
                <p class="text-slate-400 text-xs font-medium">Analyse comparative de vos actifs digitaux</p>
              </div>
              <button class="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm flex items-center gap-2">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Exporter CSV
              </button>
            </div>
            <table class="w-full">
              <thead class="bg-slate-50/50">
                <tr>
                  <th class="text-left px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entité Vitrine</th>
                  <th class="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th class="text-center px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visites</th>
                  <th class="text-center px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rebond</th>
                  <th class="text-right px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Index IA</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let site of sites" class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-10 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-7 h-7 object-contain">
                        <span *ngIf="!site.logoUrl" class="font-black text-[#FF6B2C] text-lg">{{site.companyName?.charAt(0)}}</span>
                      </div>
                      <div>
                        <p class="font-black text-[#2B3970] text-sm">{{site.companyName}}</p>
                        <p class="text-[10px] text-slate-400 font-medium">{{site.subdomain}}.vitrineclick.com</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-6">
                    <span class="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border-2 shadow-sm"
                      [class]="site.generationStatus === 'COMPLETED' ? (site.published ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-500 border-orange-100') : 'bg-blue-50 text-blue-600 border-blue-100'">
                      {{site.generationStatus === 'COMPLETED' ? (site.published ? 'Actif' : 'Brouillon') : 'Génération...'}}
                    </span>
                  </td>
                  <td class="px-6 py-6 text-center font-black text-[#2B3970] text-sm">{{site.published ? (site.visits || 0) : '—'}}</td>
                  <td class="px-6 py-6 text-center text-slate-400 font-bold text-xs">{{site.published ? '14%' : '—'}}</td>
                  <td class="px-10 py-6 text-right">
                    <div class="flex flex-col items-end">
                      <span class="font-black text-lg text-[#FF6B2C] leading-none">{{site.published ? (site.aiScore || 0) : '—'}}%</span>
                      <div *ngIf="site.published" class="w-16 bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div class="h-full bg-[#FF6B2C]" [style.width.%]="site.aiScore"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- =================== TAB: SETTINGS =================== -->
          <div *ngIf="!loading && activeTab==='settings'" class="tab-enter max-w-5xl mx-auto py-4 space-y-6">
            <div class="mb-10">
              <h2 class="text-3xl font-black text-[#2B3970] tracking-tight">Paramètres du compte</h2>
              <p class="text-slate-400 text-sm font-medium mt-1">Gérez vos informations, votre abonnement et vos préférences Studio.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left Column: Profile -->
              <div class="lg:col-span-2 space-y-8">
                <!-- Profile Card -->
                <div class="bg-white rounded-[32px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
                  <div class="bg-gradient-to-br from-[#1e2852] to-[#2B3970] px-8 py-8 relative overflow-hidden">
                    <div class="absolute -right-20 -top-20 w-64 h-64 bg-[#FF6B2C]/20 rounded-full blur-3xl"></div>
                    <div class="flex items-center gap-6 relative z-10">
                      <div class="relative group cursor-pointer">
                        <div class="absolute inset-0 bg-[#FF6B2C] blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-2xl"></div>
                        <div class="w-20 h-20 bg-gradient-to-br from-[#FF6B2C] to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl relative z-10 border border-white/10 group-hover:scale-105 transition-transform">
                          {{username ? username.charAt(0).toUpperCase() : 'U'}}
                        </div>
                        <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#2B3970] rounded-full flex items-center justify-center shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                      </div>
                      <div>
                        <h3 class="text-2xl font-black text-white">{{username || 'Utilisateur'}}</h3>
                        <p class="text-blue-100/60 text-sm font-medium mt-1">Membre depuis Janvier 2026</p>
                        <div class="flex items-center gap-2 mt-3">
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Actif
                          </span>
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 text-white/70 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                            ID: #{{username ? 'VC-' + username.slice(0,4).toUpperCase() : 'VC-001'}}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Nom d'affichage</label>
                        <input [value]="username" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,44,0.1)] outline-none transition-all placeholder:text-slate-300">
                      </div>
                      <div>
                        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Adresse Email</label>
                        <div class="relative">
                          <input type="email" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,44,0.1)] outline-none transition-all placeholder:text-slate-300" placeholder="email@exemple.com">
                          <svg class="absolute right-4 top-3.5 w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Domaine par défaut</label>
                      <div class="flex">
                        <input type="text" class="flex-1 border-2 border-r-0 border-slate-100 bg-slate-50 rounded-l-xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] focus:bg-white outline-none transition-all placeholder:text-slate-300" placeholder="ma-marque">
                        <span class="inline-flex items-center px-4 border-2 border-l-0 border-slate-100 bg-slate-100/50 text-slate-400 rounded-r-xl font-bold text-sm">.vitrineclick.com</span>
                      </div>
                    </div>
                    
                    <div class="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <p class="text-xs text-slate-400 font-medium">Vos modifications seront enregistrées automatiquement ou sauvegardez manuellement.</p>
                      <button class="px-8 py-3.5 bg-[#FF6B2C] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 shadow-lg shadow-[#FF6B2C]/20 transition-all hover:-translate-y-0.5 relative overflow-hidden group">
                        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span class="relative">Sauvegarder</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Blank Page Mode (New Setting) -->
                <div class="bg-white rounded-[32px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
                  <div class="p-8 border-b border-slate-50">
                    <h3 class="font-black text-[#2B3970] text-lg">Mode Page Vierge (Blank Page)</h3>
                    <p class="text-slate-400 text-sm font-medium mt-1">Configurez le comportement de vos vitrines par défaut.</p>
                  </div>
                  <div class="p-8 space-y-6">
                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p class="font-black text-[#2B3970] text-sm">Activer par défaut sur les nouveaux sites</p>
                        <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Affiche une page "En construction" professionnelle</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div class="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B2C]"></div>
                      </label>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Message Personnalisé (Blank Page)</label>
                      <textarea rows="3" class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="Ex: Notre nouvelle vitrine arrive bientôt. Restez connectés !"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Danger Zone -->
                <div class="bg-red-50/50 border border-red-100 rounded-[32px] p-8 flex items-center justify-between">
                  <div>
                    <h3 class="font-black text-red-500 text-lg">Zone Critique</h3>
                    <p class="text-red-400 text-sm font-medium mt-1">Actions irréversibles sur l'ensemble de votre compte.</p>
                  </div>
                  <button (click)="logout()" class="px-6 py-3 bg-white text-red-500 border border-red-100 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    Déconnexion
                  </button>
                </div>
              </div>

              <!-- Right Column: Billing -->
              <div class="space-y-8">
                <!-- Plan Card -->
                <div class="bg-white rounded-[32px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
                  <div class="p-8 pb-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 class="font-black text-[#2B3970] text-lg">Abonnement</h3>
                    <span class="px-2.5 py-1 bg-[#2B3970]/5 text-[#2B3970] text-[10px] font-black uppercase tracking-widest rounded-lg">Facturation</span>
                  </div>
                  <div class="p-8">
                    <div class="relative overflow-hidden p-6 bg-gradient-to-br from-[#2B3970] to-[#1a2450] rounded-2xl text-white shadow-xl shadow-[#2B3970]/20 mb-8">
                      <!-- Deco circle -->
                      <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[#FF6B2C]/20 rounded-full blur-2xl"></div>
                      
                      <p class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Plan Actuel</p>
                      <div class="flex items-end justify-between relative z-10">
                        <div>
                          <p class="text-2xl font-black">{{ subService.getPlanLabel() }}</p>
                        </div>
                        <div class="text-right">
                          <p class="text-2xl font-black text-[#FF6B2C]">{{ subService.getPlanTier() === 'BUSINESS' ? '99' : (subService.getPlanTier() === 'PRO' ? '29' : '0') }} €<span class="text-[10px] text-white/40 ml-1">/mois</span></p>
                        </div>
                      </div>
                      <div class="mt-6 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                        <p class="text-white/50 text-[9px] uppercase font-bold tracking-wider">Expire / Renouvellement</p>
                        <p class="text-white text-xs font-black">{{ subService.getStatus().endDate ? (subService.getStatus().endDate | date:'dd MMM yyyy') : 'Permanent' }}</p>
                      </div>
                    </div>
                    
                    <div class="space-y-5">
                      <div class="flex items-center justify-between pb-5 border-b border-slate-50">
                        <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B2C] flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                          </div>
                          <div>
                            <p class="text-sm font-black text-[#2B3970]">Vitrines limitées</p>
                            <p class="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Jusqu'à {{ subService.getStatus().maxSites }} sites en ligne</p>
                          </div>
                        </div>
                        <p class="text-sm font-black text-slate-500">{{ subService.getStatus().siteCount }} / {{ subService.getStatus().maxSites }}</p>
                      </div>
                      
                      <div class="flex items-center justify-between pb-5 border-b border-slate-50">
                        <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                          </div>
                          <div>
                            <p class="text-sm font-black text-[#2B3970]">Générations IA</p>
                            <p class="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Identify Gen™</p>
                          </div>
                        </div>
                        <p class="text-sm font-black text-emerald-500">{{ subService.getStatus().aiUsage }} / {{ subService.getStatus().maxAiCalls < 0 ? '∞' : subService.getStatus().maxAiCalls }}</p>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                          </div>
                          <div>
                            <p class="text-sm font-black text-[#2B3970]">Support Prioritaire</p>
                            <p class="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Tickets & Email 24/7</p>
                          </div>
                        </div>
                        <p class="text-sm font-black text-blue-500">Inclus</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button (click)="activeTab='sites'" class="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:text-[#2B3970] transition-colors shadow-sm">Gérer</button>
                    <button (click)="router.navigate(['/pricing'])" class="flex-1 py-3.5 text-[#FF6B2C] border-2 border-[#FF6B2C]/20 bg-orange-50/50 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#FF6B2C] hover:text-white transition-colors shadow-sm">Upgrade</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- ======================== MOBILE BOTTOM NAV ======================== -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button (click)="setTab('sites')" class="flex flex-col items-center justify-center p-2 min-w-[64px] transition-all" [class]="activeTab === 'sites' ? 'text-[#FF6B2C]' : 'text-slate-400 hover:text-slate-600'">
          <svg class="w-6 h-6 mb-1" [class]="activeTab === 'sites' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[9px] font-black uppercase tracking-wider">Vitrines</span>
        </button>
        <button (click)="setTab('assets')" class="flex flex-col items-center justify-center p-2 min-w-[64px] transition-all" [class]="activeTab === 'assets' ? 'text-[#FF6B2C]' : 'text-slate-400 hover:text-slate-600'">
          <svg class="w-6 h-6 mb-1" [class]="activeTab === 'assets' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span class="text-[9px] font-black uppercase tracking-wider">Assets</span>
        </button>
        <!-- Floating FAB placed in center bottom nav -->
        <div class="relative -top-6">
          <button (click)="openCreateWizard()" class="w-14 h-14 bg-[#2B3970] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#2B3970]/30 hover:scale-105 transition-transform rotate-3 active:rotate-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
        <button (click)="setTab('analytics')" class="flex flex-col items-center justify-center p-2 min-w-[64px] transition-all" [class]="activeTab === 'analytics' ? 'text-[#FF6B2C]' : 'text-slate-400 hover:text-slate-600'">
          <svg class="w-6 h-6 mb-1" [class]="activeTab === 'analytics' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span class="text-[9px] font-black uppercase tracking-wider">Stats</span>
        </button>
        <button (click)="setTab('settings')" class="flex flex-col items-center justify-center p-2 min-w-[64px] transition-all" [class]="activeTab === 'settings' ? 'text-[#FF6B2C]' : 'text-slate-400 hover:text-slate-600'">
          <svg class="w-6 h-6 mb-1" [class]="activeTab === 'settings' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
          <span class="text-[9px] font-black uppercase tracking-wider">Compte</span>
        </button>
      </nav>

    </div>

  <!-- ====== PREVIEW MODAL ====== -->
  <div *ngIf="previewSiteData" class="fixed inset-0 z-[9998] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-5xl h-[85vh] rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between px-8 py-4 border-b border-slate-100 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 flex items-center gap-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            {{previewSiteData.subdomain}}.vitrineclick.com
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="editSite(previewSiteData); previewSiteData=null" class="px-4 py-2 bg-[#FF6B2C] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Modifier
          </button>
          <button (click)="previewSiteData=null" class="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-lg font-bold transition-all">&#x2715;</button>
        </div>
      </div>
      <!-- Preview Placeholder (no iframe due to localhost, show content card) -->
      <div class="flex-1 bg-slate-50 overflow-auto relative flex flex-col">
        <div class="flex-1 flex items-center justify-center p-12">
          <div class="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden max-w-2xl w-full">
            <div class="h-52 flex items-center justify-center" [style.background]="previewSiteData.template ? getTemplateBg(previewSiteData.template) : 'linear-gradient(135deg,#f0f4ff,#e8eeff)'">
              <div class="text-center">
                <div class="w-20 h-20 bg-white/80 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <img *ngIf="previewSiteData.logoUrl" [src]="previewSiteData.logoUrl" class="w-16 h-16 object-contain">
                  <span *ngIf="!previewSiteData.logoUrl" class="text-4xl font-black text-slate-300 italic">{{previewSiteData.companyName?.charAt(0)}}</span>
                </div>
                <h2 class="text-2xl font-black text-[#2B3970]">{{previewSiteData.companyName}}</h2>
                <p class="text-slate-500 font-medium text-sm mt-1">{{previewSiteData.description || previewSiteData.category}}</p>
              </div>
            </div>
            <div class="p-8 space-y-4">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1.5 bg-[#2B3970]/5 text-[#2B3970] border border-[#2B3970]/10 text-xs font-black uppercase rounded-lg">{{previewSiteData.category}}</span>
                <span class="px-3 py-1.5 border text-xs font-black uppercase rounded-lg" [class]="previewSiteData.published ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-500 border-orange-100'">{{previewSiteData.published ? '● Publié' : '○ Brouillon'}}</span>
              </div>
              <p class="text-slate-400 font-medium text-sm">{{previewSiteData.subdomain}}.vitrineclick.com</p>
              <div class="grid grid-cols-3 gap-4 pt-4">
                <div class="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p class="text-2xl font-black text-[#2B3970]">{{previewSiteData.visits || 0}}</p>
                  <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Visites</p>
                </div>
                <div class="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p class="text-2xl font-black text-[#FF6B2C]">{{previewSiteData.aiScore || 0}}%</p>
                  <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Score IA</p>
                </div>
                <div class="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p class="text-2xl font-black text-emerald-500">{{ mathClass.floor((previewSiteData.retentionTimeSeconds || 0)/60) }}m{{ (previewSiteData.retentionTimeSeconds || 0) % 60 }}s</p>
                  <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Rétention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== EDIT MODAL ====== -->
  <div *ngIf="editSiteData" class="fixed inset-0 z-[9998] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-2xl rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden">
      <!-- Edit Header -->
      <div class="bg-gradient-to-br from-[#2B3970] to-[#1a2450] p-8 relative overflow-hidden">
        <div class="absolute -top-8 -right-8 w-32 h-32 bg-[#FF6B2C]/15 rounded-full blur-xl"></div>
        <button (click)="editSiteData=null" class="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center font-bold text-lg transition-all">&#x2715;</button>
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-12 h-12 bg-[#FF6B2C] rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </div>
          <div>
            <h2 class="text-xl font-black text-white">Modifier la Vitrine</h2>
            <p class="text-white/40 text-xs font-medium">{{editSiteData.companyName}}</p>
          </div>
        </div>
      </div>
      <!-- Edit Body -->
      <div class="p-10 overflow-auto max-h-[70vh] space-y-8">
        
        <!-- Section 1: Identité -->
        <div>
          <h3 class="text-sm font-black text-[#2B3970] mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">1. Identité de Base</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Nom de l'Entité *</label>
              <input [(ngModel)]="editSiteData.companyName" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Sous-domaine</label>
              <input [(ngModel)]="editSiteData.subdomain" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Secteur</label>
              <select [(ngModel)]="editSiteData.category" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all cursor-pointer appearance-none">
                <option *ngFor="let s of sectors" [value]="s.value">{{s.label}}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Couleur IA</label>
              <div class="flex gap-2 flex-wrap">
                 <button *ngFor="let c of brandColors" (click)="editSiteData.primaryColor = c.hex"
                    class="w-10 h-10 rounded-xl border-2 transition-all flex-shrink-0"
                    [style.background]="c.hex"
                    [class]="editSiteData.primaryColor === c.hex ? 'border-[#FF6B2C] scale-110 shadow-lg' : 'border-transparent hover:scale-105'"
                    [title]="c.name">
                 </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Coordonnées -->
        <div>
          <h3 class="text-sm font-black text-[#2B3970] mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">2. Coordonnées & Données</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Email Pro</label>
              <input [(ngModel)]="editSiteData.email" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Téléphone</label>
              <input [(ngModel)]="editSiteData.phone" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all">
            </div>
            <div class="col-span-2">
              <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Adresse</label>
              <input [(ngModel)]="editSiteData.address" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all">
            </div>
          </div>
        </div>

        <!-- Section 3: Configuration du Site -->
        <div>
          <h3 class="text-sm font-black text-[#2B3970] mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">3. Style & Visibilité</h3>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Description / Slogan</label>
            <textarea [(ngModel)]="editSiteData.description" rows="2" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all resize-none placeholder:text-slate-300" placeholder="Décrivez votre vitrine..."></textarea>
          </div>
          
          <div class="mt-4 flex items-center justify-between bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5">
            <div>
              <p class="font-bold text-sm text-[#2B3970]">Statut de la Vitrine</p>
              <p class="text-xs text-slate-400">Rendre votre site accessible au public.</p>
            </div>
            <label class="relative flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="editSiteData.published" class="sr-only">
              <div class="w-12 h-6 rounded-full transition-all" [class]="editSiteData.published ? 'bg-emerald-500' : 'bg-slate-300'"></div>
              <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all" [class]="editSiteData.published ? 'left-7' : 'left-1'"></div>
            </label>
          </div>

          <!-- Template Picker -->
          <div class="mt-4">
            <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Changer le Template IA</label>
            <div class="grid grid-cols-3 gap-3">
              <button *ngFor="let t of aiTemplates" (click)="editSiteData.template = t.id"
                class="border-2 rounded-2xl overflow-hidden text-left transition-all group"
                [class]="editSiteData.template === t.id ? 'border-[#FF6B2C] shadow-md shadow-[#FF6B2C]/10 scale-[1.02]' : 'border-slate-100 hover:border-[#FF6B2C]/30 hover:-translate-y-0.5'">
                <!-- Mini rich website mockup -->
                <div class="h-20 relative overflow-hidden" [style.background]="t.navBg">
                  <!-- Browser dots -->
                  <div class="absolute top-0 left-0 right-0 h-3 flex items-center px-1.5 gap-0.5 z-10" [style.background]="t.navBg">
                    <div class="w-1 h-1 rounded-full bg-red-400/50"></div>
                    <div class="w-1 h-1 rounded-full bg-yellow-400/50"></div>
                    <div class="w-1 h-1 rounded-full bg-green-400/50"></div>
                    <div class="flex-1 mx-1 h-1 rounded-full bg-white/10"></div>
                  </div>
                  <!-- Navbar line -->
                  <div class="absolute top-3 left-0 right-0 h-3.5 flex items-center justify-between px-2" [style.background]="t.navBg">
                    <div class="w-6 h-0.5 rounded-full" [style.background]="t.accent"></div>
                    <div class="h-2 px-1.5 rounded text-[4.5px] font-black flex items-center" [style.background]="t.accent" [style.color]="t.accentText">CTA</div>
                  </div>
                  <!-- Hero content -->
                  <div class="absolute top-6.5 left-0 right-0 bottom-0 flex flex-col justify-center px-2 py-1" [ngStyle]="{'background': t.heroBg}">
                    <div class="h-0.5 rounded-full mb-1 w-6" [style.background]="t.accent"></div>
                    <div class="h-1.5 rounded-sm mb-0.5 w-12" [style.background]="t.heroText"></div>
                    <div class="h-1 rounded-full mb-1.5 w-9" [style.background]="t.heroTextLight"></div>
                    <div class="flex gap-1">
                      <div class="h-2 px-1.5 rounded text-[4px] font-black flex items-center" [style.background]="t.accent" [style.color]="t.accentText">Go</div>
                      <div class="h-2 px-1.5 rounded border text-[4px] flex items-center" [style.border-color]="t.heroText + '40'" [style.color]="t.heroText">More</div>
                    </div>
                  </div>
                  <div class="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors"></div>
                </div>
                <!-- Footer row -->
                <div class="px-2 py-2" [class]="editSiteData.template === t.id ? 'bg-orange-50' : 'bg-white'">
                  <p class="font-black text-[#2B3970] text-[9px] truncate leading-tight">{{t.name}}</p>
                  <div class="flex items-center justify-between mt-0.5">
                    <span class="text-[7px] font-bold uppercase tracking-wide" [style.color]="t.accent">{{t.tags[0]}}</span>
                    <div class="flex items-center gap-1">
                      <span *ngIf="t.isPremium" class="text-[7px] font-black text-indigo-600 bg-indigo-50 px-1 rounded">PRO</span>
                      <span *ngIf="editSiteData.template === t.id" class="text-[7px] font-black text-[#FF6B2C] uppercase">Actif</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <p *ngIf="!subService.hasFeature('PREMIUM_TEMPLATES')" class="mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 p-2 rounded-xl border border-indigo-100 flex items-center gap-2">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Certains templates sont réservés aux plans Pro & Business.
            </p>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button (click)="editSiteData=null" class="flex-1 py-3.5 border-2 border-slate-100 text-slate-500 font-black text-xs rounded-2xl hover:bg-slate-50 transition-all">Annuler</button>
          <button (click)="saveEditSite()" class="flex-1 py-3.5 bg-[#FF6B2C] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-[#FF6B2C]/20 transition-all">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== TOAST NOTIFICATIONS ====== -->
  <div class="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 items-end">
    <div *ngFor="let toast of toasts" [class]="'toast-enter flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm max-w-sm ' + (toast.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : toast.type === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#2B3970] text-white shadow-[#2B3970]/20')">
      <svg *ngIf="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      <svg *ngIf="toast.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      <svg *ngIf="toast.type === 'info'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01"/></svg>
      <span>{{toast.message}}</span>
    </div>
  </div>
  `
})
export class UserPanelComponent implements OnInit, OnDestroy {
  activeTab: any = 'sites';
  FEATURES = FEATURES;


  sites: any[] = [];
  loading = true;
  username: string = '';
  toasts: { message: string; type: 'success' | 'error' | 'info' }[] = [];
  previewSiteData: any = null;
  editSiteData: any = null;

  showCreateWizard = false;
  isGenerating = false;
  wizardStep = 1;
  creationMode: 'ai' | 'manual' | null = null;
  selectedTemplate: string | null = null;
  newSite: any = { companyName: '', category: 'Tech', description: '', subdomain: '', primaryColor: '#2B3970', email: '', phone: '', address: '' };


  allMarketplaceTemplates = [
    // Tech & SaaS
    { id: 'modern', name: 'Nexus SaaS Pro', categoryLabel: 'Technologie', sector: 'Tech', rating: 4.9, popular: true, accent: '#6366f1', photo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
    { id: 'tech-launch', name: 'LaunchPad Alpha', categoryLabel: 'Startup', sector: 'Tech', rating: 4.6, popular: false, accent: '#0ea5e9', photo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80' },

    // Business & Consulting
    { id: 'strategic', name: 'Strategic Edge', categoryLabel: 'Affaires', sector: 'Consulting', rating: 4.8, popular: false, accent: '#f59e0b', photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80' },
    { id: 'corporate', name: 'Apex Trust', categoryLabel: 'Conseil', sector: 'Consulting', rating: 4.9, popular: true, accent: '#3b82f6', photo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },

    // Retail & Fashion
    { id: 'marketplace', name: 'Shopper Elite', categoryLabel: 'E-Commerce', sector: 'Retail', rating: 4.9, popular: true, accent: '#f97316', photo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80' },
    { id: 'bold', name: 'Vanguard Mode', categoryLabel: 'Mode', sector: 'Mode', rating: 4.7, popular: false, accent: '#111827', photo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' },

    // Gastronomy
    { id: 'bistro', name: 'Gourmet Bistro', categoryLabel: 'Restauration', sector: 'Restaurant', rating: 4.7, popular: false, accent: '#ea580c', photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
    { id: 'gourmet', name: 'Grand Gourmet', categoryLabel: 'Gastronomie', sector: 'Restaurant', rating: 4.9, popular: true, accent: '#b91c1c', photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80' },

    // Beauty & Health
    { id: 'spa', name: 'Aura Beauty', categoryLabel: 'Bien-être', sector: 'Beauty', rating: 5.0, popular: true, accent: '#f43f5e', photo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
    { id: 'medical', name: 'CareFirst Pro', categoryLabel: 'Santé', sector: 'Medical', rating: 4.8, popular: false, accent: '#0284c7', photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80' },

    // Education & Knowledge
    { id: 'edu', name: 'AcadeMind Plus', categoryLabel: 'Éducation', sector: 'Education', rating: 4.7, popular: false, accent: '#7c3aed', photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80' },
    { id: 'organic', name: 'Eco Learn', categoryLabel: 'Formation', sector: 'Education', rating: 4.5, popular: false, accent: '#16a34a', photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80' },

    // Specialized Industries
    { id: 'mansion', name: 'Elite Real Estate', categoryLabel: 'Immobilier', sector: 'Immobilier', rating: 4.8, popular: true, accent: '#7c3aed', photo: 'https://images.unsplash.com/photo-1582407947304-fd86f28f82f6?auto=format&fit=crop&w=600&q=80' },
    { id: 'sport', name: 'PowerZone Gym', categoryLabel: 'Sport', sector: 'Sport', rating: 4.9, popular: true, accent: '#ef4444', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
    { id: 'finance', name: 'Capital Shield', categoryLabel: 'Juridique', sector: 'Juridique', rating: 4.7, popular: false, accent: '#1e3a8a', photo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80' },
    { id: 'artisan', name: 'Atelier Folk', categoryLabel: 'Artisanat', sector: 'Artisanat', rating: 4.7, popular: false, accent: '#92400e', photo: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80' },
    { id: 'blank', name: 'Blank Page (Structure)', categoryLabel: 'Vierge', sector: 'all', rating: 5.0, popular: false, accent: '#000000', photo: 'https://images.unsplash.com/photo-1483546416297-30ed0a1949c2?auto=format&fit=crop&w=600&q=80' }
  ];

  get marketplaceTemplates() {
    return this.allMarketplaceTemplates.filter(t => {
      const selectedSector = this.newSite.category;
      return selectedSector === 'all' || t.sector === selectedSector;
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push('full');
      else if (i - 0.5 <= rating) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }

  sectors = [
    { value: 'Tech', label: 'Technologie & SaaS' },
    { value: 'Restaurant', label: 'Gastronomie & Restauration' },
    { value: 'Beauty', label: 'Beauté & Bien-être' },
    { value: 'Retail', label: 'E-Commerce & Retail' },
    { value: 'Consulting', label: 'Consulting & Conseil' },
    { value: 'Medical', label: 'Santé & Médecine' },
    { value: 'Education', label: 'Éducation & Formation' },
    { value: 'Immobilier', label: 'Immobilier & Architecture' },
    { value: 'Juridique', label: 'Juridique & Finance' },
    { value: 'Mode', label: 'Mode & Luxe' },
    { value: 'Sport', label: 'Sport & Fitness' },
    { value: 'Artisanat', label: 'Artisanat & Art' },
  ];
  liveContent: any = null;
  mathClass = Math;

  get totalVisits() { return this.sites.reduce((sum, s) => sum + (s.visits || 0), 0); }
  get avgAiScore() { const pub = this.sites.filter(s => s.published); return pub.length ? pub.reduce((sum, s) => sum + (s.aiScore || 0), 0) / pub.length : 0; }
  get avgRetention() { const pub = this.sites.filter(s => s.published); return pub.length ? pub.reduce((sum, s) => sum + (s.retentionTimeSeconds || 0), 0) / pub.length : 0; }

  aiTemplates = [
    // ── Tech & SaaS ──
    {
      id: 'modern', name: 'Nexus Pro', desc: 'Architecture minimaliste pour la conversion B2B SaaS.', tags: ['SaaS', 'Tech'], sectors: ['Tech'], isPremium: true, style: 'Dark Minimal', font: 'Inter',
      navBg: '#0f172a', accent: '#6366f1', accentText: '#fff', textLight: 'rgba(255,255,255,0.2)',
      heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', heroText: 'rgba(255,255,255,0.85)', heroTextLight: 'rgba(255,255,255,0.3)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(99,102,241,0.5)', 'rgba(99,102,241,0.3)', 'rgba(99,102,241,0.2)'],
      sectionBg: 'rgba(99,102,241,0.08)', cardBg: 'rgba(255,255,255,0.04)', footerBg: '#020617'
    },
    {
      id: 'tech-launch', name: 'LaunchPad', desc: "Design épuré pour startups et apps mobiles en phase de lancement.", tags: ['Startup', 'App'], sectors: ['Tech'], isPremium: false, style: 'Clean Launch', font: 'Outfit',
      navBg: '#fff', accent: '#0ea5e9', accentText: '#fff', textLight: 'rgba(0,0,0,0.15)',
      heroBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', heroText: 'rgba(7,89,133,0.9)', heroTextLight: 'rgba(7,89,133,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(14,165,233,0.5)', 'rgba(14,165,233,0.3)', 'rgba(14,165,233,0.15)'],
      sectionBg: 'rgba(14,165,233,0.07)', cardBg: 'rgba(255,255,255,0.8)', footerBg: '#0c4a6e'
    },
    // ── Restaurant & Gastronomie ──
    {
      id: 'bistro', name: 'Le Bistrot', desc: 'Chaleur et gourmandise pour restaurants & traiteurs.', tags: ['Restaurant', 'Food'], sectors: ['Restaurant'], isPremium: false, style: 'Warm & Tasty', font: 'Playfair Display',
      navBg: '#3b1a08', accent: '#ea580c', accentText: '#fff', textLight: 'rgba(255,255,255,0.25)',
      heroBg: 'linear-gradient(135deg, #3b1a08 0%, #5c2d0e 100%)', heroText: 'rgba(255,255,255,0.9)', heroTextLight: 'rgba(255,255,255,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(234,88,12,0.6)', 'rgba(234,88,12,0.35)', 'rgba(234,88,12,0.2)'],
      sectionBg: 'rgba(234,88,12,0.07)', cardBg: 'rgba(255,255,255,0.05)', footerBg: '#1c0a02'
    },
    {
      id: 'gourmet', name: 'Gourmet Blanc', desc: "Élégance intemporelle pour restaurants gastronomiques haut de gamme.", tags: ['Gastronomie', 'Luxe'], sectors: ['Restaurant'], isPremium: true, style: 'Fine Dining', font: 'Lora',
      navBg: '#fff', accent: '#b91c1c', accentText: '#fff', textLight: 'rgba(0,0,0,0.12)',
      heroBg: 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)', heroText: 'rgba(15,23,42,0.9)', heroTextLight: 'rgba(15,23,42,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(185,28,28,0.5)', 'rgba(185,28,28,0.3)', 'rgba(185,28,28,0.15)'],
      sectionBg: 'rgba(185,28,28,0.05)', cardBg: 'rgba(255,255,255,0.9)', footerBg: '#0f172a'
    },
    // ── Beauté & Bien-être ──
    {
      id: 'organic', name: 'Botanica', desc: 'Lignes fluides et palette naturelle apaisante pour bien-être.', tags: ['Bien-être', 'Bio'], sectors: ['Beauty'], isPremium: false, style: 'Natural & Soft', font: 'Montserrat',
      navBg: '#f0fdf4', accent: '#16a34a', accentText: '#fff', textLight: 'rgba(22,163,74,0.2)',
      heroBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', heroText: 'rgba(15,40,15,0.85)', heroTextLight: 'rgba(15,40,15,0.3)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(22,163,74,0.5)', 'rgba(22,163,74,0.3)', 'rgba(22,163,74,0.15)'],
      sectionBg: 'rgba(22,163,74,0.06)', cardBg: 'rgba(255,255,255,0.7)', footerBg: '#052e16'
    },
    {
      id: 'spa', name: 'Aura Spa', desc: "Design rosé et apaisant pour instituts de beauté et spas.", tags: ['Spa', 'Beauté'], sectors: ['Beauty'], isPremium: true, style: 'Blush & Calm', font: 'Montserrat',
      navBg: '#fff5f5', accent: '#f43f5e', accentText: '#fff', textLight: 'rgba(244,63,94,0.2)',
      heroBg: 'linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%)', heroText: 'rgba(76,5,25,0.85)', heroTextLight: 'rgba(76,5,25,0.3)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(244,63,94,0.5)', 'rgba(244,63,94,0.3)', 'rgba(244,63,94,0.15)'],
      sectionBg: 'rgba(244,63,94,0.05)', cardBg: 'rgba(255,255,255,0.8)', footerBg: '#4c0519'
    },
    // ── E-Commerce & Retail ──
    {
      id: 'bold', name: 'Vanguard', desc: 'Typographie massive, contrastes marqués pour boutiques et marques.', tags: ['Retail', 'Boutique'], sectors: ['Retail', 'Mode'], isPremium: false, style: 'Bold & Vibrant', font: 'Syne',
      navBg: '#fff', accent: '#f97316', accentText: '#fff', textLight: 'rgba(0,0,0,0.18)',
      heroBg: 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)', heroText: 'rgba(15,23,42,0.9)', heroTextLight: 'rgba(15,23,42,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(249,115,22,0.5)', 'rgba(249,115,22,0.3)', 'rgba(249,115,22,0.15)'],
      sectionBg: 'rgba(249,115,22,0.06)', cardBg: 'rgba(249,115,22,0.05)', footerBg: '#0f172a'
    },
    {
      id: 'marketplace', name: 'Shopper Dark', desc: 'Vitrine sombre premium pour e-commerce avec mise en avant produits.', tags: ['E-Shop', 'Dark'], sectors: ['Retail', 'Mode'], isPremium: true, style: 'Dark Store', font: 'Inter',
      navBg: '#111827', accent: '#10b981', accentText: '#fff', textLight: 'rgba(255,255,255,0.2)',
      heroBg: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', heroText: 'rgba(255,255,255,0.9)', heroTextLight: 'rgba(255,255,255,0.3)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(16,185,129,0.5)', 'rgba(16,185,129,0.3)', 'rgba(16,185,129,0.15)'],
      sectionBg: 'rgba(16,185,129,0.07)', cardBg: 'rgba(255,255,255,0.04)', footerBg: '#030712'
    },
    // ── Immobilier & Architecture ──
    {
      id: 'mansion', name: 'Elite Estates', desc: "Luxe et prestige pour l'immobilier haut de gamme.", tags: ['Immobilier', 'Luxe'], sectors: ['Immobilier'], isPremium: true, style: 'Premium Property', font: 'Montserrat',
      navBg: '#fff', accent: '#7c3aed', accentText: '#fff', textLight: 'rgba(0,0,0,0.12)',
      heroBg: 'linear-gradient(135deg, #f5f3ff 0%, #fff 100%)', heroText: 'rgba(30,27,75,0.9)', heroTextLight: 'rgba(30,27,75,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1582407947304-fd86f28f82f6?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(124,58,237,0.5)', 'rgba(124,58,237,0.3)', 'rgba(124,58,237,0.15)'],
      sectionBg: 'rgba(124,58,237,0.06)', cardBg: 'rgba(255,255,255,0.9)', footerBg: '#1e1b4b'
    },
    // ── Consulting & Professional ──
    {
      id: 'corporate', name: 'Apex Trust', desc: 'Structure classique qui inspire fiabilité pour consulting & légal.', tags: ['Consulting', 'Finance'], sectors: ['Consulting', 'Juridique'], isPremium: false, style: 'Classic Corporate', font: 'Inter',
      navBg: '#1e3a8a', accent: '#3b82f6', accentText: '#fff', textLight: 'rgba(255,255,255,0.25)',
      heroBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', heroText: 'rgba(30,58,138,0.9)', heroTextLight: 'rgba(30,58,138,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(59,130,246,0.5)', 'rgba(59,130,246,0.3)', 'rgba(59,130,246,0.15)'],
      sectionBg: 'rgba(59,130,246,0.07)', cardBg: 'rgba(255,255,255,0.8)', footerBg: '#0f172a'
    },
    // ── Artisanat ──
    {
      id: 'artisan', name: 'Atelier Folk', desc: 'Esthétique craft et textures chaleureuses pour artisans et créateurs.', tags: ['Artisanat', 'Créatif'], sectors: ['Artisanat'], isPremium: false, style: 'Craft & Warm', font: 'Playfair Display',
      navBg: '#fef3c7', accent: '#92400e', accentText: '#fff', textLight: 'rgba(146,64,14,0.25)',
      heroBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', heroText: 'rgba(92,40,10,0.9)', heroTextLight: 'rgba(92,40,10,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(146,64,14,0.5)', 'rgba(146,64,14,0.3)', 'rgba(146,64,14,0.15)'],
      sectionBg: 'rgba(146,64,14,0.06)', cardBg: 'rgba(255,255,255,0.7)', footerBg: '#451a03'
    },
    // ── Stratégie & Santé ──
    {
      id: 'strategic', name: 'Strategic Edge', desc: 'Design épuré et autoritaire pour cabinets de conseil en stratégie.', tags: ['Stratégie', 'B2B'], sectors: ['Consulting'], isPremium: true, style: 'Authority', font: 'Inter',
      navBg: '#0f172a', accent: '#f59e0b', accentText: '#000', textLight: 'rgba(255,255,255,0.2)',
      heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', heroText: 'rgba(255,255,255,0.88)', heroTextLight: 'rgba(255,255,255,0.3)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(245,158,11,0.6)', 'rgba(245,158,11,0.35)', 'rgba(245,158,11,0.2)'],
      sectionBg: 'rgba(245,158,11,0.07)', cardBg: 'rgba(255,255,255,0.04)', footerBg: '#020617'
    },
    {
      id: 'medical', name: 'CareFirst', desc: 'Interface propre et rassurante pour cabinets médicaux et cliniques.', tags: ['Médecine', 'Santé'], sectors: ['Medical'], isPremium: false, style: 'Clean Medical', font: 'Inter',
      navBg: '#fff', accent: '#0284c7', accentText: '#fff', textLight: 'rgba(0,0,0,0.1)',
      heroBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', heroText: 'rgba(12,74,110,0.9)', heroTextLight: 'rgba(12,74,110,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(2,132,199,0.5)', 'rgba(2,132,199,0.3)', 'rgba(2,132,199,0.15)'],
      sectionBg: 'rgba(2,132,199,0.06)', cardBg: 'rgba(255,255,255,0.9)', footerBg: '#075985'
    },
    // ── Éducation & Sport ──
    {
      id: 'edu', name: 'AcadeMind', desc: "Plateforme pédagogique moderne pour centres de formation et écoles.", tags: ['Formation', 'École'], sectors: ['Education'], isPremium: false, style: 'Academic Fresh', font: 'Outfit',
      navBg: '#fff', accent: '#7c3aed', accentText: '#fff', textLight: 'rgba(0,0,0,0.15)',
      heroBg: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)', heroText: 'rgba(46,16,101,0.9)', heroTextLight: 'rgba(46,16,101,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(124,58,237,0.5)', 'rgba(124,58,237,0.3)', 'rgba(124,58,237,0.15)'],
      sectionBg: 'rgba(124,58,237,0.06)', cardBg: 'rgba(255,255,255,0.8)', footerBg: '#2e1065'
    },
    {
      id: 'sport', name: 'PowerZone', desc: 'Énergie brute et dynamisme pour salles de sport et coachs.', tags: ['Sport', 'Fitness'], sectors: ['Sport'], isPremium: false, style: 'High Energy', font: 'Syne',
      navBg: '#111827', accent: '#ef4444', accentText: '#fff', textLight: 'rgba(255,255,255,0.2)',
      heroBg: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', heroText: 'rgba(255,255,255,0.9)', heroTextLight: 'rgba(255,255,255,0.3)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(239,68,68,0.6)', 'rgba(239,68,68,0.35)', 'rgba(239,68,68,0.2)'],
      sectionBg: 'rgba(239,68,68,0.07)', cardBg: 'rgba(255,255,255,0.04)', footerBg: '#030712'
    },
    {
      id: 'finance', name: 'Capital Shield', desc: 'Sérieux et sécurité pour services financiers et juridiques.', tags: ['Finance', 'Légal'], sectors: ['Juridique'], isPremium: false, style: 'Corporate Secure', font: 'Inter',
      navBg: '#1e3a8a', accent: '#1e3a8a', accentText: '#fff', textLight: 'rgba(255,255,255,0.15)',
      heroBg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', heroText: 'rgba(15,23,42,0.9)', heroTextLight: 'rgba(15,23,42,0.35)',
      hasImage: true, heroImg: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
      featureBars: ['rgba(30,58,138,0.6)', 'rgba(30,58,138,0.35)', 'rgba(30,58,138,0.2)'],
      sectionBg: 'rgba(30,58,138,0.05)', cardBg: 'rgba(255,255,255,0.9)', footerBg: '#0f172a'
    }
  ];

  brandColors = [
    { name: 'Navy', hex: '#2B3970' }, { name: 'Orange Vif', hex: '#FF6B2C' },
    { name: 'Émeraude', hex: '#10b981' }, { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Rouge', hex: '#ef4444' }, { name: 'Noir', hex: '#111827' },
    { name: 'Slate', hex: '#64748b' }, { name: 'Rose', hex: '#ec4899' },
    { name: 'Indigo', hex: '#4f46e5' }, { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Ambre', hex: '#f59e0b' }, { name: 'Teal', hex: '#14b8a6' },
  ];

  secondaryColors = [
    { name: 'Blanc', hex: '#ffffff' }, { name: 'Crème', hex: '#fefce8' },
    { name: 'Slate 50', hex: '#f8fafc' }, { name: 'Bleu Ciel', hex: '#e0f2fe' },
    { name: 'Vert Pâle', hex: '#dcfce7' }, { name: 'Violet Pâle', hex: '#ede9fe' },
    { name: 'Rose Pâle', hex: '#fce7f3' }, { name: 'Gris Foncé', hex: '#1e293b' },
    { name: 'Noir Doux', hex: '#0f172a' }, { name: 'Marine', hex: '#1e3a5f' },
  ];

  fontPairs = [
    {
      id: 'outfit-inter',
      label: 'Modern SaaS',
      heading: 'Outfit',
      body: 'Inter',
      preview: 'Votre Marque',
      desc: 'Géométrique & Lisible',
      tag: 'Populaire',
      url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Inter:wght@400;600&display=swap'
    },
    {
      id: 'syne-dm',
      label: 'Agency Bold',
      heading: 'Syne',
      body: 'DM Sans',
      preview: 'Votre Marque',
      desc: 'Expressif & Unique',
      tag: 'Tendance',
      url: 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap'
    },
    {
      id: 'playfair-source',
      label: 'Luxe Classic',
      heading: 'Playfair Display',
      body: 'Source Sans 3',
      preview: 'Votre Marque',
      desc: 'Élégant & Premium',
      tag: 'Luxe',
      url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@400;600&display=swap'
    },
    {
      id: 'space-grotesk',
      label: 'Tech Futur',
      heading: 'Space Grotesk',
      body: 'Space Grotesk',
      preview: 'Votre Marque',
      desc: 'Tech & Moderne',
      tag: 'Futuriste',
      url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap'
    },
    {
      id: 'montserrat-open',
      label: 'Corporate Pro',
      heading: 'Montserrat',
      body: 'Open Sans',
      preview: 'Votre Marque',
      desc: 'Professionnel & Sûr',
      tag: 'Corporate',
      url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Open+Sans:wght@400;600&display=swap'
    },
    {
      id: 'lora-lato',
      label: 'Editorial',
      heading: 'Lora',
      body: 'Lato',
      preview: 'Votre Marque',
      desc: 'Narratif & Chaleureux',
      tag: 'Éditorial',
      url: 'https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Lato:wght@400;700&display=swap'
    },
  ];

  selectedFont: string = 'outfit-inter';

  chartData = [
    { day: 'Lun', value: 40, isToday: false },
    { day: 'Mar', value: 65, isToday: false },
    { day: 'Mer', value: 30, isToday: false },
    { day: 'Jeu', value: 85, isToday: false },
    { day: 'Ven', value: 55, isToday: false },
    { day: 'Sam', value: 70, isToday: true },
    { day: 'Dim', value: 45, isToday: false },
  ];

  get publishedCount(): number {
    return this.sites.filter(s => s.published).length;
  }

  get filteredTemplates() {
    return this.getFilteredTemplatesForCategory(this.newSite.category);
  }

  getFilteredTemplatesForCategory(category: string) {
    if (!category) return this.aiTemplates;
    const filtered = this.aiTemplates.filter(t => t.sectors?.includes(category));
    return filtered.length > 0 ? filtered : this.aiTemplates;
  }

  getSelectedFont() {
    return this.fontPairs.find(f => f.id === this.selectedFont) || this.fontPairs[0];
  }

  get selectedFontHeading(): string {
    const f = this.fontPairs.find(fp => fp.id === this.selectedFont) || this.fontPairs[0];
    return f ? f.heading + ', sans-serif' : 'Outfit, sans-serif';
  }

  get selectedFontBody(): string {
    const f = this.fontPairs.find(fp => fp.id === this.selectedFont) || this.fontPairs[0];
    return f ? f.body + ', sans-serif' : 'Inter, sans-serif';
  }

  onCategoryChange() {
    // Reset template selection when sector changes
    this.selectedTemplate = null;
  }

  constructor(
    private authService: AuthService,
    private siteService: SiteService,
    public subService: SubscriptionService,
    public router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadSites();
    this.subService.loadStatus().subscribe(); // Professional: Load quota status

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.username) this.username = user.username;

    this.notificationService.connect();
    this.notificationService.getNotifications().subscribe((data) => {
      // Refresh sites and subscription status whenever notification received
      this.loadSites();
      this.subService.loadStatus().subscribe();
    });
  }

  ngOnDestroy() {
    this.notificationService.disconnect();
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getTabSubtitle(): string {
    if (this.activeTab === 'sites') return 'Gérez vos identités digitales';
    if (this.activeTab === 'assets') return "Graphismes générés par l'IA";
    if (this.activeTab === 'analytics') return 'Performances en temps réel';
    return 'Préférences du compte';
  }

  openSite(subdomain: string) {
    if (subdomain) window.open('/s/' + subdomain, '_blank');
  }

  getGenerationStatus(): string {
    if (!this.isGenerating) return 'Identification validée';
    return this.creationMode === 'ai' ? "Construction de l'Atelier & Déploiement" : 'Sauvegarde des paramètres';
  }

  setTab(tab: 'sites' | 'assets' | 'analytics' | 'settings') {
    this.activeTab = tab;
  }

  loadSites() {
    this.loading = true;
    this.siteService.getSites().subscribe({
      next: (data) => { this.sites = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  deleteSite(siteId: number) {
    if (!confirm('Supprimer définitivement cette vitrine ?')) return;
    this.siteService.deleteSite(siteId).subscribe({
      next: () => { this.loadSites(); this.showToast('Vitrine supprimée.', 'success'); },
      error: () => this.showToast('Erreur lors de la suppression.', 'error')
    });
  }

  togglePublish(site: any) {
    this.siteService.updateSite(site.id, { ...site, published: !site.published }).subscribe({
      next: () => { this.loadSites(); this.showToast(site.published ? 'Vitrine mise en brouillon.' : 'Vitrine publiée !', 'success'); },
      error: () => this.showToast('Erreur lors de la mise à jour.', 'error')
    });
  }

  previewSite(site: any) {
    const sub = site.subdomain || (site.companyName || '').toLowerCase().replace(/\s+/g, '-');
    if (sub) {
      window.open(`/s/${sub}`, '_blank');
    } else {
      this.showToast('Aucun sous-domaine configuré pour ce site.', 'info');
    }
  }

  editSite(site: any) {
    this.editSiteData = { ...site };
  }

  saveEditSite() {
    if (!this.editSiteData?.companyName) return;
    this.siteService.updateSite(this.editSiteData.id, this.editSiteData).subscribe({
      next: () => {
        this.loadSites();
        this.showToast('Vitrine mise à jour !', 'success');
        this.editSiteData = null;
      },
      error: () => this.showToast('Erreur lors de la mise à jour.', 'error')
    });
  }

  getTemplateBg(templateId: string): string {
    const t = this.aiTemplates.find(t => t.id === templateId);
    return t?.heroBg || 'linear-gradient(135deg,#f0f4ff,#e8eeff)';
  }

  addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.showToast(message, type);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => this.toasts = this.toasts.filter(t => t !== toast), 3500);
  }

  openCreateWizard() {
    if (!this.subService.canCreateSite()) {
      this.showToast('Limite de sites atteinte pour votre plan. Passez au niveau supérieur !', 'info');
      this.router.navigate(['/pricing']);
      return;
    }
    this.newSite = { companyName: '', category: 'Tech', description: '', subdomain: '', primaryColor: '#FF6B2C', secondaryColor: '#0f172a', fontFamily: 'outfit-inter', email: '', phone: '', address: '' };
    this.selectedFont = 'outfit-inter';
    this.wizardStep = 1;
    this.creationMode = null;
    this.selectedTemplate = null;
    this.isGenerating = false;
    this.showCreateWizard = true;
    this.liveContent = null;
  }

  selectTemplate(templateId: string) {
    const t = this.aiTemplates.find(x => x.id === templateId);
    if (t?.isPremium && !this.subService.hasFeature('PREMIUM_TEMPLATES')) {
      this.showToast('Ce template est réservé aux membres Pro.', 'info');
      this.router.navigate(['/pricing']);
      return;
    }
    this.selectedTemplate = templateId;
    this.wizardStep = 3;
  }

  selectMode(mode: 'ai' | 'manual') {
    this.creationMode = mode;
  }

  nextWizardStep() {
    if (this.wizardStep < 3) this.wizardStep++;
  }

  prevWizardStep() {
    if (this.wizardStep > 1) this.wizardStep--;
  }

  progressText = '';
  progressPercent = 0;
  currentStepIndex = 0;
  generationSteps = [
    "Analyse du secteur d'activité",
    "Génération de l'identité visuelle",
    "Production du Kit Assets IA (Logos, Icons)",
    "Rédaction du contenu stratégique",
    "Optimisation SEO & Meta-data",
    "Configuration des Analytiques en temps réel",
    "Assemblage du design premium",
    "Déploiement sur le Cloud"
  ];

  submitCreateSite() {
    if (this.creationMode === 'manual' && !this.newSite.companyName) return;
    if (this.creationMode === 'ai' && !this.newSite.description) return;

    this.wizardStep = 3;
    this.isGenerating = true;
    this.progressText = "Initialisation...";
    this.progressPercent = 5;
    this.currentStepIndex = 0;
    this.liveContent = null;

    let selectedStyle = 'premium';
    let selectedFont = 'Inter';
    let templateConfigStr = null;

    if (this.selectedTemplate) {
      const t = this.aiTemplates.find(t => t.id === this.selectedTemplate);
      if (t) {
        templateConfigStr = JSON.stringify(t);
        selectedStyle = t.style || 'premium';
        if (t.font) selectedFont = t.font;
        // If template has an accent and user didn't change the default primary color, use template's accent
        if (t.accent && (this.newSite.primaryColor === '#FF6B2C' || !this.newSite.primaryColor)) {
          this.newSite.primaryColor = t.accent;
        }
      }
    }

    const executeCreation = () => {
      let finalSite: any = {
        ...this.newSite,
        templateIdString: this.selectedTemplate,
        templateConfig: templateConfigStr,
        primaryColor: this.newSite.primaryColor,
        style: selectedStyle,
        font: selectedFont,
        aiMode: this.creationMode === 'ai'
      };

      if (!finalSite.subdomain && finalSite.companyName) {
        finalSite.subdomain = finalSite.companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      this.siteService.createSite(finalSite).subscribe({
        next: (created: any) => {
          this.progressPercent = 100;
          this.progressText = "Site généré avec succès !";
          this.currentStepIndex = this.generationSteps.length;

          // Populate live preview with real AI response
          if (created?.generatedVisuals) {
            try {
              const aiData = JSON.parse(created.generatedVisuals);
              this.liveContent = {
                theme: aiData.theme || { primary: this.newSite.primaryColor },
                heroText: aiData.pages?.home?.heroText,
                heroSubtext: aiData.pages?.home?.heroSubtext,
                seo: aiData.seo,
                products: aiData.pages?.home?.products || []
              };
            } catch (e) { }
          }

          setTimeout(() => {
            this.isGenerating = false;
            this.showCreateWizard = false;
            this.activeTab = 'sites';
            this.loadSites();
            this.showToast(this.creationMode === 'ai' ? 'L\'IA a généré votre vitrine avec succès !' : 'Vitrine créée avec succès !', 'success');
          }, 1500);
        },
        error: () => {
          this.isGenerating = false;
          this.wizardStep = 2;
          this.showToast('Erreur lors de la création.', 'error');
        }
      });
    };

    if (this.creationMode === 'ai') {
      // Seed the live preview immediately with basic theme info
      this.liveContent = { theme: { primary: this.newSite.primaryColor, fontFamily: selectedFont }, seo: null };

      // Drive the progress timeline while the backend is processing
      const stepDurations = [1200, 2500, 3500, 4000, 3000, 2500];
      const stepPcts = [12, 28, 45, 68, 85, 96];
      let idx = 0;

      const advance = () => {
        if (idx < this.generationSteps.length && this.isGenerating) {
          this.currentStepIndex = idx;
          this.progressText = this.generationSteps[idx];
          this.progressPercent = stepPcts[idx];

          console.log(` [WIZARD] Step ${idx}: ${this.progressText} (${this.progressPercent}%)`);

          // Progressive live content enrichment
          if (idx === 1) this.liveContent = { ...this.liveContent, heroText: this.newSite.companyName };
          if (idx === 2) this.liveContent = { ...this.liveContent, heroSubtext: "Génération de votre proposition de valeur unique..." };
          if (idx === 3) this.liveContent = { ...this.liveContent, heroSubtext: this.newSite.description };
          if (idx === 4) this.liveContent = { ...this.liveContent, seo: { title: this.newSite.companyName + ' | Site Officiel' } };

          idx++;
          if (idx < this.generationSteps.length) {
            console.log(` [WIZARD] Scheduling next step in ${stepDurations[idx]}ms`);
            setTimeout(advance, stepDurations[idx]);
          }
        } else {
          console.log(` [WIZARD] Progress loop stopped. idx=${idx}, isGenerating=${this.isGenerating}`);
        }
      };

      advance();
      executeCreation();
    } else {
      executeCreation();
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}
