import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-site-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="w-12 h-12 border-4 border-[#FF6B2C] border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div *ngIf="error" class="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div class="text-center bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full">
        <h2 class="text-2xl font-black text-slate-800 mb-4">404 - Introuvable</h2>
        <p class="text-slate-500 mb-8">{{error}}</p>
        <a routerLink="/" class="px-6 py-3 bg-[#2B3970] text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Retour à l'accueil</a>
      </div>
    </div>

    <!-- MAIN SITE TEMPLATE -->
    <div *ngIf="site && !loading" [ngStyle]="containerStyle" class="min-h-screen transition-all duration-700 bg-[var(--section-bg)] text-slate-900 selection:bg-[var(--accent-color)] selection:text-white">
      
      <!-- Premium Multi-Page Navigation -->
      <nav class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500" 
           [class.bg-[var(--nav-bg)]]="scrolled" [class.backdrop-blur-xl]="scrolled" [class.py-4]="scrolled" [class.py-8]="!scrolled"
           [class.shadow-[0_20px_50px_rgba(0,0,0,0.05)]]="scrolled">
        <div class="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div class="flex items-center gap-2 group cursor-pointer" (click)="navigateTo('home')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">
              {{site?.companyName?.charAt(0) || 'V'}}
            </div>
            <span class="text-2xl font-black text-slate-900 tracking-tighter">{{site?.companyName || 'VitrineClick'}}</span>
          </div>
          
          <div class="hidden md:flex items-center gap-10">
            <a (click)="navigateTo('home')" class="text-sm font-bold uppercase tracking-widest cursor-pointer transition-all border-b-2" [class.text-[var(--accent-color)]]="currentPage==='home'" [class.border-[var(--accent-color)]]="currentPage==='home'" [class.border-transparent]="currentPage!=='home'">Accueil</a>
            <a (click)="navigateTo('about')" class="text-sm font-bold uppercase tracking-widest cursor-pointer transition-all border-b-2" [class.text-[var(--accent-color)]]="currentPage==='about'" [class.border-[var(--accent-color)]]="currentPage==='about'" [class.border-transparent]="currentPage!=='about'">À Propos</a>
            <a (click)="navigateTo('contact')" class="text-sm font-bold uppercase tracking-widest cursor-pointer transition-all border-b-2" [class.text-[var(--accent-color)]]="currentPage==='contact'" [class.border-[var(--accent-color)]]="currentPage==='contact'" [class.border-transparent]="currentPage!=='contact'">Contact</a>
          </div>

          <div class="flex items-center gap-4">
             <button (click)="cartOpen = !cartOpen" class="relative p-2 text-slate-800 hover:text-[var(--accent-color)] transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span *ngIf="cart.length > 0" class="absolute -top-1 -right-1 bg-[var(--accent-color)] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                   {{cart.length}}
                </span>
             </button>
             <button (click)="customizerOpen = true" class="p-2 text-slate-800 hover:rotate-90 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
             </button>
             <a class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">Rejoindre</a>
          </div>
        </div>
      </nav>

      <!-- PAGE CONTENT WRAPPER -->
      <div *ngIf="currentPage === 'home'">
        <!-- Hero Section -->
        <header class="relative pt-40 pb-32 overflow-hidden px-6">
          <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div class="flex-1 text-center md:text-left animate-slide-up" [class.md:text-center]="aiContent?.layout?.heroType === 'centered'" [class.md:max-w-4xl]="aiContent?.layout?.heroType === 'centered'" [class.mx-auto]="aiContent?.layout?.heroType === 'centered'">
              <span class="inline-block px-4 py-2 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-black uppercase tracking-widest mb-6">Expert en {{site?.category}}</span>
              <h1 class="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 italic">
                {{aiContent?.heroText}}
              </h1>
              <p class="text-xl md:text-2xl text-slate-500 font-medium mb-12 max-w-2xl" [class.mx-auto]="aiContent?.layout?.heroType === 'centered'">
                {{aiContent?.heroSubtext}}
              </p>
              <div class="flex flex-wrap items-center gap-4" [class.justify-center]="aiContent?.layout?.heroType === 'centered'">
                <button (click)="navigateTo('contact')" class="bg-[var(--accent-color)] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1">Démarrer</button>
                <button (click)="navigateTo('about')" class="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">En savoir plus</button>
              </div>
            </div>
            <div *ngIf="aiContent?.layout?.heroType !== 'centered'" class="flex-1 w-full relative group animate-fade-in shadow-2xl rounded-[3rem] overflow-hidden rotate-2 translate-x-10">
              <img [src]="aiContent?.products?.[0]?.image" class="w-full aspect-[4/5] object-cover transition-transform duration-[2s] group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              <div class="absolute bottom-10 left-10 text-white">
                 <p class="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Signature Series</p>
                 <h2 class="text-4xl font-black italic">{{aiContent?.products?.[0]?.name}}</h2>
              </div>
            </div>
          </div>
        </header>

        <!-- Product/Store Section -->
        <section class="py-32 px-6">
          <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div class="max-w-2xl">
                <span class="text-[var(--accent-color)] font-black text-sm uppercase tracking-widest mb-4 inline-block">Boutique Exclusive</span>
                <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">L'Art de l'Excellence</h2>
              </div>
              <p class="text-slate-500 font-bold max-w-xs text-right border-r-4 border-slate-100 pr-6">Designé avec soin pour refléter l'identité unique de {{site?.companyName}} sur le marché mondial.</p>
            </div>

            <!-- Bento Grid Layout -->
            <div *ngIf="aiContent?.layout?.featureLayout === 'bento'" class="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 min-h-[700px]">
               <div class="md:col-span-2 md:row-span-2 bg-slate-100 p-12 relative overflow-hidden group shadow-xl" [style.border-radius]="'var(--border-radius)'">
                  <img [src]="aiContent.products?.[0]?.image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div class="relative h-full flex flex-col justify-end text-white">
                     <h3 class="text-5xl font-black mb-4 leading-none uppercase italic">{{aiContent.products?.[0]?.name}}</h3>
                     <p class="text-white/70 max-w-xs mb-8 text-sm font-medium leading-relaxed">{{aiContent.products?.[0]?.desc}}</p>
                     <div class="flex items-center gap-6">
                        <span class="text-4xl font-black text-[var(--accent-color)]">{{aiContent.products?.[0]?.price}}</span>
                        <button (click)="addToCart(aiContent.products[0])" class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-slate-900 transition-all">Acheter</button>
                     </div>
                  </div>
               </div>
               <div *ngFor="let p of aiContent.products?.slice(1, 4)" class="md:col-span-1 bg-white border border-slate-100 p-8 flex flex-col items-center text-center group transition-all" [style.border-radius]="'var(--border-radius)'">
                  <div class="w-full aspect-square overflow-hidden mb-8 shadow-sm group-hover:-translate-y-2 transition-transform" [style.border-radius]="'calc(var(--border-radius) / 2)'">
                     <img [src]="p.image" class="w-full h-full object-cover">
                  </div>
                  <h4 class="font-black text-slate-800 text-xl mb-2 tracking-tight uppercase italic">{{p.name}}</h4>
                  <div class="flex items-center gap-4 mt-auto">
                     <span class="font-black" [style.color]="'var(--accent-color)'">{{p.price}}</span>
                     <button (click)="addToCart(p)" class="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">+ </button>
                  </div>
               </div>
            </div>
            
            <!-- Standard Grid -->
            <div *ngIf="aiContent?.layout?.featureLayout !== 'bento'" class="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div *ngFor="let p of aiContent.products" class="group bg-white p-4" [style.border-radius]="'var(--border-radius)'">
                  <div class="aspect-[3/4] overflow-hidden mb-6 relative" [style.border-radius]="'calc(var(--border-radius) / 2)'">
                     <img [src]="p.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
                     <button (click)="addToCart(p)" class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                     </button>
                  </div>
                  <h3 class="text-2xl font-black mb-1 italic tracking-tighter uppercase">{{p.name}}</h3>
                  <p class="text-slate-400 text-sm font-medium mb-4 line-clamp-2">{{p.desc}}</p>
                  <span class="text-xl font-black" [style.color]="'var(--accent-color)'">{{p.price}}</span>
               </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ABOUT PAGE CONTENT -->
      <div *ngIf="currentPage === 'about'" class="pt-40 pb-32 px-6 animate-fade-in">
         <div class="max-w-4xl mx-auto">
            <span class="text-[var(--accent-color)] font-black uppercase tracking-widest text-sm mb-6 inline-block">Notre Histoire</span>
            <h1 class="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter italic mb-12 uppercase leading-none">
               Au-delà du <span class="text-transparent border-slate-900" style="-webkit-text-stroke: 2px #0f172a">possible</span>
            </h1>
            <div class="prose prose-2xl text-slate-600 font-medium leading-relaxed mb-20 whitespace-pre-line">
               {{aiContent?.story}}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20 py-20 border-t border-slate-100">
               <div>
                  <h2 class="text-4xl font-black mb-6 uppercase italic">Mission</h2>
                  <p class="text-lg text-slate-500 font-medium leading-relaxed">{{aiContent?.mission}}</p>
               </div>
               <div class="bg-[var(--accent-color)]/5 p-12" [style.border-radius]="'var(--border-radius)'">
                  <h2 class="text-2xl font-black mb-4 uppercase text-[var(--accent-color)]">Culture Pro</h2>
                  <p class="text-slate-600 italic">"Nous croyons que chaque détail compte. C'est pourquoi nous repoussons sans cesse les limites du design et de la technologie pour {{site?.companyName}}."</p>
               </div>
            </div>
         </div>
      </div>

      <!-- CONTACT PAGE CONTENT -->
      <div *ngIf="currentPage === 'contact'" class="pt-40 pb-32 px-6 animate-fade-in">
         <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32">
            <div>
               <h1 class="text-7xl font-black text-slate-900 tracking-tighter italic mb-8 uppercase leading-none">Collaborons</h1>
               <p class="text-2xl text-slate-500 font-medium mb-12">{{aiContent?.message}}</p>
               
               <div class="space-y-12">
                  <div class="flex items-start gap-6">
                     <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--accent-color)] shadow-sm">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                     </div>
                     <div>
                        <h4 class="font-black text-xl uppercase tracking-tighter mb-2">Bureau Global</h4>
                        <p class="text-slate-500 font-medium">{{aiContent?.address}}</p>
                     </div>
                  </div>
                  <div class="flex items-start gap-6">
                     <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--accent-color)] shadow-sm">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     </div>
                     <div>
                        <h4 class="font-black text-xl uppercase tracking-tighter mb-2">Horaires</h4>
                        <p class="text-slate-500 font-medium">{{aiContent?.hours}}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="bg-white p-12 shadow-2xl" [style.border-radius]="'var(--border-radius)'">
               <h3 class="text-3xl font-black mb-10 uppercase italic">Envoyer un message</h3>
               <form class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                     <input type="text" placeholder="Nom" class="w-full bg-slate-50 border-none p-5 rounded-xl font-bold focus:ring-2 ring-[var(--accent-color)]">
                     <input type="email" placeholder="Email" class="w-full bg-slate-50 border-none p-5 rounded-xl font-bold focus:ring-2 ring-[var(--accent-color)]">
                  </div>
                  <textarea rows="5" placeholder="Votre projet..." class="w-full bg-slate-50 border-none p-5 rounded-xl font-bold focus:ring-2 ring-[var(--accent-color)]"></textarea>
                  <button type="button" class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg transition-all hover:bg-slate-800">Envoyer l'inflexion</button>
               </form>
            </div>
         </div>
      </div>

      <!-- Shopping Cart Sidebar -->
      <div *ngIf="cartOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[200] flex justify-end">
         <div class="w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col">
            <div class="flex items-center justify-between mb-12">
               <h2 class="text-4xl font-black italic uppercase tracking-tighter">Votre Panier</h2>
               <button (click)="cartOpen = false" class="text-slate-400 hover:text-slate-900 transition-colors">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>
            
            <div class="flex-1 overflow-y-auto space-y-8 pr-4">
               <div *ngIf="cart.length === 0" class="text-center py-20 text-slate-300">
                  <p class="font-bold uppercase tracking-widest">Vide</p>
               </div>
               <div *ngFor="let item of cart; let idx = index" class="flex items-center gap-6 group">
                  <div class="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                     <img [src]="item.image" class="w-full h-full object-cover">
                  </div>
                  <div class="flex-1">
                     <h4 class="font-black italic uppercase tracking-tighter text-lg">{{item.name}}</h4>
                     <p class="text-[var(--accent-color)] font-black text-xl">{{item.price}}</p>
                  </div>
                  <button (click)="cart.splice(idx, 1)" class="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">Supprimer</button>
               </div>
            </div>
            
            <div class="mt-12 pt-12 border-t-4 border-slate-50">
               <div class="flex items-center justify-between mb-8">
                  <span class="text-slate-400 font-bold uppercase tracking-widest">Sous-total</span>
                  <span class="text-4xl font-black italic" [style.color]="'var(--accent-color)'">{{cartTotal}}€</span>
               </div>
               <button class="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Commander</button>
            </div>
         </div>
      </div>

      <!-- Live Customizer Sidebar -->
      <div *ngIf="customizerOpen" class="fixed left-0 top-0 bottom-0 w-80 bg-white/10 backdrop-blur-2xl z-[150] shadow-2xl p-8 flex flex-col border-r border-white/20">
         <div class="flex items-center justify-between mb-12 text-slate-900">
            <h3 class="text-xl font-black italic tracking-widest uppercase">Customizer</h3>
            <button (click)="customizerOpen = false" class="text-slate-400">X</button>
         </div>
         <div class="space-y-12">
            <div>
               <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Couleur Accent</label>
               <div class="grid grid-cols-5 gap-3">
                  <div *ngFor="let c of ['#FF6B2C', '#2B3970', '#E11D48', '#10B981', '#F59E0B']" 
                       (click)="updatePrimaryColor(c)" 
                       [style.background-color]="c" 
                       class="aspect-square rounded-full cursor-pointer hover:scale-125 transition-transform shadow-md"
                       [class.ring-4]="site.primaryColor === c"
                       [class.ring-slate-100]="site.primaryColor === c"></div>
               </div>
            </div>
            <div>
               <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Structure Hero</label>
               <button (click)="aiContent.layout.heroType = 'centered'" class="w-full py-4 px-6 mb-4 rounded-2xl bg-slate-50 font-bold hover:bg-slate-100 transition-colors text-slate-900" [class.ring-2]="aiContent.layout.heroType === 'centered'">Centré</button>
               <button (click)="aiContent.layout.heroType = 'split'" class="w-full py-4 px-6 rounded-2xl bg-slate-50 font-bold hover:bg-slate-100 transition-colors text-slate-900" [class.ring-2]="aiContent.layout.heroType === 'split'">Split</button>
            </div>
         </div>
      </div>

      <!-- Detailed Footer -->
      <footer class="py-32 bg-slate-900 border-t border-white/5 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-20 relative z-10">
          <div class="col-span-2">
            <h3 class="text-white text-3xl font-black mb-6 tracking-tight">{{site.companyName}}</h3>
            <p class="text-slate-500 max-w-sm leading-relaxed mb-8 font-medium">L'élégance et la performance au service de votre identité digitale. Une expérience conçue par l'intelligence Identify Gen™.</p>
          </div>
          <div>
            <h4 class="text-white font-black mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <ul class="space-y-4 text-slate-500 font-bold text-sm">
              <li><a (click)="navigateTo('home')" class="hover:text-white transition-colors cursor-pointer">Accueil</a></li>
              <li><a (click)="navigateTo('about')" class="hover:text-white transition-colors cursor-pointer">À Propos</a></li>
              <li><a (click)="navigateTo('contact')" class="hover:text-white transition-colors cursor-pointer">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
           <p>&copy; {{currentYear}} {{site.companyName}}. Réalisation d'Excellence.</p>
           <p class="mt-4 md:mt-0">Propulsé par <span class="text-white">VitrineClick Studio &trade;</span></p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    .animate-fade-in { animation: fade-in 1s ease-out forwards; }
    .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
  `]
})
export class SiteViewerComponent implements OnInit {
  subdomain: string = '';
  site: any = null;
  fullAiContent: any = null;
  aiContent: any = null; // Current active page content
  templateConfig: any = null;
  loading: boolean = true;
  error: string = '';
  scrolled: boolean = false;
  currentYear = new Date().getFullYear();
  
  // Multi-Page & Cart State
  currentPage: string = 'home';
  cart: any[] = [];
  cartOpen: boolean = false;
  customizerOpen: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta
  ) {}

  get containerStyle() {
    if (!this.templateConfig) return {
      '--accent-color': this.site?.primaryColor || '#FF6B2C',
      '--accent-text': '#ffffff',
      '--nav-bg': 'rgba(255,255,255,0.8)',
      '--hero-bg': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      '--hero-text': '#0f172a',
      '--hero-text-light': 'rgba(15,23,42,0.7)',
      '--section-bg': '#f8fafc',
      '--card-bg': '#ffffff',
      '--footer-bg': '#0f172a'
    };
    
    return {
      '--accent-color': this.site?.primaryColor || this.templateConfig.accent || '#FF6B2C',
      '--accent-text': this.templateConfig.accentText || '#fff',
      '--nav-bg': (this.templateConfig.navBg || '#ffffff') + 'CC',
      '--hero-bg': this.templateConfig.heroBg || 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      '--hero-text': this.templateConfig.heroText || '#0f172a',
      '--hero-text-light': this.templateConfig.heroTextLight || 'rgba(15,23,42,0.7)',
      '--section-bg': this.templateConfig.sectionBg?.[0] === '#' ? this.templateConfig.sectionBg : '#f8fafc',
      '--card-bg': this.templateConfig.cardBg?.[0] === '#' ? this.templateConfig.cardBg : '#ffffff',
      '--footer-bg': this.templateConfig.footerBg || '#0f172a',
      '--glass-opacity': this.aiContent?.layout?.style === 'premium' ? '0.7' : '0.4',
      '--border-radius': this.aiContent?.layout?.style === 'clean' ? '1rem' : '2.5rem'
    };
  }

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.scrolled = window.scrollY > 20;
    });

    this.route.paramMap.subscribe(params => {
      this.subdomain = params.get('subdomain') || '';
      if(this.subdomain) {
        this.loadSite();
      } else {
        this.error = "Aucun sous-domaine spécifié.";
        this.loading = false;
      }
    });
  }

  loadSite() {
    this.loading = true;
    this.http.get(`http://localhost:8080/api/public/sites/subdomain/${this.subdomain}`).subscribe({
      next: (data: any) => {
        this.site = data;
        
        // Apply SEO Metadata
        const title = this.site.metaTitle || (this.site.companyName + " | Officiel");
        this.titleService.setTitle(title);
        if (this.site.metaDescription) {
          this.metaService.updateTag({ name: 'description', content: this.site.metaDescription });
        }
        
        // Parse Theme Settings (Primary/Secondary Colors, etc)
        if (this.site.themeSettings) {
          try {
            const theme = JSON.parse(this.site.themeSettings);
            if (theme.primary) this.site.primaryColor = theme.primary;
          } catch(e) {}
        }
        
        // Parse generated visuals (which contains our AI content)
        if (this.site.generatedVisuals) {
          try {
            this.fullAiContent = JSON.parse(this.site.generatedVisuals);
            this.syncPageContent();
          } catch(e) {
            console.error("Could not parse AI content", e);
          }
        }
        
        if (this.site.templateConfig) {
          try {
             this.templateConfig = JSON.parse(this.site.templateConfig);
          } catch(e) {}
        }
        
        // Track visit asynchronously
        this.http.post(`http://localhost:8080/api/sites/${this.site.id}/visit`, {retention: 0}).subscribe();
        
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400 && err.error?.message?.includes('published')) {
           this.error = "Ce site n'est pas encore rendu public par son créateur.";
        } else {
           this.error = "Site introuvable ou sous-domaine invalide.";
        }
      }
    });
  }

  syncPageContent() {
    if (!this.fullAiContent?.pages) {
      this.aiContent = this.fullAiContent; // Fallback to flat structure
      return;
    }
    
    // Merge global context with page-specific ones
    const pageData = this.fullAiContent.pages[this.currentPage] || this.fullAiContent.pages['home'];
    this.aiContent = {
      ...this.fullAiContent,
      ...pageData,
      layout: this.fullAiContent.layout,
      theme: this.fullAiContent.theme
    };
    
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.syncPageContent();
  }

  addToCart(product: any) {
    this.cart.push(product);
    this.cartOpen = true;
    setTimeout(() => this.cartOpen = false, 3000); // Visual cue
  }

  get cartTotal() {
    return this.cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
      return total + price;
    }, 0);
  }

  updatePrimaryColor(color: string) {
    this.site.primaryColor = color;
  }
}
