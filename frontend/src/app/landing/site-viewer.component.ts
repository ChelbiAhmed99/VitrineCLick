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

    <!-- MAIN SITE TEMPLATE -->    <div *ngIf="site && !loading" class="min-h-screen font-sans antialiased text-slate-900 overflow-x-hidden" [ngStyle]="containerStyle">
      
      <!-- Premium Overlay Gradients -->
      <div class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-color)] opacity-[0.03] blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--hero-text)] opacity-[0.02] blur-[120px]"></div>
      </div>

      <!-- Navbar -->
      <nav class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b" 
           [style.background]="scrolled ? 'rgba(255,255,255,0.85)' : 'transparent'"
           [style.backdrop-blur]="scrolled ? '20px' : '0'"
           [style.border-color]="scrolled ? 'rgba(0,0,0,0.05)' : 'transparent'">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-4 group cursor-pointer">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 overflow-hidden" [style.background-color]="'var(--accent-color)'">
              <img *ngIf="site.logoUrl" [src]="site.logoUrl" class="w-full h-full object-cover p-1">
              <span *ngIf="!site.logoUrl" class="text-white font-black text-xl">{{site.companyName.charAt(0)}}</span>
            </div>
            <span class="text-xl font-black tracking-tighter text-slate-800">{{site.companyName}}</span>
          </div>
          <div class="hidden md:flex items-center gap-10 font-bold text-[13px] uppercase tracking-widest text-slate-500">
            <a href="#services" class="hover:text-slate-900 transition-colors">Services</a>
            <a href="#products" *ngIf="aiContent?.products" class="hover:text-slate-900 transition-colors">Catalogue</a>
            <a href="#about" class="hover:text-slate-900 transition-colors">Vision</a>
            <a href="#contact" class="px-6 py-3 rounded-xl shadow-xl hover:-translate-y-1 transition-all active:scale-95" 
               [style.background-color]="'var(--accent-color)'" [style.color]="'var(--accent-text)'">Contact</a>
          </div>
        </div>
      </nav>

      <!-- HERO SECTION (Dynamic Layout) -->
      <section class="relative pt-48 pb-32 flex flex-col items-center px-6 overflow-hidden min-h-[70vh] justify-center">
        
        <!-- Standard Centered Hero -->
        <div *ngIf="aiContent?.layout?.heroType !== 'split'" class="max-w-4xl mx-auto z-10 text-center animate-fade-in">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-white/40 backdrop-blur-md mb-8 shadow-sm">
            <span class="w-2 h-2 rounded-full animate-pulse" [style.background-color]="'var(--accent-color)'"></span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{{site.category}} Haute Couture</span>
          </div>
          <h1 class="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-slate-900">
            {{aiContent?.heroText || site.companyName}}
          </h1>
          <p class="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            {{aiContent?.heroSubtext || site.description}}
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#products" class="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all" 
               [style.background-color]="'var(--accent-color)'" [style.color]="'var(--accent-text)'">
               Explorer la Collection
            </a>
            <a href="#services" class="px-10 py-5 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200 font-black text-sm uppercase tracking-widest hover:bg-white transition-all">
               Notre Expertise
            </a>
          </div>
        </div>

        <!-- Split Hero (Modern SaaS Style) -->
        <div *ngIf="aiContent?.layout?.heroType === 'split'" class="max-w-7xl mx-auto z-10 grid md:grid-cols-2 gap-20 items-center text-left animate-slide-up">
           <div class="space-y-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-[10px] font-black uppercase tracking-widest">
                 {{site.category}} Strategic Partner
              </div>
              <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none text-slate-900">
                 {{aiContent?.heroText}}
              </h1>
              <p class="text-xl text-slate-500 leading-relaxed font-medium">
                 {{aiContent?.heroSubtext}}
              </p>
              <div class="flex items-center gap-4">
                 <a href="#products" class="h-14 px-8 rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-xl" [style.background-color]="'var(--accent-color)'" [style.color]="'var(--accent-text)'">Démarrer</a>
                 <a href="#about" class="h-14 px-8 rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-widest border border-slate-200 bg-white">Vision Pro</a>
              </div>
           </div>
           <div class="relative">
              <div class="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                 <img [src]="aiContent.products?.[0]?.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover">
              </div>
              <div class="absolute -bottom-10 -left-10 p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl animate-bounce-slow">
                 <p class="text-4xl font-black text-[var(--accent-color)]">99%</p>
                 <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Satisfaction Client</p>
              </div>
           </div>
        </div>
        
        <!-- Decoration orbs -->
        <div class="absolute right-[-10%] top-[20%] w-[35%] h-[50%] rounded-full opacity-[0.04] blur-[120px]" [style.background-color]="'var(--accent-color)'"></div>
      </section>
      <!-- PRODUCTS SECTION (Grid vs Horizontal) -->
      <section *ngIf="aiContent?.products?.length" id="products" class="py-32 bg-white relative z-10">
        <div class="max-w-7xl mx-auto px-6">
          <div class="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
               <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-4">L'Art de l'Excellence</h2>
               <div class="w-20 h-2 rounded-full" [style.background-color]="'var(--accent-color)'"></div>
             </div>
             <p class="text-slate-400 font-medium max-w-md">Chaque détail est pensé pour refléter l'identité unique de {{site.companyName}} sur le marché mondial.</p>
          </div>

          <!-- Standard Grid -->
          <div *ngIf="aiContent?.layout?.featureLayout !== 'bento'" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div *ngFor="let prod of aiContent.products" class="group relative bg-slate-50 p-3 transition-all duration-500 hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-transparent hover:border-slate-100"
                 [style.border-radius]="'var(--border-radius)'">
              <div class="relative aspect-square overflow-hidden mb-6 shadow-sm" [style.border-radius]="'calc(var(--border-radius) / 2)'">
                <img [src]="prod.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <div class="absolute top-4 right-4 h-8 w-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg class="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                </div>
              </div>
              <div class="px-2">
                 <h3 class="text-lg font-black text-slate-800 mb-1">{{prod.name}}</h3>
                 <div class="flex items-center justify-between">
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-widest">Premium</span>
                    <span class="text-lg font-black" [style.color]="'var(--accent-color)'">{{prod.price}}</span>
                 </div>
              </div>
            </div>
          </div>

          <!-- Bento Grid Layout (Modern Trend) -->
          <div *ngIf="aiContent?.layout?.featureLayout === 'bento'" class="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 min-h-[600px]">
             <div class="md:col-span-2 md:row-span-2 bg-slate-100 p-10 relative overflow-hidden group shadow-xl" [style.border-radius]="'var(--border-radius)'">
                <img [src]="aiContent.products[0]?.image" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="relative h-full flex flex-col justify-end text-white">
                   <h3 class="text-4xl font-black mb-2 leading-none uppercase tracking-tighter">{{aiContent.products[0]?.name}}</h3>
                   <p class="text-white/70 max-w-xs mb-6 text-sm font-medium">{{aiContent.products[0]?.desc}}</p>
                   <span class="text-3xl font-black text-[var(--accent-color)]">{{aiContent.products[0]?.price}}</span>
                </div>
             </div>
             <div *ngFor="let p of aiContent.products.slice(1, 4)" class="md:col-span-1 bg-white border border-slate-100 p-8 flex flex-col items-center text-center group hover:border-[var(--accent-color)] transition-all shadow-sm" [style.border-radius]="'var(--border-radius)'">
                <div class="w-24 h-24 overflow-hidden mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform" [style.border-radius]="'calc(var(--border-radius) / 3)'">
                   <img [src]="p.image" class="w-full h-full object-cover">
                </div>
                <h4 class="font-black text-slate-800 mb-2 tracking-tight">{{p.name}}</h4>
                <p class="text-[10px] text-slate-400 mb-4 line-clamp-2 uppercase tracking-widest font-bold">{{p.desc}}</p>
                <span class="font-black text-xl" [style.color]="'var(--accent-color)'">{{p.price}}</span>
             </div>
          </div>
        </div>
      </section>>

      <!-- Benefits / Features Section -->
      <section *ngIf="aiContent?.features?.length" id="services" class="py-32 relative overflow-hidden" [style.background-color]="'var(--section-bg)'">
          <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 class="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-none">Pourquoi Nous <br> Choisir ?</h2>
              <div class="space-y-10">
                <div *ngFor="let feat of aiContent.features; let i = index" class="flex gap-6">
                  <div class="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl shadow-lg" 
                       [style.background-color]="'var(--accent-color)'" [style.color]="'var(--accent-text)'">
                    0{{i+1}}
                  </div>
                  <div>
                    <h4 class="text-xl font-black mb-2">{{feat.title}}</h4>
                    <p class="text-slate-500 leading-relaxed font-medium">{{feat.desc}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative">
               <div class="aspect-square bg-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                  <div class="absolute inset-0 bg-[var(--accent-color)] opacity-20 mix-blend-overlay"></div>
                  <div class="absolute bottom-10 left-10 p-10 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/40 max-w-sm">
                    <p class="text-2xl font-black italic">"{{aiContent?.testimonials?.[0]?.quote || 'Innover chaque jour.'}}"</p>
                    <p class="mt-4 text-xs font-black uppercase tracking-widest">— {{aiContent?.testimonials?.[0]?.name || site.companyName}}</p>
                  </div>
               </div>
            </div>
          </div>
      </section>

      <!-- About / Vision -->
      <section id="about" class="py-40 bg-slate-900 relative overflow-hidden">
        <div class="absolute top-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--accent-color)] opacity-[0.05] blur-[150px]"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 class="text-white text-5xl md:text-7xl font-black mb-12 tracking-tighter">Notre Vision</h2>
          <p class="text-slate-400 text-2xl leading-relaxed italic font-light">
             {{aiContent?.aboutText || site.description}}
          </p>
        </div>
      </section>

      <!-- Contact Area -->
      <section id="contact" class="py-32 bg-white flex flex-col items-center">
         <div class="max-w-4xl w-full px-6 text-center">
            <h2 class="text-4xl md:text-6xl font-black mb-16 tracking-tight">Commençons Votre Voyage</h2>
            <div class="flex flex-wrap justify-center gap-10 mb-20 text-lg font-bold">
               <div *ngIf="site.email" class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  {{site.email}}
               </div>
               <div *ngIf="site.phone" class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  {{site.phone}}
               </div>
            </div>
            <a *ngIf="site.email" [href]="'mailto:' + site.email" class="inline-block px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105" [style.background-color]="'var(--accent-color)'" [style.color]="'var(--accent-text)'">
               Nous Contacter Exclusivement
            </a>
         </div>
      </section>

      <!-- Detailed Footer -->
      <footer class="py-32 bg-slate-900 border-t border-white/5 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-20 relative z-10">
          <div class="col-span-2">
            <h3 class="text-white text-3xl font-black mb-6 tracking-tight">{{site.companyName}}</h3>
            <p class="text-slate-500 max-w-sm leading-relaxed mb-8 font-medium">L'élégance et la performance au service de votre identité digitale. Une expérience conçue par l'intelligence Identify Gen™.</p>
            <div class="flex gap-4">
               <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[var(--accent-color)] transition-colors cursor-pointer">
                  <svg class="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </div>
               <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[var(--accent-color)] transition-colors cursor-pointer">
                  <svg class="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
               </div>
            </div>
          </div>
          <div>
            <h4 class="text-white font-black mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <ul class="space-y-4 text-slate-500 font-bold text-sm">
              <li><a href="#services" class="hover:text-white transition-colors">Services</a></li>
              <li><a href="#products" class="hover:text-white transition-colors">Catalogue</a></li>
              <li><a href="#about" class="hover:text-white transition-colors">À Propos</a></li>
              <li><a href="#contact" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
             <h4 class="text-white font-black mb-6 uppercase tracking-widest text-xs">Légal</h4>
             <ul class="space-y-4 text-slate-500 font-bold text-sm">
                <li>Mentions Légales</li>
                <li>Confidentialité</li>
                <li>CGV / CGU</li>
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
  aiContent: any = null;
  templateConfig: any = null;
  loading: boolean = true;
  error: string = '';
  scrolled: boolean = false;
  currentYear = new Date().getFullYear();

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
            this.aiContent = JSON.parse(this.site.generatedVisuals);
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
}
