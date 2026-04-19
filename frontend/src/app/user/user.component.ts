import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

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
          <div class="w-11 h-11 bg-[#FF6B2C] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF6B2C]/30 rotate-3 flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <span class="text-xl font-black text-white tracking-tight">Viky<span class="text-[#FF6B2C]">Hub</span></span>
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
          [class]="activeTab==='assets' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
          <span *ngIf="activeTab==='assets'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#FF6B2C] rounded-r-full"></span>
          <svg class="w-5 h-5 flex-shrink-0" [class]="activeTab==='assets'?'text-[#FF6B2C]':'text-white/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Assets IA
        </button>

        <button (click)="setTab('analytics')"
          class="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden"
          [class]="activeTab==='analytics' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
          <span *ngIf="activeTab==='analytics'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#FF6B2C] rounded-r-full"></span>
          <svg class="w-5 h-5 flex-shrink-0" [class]="activeTab==='analytics'?'text-[#FF6B2C]':'text-white/30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Analytiques
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
              <span class="text-[9px] font-bold text-emerald-400/80 uppercase tracking-wider">Plan Pro · Actif</span>
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
          <div class="hidden md:flex w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2B3970] to-[#1a2450] text-white items-center justify-center font-black text-sm flex-shrink-0 shadow-md">
            {{username ? username.charAt(0).toUpperCase() : 'U'}}
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
            <span class="text-[10px] font-black text-[#FF6B2C] uppercase tracking-widest">Pro</span>
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
                <div class="w-14 h-14 bg-gradient-to-br from-[#FF6B2C] to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 border border-white/10">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
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
                <h3 class="text-xl font-black text-[#2B3970] mb-2">1. Identité & Visuel</h3>
                <p class="text-slate-400 text-sm font-medium mb-6">Définissez la base de votre vitrine.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Nom de l'Entité</label>
                    <input [(ngModel)]="newSite.companyName" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="Ex: Studio Alpha">
                  </div>
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Sous-domaine</label>
                    <input [(ngModel)]="newSite.subdomain" type="text" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all placeholder:text-slate-300" placeholder="studio-alpha">
                  </div>
                  <div>
                     <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Secteur d'Activité</label>
                     <select [(ngModel)]="newSite.category" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3.5 font-bold text-[#2B3970] focus:border-[#FF6B2C] outline-none transition-all cursor-pointer appearance-none">
                       <option value="Tech">Technologie</option>
                       <option value="Restaurant">Gastronomie</option>
                       <option value="Consulting">Consulting</option>
                       <option value="Beauty">Bien-être</option>
                       <option value="Retail">E-Commerce</option>
                     </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Couleur IA</label>
                    <div class="flex gap-2 flex-wrap">
                       <button *ngFor="let c of brandColors" (click)="newSite.primaryColor = c.hex"
                          class="w-10 h-10 rounded-xl border-2 transition-all flex-shrink-0"
                          [style.background]="c.hex"
                          [class]="newSite.primaryColor === c.hex ? 'border-slate-700 scale-110 shadow-lg' : 'border-transparent hover:scale-105'"
                          [title]="c.name">
                       </button>
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
                <h3 class="text-xl font-black text-[#2B3970] mb-2">3. Design & Structure</h3>
                <p class="text-slate-400 text-sm font-medium mb-6">Sélectionnez le style de base. L'IA l'adaptera entièrement à votre secteur.</p>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
              <button *ngFor="let t of aiTemplates" (click)="selectedTemplate = t.id"
                class="group relative border-2 rounded-[20px] overflow-hidden transition-all duration-300 text-left bg-white flex flex-col"
                [class]="selectedTemplate === t.id ? 'border-[#FF6B2C] shadow-[0_16px_48px_rgba(255,107,44,0.18)] scale-[1.03]' : 'border-slate-100 hover:border-[#FF6B2C]/40 hover:shadow-2xl hover:-translate-y-1'">

                <!-- Elite Badge -->
                <div *ngIf="t.isPremium" class="absolute top-2.5 left-2.5 z-20 bg-[#FF6B2C] text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow">
                  Elite
                </div>

                <!-- ===== PREMIUM WEBSITE MOCKUP PREVIEW ===== -->
                <div class="h-40 relative overflow-hidden flex-shrink-0" [style.background]="t.navBg">

                  <!-- Browser chrome -->
                  <div class="absolute top-0 left-0 right-0 h-4 flex items-center px-2 gap-1 z-20" [style.background]="t.navBg">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-400/60"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-yellow-400/60"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-green-400/60"></div>
                    <div class="flex-1 mx-2 h-1.5 rounded-full bg-white/10"></div>
                  </div>

                  <!-- Navbar -->
                  <div class="absolute top-4 left-0 right-0 h-6 flex items-center justify-between px-2.5 z-10" [style.background]="t.navBg">
                    <div class="flex items-center gap-1.5">
                      <div class="w-2 h-2 rounded-sm" [style.background]="t.accent"></div>
                      <div class="w-10 h-1 rounded-full" [style.background]="t.textLight"></div>
                    </div>
                    <div class="flex gap-3 items-center">
                      <div class="w-6 h-0.5 rounded-full" [style.background]="t.textLight"></div>
                      <div class="w-6 h-0.5 rounded-full" [style.background]="t.textLight"></div>
                      <div class="h-3 px-2 rounded text-[5.5px] font-black flex items-center" [style.background]="t.accent" [style.color]="t.accentText">Contact</div>
                    </div>
                  </div>

                  <!-- Hero / Main content -->
                  <div class="absolute top-10 left-0 right-0 bottom-0" [ngStyle]="{'background': t.heroBg}">
                    <div class="flex h-full">
                      <!-- Left content -->
                      <div class="flex-1 flex flex-col justify-center px-3 py-1.5">
                        <!-- Eyebrow label -->
                        <div class="h-1 rounded-sm mb-1.5 w-10" [style.background]="t.accent"></div>
                        <!-- H1 -->
                        <div class="h-2.5 rounded-sm mb-1 w-24" [style.background]="t.heroText"></div>
                        <!-- H1 line 2 -->
                        <div class="h-2.5 rounded-sm mb-2 w-20" [style.background]="t.heroText"></div>
                        <!-- Subtext -->
                        <div class="h-1 rounded-full mb-0.5 w-20" [style.background]="t.heroTextLight"></div>
                        <div class="h-1 rounded-full mb-3 w-16" [style.background]="t.heroTextLight"></div>
                        <!-- CTA Buttons -->
                        <div class="flex gap-1.5 items-center">
                          <div class="h-3.5 px-2 rounded text-[5.5px] font-black flex items-center shadow-sm" [style.background]="t.accent" [style.color]="t.accentText">Démarrer</div>
                          <div class="h-3.5 px-2 rounded border text-[5.5px] flex items-center" [style.border-color]="t.heroText + '50'" [style.color]="t.heroText">En savoir +</div>
                        </div>
                      </div>
                      <!-- Right visual block -->
                      <div *ngIf="t.hasImage" class="w-14 flex items-center justify-center overflow-hidden relative mr-1.5">
                        <div class="w-11 h-full rounded-lg overflow-hidden" [style.background]="t.imageBg">
                          <!-- Simulated card/image placeholder -->
                          <div class="m-1.5 h-5 rounded" [style.background]="'rgba(255,255,255,0.15)'"></div>
                          <div class="mx-1.5 h-1 rounded-full mb-1" [style.background]="'rgba(255,255,255,0.25)'"></div>
                          <div class="mx-1.5 h-1 rounded-full" [style.background]="'rgba(255,255,255,0.15)'"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Features row at bottom -->
                    <div class="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-1.5">
                      <div *ngFor="let bar of t.featureBars" class="flex-1 h-4 rounded-md" [style.background]="bar"></div>
                    </div>
                  </div>

                  <!-- Hover overlay -->
                  <div class="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
                </div>

                <!-- Card Footer -->
                <div class="p-3 flex-1 flex flex-col justify-between" [class]="selectedTemplate === t.id ? 'bg-orange-50/70' : 'bg-white group-hover:bg-slate-50/60 transition-colors'">
                  <div>
                    <div class="flex items-start justify-between gap-1 mb-1">
                      <h4 class="font-black text-[#2B3970] text-xs leading-tight">{{t.name}}</h4>
                      <span class="text-[6.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                        [style.background]="t.accent + '22'" [style.color]="t.accent">{{t.tags[0]}}</span>
                    </div>
                    <p class="text-[8.5px] text-slate-400 font-medium leading-tight line-clamp-2">{{t.desc}}</p>
                  </div>
                  <div class="flex items-center justify-between mt-1.5">
                    <span class="text-[7px] text-slate-300 font-bold uppercase tracking-wider">{{t.style}}</span>
                    <div *ngIf="selectedTemplate === t.id" class="flex items-center gap-1">
                      <div class="w-3.5 h-3.5 bg-[#FF6B2C] rounded-full flex items-center justify-center shadow">
                        <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span class="text-[7px] font-black text-[#FF6B2C] uppercase">Sélectionné</span>
                    </div>
                  </div>
                </div>
              </button>
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
                    <select [(ngModel)]="newSite.category" class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 font-bold text-[#2B3970] focus:border-[#2B3970] outline-none cursor-pointer appearance-none transition-all">
                      <option value="Tech">Technologie</option>
                      <option value="Restaurant">Gastronomie</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Beauty">Bien-être</option>
                      <option value="Retail">E-Commerce</option>
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
          <div *ngIf="wizardStep === 3" class="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 relative overflow-hidden min-h-[500px]">
             
             <!-- Floating Background Blobs -->
             <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-[#FF6B2C]/10 rounded-full blur-3xl animate-pulse"></div>
             <div class="absolute -left-20 -top-20 w-64 h-64 bg-[#2B3970]/5 rounded-full blur-3xl"></div>

             <!-- Status & Progress -->
             <div class="z-10 w-full max-w-sm text-center mb-10">
                <div class="relative w-20 h-20 mx-auto mb-6">
                   <div class="absolute inset-0 border-2 border-[#FF6B2C]/20 rounded-2xl animate-spin" style="animation-duration: 3s"></div>
                   <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-12 h-12 bg-gradient-to-br from-[#2B3970] to-[#1a2450] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                         <div class="absolute inset-0 bg-[#FF6B2C]/20 animate-pulse"></div>
                         <svg class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      </div>
                   </div>
                </div>
                <h3 class="text-xl font-black text-[#2B3970] mb-2 tracking-tight">{{progressText}}</h3>
                <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4 shadow-inner">
                   <div class="h-full bg-gradient-to-r from-[#FF6B2C] to-[#f97316] transition-all duration-700 shadow-[0_0_10px_rgba(255,107,44,0.3)]" [style.width.%]="progressPercent"></div>
                </div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Identify Gen™ en cours d'exécution</p>
             </div>

             <!-- THE LIVE PREVIEW MOCKUP -->
             <div *ngIf="liveContent" class="z-10 w-full max-w-lg bg-white rounded-[32px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] border border-white overflow-hidden transform transition-all duration-700 hover:scale-[1.02] relative animate-fade-in-up">
                <!-- Browser Bar -->
                <div class="h-7 bg-slate-50 flex items-center gap-1.5 px-5 border-b border-slate-100">
                   <div class="flex gap-1">
                     <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                     <div class="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                     <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                   </div>
                   <div class="mx-auto text-[8px] font-black text-slate-300 tracking-tighter uppercase">{{newSite.subdomain || 'votre-site'}}.vitrineclick.com</div>
                </div>
                
                <!-- Mockup Content -->
                <div class="p-8">
                   <!-- Mockup Navbar -->
                   <div class="flex items-center justify-between mb-8">
                      <div class="flex items-center gap-2.5">
                         <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md transition-all duration-500" [style.background-color]="liveContent.theme?.primary || '#f1f5f9'">
                            <span *ngIf="liveContent.theme">{{newSite.companyName?.charAt(0)}}</span>
                         </div>
                         <div class="h-1.5 w-16 rounded-full bg-slate-100" *ngIf="!liveContent.seo"></div>
                         <div class="text-[9px] font-black text-[#2B3970] uppercase tracking-wider" *ngIf="liveContent.seo">{{newSite.companyName}}</div>
                      </div>
                      <div class="flex gap-2">
                         <div class="h-1 w-6 rounded-full bg-slate-100"></div>
                         <div class="h-1 w-6 rounded-full bg-slate-100"></div>
                      </div>
                   </div>
                   
                   <!-- Mockup Hero -->
                   <div class="space-y-4 mb-8">
                      <div class="space-y-1.5">
                        <div class="h-2 rounded-lg w-16 bg-[#FF6B2C]/20" *ngIf="liveContent.theme"></div>
                        <div class="h-4 rounded-lg w-5/6 animate-pulse bg-slate-50" *ngIf="!liveContent.heroText"></div>
                        <div class="text-xl font-black leading-none text-[#2B3970] animate-fade-in" *ngIf="liveContent.heroText">{{liveContent.heroText}}</div>
                      </div>
                      
                      <div class="space-y-1.5">
                        <div class="h-2 rounded-full w-1/2 animate-pulse bg-slate-50" *ngIf="!liveContent.aboutText"></div>
                        <div class="text-[9px] text-slate-400 font-medium leading-relaxed animate-fade-in" *ngIf="liveContent.aboutText">{{liveContent.aboutText}}</div>
                      </div>

                      <div class="flex gap-2.5 pt-2" *ngIf="liveContent.theme">
                         <div class="h-7 w-20 rounded-lg shadow-sm" [style.background-color]="liveContent.theme.primary"></div>
                         <div class="h-7 w-20 rounded-lg border border-slate-100"></div>
                      </div>
                   </div>
                   
                   <!-- Mockup Products -->
                   <div class="mt-8 grid grid-cols-4 gap-3 animate-fade-in" *ngIf="liveContent.products">
                      <div *ngFor="let p of liveContent.products" class="aspect-[4/5] bg-slate-50 rounded-xl flex flex-col p-2 border border-slate-100/50 transition-all hover:shadow-md">
                         <div class="w-full h-3/4 rounded-lg mb-2 relative overflow-hidden" [style.background-color]="liveContent.theme.primary + '11'">
                           <div class="absolute inset-0 flex items-center justify-center opacity-20">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                           </div>
                         </div>
                         <div class="h-1 w-2/3 bg-slate-200 rounded-full mb-1"></div>
                         <div class="h-1 w-1/2 bg-slate-100 rounded-full"></div>
                      </div>
                   </div>
                </div>
             </div>
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
              <p class="text-3xl font-black text-white">Pro</p>
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
                <!-- Status badge -->
                <div class="absolute top-4 left-4 z-10">
                  <span class="px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 backdrop-blur-sm"
                    [class]="site.published ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100' : 'bg-white/80 text-orange-500 border-orange-100'">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="site.published ? 'bg-emerald-500 animate-pulse' : 'bg-orange-400'"></span>
                    {{site.published ? 'En ligne' : 'Brouillon'}}
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

        <!-- =================== TAB: ASSETS =================== -->
          <!-- TAB ASSETS -->
          <div *ngIf="!loading && activeTab==='assets'" class="tab-enter space-y-8">
            <div class="stagger-in">
              <div class="flex items-center justify-between bg-white rounded-[32px] p-8 border border-slate-100 mb-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
               <div>
                 <h2 class="text-3xl font-black text-[#2B3970] tracking-tight">Bibliothèque d'Assets</h2>
                 <p class="text-slate-500 font-medium mt-2 text-sm">Tous vos logos et graphismes générés par l'IA Identify Gen™ centralisés.</p>
               </div>
               <button (click)="openCreateWizard()" class="px-6 py-3.5 bg-slate-50 text-[#2B3970] font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 border border-slate-100 hover:bg-[#2B3970] hover:text-white hover:border-[#2B3970] shadow-sm transition-all group">
                  <svg class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                  Nouveau Logo IA
               </button>
            </div>

            <!-- Empty Assets State -->
            <div *ngIf="sites.length === 0" class="bg-white rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-20 flex flex-col items-center text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-8 border border-slate-200/50 shadow-inner -rotate-6">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h2 class="text-2xl font-black text-[#2B3970] mb-3">Aucun asset généré</h2>
              <p class="text-slate-500 mb-8 max-w-sm">Vous n'avez pas encore généré d'identité visuelle avec notre IA.</p>
            </div>

            <!-- Assets Grid -->
            <div *ngIf="sites.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div *ngFor="let site of sites" class="bg-white rounded-[32px] border border-slate-100 overflow-hidden group shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 relative">
                <!-- Hover Overlay -->
                <div class="absolute inset-x-0 top-0 h-40 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button class="w-10 h-10 rounded-full bg-white text-[#2B3970] flex items-center justify-center hover:bg-[#FF6B2C] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl" title="Télécharger">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  </button>
                  <button (click)="openSite(site.subdomain)" class="w-10 h-10 rounded-full bg-white text-[#2B3970] flex items-center justify-center hover:bg-[#FF6B2C] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-xl" title="Voir le site">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
                <!-- Image Header -->
                <div class="h-40 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                   <div class="absolute inset-0 bg-gradient-to-tr" [style.background-image]="'linear-gradient(to top right, ' + site.primaryColor + '20, transparent)'"></div>
                   <div class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-0" [style.background-color]="site.primaryColor">
                      <span class="text-3xl font-black text-white mix-blend-overlay">{{ site.companyName.charAt(0).toUpperCase() }}</span>
                   </div>
                </div>
                <!-- Body -->
                <div class="p-6">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-black text-[#2B3970] text-sm truncate">{{ site.companyName }} — Logo</h3>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-xs text-slate-400 font-medium uppercase tracking-widest">{{ site.category }}</p>
                    <span class="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">SVG/PNG</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        <!-- =================== TAB: ANALYTICS =================== -->
        <div *ngIf="!loading && activeTab==='analytics'" class="space-y-8 tab-enter">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow relative overflow-hidden group">
              <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500"></div>
              <div class="flex items-start justify-between mb-6 relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#2B3970] shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <span class="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 rounded-xl text-[#FF6B2C] font-black text-xs shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
                  Temps Réel
                </span>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-slate-100 pb-3 inline-block">Visiteurs Uniques</p>
                <div class="flex items-baseline gap-3">
                  <p class="text-5xl font-black text-[#2B3970] tracking-tight">{{ totalVisits | number:'1.0-0' }}</p>
                  <p class="text-xs text-slate-400 font-bold mb-1">/ sem</p>
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
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Synchronisé
                </span>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3 border-b border-white/10 pb-3 inline-block">Taux de Conversion</p>
                <div class="flex items-baseline gap-3">
                  <p class="text-5xl font-black text-white tracking-tight">{{ avgAiScore | number:'1.0-0' }}<span class="text-3xl text-white/70">%</span></p>
                  <p class="text-xs text-white/50 font-bold mb-1">IA Optimisé</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow relative overflow-hidden group">
              <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors duration-500"></div>
              <div class="flex items-start justify-between mb-6 relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 rounded-2xl flex items-center justify-center text-[#FF6B2C] shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span class="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 rounded-xl text-[#FF6B2C] font-black text-xs shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
                  En direct
                </span>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-slate-100 pb-3 inline-block">Temps de Rétention</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-5xl font-black text-[#2B3970] tracking-tight">{{ mathClass.floor(avgRetention/60) }}<span class="text-3xl text-slate-400">m</span> {{ avgRetention % 60 }}<span class="text-3xl text-slate-400">s</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Section -->
          <div class="bg-white border border-slate-100 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden stagger-in">
            <div class="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-black text-[#2B3970] tracking-tight">Activité Globale</h3>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.1em] mt-1">Visites générées par vos vitrines IA cette semaine</p>
              </div>
              <div class="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm animate-pulse">
                Live Data
              </div>
            </div>
            <div class="p-10">
              <!-- Premium SVG Area Chart Illusion -->
              <div class="relative h-64 mb-10 group">
                <!-- SVG Chart -->
                <svg class="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#FF6B2C" stop-opacity="0.2" />
                      <stop offset="100%" stop-color="#FF6B2C" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <!-- Path Area -->
                  <path d="M0,180 C100,100 200,190 300,60 C400,140 500,110 600,160 C700,90 800,90 900,90 V200 H0 Z" fill="url(#premiumGradient)" />
                  <!-- Path Line -->
                  <path d="M0,180 C100,100 200,190 300,60 C400,140 500,110 600,160 C700,90" 
                        fill="none" stroke="#FF6B2C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
                        class="drop-shadow-[0_8px_15px_rgba(255,107,44,0.3)]" />
                </svg>

                <!-- Data Tooltips Simulation -->
                <div class="absolute inset-0 flex justify-between px-4 items-end pointer-events-none">
                  <div *ngFor="let point of chartData" class="flex-1 flex flex-col items-center group/p pointer-events-auto">
                    <div class="mb-4 opacity-0 group-hover/p:opacity-100 transition-all bg-[#2B3970] text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl translate-y-2 group-hover/p:translate-y-0">
                      {{point.value * 12}} Visits
                    </div>
                    <div class="w-4 h-4 rounded-full border-4 border-white shadow-lg transition-all"
                         [class]="point.isToday ? 'bg-[#FF6B2C] scale-125' : 'bg-slate-200 group-hover/p:bg-[#2B3970]'"
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

          <!-- Sites Performance Table -->
          <div *ngIf="sites.length > 0" class="bg-white border border-slate-100 rounded-[28px] shadow-sm overflow-hidden">
            <div class="px-8 py-6 border-b border-slate-50">
              <h3 class="font-black text-[#2B3970]">Performance par Vitrine</h3>
              <p class="text-slate-400 text-xs font-medium">Métriques individuelles de chaque site déployé</p>
            </div>
            <table class="w-full">
              <thead class="bg-slate-50/80">
                <tr>
                  <th class="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitrine</th>
                  <th class="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th class="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visites</th>
                  <th class="text-right px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score IA</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let site of sites" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-6 h-6 object-contain">
                        <span *ngIf="!site.logoUrl" class="font-black text-slate-300 text-sm">{{site.companyName?.charAt(0)}}</span>
                      </div>
                      <div>
                        <p class="font-black text-[#2B3970] text-sm">{{site.companyName}}</p>
                        <p class="text-[10px] text-slate-400">{{site.subdomain}}.vitrineclick.com</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <span class="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border"
                      [class]="site.published ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-500 border-orange-100'">
                      {{site.published ? 'En ligne' : 'Brouillon'}}
                    </span>
                  </td>
                  <td class="px-6 py-5 font-black text-[#2B3970]">{{site.published ? (site.visits || 0) : '—'}}</td>
                  <td class="px-8 py-5 text-right">
                    <span class="font-black text-[#FF6B2C]">{{site.published ? (site.aiScore || 0) : '—'}}%</span>
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
                          <p class="text-2xl font-black">Pro Studio</p>
                        </div>
                        <div class="text-right">
                          <p class="text-2xl font-black text-[#FF6B2C]">29 DT<span class="text-[10px] text-white/40 ml-1">/mois</span></p>
                        </div>
                      </div>
                      <div class="mt-6 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                        <p class="text-white/50 text-[9px] uppercase font-bold tracking-wider">Renouvellement</p>
                        <p class="text-white text-xs font-black">12 Mai 2026</p>
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
                            <p class="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Jusqu'à 10 sites en ligne</p>
                          </div>
                        </div>
                        <p class="text-sm font-black text-slate-500">{{publishedCount}} / 10</p>
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
                        <p class="text-sm font-black text-emerald-500">Illimité</p>
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
                    <button class="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:text-[#2B3970] transition-colors shadow-sm">Gérer</button>
                    <button class="flex-1 py-3.5 text-[#FF6B2C] border-2 border-[#FF6B2C]/20 bg-orange-50/50 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#FF6B2C] hover:text-white transition-colors shadow-sm">Upgrade</button>
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
                <option value="Tech">Technologie</option>
                <option value="Restaurant">Gastronomie</option>
                <option value="Consulting">Consulting</option>
                <option value="Beauty">Bien-être</option>
                <option value="Retail">E-Commerce</option>
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
                    <span *ngIf="editSiteData.template === t.id" class="text-[7px] font-black text-[#FF6B2C] uppercase">Actif</span>
                  </div>
                </div>
              </button>
            </div>
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
  activeTab: 'sites' | 'assets' | 'analytics' | 'settings' = 'sites';
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
  liveContent: any = null;
  mathClass = Math;

  get totalVisits() { return this.sites.reduce((sum, s) => sum + (s.visits || 0), 0); }
  get avgAiScore() { const pub = this.sites.filter(s => s.published); return pub.length ? pub.reduce((sum, s) => sum + (s.aiScore || 0), 0) / pub.length : 0; }
  get avgRetention() { const pub = this.sites.filter(s => s.published); return pub.length ? pub.reduce((sum, s) => sum + (s.retentionTimeSeconds || 0), 0) / pub.length : 0; }


  aiTemplates = [
    {
      id: 'modern', name: 'Nexus Pro', desc: 'Architecture minimaliste pour la conversion B2B SaaS.', tags: ['SaaS', 'Tech'], isPremium: true, style: 'Dark Minimal',
      navBg: '#0f172a', accent: '#6366f1', accentText: '#fff', textLight: 'rgba(255,255,255,0.2)',
      heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', heroText: 'rgba(255,255,255,0.85)', heroTextLight: 'rgba(255,255,255,0.3)',
      hasImage: true, imageBg: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
      featureBars: ['rgba(99,102,241,0.5)', 'rgba(99,102,241,0.3)', 'rgba(99,102,241,0.2)'],
      sectionBg: 'rgba(99,102,241,0.08)', cardBg: 'rgba(255,255,255,0.04)', footerBg: '#020617'
    },
    {
      id: 'bold', name: 'Vanguard', desc: 'Typographie massive, contrastes marqués pour agences créatives.', tags: ['Agence', 'Créatif'], isPremium: false, style: 'Bold & Vibrant',
      navBg: '#fff', accent: '#f97316', accentText: '#fff', textLight: 'rgba(0,0,0,0.18)',
      heroBg: 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)', heroText: 'rgba(15,23,42,0.9)', heroTextLight: 'rgba(15,23,42,0.35)',
      hasImage: true, imageBg: 'linear-gradient(150deg, #fed7aa 0%, #fb923c 100%)',
      featureBars: ['rgba(249,115,22,0.5)', 'rgba(249,115,22,0.3)', 'rgba(249,115,22,0.15)'],
      sectionBg: 'rgba(249,115,22,0.06)', cardBg: 'rgba(249,115,22,0.05)', footerBg: '#0f172a'
    },
    {
      id: 'elegant', name: 'Maison Luxe', desc: 'Grilles aérées et esthétique éditoriale haut de gamme.', tags: ['Luxe', 'Mode'], isPremium: true, style: 'Luxury Editorial',
      navBg: '#1a1108', accent: '#d4af37', accentText: '#1a1108', textLight: 'rgba(212,175,55,0.3)',
      heroBg: 'linear-gradient(135deg, #1a1108 0%, #2d1f0a 100%)', heroText: 'rgba(255,255,255,0.9)', heroTextLight: 'rgba(255,255,255,0.3)',
      hasImage: true, imageBg: 'linear-gradient(180deg, #d4af37 0%, #b8860b 100%)',
      featureBars: ['rgba(212,175,55,0.6)', 'rgba(212,175,55,0.35)', 'rgba(212,175,55,0.2)'],
      sectionBg: 'rgba(212,175,55,0.07)', cardBg: 'rgba(255,255,255,0.03)', footerBg: '#0a0804'
    },
    {
      id: 'organic', name: 'Botanica', desc: 'Lignes fluides et palette naturelle apaisante pour bien-être.', tags: ['Bien-être', 'Bio'], isPremium: false, style: 'Natural & Soft',
      navBg: '#f0fdf4', accent: '#16a34a', accentText: '#fff', textLight: 'rgba(22,163,74,0.2)',
      heroBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', heroText: 'rgba(15,40,15,0.85)', heroTextLight: 'rgba(15,40,15,0.3)',
      hasImage: true, imageBg: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
      featureBars: ['rgba(22,163,74,0.5)', 'rgba(22,163,74,0.3)', 'rgba(22,163,74,0.15)'],
      sectionBg: 'rgba(22,163,74,0.06)', cardBg: 'rgba(255,255,255,0.7)', footerBg: '#052e16'
    },
    {
      id: 'urban', name: 'Cyber Night', desc: 'Interface sombre avec accents néon pour gaming & Web3.', tags: ['E-sport', 'Web3'], isPremium: true, style: 'Neon Dark',
      navBg: '#0d0d1a', accent: '#a855f7', accentText: '#fff', textLight: 'rgba(168,85,247,0.3)',
      heroBg: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 100%)', heroText: 'rgba(255,255,255,0.85)', heroTextLight: 'rgba(255,255,255,0.25)',
      hasImage: true, imageBg: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)',
      featureBars: ['rgba(168,85,247,0.6)', 'rgba(168,85,247,0.35)', 'rgba(168,85,247,0.2)'],
      sectionBg: 'rgba(168,85,247,0.08)', cardBg: 'rgba(255,255,255,0.04)', footerBg: '#04011a'
    },
    {
      id: 'corporate', name: 'Apex Trust', desc: 'Structure classique qui inspire fiabilité pour finance & légal.', tags: ['Finance', 'Légal'], isPremium: false, style: 'Classic Corporate',
      navBg: '#1e3a8a', accent: '#3b82f6', accentText: '#fff', textLight: 'rgba(255,255,255,0.25)',
      heroBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', heroText: 'rgba(30,58,138,0.9)', heroTextLight: 'rgba(30,58,138,0.35)',
      hasImage: false, imageBg: '',
      featureBars: ['rgba(59,130,246,0.5)', 'rgba(59,130,246,0.3)', 'rgba(59,130,246,0.15)'],
      sectionBg: 'rgba(59,130,246,0.07)', cardBg: 'rgba(255,255,255,0.8)', footerBg: '#0f172a'
    },
  ];

  brandColors = [
    { name: 'Navy', hex: '#2B3970' }, { name: 'Orange', hex: '#FF6B2C' },
    { name: 'Vert', hex: '#10b981' }, { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Rouge', hex: '#ef4444' }, { name: 'Noir', hex: '#111827' },
    { name: 'Slate', hex: '#64748b' }, { name: 'Rose', hex: '#ec4899' },
  ];

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

  constructor(private siteService: SiteService, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadSites();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.username) this.username = user.username;

    this.notificationService.connect();
    this.notificationService.getNotifications().subscribe((data) => {
      // Refresh sites whenever notification received
      this.loadSites();
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
    if(subdomain) window.open('/s/' + subdomain, '_blank');
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
    if (site.subdomain) {
      window.open(`/s/${site.subdomain}`, '_blank');
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

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => this.toasts = this.toasts.filter(t => t !== toast), 3500);
  }

  openCreateWizard() {
    this.newSite = { companyName: '', category: 'Tech', description: '', subdomain: '', primaryColor: '#2B3970', email: '', phone: '', address: '' };
    this.wizardStep = 1;
    this.creationMode = null;
    this.selectedTemplate = null;
    this.isGenerating = false;
    this.showCreateWizard = true;
    this.liveContent = null;
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
  
  submitCreateSite() {
    if (this.creationMode === 'manual' && !this.newSite.companyName) return;
    if (this.creationMode === 'ai' && !this.newSite.description) return;

    this.wizardStep = 3;
    this.isGenerating = true;
    this.progressText = "Initialisation...";
    this.progressPercent = 10;

    // Simulate AI Generation logic UX flow
    const executeCreation = () => {
      let templateConfigStr = null;
      if (this.selectedTemplate) {
        const t = this.aiTemplates.find(t => t.id === this.selectedTemplate);
        if (t) templateConfigStr = JSON.stringify(t);
      }
      
      let finalSite = { 
        ...this.newSite, 
        templateIdString: this.selectedTemplate,
        templateConfig: templateConfigStr,
        aiMode: true 
      };

      if (this.creationMode === 'ai') {
        if (!finalSite.subdomain && finalSite.companyName) {
          finalSite.subdomain = finalSite.companyName.toLowerCase().replace(/\s+/g, '-');
        }
      }

      this.siteService.createSite(finalSite).subscribe({
        next: () => {
          this.progressPercent = 100;
          this.progressText = "Terminé !";
          setTimeout(() => {
            this.isGenerating = false;
            this.showCreateWizard = false;
            this.activeTab = 'sites';
            this.loadSites();
            this.showToast(this.creationMode === 'ai' ? 'L\'IA a généré votre vitrine avec succès !' : 'Vitrine créée avec succès !', 'success');
          }, 800);
        },
        error: () => {
          this.isGenerating = false;
          this.wizardStep = 2;
          this.showToast('Erreur lors de la création.', 'error');
        }
      });
    };

    if (this.creationMode === 'ai') {
      this.liveContent = { status: 'thinking' };
      
      // Update UI state periodically while the request is in flight
      const steps = [
        { text: "Analyse du secteur " + this.newSite.category + "...", pct: 25 },
        { text: "Génération du branding & SEO...", pct: 50 },
        { text: "Fabrication du catalogue produits IA...", pct: 75 },
        { text: "Déploiement final du Studio...", pct: 90 }
      ];
      
      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length && this.isGenerating) {
          this.progressText = steps[stepIdx].text;
          this.progressPercent = steps[stepIdx].pct;
          
          if (stepIdx === 1) this.liveContent = { ...this.liveContent, theme: { primary: this.newSite.primaryColor, font: 'Inter' }, seo: { title: this.newSite.companyName + " | Officiel" } };
          if (stepIdx === 2) this.liveContent = { ...this.liveContent, products: [{}, {}, {}, {}] };
          
          stepIdx++;
        } else {
          clearInterval(interval);
        }
      }, 1500);

      // Call Backend IMMEDIATELY
      executeCreation();
    } else {
      executeCreation(); // Instant
    }
  }


  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}
