import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-site-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading" class="min-h-screen flex items-center justify-center" [style.background]="'#0f172a'">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-[#FF6B2C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p class="text-white/50 font-bold text-sm uppercase tracking-widest animate-pulse">Chargement de votre vitrine...</p>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="error && !loading" class="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div class="text-center bg-white p-14 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100">
        <div class="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="text-2xl font-black text-slate-800 mb-3">Site introuvable</h2>
        <p class="text-slate-500 mb-8 text-sm">{{error}}</p>
        <a routerLink="/" class="inline-block px-8 py-3 bg-[#2B3970] text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors">← Retour à l'accueil</a>
      </div>
    </div>

    <!-- Main Site -->
    <div *ngIf="site && !loading" class="site-root" [style]="siteVars">

      <!-- ===== NAVBAR ===== -->
      <nav class="site-nav" [class.scrolled]="scrolled">
        <div class="nav-inner">
          <a (click)="navigateTo('home')" class="brand">
            <div class="brand-logo" [style.background]="accentColor">
              <img *ngIf="site.logoUrl" [src]="site.logoUrl" alt="Logo" class="w-full h-full object-contain p-1.5">
              <span *ngIf="!site.logoUrl" class="text-white font-black text-xl">{{site.companyName?.charAt(0)}}</span>
            </div>
            <span class="brand-name">{{site.companyName}}</span>
          </a>

          <div class="nav-links">
            <a (click)="navigateTo('home')" [class.active]="currentPage==='home'" class="nav-link">Accueil</a>
            <a (click)="navigateTo('about')" [class.active]="currentPage==='about'" class="nav-link">À Propos</a>
            <a (click)="navigateTo('contact')" [class.active]="currentPage==='contact'" class="nav-link">Contact</a>
          </div>

          <div class="nav-actions">
            <button (click)="navigateTo('contact')" class="nav-cta">Nous contacter</button>
          </div>
        </div>
      </nav>

      <!-- ===== HOME PAGE ===== -->
      <div *ngIf="currentPage==='home'">

        <!-- Hero Section -->
        <section class="hero-section" [style.background]="templateConfig?.heroBg || 'linear-gradient(135deg, #1e2852 0%, #2B3970 100%)'">
          <div class="hero-blob hero-blob-1" [style.background]="accentColor + '33'"></div>
          <div class="hero-blob hero-blob-2" [style.background]="accentColor + '22'"></div>

          <div class="hero-inner">
            <!-- Text Content -->
            <div class="hero-text" [class.hero-centered]="layout?.heroType === 'centered'">
              <span class="hero-badge" [style.background]="accentColor + '18'" [style.color]="accentColor">
                Expert en {{ site.category }}
              </span>
              <h1 class="hero-h1" [style.color]="templateConfig?.heroText || '#0f172a'">
                {{ homeContent?.heroText }}
              </h1>
              <p class="hero-sub" [style.color]="templateConfig?.heroTextLight || 'rgba(15,23,42,0.6)'">
                {{ homeContent?.heroSubtext }}
              </p>
              <div class="hero-btns">
                <button (click)="navigateTo('contact')" class="btn-primary" [style.background]="accentColor + ' !important'">
                  Découvrir
                </button>
                <button (click)="navigateTo('about')" class="btn-outline" [style.border-color]="accentColor + '40'" [style.color]="templateConfig?.heroText || '#0f172a'">
                  En savoir plus
                </button>
              </div>
            </div>

            <!-- Hero Visual -->
            <div *ngIf="layout?.heroType !== 'centered' && homeContent?.products?.length" class="hero-visual">
              <div class="hero-img-wrap" [style.border-color]="accentColor + '40'">
                <img [src]="homeContent.products[0]?.image" [alt]="homeContent.products[0]?.name" class="hero-img">
                <div class="hero-img-badge" [style.background]="accentColor">
                  <span>Nouveau</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section" *ngIf="homeContent?.features?.length">
          <div class="section-inner">
            <div class="section-header">
              <span class="section-tag" [style.color]="accentColor">Nos Atouts</span>
              <h2 class="section-title">Expertise & Excellence</h2>
            </div>
            <div class="features-grid">
              <div *ngFor="let f of homeContent.features; let i = index" class="feature-card" [style.border-color]="i===0 ? accentColor + '30' : 'transparent'">
                <div class="feature-icon" [style.background]="accentColor + '15'" [style.color]="accentColor">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 class="feature-title">{{f.title}}</h3>
                <p class="feature-desc">{{f.desc}}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Products Section -->
        <section class="products-section" *ngIf="homeContent?.products?.length" [style.background]="templateConfig?.sectionBg || '#f8fafc'">
          <div class="section-inner">
            <div class="section-header">
              <span class="section-tag" [style.color]="accentColor">Notre Catalogue</span>
              <h2 class="section-title">Nos Produits & Services</h2>
              <p class="section-sub">Découvrez l'excellence de nos offres taillées sur mesure pour vous.</p>
            </div>
            <div class="products-grid">
              <div *ngFor="let p of homeContent.products" class="product-card">
                <div class="product-img-wrap">
                  <img [src]="p.image" [alt]="p.name" class="product-img">
                  <div class="product-overlay" [style.background]="'linear-gradient(to top, ' + (accentColor) + 'cc, transparent)'">
                    <button (click)="addToCart(p)" class="product-add-btn" [style.background]="accentColor">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                      Ajouter
                    </button>
                  </div>
                </div>
                <div class="product-body">
                  <h4 class="product-name">{{p.name}}</h4>
                  <p class="product-desc">{{p.desc}}</p>
                  <span class="product-price" [style.color]="accentColor">{{p.price}}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section" [style.background]="accentColor">
          <div class="section-inner cta-inner">
            <div>
              <h2 class="cta-title">Prêt à collaborer ?</h2>
              <p class="cta-sub">Parlons de votre projet. Notre équipe est là pour vous accompagner.</p>
            </div>
            <button (click)="navigateTo('contact')" class="cta-btn">Nous contacter →</button>
          </div>
        </section>

      </div>

      <!-- ===== ABOUT PAGE ===== -->
      <div *ngIf="currentPage==='about'" class="page-content">
        <div class="page-hero" [style.background]="templateConfig?.heroBg || '#f8fafc'">
          <div class="section-inner">
            <span class="section-tag" [style.color]="accentColor">Notre Histoire</span>
            <h1 class="page-hero-h1" [style.color]="templateConfig?.heroText || '#0f172a'">À Propos de Nous</h1>
            <p class="page-hero-sub" [style.color]="templateConfig?.heroTextLight || 'rgba(15,23,42,0.6)'">Découvrez qui nous sommes et ce qui nous anime.</p>
          </div>
        </div>
        <div class="section-inner py-20">
          <div class="about-grid">
            <div>
              <h2 class="about-title" [style.color]="accentColor">Notre Histoire</h2>
              <p class="about-text">{{aboutContent?.story}}</p>
            </div>
            <div class="about-mission" [style.border-color]="accentColor + '30'" [style.background]="accentColor + '08'">
              <h3 class="about-mission-title" [style.color]="accentColor">Notre Mission</h3>
              <p class="about-text">{{aboutContent?.mission}}</p>
              <div class="about-divider" [style.background]="accentColor"></div>
              <p class="about-quote">"Chaque client mérite l'excellence. C'est notre promesse."</p>
            </div>
          </div>
          <!-- Team -->
          <div *ngIf="aboutContent?.team?.length" class="team-section">
            <h2 class="section-title mb-12">Notre Équipe</h2>
            <div class="team-grid">
              <div *ngFor="let m of aboutContent.team" class="team-card">
                <div class="team-avatar" [style.background]="accentColor + '20'" [style.color]="accentColor">
                  {{m.name?.charAt(0)}}
                </div>
                <h4 class="team-name">{{m.name}}</h4>
                <p class="team-role" [style.color]="accentColor">{{m.role}}</p>
                <p class="team-bio">{{m.bio}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== CONTACT PAGE ===== -->
      <div *ngIf="currentPage==='contact'" class="page-content">
        <div class="page-hero" [style.background]="templateConfig?.heroBg || '#f8fafc'">
          <div class="section-inner">
            <span class="section-tag" [style.color]="accentColor">Contactez-Nous</span>
            <h1 class="page-hero-h1" [style.color]="templateConfig?.heroText || '#0f172a'">Parlons de Votre Projet</h1>
            <p class="page-hero-sub" [style.color]="templateConfig?.heroTextLight || 'rgba(15,23,42,0.6)'">{{contactContent?.message}}</p>
          </div>
        </div>
        <div class="section-inner contact-grid">
          <div class="contact-info">
            <div class="contact-item" *ngIf="site.address || contactContent?.address">
              <div class="contact-icon" [style.background]="accentColor + '15'" [style.color]="accentColor">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p class="contact-label">Adresse</p>
                <p class="contact-value">{{site.address || contactContent?.address}}</p>
              </div>
            </div>
            <div class="contact-item" *ngIf="site.phone">
              <div class="contact-icon" [style.background]="accentColor + '15'" [style.color]="accentColor">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <p class="contact-label">Téléphone</p>
                <p class="contact-value">{{site.phone}}</p>
              </div>
            </div>
            <div class="contact-item" *ngIf="site.email">
              <div class="contact-icon" [style.background]="accentColor + '15'" [style.color]="accentColor">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="contact-label">Email</p>
                <p class="contact-value">{{site.email}}</p>
              </div>
            </div>
            <div class="contact-item" *ngIf="contactContent?.hours">
              <div class="contact-icon" [style.background]="accentColor + '15'" [style.color]="accentColor">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="contact-label">Horaires</p>
                <p class="contact-value">{{contactContent.hours}}</p>
              </div>
            </div>
          </div>

          <form class="contact-form" (submit)="sendMessage($event)">
            <h3 class="contact-form-title">Envoyez un message</h3>
            <div class="form-row">
              <input [(ngModel)]="contactForm.name" name="name" type="text" placeholder="Votre nom" class="form-input" [style.--focus-color]="accentColor">
              <input [(ngModel)]="contactForm.email" name="email" type="email" placeholder="Email" class="form-input" [style.--focus-color]="accentColor">
            </div>
            <input [(ngModel)]="contactForm.subject" name="subject" type="text" placeholder="Sujet de votre demande" class="form-input" [style.--focus-color]="accentColor">
            <textarea [(ngModel)]="contactForm.message" name="message" rows="5" placeholder="Décrivez votre projet..." class="form-input form-textarea" [style.--focus-color]="accentColor"></textarea>
            <button type="submit" class="form-submit" [style.background]="accentColor">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Envoyer le message
            </button>
            <div *ngIf="messageSent" class="form-success" [style.background]="accentColor + '15'" [style.color]="accentColor">
              ✓ Message envoyé! Nous vous répondrons sous 24h.
            </div>
          </form>
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <footer class="site-footer" [style.background]="templateConfig?.footerBg || '#0f172a'">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="footer-logo" [style.background]="accentColor">
              <img *ngIf="site.logoUrl" [src]="site.logoUrl" alt="Logo" class="w-full h-full object-contain p-1.5">
              <span *ngIf="!site.logoUrl" class="text-white font-black text-lg">{{site.companyName?.charAt(0)}}</span>
            </div>
            <div>
              <p class="footer-name">{{site.companyName}}</p>
              <p class="footer-tagline">{{homeContent?.heroSubtext?.substring(0,60)}}...</p>
            </div>
          </div>
          <div class="footer-links">
            <p class="footer-links-title">Navigation</p>
            <a (click)="navigateTo('home')" class="footer-link">Accueil</a>
            <a (click)="navigateTo('about')" class="footer-link">À Propos</a>
            <a (click)="navigateTo('contact')" class="footer-link">Contact</a>
          </div>
          <div class="footer-contact">
            <p class="footer-links-title">Contact</p>
            <p class="footer-link" *ngIf="site.email">{{site.email}}</p>
            <p class="footer-link" *ngIf="site.phone">{{site.phone}}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© {{currentYear}} {{site.companyName}}. Tous droits réservés.</p>
          <p>Propulsé par <span [style.color]="accentColor">VitrineClick™</span></p>
        </div>
      </footer>

      <!-- Cart Sidebar -->
      <div *ngIf="cartOpen" class="cart-overlay" (click)="cartOpen=false">
        <div class="cart-sidebar" (click)="$event.stopPropagation()">
          <div class="cart-header">
            <h3 class="cart-title">Panier ({{cart.length}})</h3>
            <button (click)="cartOpen=false" class="cart-close">✕</button>
          </div>
          <div class="cart-empty" *ngIf="cart.length===0">Votre panier est vide</div>
          <div class="cart-items">
            <div *ngFor="let p of cart; let i=index" class="cart-item">
              <img [src]="p.image" [alt]="p.name" class="cart-item-img">
              <div class="cart-item-info">
                <p class="cart-item-name">{{p.name}}</p>
                <p class="cart-item-price" [style.color]="accentColor">{{p.price}}</p>
              </div>
              <button (click)="cart.splice(i,1)" class="cart-item-remove">✕</button>
            </div>
          </div>
          <div class="cart-footer" *ngIf="cart.length>0">
            <div class="cart-total">
              <span>Total</span>
              <span [style.color]="accentColor" class="font-black">{{cartTotal}}€</span>
            </div>
            <button class="cart-checkout" [style.background]="accentColor">Commander</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ====== CSS Variables ====== */
    .site-root {
      --accent: #FF6B2C;
      font-family: var(--font, 'Inter', sans-serif);
      min-height: 100vh;
    }

    /* ====== Navbar ====== */
    .site-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 24px 0;
      transition: all 0.4s ease;
    }
    .site-nav.scrolled {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      padding: 14px 0;
      box-shadow: 0 4px 30px rgba(0,0,0,0.06);
    }
    .nav-inner {
      max-width: 1280px; margin: 0 auto; padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
    .brand-logo {
      width: 44px; height: 44px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; flex-shrink: 0; box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .brand-name { font-size: 1.3rem; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; }
    .nav-links { display: flex; gap: 40px; align-items: center; }
    .nav-link {
      font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: #475569; cursor: pointer;
      border-bottom: 2px solid transparent; padding-bottom: 2px;
      transition: all 0.2s;
    }
    .nav-link:hover, .nav-link.active { color: var(--accent); border-bottom-color: var(--accent); }
    .nav-actions {}
    .nav-cta {
      padding: 10px 24px; border-radius: 12px;
      background: var(--accent); color: white;
      font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.12);
    }
    .nav-cta:hover { transform: translateY(-2px); filter: brightness(1.1); }

    /* ====== Hero ====== */
    .hero-section {
      position: relative; padding: 160px 32px 100px; overflow: hidden;
      min-height: 90vh; display: flex; align-items: center;
    }
    .hero-blob {
      position: absolute; border-radius: 50%;
      filter: blur(80px); pointer-events: none;
    }
    .hero-blob-1 { width: 600px; height: 600px; top: -200px; right: -200px; }
    .hero-blob-2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
    .hero-inner {
      max-width: 1280px; margin: 0 auto; width: 100%;
      display: flex; align-items: center; gap: 80px;
      position: relative; z-index: 1;
    }
    .hero-text { flex: 1; }
    .hero-text.hero-centered { text-align: center; max-width: 800px; margin: 0 auto; }
    .hero-badge {
      display: inline-block; padding: 6px 16px; border-radius: 9999px;
      font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 24px;
    }
    .hero-h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900;
      line-height: 1; letter-spacing: -0.03em;
      margin-bottom: 24px;
    }
    .hero-sub {
      font-size: 1.1rem; font-weight: 500; line-height: 1.6;
      margin-bottom: 40px; max-width: 540px;
    }
    .hero-centered .hero-sub { margin-left: auto; margin-right: auto; }
    .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
    .hero-centered .hero-btns { justify-content: center; }
    .btn-primary {
      padding: 16px 36px; border-radius: 14px;
      color: white; font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.06em;
      cursor: pointer; transition: all 0.3s;
      box-shadow: 0 12px 30px rgba(0,0,0,0.18);
    }
    .btn-primary:hover { transform: translateY(-3px); filter: brightness(1.08); }
    .btn-outline {
      padding: 16px 36px; border-radius: 14px;
      background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
      border: 2px solid; font-weight: 900; font-size: 0.9rem;
      text-transform: uppercase; letter-spacing: 0.06em;
      cursor: pointer; transition: all 0.2s;
    }
    .hero-visual { flex: 1; position: relative; }
    .hero-img-wrap {
      border-radius: 32px; overflow: hidden;
      border: 2px solid; box-shadow: 0 30px 80px rgba(0,0,0,0.15);
      position: relative;
    }
    .hero-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; }
    .hero-img-badge {
      position: absolute; top: 20px; right: 20px;
      padding: 6px 16px; border-radius: 9999px;
      color: white; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;
    }

    /* ====== Sections ====== */
    .section-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
    .section-header { text-align: center; margin-bottom: 64px; }
    .section-tag {
      font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em;
      display: block; margin-bottom: 12px;
    }
    .section-title {
      font-size: clamp(2rem, 4vw, 3rem); font-weight: 900;
      color: #0f172a; letter-spacing: -0.02em; line-height: 1.1;
    }
    .section-sub { color: #64748b; margin-top: 16px; font-size: 1.05rem; }

    /* ====== Features ====== */
    .features-section { padding: 100px 32px; background: #ffffff; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; }
    .feature-card {
      padding: 36px; border-radius: 24px; background: #f8fafc;
      border: 2px solid transparent; transition: all 0.3s;
    }
    .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.06); }
    .feature-icon {
      width: 56px; height: 56px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }
    .feature-title { font-size: 1.1rem; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
    .feature-desc { color: #64748b; font-size: 0.9rem; line-height: 1.6; }

    /* ====== Products ====== */
    .products-section { padding: 100px 32px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }
    .product-card { border-radius: 24px; background: white; overflow: hidden; border: 1px solid #f1f5f9; transition: all 0.3s; }
    .product-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.1); }
    .product-img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; }
    .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
    .product-card:hover .product-img { transform: scale(1.05); }
    .product-overlay {
      position: absolute; inset: 0;
      display: flex; align-items: flex-end; padding: 20px;
      opacity: 0; transition: opacity 0.3s;
    }
    .product-card:hover .product-overlay { opacity: 1; }
    .product-add-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 12px; color: white;
      font-weight: 800; font-size: 0.8rem; cursor: pointer;
    }
    .product-body { padding: 20px; }
    .product-name { font-size: 1rem; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
    .product-desc { font-size: 0.82rem; color: #64748b; margin-bottom: 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .product-price { font-size: 1rem; font-weight: 900; }

    /* ====== CTA ====== */
    .cta-section { padding: 80px 32px; }
    .cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
    .cta-title { font-size: 2rem; font-weight: 900; color: white; }
    .cta-sub { color: rgba(255,255,255,0.75); margin-top: 8px; }
    .cta-btn {
      padding: 16px 40px; border-radius: 16px;
      background: white; font-weight: 900; font-size: 0.9rem;
      cursor: pointer; transition: all 0.2s; white-space: nowrap;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .cta-btn:hover { transform: translateY(-2px); }

    /* ====== Page Hero ====== */
    .page-content { padding-top: 100px; }
    .page-hero { padding: 80px 32px; }
    .page-hero-h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -0.03em; margin: 16px 0; }
    .page-hero-sub { font-size: 1.1rem; max-width: 600px; font-weight: 500; }

    /* ====== About ====== */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; padding: 40px 0; }
    @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } }
    .about-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 20px; }
    .about-text { color: #475569; line-height: 1.8; font-size: 1rem; }
    .about-mission { padding: 40px; border-radius: 24px; border: 2px solid; }
    .about-mission-title { font-size: 1.1rem; font-weight: 900; margin-bottom: 16px; }
    .about-divider { width: 40px; height: 3px; border-radius: 9999px; margin: 24px 0; }
    .about-quote { font-size: 1rem; color: #64748b; font-style: italic; }
    .team-section { padding: 60px 0 20px; border-top: 1px solid #f1f5f9; margin-top: 20px; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
    .team-card { background: #f8fafc; border-radius: 20px; padding: 28px; text-align: center; }
    .team-avatar {
      width: 64px; height: 64px; border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 900; margin: 0 auto 16px;
    }
    .team-name { font-weight: 900; color: #0f172a; margin-bottom: 4px; }
    .team-role { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
    .team-bio { font-size: 0.82rem; color: #64748b; line-height: 1.5; }

    /* ====== Contact ====== */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px; padding: 60px 32px; }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
    .contact-info { display: flex; flex-direction: column; gap: 32px; }
    .contact-item { display: flex; align-items: flex-start; gap: 16px; }
    .contact-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .contact-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 4px; }
    .contact-value { font-weight: 700; color: #0f172a; }
    .contact-form { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.06); }
    .contact-form-title { font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 28px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .form-input {
      width: 100%; padding: 14px 18px; border-radius: 14px;
      border: 2px solid #f1f5f9; background: #f8fafc;
      font-weight: 600; color: #0f172a; font-size: 0.9rem;
      outline: none; transition: all 0.2s; margin-bottom: 0;
      box-sizing: border-box;
    }
    .form-input + .form-input, .form-input:not(:last-child) { margin-bottom: 16px; }
    .form-input:focus { border-color: var(--focus-color, #FF6B2C); background: white; box-shadow: 0 0 0 4px rgba(255,107,44,0.08); }
    .form-textarea { resize: vertical; min-height: 120px; }
    .form-submit {
      width: 100%; padding: 16px; border-radius: 14px; color: white;
      font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.06em;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
      margin-top: 8px;
    }
    .form-submit:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .form-success { padding: 14px; border-radius: 12px; font-weight: 700; text-align: center; margin-top: 12px; }

    /* ====== Footer ====== */
    .site-footer { padding: 80px 32px 32px; }
    .footer-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; padding-bottom: 60px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    @media (max-width: 768px) { .footer-inner { grid-template-columns: 1fr; } }
    .footer-brand { display: flex; align-items: center; gap: 16px; }
    .footer-logo { width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .footer-name { font-size: 1.1rem; font-weight: 900; color: white; }
    .footer-tagline { font-size: 0.82rem; color: rgba(255,255,255,0.4); margin-top: 4px; }
    .footer-links-title { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 20px; }
    .footer-link { display: block; color: rgba(255,255,255,0.5); font-size: 0.88rem; font-weight: 600; margin-bottom: 12px; cursor: pointer; transition: color 0.2s; }
    .footer-link:hover { color: white; }
    .footer-bottom { max-width: 1280px; margin: 30px auto 0; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(255,255,255,0.25); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

    /* ====== Cart ====== */
    .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 300; display: flex; justify-content: flex-end; }
    .cart-sidebar { width: 400px; background: white; height: 100%; display: flex; flex-direction: column; padding: 32px; overflow: hidden; }
    .cart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
    .cart-title { font-size: 1.4rem; font-weight: 900; color: #0f172a; }
    .cart-close { font-size: 1.2rem; color: #94a3b8; cursor: pointer; padding: 4px; }
    .cart-empty { color: #94a3b8; text-align: center; margin: auto; font-weight: 700; }
    .cart-items { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
    .cart-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 16px; background: #f8fafc; }
    .cart-item-img { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; }
    .cart-item-info { flex: 1; }
    .cart-item-name { font-weight: 900; color: #0f172a; margin-bottom: 4px; }
    .cart-item-price { font-weight: 800; font-size: 0.9rem; }
    .cart-item-remove { color: #cbd5e1; cursor: pointer; padding: 4px; }
    .cart-footer { border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 20px; }
    .cart-total { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 16px; }
    .cart-checkout { width: 100%; padding: 16px; border-radius: 14px; color: white; font-weight: 900; font-size: 0.9rem; cursor: pointer; }

    /* ====== Animations ====== */
    @keyframes fade-in { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .site-root { animation: fade-in 0.5s ease-out forwards; }
  `]
})
export class SiteViewerComponent implements OnInit {
  subdomain: string = '';
  site: any = null;
  fullAiContent: any = null;
  templateConfig: any = null;
  loading: boolean = true;
  error: string = '';
  scrolled: boolean = false;
  currentYear = new Date().getFullYear();
  currentPage: string = 'home';
  cart: any[] = [];
  cartOpen: boolean = false;
  messageSent: boolean = false;
  contactForm = { name: '', email: '', subject: '', message: '' };

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta
  ) {}

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 60; }

  get accentColor(): string {
    return this.site?.primaryColor || this.templateConfig?.accent || '#FF6B2C';
  }

  get siteVars(): any {
    return { '--accent': this.accentColor, '--font': this.fullAiContent?.theme?.fontFamily || 'Inter' };
  }

  get layout(): any { return this.fullAiContent?.layout; }
  get homeContent(): any { return this.fullAiContent?.pages?.home; }
  get aboutContent(): any { return this.fullAiContent?.pages?.about; }
  get contactContent(): any { return this.fullAiContent?.pages?.contact; }

  get cartTotal(): number {
    return this.cart.reduce((s, p) => s + (parseFloat((p.price || '').replace(/[^\d.]/g,'')) || 0), 0);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.subdomain = params.get('subdomain') || '';
      if (this.subdomain) { this.loadSite(); }
      else { this.error = "Aucun sous-domaine spécifié."; this.loading = false; }
    });
  }

  loadSite() {
    this.loading = true;
    this.http.get(`http://localhost:8080/api/public/sites/subdomain/${this.subdomain}`).subscribe({
      next: (data: any) => {
        this.site = data;
        const title = this.site.metaTitle || (this.site.companyName + " | Site Officiel");
        this.titleService.setTitle(title);
        if (this.site.metaDescription) this.metaService.updateTag({ name: 'description', content: this.site.metaDescription });

        if (this.site.generatedVisuals) {
          try { this.fullAiContent = JSON.parse(this.site.generatedVisuals); } catch(e) {}
        }
        if (this.site.templateConfig) {
          try { this.templateConfig = JSON.parse(this.site.templateConfig); } catch(e) {}
        }
        // Override accent with stored theme if available
        if (this.fullAiContent?.theme?.primary) this.site.primaryColor = this.fullAiContent.theme.primary;

        this.http.post(`http://localhost:8080/api/sites/${this.site.id}/visit`, { retention: 0 }).subscribe();
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

  navigateTo(page: string) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(product: any) {
    this.cart.push(product);
    this.cartOpen = true;
  }

  sendMessage(e: Event) {
    e.preventDefault();
    this.messageSent = true;
    this.contactForm = { name: '', email: '', subject: '', message: '' };
    setTimeout(() => this.messageSent = false, 5000);
  }
}
