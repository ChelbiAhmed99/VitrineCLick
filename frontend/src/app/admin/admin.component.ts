import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-700 pb-20 md:pb-0">

      <!-- ======================== SIDEBAR (DESKTOP) ======================== -->
      <aside class="hidden md:flex w-72 bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#374151] flex-col h-screen sticky top-0 z-20 shadow-[4px_0_40px_rgba(0,0,0,0.15)] flex-shrink-0">
        <div class="p-10 border-b border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#FF6B2C] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
               <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-black text-white tracking-tight">Admin<span class="text-[#FF6B2C]">Core</span></span>
              <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">System Identity</span>
            </div>
          </div>
        </div>
        
        <nav class="p-6 flex-1 space-y-1">
          <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.45em] px-4 mb-5">Superviseur Global</p>
          
          <button (click)="setTab('overview')"
            class="w-full flex items-center gap-4 px-5 py-4 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden group"
            [class]="activeTab === 'overview' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
            <span *ngIf="activeTab === 'overview'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF6B2C] rounded-r-full"></span>
            <svg class="w-6 h-6" [class]="activeTab === 'overview' ? 'text-[#FF6B2C]' : 'text-white/30 group-hover:text-white/50'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Vue d'Ensemble
          </button>
          
          <button (click)="setTab('users')"
            class="w-full flex items-center gap-4 px-5 py-4 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden group"
            [class]="activeTab === 'users' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
            <span *ngIf="activeTab === 'users'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF6B2C] rounded-r-full"></span>
            <svg class="w-6 h-6" [class]="activeTab === 'users' ? 'text-[#FF6B2C]' : 'text-white/30 group-hover:text-white/50'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Utilisateurs
            <span class="ml-auto text-[9px] font-black px-2.5 py-1 rounded-full transition-all" [class]="activeTab === 'users' ? 'bg-[#FF6B2C] text-white' : 'bg-white/10 text-white/50'">{{ users.length || 0 }}</span>
          </button>

          <button (click)="setTab('sites')"
            class="w-full flex items-center gap-4 px-5 py-4 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden group"
            [class]="activeTab === 'sites' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
            <span *ngIf="activeTab === 'sites'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF6B2C] rounded-r-full"></span>
            <svg class="w-6 h-6" [class]="activeTab === 'sites' ? 'text-[#FF6B2C]' : 'text-white/30 group-hover:text-white/50'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            Sites Web
            <span class="ml-auto text-[9px] font-black px-2.5 py-1 rounded-full transition-all" [class]="activeTab === 'sites' ? 'bg-[#FF6B2C] text-white' : 'bg-white/10 text-white/50'">{{ sites.length || 0 }}</span>
          </button>
          <button (click)="setTab('settings')"
            class="w-full flex items-center gap-4 px-5 py-4 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all relative overflow-hidden group"
            [class]="activeTab === 'settings' ? 'bg-white/12 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/75'">
            <span *ngIf="activeTab === 'settings'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF6B2C] rounded-r-full"></span>
            <svg class="w-6 h-6" [class]="activeTab === 'settings' ? 'text-[#FF6B2C]' : 'text-white/30 group-hover:text-white/50'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Configuration
          </button>
        </nav>

        <div class="p-6 border-t border-white/8">
          <div class="flex items-center gap-4 bg-white/5 rounded-2xl p-4 mb-4">
            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black uppercase border border-orange-500/30">AD</div>
              <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[#1e2852] rounded-full"></div>
            </div>
            <div class="overflow-hidden">
              <p class="font-black text-white truncate text-sm">Super Admin</p>
              <p class="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Accès Total</p>
            </div>
          </div>
          <button (click)="logout()" class="w-full flex items-center gap-3 px-5 py-3.5 text-white/50 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest rounded-xl transition-all group">
            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Quitter
          </button>
        </div>
      </aside>

      <!-- Main Admin View -->
      <main class="flex-1 flex flex-col relative overflow-hidden">
        <!-- Header -->
        <header class="bg-white/90 backdrop-blur-xl px-4 sm:px-6 md:px-10 py-5 flex justify-between items-center sticky top-0 z-10 border-b border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div>
            <h1 class="text-xl md:text-2xl font-black text-[#111827] tracking-tight">
              {{ activeTab === 'overview' ? 'Vue d’Ensemble' : activeTab === 'users' ? 'Utilisateurs' : 'Sites' }}
            </h1>
            <p class="hidden sm:block text-slate-400 text-xs font-medium mt-0.5">Architecture VitrineClick AI</p>
          </div>
          <div class="flex items-center gap-6">
            <span class="px-6 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#FF6B2C] text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
               <span class="w-2 h-2 rounded-full bg-[#FF6B2C] animate-ping"></span>
               Session Sécurisée
            </span>
            <button (click)="loadAllData()" class="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-[#2B3970] hover:text-[#FF6B2C] border border-slate-100 hover:shadow-lg transition-all active:scale-95">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
        </header>

        <div class="p-6 md:p-16 flex-1 overflow-auto max-w-[1400px] mx-auto w-full relative z-10">
          
          <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-3 gap-10 animate-pulse">
            <div *ngFor="let i of [1,2,3]" class="skeleton h-48 rounded-[50px]"></div>
          </div>

          <div *ngIf="error" class="bg-red-50 border border-red-100 text-red-500 p-8 rounded-[32px] flex items-center gap-6 shadow-xl shadow-red-500/5">
            <svg class="w-10 h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span class="font-black tracking-tight text-lg">{{ error }}</span>
          </div>

          <!-- TAB OVERVIEW -->
          <div *ngIf="!loading && activeTab === 'overview'" class="tab-enter grid grid-cols-1 xl:grid-cols-3 gap-10 stagger-in">
            <!-- Main Metrics Card -->
            <div class="col-span-1 xl:col-span-2 bg-gradient-to-br from-[#1e2852] via-[#2B3970] to-[#1a2450] rounded-[40px] p-12 text-white relative overflow-hidden shadow-[0_40px_100px_rgba(43,57,112,0.3)] group border border-white/10">
              <div class="absolute -right-20 -top-20 w-80 h-80 bg-[#FF6B2C]/20 rounded-full blur-3xl group-hover:bg-[#FF6B2C]/30 transition-colors duration-1000"></div>
              <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
              
              <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div>
                  <div class="flex items-center gap-4 mb-8">
                    <div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#FF6B2C] border border-white/10 shadow-lg">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <p class="text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">Sites Actifs Globaux</p>
                  </div>
                  <h3 class="text-7xl font-black text-white tracking-tighter mb-2">{{ sites.length }}</h3>
                  <p class="text-emerald-400 font-bold text-sm flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full inline-flex border border-emerald-500/20">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                     +12.5% vs mois dernier
                  </p>
                </div>
                
                <!-- Premium SVG Network Graph -->
                <div class="w-full md:w-1/2 h-40 opacity-80 group-hover:opacity-100 transition-opacity">
                   <svg viewBox="0 0 400 150" class="w-full h-full drop-shadow-2xl overflow-visible">
                     <!-- Grid -->
                     <path d="M0,50 L400,50 M0,100 L400,100" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="5,5" />
                     <!-- Spline Area -->
                     <path d="M0,150 L0,120 Q50,80 100,100 T200,60 T300,80 T400,30 L400,150 Z" fill="url(#grad_area)" opacity="0.3" class="animate-pulse" />
                     <!-- Spline Path -->
                     <path d="M0,120 Q50,80 100,100 T200,60 T300,80 T400,30" fill="none" stroke="#FF6B2C" stroke-width="4" stroke-linecap="round" class="drop-shadow-lg" />
                     <!-- Data Points -->
                     <circle cx="100" cy="100" r="5" fill="white" stroke="#FF6B2C" stroke-width="3" class="animate-ping" style="animation-duration: 3s;" />
                     <circle cx="200" cy="60" r="5" fill="white" stroke="#FF6B2C" stroke-width="3" class="hover:r-[8px] transition-all cursor-pointer" />
                     <circle cx="300" cy="80" r="5" fill="white" stroke="#FF6B2C" stroke-width="3" />
                     <circle cx="400" cy="30" r="7" fill="white" stroke="#FF6B2C" stroke-width="4" class="animate-pulse shadow-xl" />
                     <defs>
                       <linearGradient id="grad_area" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stop-color="#FF6B2C" />
                         <stop offset="100%" stop-color="rgba(255,107,44,0)" />
                       </linearGradient>
                     </defs>
                   </svg>
                </div>
              </div>
            </div>

            <!-- Secondary Metrics -->
            <div class="grid grid-rows-2 gap-10">
               <!-- Health Card -->
               <div class="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Santé IA</h3>
                    <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                  </div>
                  <div class="flex items-end gap-3 mb-4">
                    <span class="text-5xl font-black text-[#2B3970] tracking-tighter">{{ stats?.healthScore || 0 | number:'1.1-1' }}</span><span class="text-xl font-bold text-slate-400 mb-1">%</span>
                  </div>
                  <div class="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                     <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full group-hover:scale-105 origin-left transition-transform" [style.width.%]="stats?.healthScore || 0"></div>
                  </div>
               </div>

               <!-- Revenue/Users Card -->
               <div class="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between">
                  <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateurs Globaux</h3>
                  <div class="flex items-center gap-6 mt-4">
                    <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B2C]">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    </div>
                    <div>
                      <p class="text-4xl font-black text-[#2B3970]">{{ users.length }}</p>
                      <p class="text-xs font-bold text-slate-400 mt-1">Inscrits Confirmés</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <!-- TAB USERS -->
          <div *ngIf="!loading && activeTab === 'users'" class="tab-enter">
            <!-- Search & Actions Bar -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 stagger-in">
              <div class="relative w-full md:w-96">
                <input type="text" placeholder="Rechercher par identité, email..." class="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] font-bold text-[#2B3970] focus:border-[#FF6B2C] focus:ring-4 focus:ring-[#FF6B2C]/10 transition-all shadow-sm outline-none placeholder:text-slate-300">
                <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <button class="px-6 py-4 bg-[#FF6B2C] text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 shadow-xl shadow-[#FF6B2C]/20 transition-all flex items-center gap-3 w-full md:w-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                Inviter Administrateur
              </button>
            </div>

            <!-- Complex Data Grid -->
            <div class="bg-white border border-slate-100 rounded-[30px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] stagger-in">
              <div class="overflow-x-auto">
                <table class="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr class="bg-slate-50/50">
                      <th class="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Client & Identité</th>
                      <th class="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Date Info</th>
                      <th class="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Permission</th>
                      <th class="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Statut</th>
                      <th class="py-6 px-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Gestion</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100/50">
                    <tr *ngFor="let user of users" class="hover:bg-slate-50/50 transition-colors group" [class.opacity-50]="user.suspended">
                      <!-- Identify Col -->
                      <td class="py-6 px-8">
                         <div class="flex items-center gap-4">
                            <div class="relative">
                              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B3970] to-blue-900 text-white flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform shadow-md border border-white/20">
                                 {{ user.username.charAt(0).toUpperCase() }}
                              </div>
                              <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" [class]="user.suspended ? 'bg-orange-500' : 'bg-emerald-500'"></div>
                            </div>
                            <div>
                              <p class="text-sm font-black text-[#2B3970]">@{{ user.username }}</p>
                              <span class="text-xs font-bold text-slate-400">{{ user.email }}</span>
                            </div>
                         </div>
                      </td>
                      <!-- Time Info Mock -->
                      <td class="py-6 px-8">
                        <p class="text-xs font-bold text-[#2B3970]">Aujourd'hui</p>
                        <p class="text-[10px] font-bold text-slate-400 mt-0.5">Dernière Connexion</p>
                      </td>
                      <!-- Permissions -->
                      <td class="py-6 px-8">
                        <div class="flex flex-wrap gap-2">
                           <span *ngFor="let role of user.roles" 
                                 [class]="role.name === 'ROLE_ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 ring-4 ring-indigo-50' : 'bg-slate-50 text-slate-500 border-slate-100'"
                                 class="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border">
                             {{ role.name.replace('ROLE_', '') }}
                           </span>
                        </div>
                      </td>
                      <!-- Status -->
                      <td class="py-6 px-8">
                        <span *ngIf="!user.suspended" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Actif
                        </span>
                        <span *ngIf="user.suspended" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-500 text-[9px] font-black uppercase tracking-widest border border-orange-100">
                          <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Suspendu
                        </span>
                      </td>
                      <!-- Management Menu -->
                      <td class="py-6 px-8 text-center">
                        <div *ngIf="user.username !== 'admin'" class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <!-- Quick Actions -->
                           <button (click)="suspendUser(user.id)" class="w-9 h-9 rounded-xl border border-orange-100 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center" title="Suspendre">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                           </button>
                           <button (click)="deleteUser(user.id)" class="w-9 h-9 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="Bannir Définitivement">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                           </button>
                        </div>
                        <span *ngIf="user.username === 'admin'" class="text-[9px] font-black uppercase tracking-widest text-slate-300 border border-slate-200 px-3 py-1.5 rounded-xl">Intouchable</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB SITES -->
          <div *ngIf="!loading && activeTab === 'sites'" class="tab-enter">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 stagger-in">
              <div *ngFor="let site of sites" class="card-lift bg-white rounded-[50px] border border-slate-100 overflow-hidden flex flex-col group hover:border-[#FF6B2C]/30">
                 <div class="h-60 bg-[#F8FAFC] p-10 relative flex items-center justify-center border-b border-slate-50 overflow-hidden">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] opacity-50"></div>
                    
                    <div class="absolute top-6 left-8 flex gap-2">
                      <div class="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div class="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div class="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                    
                    <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-32 h-32 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" alt="Logo">
                    <span *ngIf="!site.logoUrl" class="text-7xl font-black text-slate-100 relative z-10 italic drop-shadow-sm">{{ site.companyName.charAt(0) }}</span>
                    
                    <div class="absolute bottom-6 right-8">
                       <span class="px-5 py-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border bg-white shadow-sm" [class]="site.published ? 'text-emerald-500 border-emerald-100' : 'text-orange-500 border-orange-100'">
                         <span class="w-2 h-2 rounded-full" [class]="site.published ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'"></span>
                         {{ site.published ? 'Publié' : 'Brouillon' }}
                       </span>
                    </div>
                 </div>
                 
                 <div class="p-10 flex-grow flex flex-col justify-between">
                    <div>
                      <div class="flex justify-between items-start mb-4">
                         <h3 class="text-2xl font-black text-[#2B3970] leading-tight truncate pr-4">{{ site.companyName }}</h3>
                         <span class="bg-[#FF6B2C]/10 text-[#FF6B2C] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-[#FF6B2C]/20">{{ site.category }}</span>
                      </div>
                      <p class="text-[11px] text-slate-400 font-black uppercase tracking-widest">{{ site.subdomain }}.vitrineclick.com</p>
                    </div>
                    
                    <div class="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                        <div class="flex gap-4">
                           <button (click)="toggleSitePublish(site.id)" [class]="site.published ? 'bg-orange-50 text-[#FF6B2C] border-orange-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'" class="px-5 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all">
                              {{ site.published ? 'Draft' : 'Publish' }}
                           </button>
                           <button (click)="deleteSite(site.id)" class="px-5 py-2 rounded-xl border border-red-100 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                              Delete
                           </button>
                        </div>
                        <button (click)="openSite(site.subdomain)" class="w-12 h-12 rounded-2xl bg-slate-50 text-[#2B3970] hover:bg-[#2B3970] hover:text-white transition-all flex items-center justify-center transform group-hover:rotate-12">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </button>
                     </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- TAB SETTINGS -->
          <div *ngIf="!loading && activeTab === 'settings'" class="tab-enter">
            <div class="bg-white border border-slate-100 rounded-[40px] p-10 md:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.03)] stagger-in">
              <h3 class="text-3xl font-black text-[#2B3970] mb-8">Configuration Globale de la Plateforme</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <!-- Security Core -->
                 <div class="space-y-8">
                    <div class="pb-6 border-b border-slate-100">
                      <div class="flex items-center gap-3 mb-2">
                        <svg class="w-6 h-6 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        <h4 class="text-lg font-black text-[#111827]">Clé d'API Gateway IAM</h4>
                      </div>
                      <p class="text-xs font-bold text-slate-400 mb-4">La clé principale permettant aux microservices de s'authentifier à la Gateway Centrale.</p>
                      <div class="flex">
                        <input type="password" [value]="systemConfig.apiKey" disabled class="flex-1 bg-slate-50 border border-slate-200 rounded-l-2xl px-5 py-4 text-[#2B3970] font-black tracking-widest select-none">
                        <button class="bg-[#2B3970] text-white px-6 rounded-r-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-colors">Générer Clé</button>
                      </div>
                    </div>

                    <div class="pb-6 border-b border-slate-100">
                       <h4 class="text-lg font-black text-[#111827] mb-4">Stockage Central</h4>
                       <div class="h-6 bg-slate-50 rounded-full border border-slate-200 p-1 overflow-hidden relative">
                         <div class="h-full bg-[#2B3970] rounded-full w-[45%]"></div>
                         <span class="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase text-white mix-blend-difference">225 GB / {{ systemConfig.storageLimitGB }} GB Utilisés</span>
                       </div>
                    </div>
                 </div>

                 <!-- System Flags -->
                 <div class="space-y-6">
                    <!-- Maintenance Mode -->
                    <div class="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-[#FF6B2C]/30 transition-colors cursor-pointer" (click)="systemConfig.maintenanceMode = !systemConfig.maintenanceMode">
                       <div>
                         <h5 class="font-black text-[#2B3970]">Mode Maintenance</h5>
                         <p class="text-xs font-bold text-slate-400 mt-1">Suspend temporairement l'accès aux clients externes.</p>
                       </div>
                       <!-- Toggle Mock -->
                       <div class="w-14 h-8 rounded-full transition-colors flex items-center px-1" [class]="systemConfig.maintenanceMode ? 'bg-[#FF6B2C]' : 'bg-slate-300'">
                         <div class="w-6 h-6 rounded-full bg-white shadow-sm transition-transform" [class]="systemConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-0'"></div>
                       </div>
                    </div>

                    <!-- Open Registration -->
                    <div class="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-500/30 transition-colors cursor-pointer" (click)="systemConfig.registrationEnabled = !systemConfig.registrationEnabled">
                       <div>
                         <h5 class="font-black text-[#2B3970]">Inscriptions Ouvertes</h5>
                         <p class="text-xs font-bold text-slate-400 mt-1">Autoriser de nouveaux architectes à rejoindre le Hub.</p>
                       </div>
                       <div class="w-14 h-8 rounded-full transition-colors flex items-center px-1" [class]="systemConfig.registrationEnabled ? 'bg-emerald-500' : 'bg-slate-300'">
                         <div class="w-6 h-6 rounded-full bg-white shadow-sm transition-transform" [class]="systemConfig.registrationEnabled ? 'translate-x-6' : 'translate-x-0'"></div>
                       </div>
                    </div>
                    
                    <button class="w-full mt-4 py-5 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-[#2B3970] hover:bg-slate-50 transition-colors hover:border-[#2B3970]">Sauvegarder la Configuration</button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- ======================== MOBILE BOTTOM NAV ======================== -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <button (click)="setTab('overview')" class="flex flex-col items-center justify-center p-2 min-w-[64px] transition-all" [class]="activeTab === 'overview' ? 'text-[#10b981]' : 'text-slate-400 hover:text-slate-600'">
        <svg class="w-6 h-6 mb-1" [class]="activeTab === 'overview' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        <span class="text-[9px] font-black uppercase tracking-wider">Dashboard</span>
      </button>
      <button (click)="setTab('users')" class="flex flex-col items-center justify-center p-2 min-w-[64px] transition-all" [class]="activeTab === 'users' ? 'text-[#10b981]' : 'text-slate-400 hover:text-slate-600'">
        <svg class="w-6 h-6 mb-1" [class]="activeTab === 'users' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span class="text-[9px] font-black uppercase tracking-wider">Clients</span>
      </button>
      <button (click)="setTab('sites')" class="flex flex-col items-center justify-center p-2 min-w-[50px] transition-all" [class]="activeTab === 'sites' ? 'text-[#10b981]' : 'text-slate-400 hover:text-slate-600'">
        <svg class="w-6 h-6 mb-1" [class]="activeTab === 'sites' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
        <span class="text-[9px] font-black uppercase tracking-wider">Sites</span>
      </button>
      <button (click)="setTab('settings')" class="flex flex-col items-center justify-center p-2 min-w-[50px] transition-all" [class]="activeTab === 'settings' ? 'text-[#10b981]' : 'text-slate-400 hover:text-slate-600'">
        <svg class="w-6 h-6 mb-1" [class]="activeTab === 'settings' ? 'scale-110 drop-shadow-md' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
        <span class="text-[9px] font-black uppercase tracking-wider">Config</span>
      </button>
      <button (click)="logout()" class="flex flex-col items-center justify-center p-2 min-w-[50px] transition-all text-slate-400 hover:text-red-500 hover:scale-105">
        <svg class="w-5 h-5 mb-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        <span class="text-[9px] font-black uppercase tracking-wider opacity-60">Sortir</span>
      </button>
    </nav>

  <!-- ====== TOAST NOTIFICATIONS ====== -->
  <div class="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 items-end">
    <div *ngFor="let toast of toasts" [class]="'toast-enter flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm max-w-sm ' + (toast.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : toast.type === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#2B3970] text-white shadow-[#2B3970]/20')">
      <svg *ngIf="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      <svg *ngIf="toast.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      <span>{{toast.message}}</span>
    </div>
  </div>
  `
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  activeTab: 'overview' | 'users' | 'sites' | 'settings' = 'overview';
  
  stats: any = null;
  users: any[] = [];
  sites: any[] = [];
  loading = true;
  error = '';
  toasts: { message: string; type: 'success' | 'error' | 'info' }[] = [];

  // Theme Config logic
  systemConfig = {
    maintenanceMode: false,
    apiKey: 'sk_live_vc2026_xxxxxx',
    registrationEnabled: true,
    storageLimitGB: 500
  };

  constructor(private http: HttpClient, private authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadAllData();
    this.notificationService.connect();
    this.notificationService.getNotifications().subscribe(() => {
      this.loadAllData();
    });
  }

  ngOnDestroy() {
    this.notificationService.disconnect();
  }

  setTab(tab: 'overview' | 'users' | 'sites' | 'settings') {
    this.activeTab = tab;
  }

  loadAllData() {
    this.loading = true;
    this.error = '';
    
    const headers = { 'Authorization': 'Bearer ' + this.authService.getToken() };
    
    // Using single requests without RxJS forkJoin to easily handle individual errors if backend isn't ready
    this.http.get('http://localhost:8080/api/admin/stats', { headers }).subscribe({
      next: (res) => this.stats = res,
      error: () => this.error = "Erreur de connexion API Admin."
    });

    this.http.get<any[]>('http://localhost:8080/api/admin/users', { headers }).subscribe({
      next: (res) => this.users = res,
      error: () => null
    });

    this.http.get<any[]>('http://localhost:8080/api/admin/sites', { headers }).subscribe({
      next: (res) => {
        this.sites = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  suspendUser(userId: number) {
    if (confirm('Suspendre l\'accès de cet utilisateur sans détruire ses données ?')) {
      this.showToast('Compte utilisateur suspendu avec succès.', 'success');
      // Simulated frontend suspension
      const u = this.users.find(x => x.id === userId);
      if(u) u.suspended = !u.suspended;
    }
  }

  deleteUser(userId: number) {
    if (confirm('Supprimer définitivement cet utilisateur ? (Action irréversible)')) {
      const headers = { 'Authorization': 'Bearer ' + this.authService.getToken() };
      this.http.delete(`http://localhost:8080/api/admin/users/${userId}`, { headers }).subscribe({
        next: () => { this.loadAllData(); this.showToast('Utilisateur supprimé.', 'success'); },
        error: () => this.showToast('Erreur lors de la suppression.', 'error')
      });
    }
  }

  deleteSite(siteId: number) {
    if (confirm('Supprimer ce site ?')) {
      const headers = { 'Authorization': 'Bearer ' + this.authService.getToken() };
      this.http.delete(`http://localhost:8080/api/admin/sites/${siteId}`, { headers }).subscribe({
        next: () => { this.loadAllData(); this.showToast('Site supprimé.', 'success'); },
        error: () => this.showToast('Erreur lors de la suppression.', 'error')
      });
    }
  }

  toggleSitePublish(siteId: number) {
    const headers = { 'Authorization': 'Bearer ' + this.authService.getToken() };
    this.http.put(`http://localhost:8080/api/admin/sites/${siteId}/toggle-publish`, {}, { headers }).subscribe({
      next: () => { this.loadAllData(); this.showToast('Statut du site mis à jour.', 'success'); },
      error: () => this.showToast('Erreur lors de la mise à jour.', 'error')
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => this.toasts = this.toasts.filter(t => t !== toast), 3500);
  }

  openSite(subdomain: string) {
    window.open('http://' + subdomain + '.vitrineclick.com', '_blank');
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}
