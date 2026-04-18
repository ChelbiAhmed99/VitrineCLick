import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SiteService } from '../services/site.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-landing-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: '../app.scss'
})
export class LandingPanelComponent implements OnInit {
  title = 'VitrineClick';
  currentView = 'auth';

  categories = ['Tous les Modèles', 'Restaurant', 'Tech', 'Consulting', 'Beauty', 'Retail'];
  activeCategory = 'Tous les Modèles';
  templates = [
    { id: 1, name: 'Savor Excellence', desc: 'Gastronomie Fine & Bistrot', cat: 'Restaurant', color1: 'from-orange-500 to-red-600', color2: 'bg-red-600', layout: 'split', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', badge: 'Populaire', features: ['Menu Digital', 'Réservation Table', 'Galerie HD'] },
    { id: 2, name: 'SaaS Innovator', desc: 'Software & Tech Startup', cat: 'Tech', color1: 'from-indigo-600 to-blue-500', color2: 'bg-indigo-600', layout: 'hero', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', badge: 'AI Elite', features: ['Tableaux de Prix', 'Intégration API', 'Mode Sombre'] },
    { id: 3, name: 'Agency Bold', desc: 'Portfolio Créatif & Audit', cat: 'Consulting', color1: 'from-purple-600 to-pink-500', color2: 'bg-purple-600', layout: 'minimal', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', badge: 'Design Award', features: ['Animation Parallaxe', 'Études de Cas', 'Blog'] },
    { id: 4, name: 'Beauty Elegance', desc: 'Spa & Salon de Beauté', cat: 'Beauty', color1: 'from-teal-500 to-emerald-400', color2: 'bg-teal-500', layout: 'elegant', imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80', badge: 'Top Ventes', features: ['Prestation en Ligne', 'Avis Clients', 'Boutique Shampoing'] },
    { id: 5, name: 'Storefront Pro', desc: 'E-commerce Mode & Lifestyle', cat: 'Retail', color1: 'from-rose-500 to-red-400', color2: 'bg-rose-500', layout: 'grid', imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80', badge: 'Conversion Max', features: ['Panier Flash', 'Fiches Produits IA', 'Suivi Colis'] },
    { id: 6, name: 'Corporate Trust', desc: 'Finance & Services Juridiques', cat: 'Consulting', color1: 'from-slate-800 to-slate-600', color2: 'bg-slate-800', layout: 'classic', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', badge: 'Pro Safe', features: ['Espace Client', 'Signature Élec.', 'Cryptage SSL'] },
    { id: 7, name: 'Luxe Jewels', desc: 'Joaillerie & Horlogerie', cat: 'Retail', color1: 'from-amber-400 to-yellow-600', color2: 'bg-black', layout: 'elegant', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88bd7ce33f?auto=format&fit=crop&w=800&q=80', badge: 'Ultra Luxe', features: ['Mode Sombre Or', 'Zoom Scroll', 'Conciergerie'] },
    { id: 8, name: 'Gym Flow', desc: 'Fitness & Coaching Performance', cat: 'Beauty', color1: 'from-orange-600 to-yellow-500', color2: 'bg-orange-600', layout: 'split', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', badge: 'Énergie', features: ['Planning Cours', 'Coach IA', 'Calculateur IMC'] },
    { id: 9, name: 'MedCare Pro', desc: 'Clinique & Santé Digitale', cat: 'Consulting', color1: 'from-sky-400 to-blue-600', color2: 'bg-sky-500', layout: 'minimal', imageUrl: 'https://images.unsplash.com/photo-1505751172107-573230a9e96e?auto=format&fit=crop&w=800&q=80', badge: 'Clinique', features: ['Téléconsultation', 'RDV Doctolib', 'Dossier Patient'] },
    { id: 10, name: 'Artisan Studio', desc: 'Design d’Interieur & Artisanat', cat: 'Consulting', color1: 'from-stone-400 to-stone-600', color2: 'bg-stone-500', layout: 'grid', imageUrl: 'https://images.unsplash.com/photo-1493663249033-649033649033?auto=format&fit=crop&w=800&q=80', badge: 'Minimalist', features: ['Vision 360', 'Moodboard', 'Vente Artisanat'] },
    { id: 11, name: 'Future Tech', desc: 'IA & Web3 Infrastructure', cat: 'Tech', color1: 'from-cyan-400 to-purple-600', color2: 'bg-cyan-500', layout: 'hero', imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80', badge: 'Next Gen', features: ['Glassmorphism', 'Wallet Connect', 'Data Viz'] }
  ];

  wizardStep = 1;
  siteData = { companyName: '', description: '', category: '', address: '', phone: '', email: '', templateId: 0, aiVisuals: false, aiGenerating: false };
  isLoginMode = true;
  loginData = { username: 'user', password: 'password123' };
  signupData = { username: '', email: '', password: '' };
  errorMessage = '';
  aiLoadingText = "Analyse de l'identité de la marque...";
  generatedLogoUrl = '';
  
  // Payment State
  showPaymentModal = false;
  selectedPlan: any = null;
  paymentData = { cardName: '', cardNumber: '', expiry: '', cvc: '' };
  isProcessingPayment = false;
  paymentSuccess = false;

  isMobileMenuOpen = false;
  notifications: {id: number, message: string}[] = [];
  private notificationId = 0;

  publicStats: any = null;

  constructor(
    private authService: AuthService, 
    private siteService: SiteService, 
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  get isLandingPage() { return true; } // Always true for this component

  ngOnInit() {
    // 0. Fetch initial stats
    this.fetchGlobalStats();

    // 1. Session check - Redirect if already logged in
    const roles = this.authService.getUserRoles();
    if (roles.length > 0) {
      if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
    }

    // 2. Notifications subscription
    this.notificationService.getNotifications().subscribe(notif => {
      this.addToast(notif.message);
      // Optional: if real-time needs to be extremely accurate, we can refetch stats or update counters here 
      if (notif.type === 'GLOBAL_UPDATE' || notif.type === 'SITE_UPDATE') {
        this.fetchGlobalStats();
      }
    });
  }

  fetchGlobalStats() {
    this.http.get('http://localhost:8080/api/public/sites/stats').subscribe(data => {
      this.publicStats = data;
    });
  }

  setCategory(cat: string) { this.activeCategory = cat; }

  setView(view: string) {
    this.currentView = view;
  }

  toggleAuthMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.addToast("Connexion réussie ! Redirection...");
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Identifiants incorrects';
      }
    });
  }

  signup() {
    this.authService.register(this.signupData).subscribe({
      next: (res) => {
        this.addToast("Compte créé avec succès ! Veuillez vous connecter.");
        this.isLoginMode = true;
        this.loginData.username = this.signupData.username;
        this.loginData.password = '';
        this.signupData = { username: '', email: '', password: '' };
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }

  addToast(message: string) {
    const id = this.notificationId++;
    this.notifications.push({ id, message });
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }, 5000);
  }

  removeToast(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  scrollToLogin() {
    const el = document.getElementById('login-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Payment UI Methods
  openPaymentModal(planName: string, price: number, isPro: boolean = false) {
    this.selectedPlan = { name: planName, price: price, isPro: isPro };
    this.showPaymentModal = true;
    this.paymentSuccess = false;
    this.paymentData = { cardName: '', cardNumber: '', expiry: '', cvc: '' };
  }

  closePaymentModal() {
    if (this.isProcessingPayment) return;
    this.showPaymentModal = false;
    setTimeout(() => this.selectedPlan = null, 300); // Wait for transition
  }

  processPayment() {
    if (!this.paymentData.cardNumber || !this.paymentData.expiry || !this.paymentData.cvc) {
      this.addToast("Veuillez remplir tous les champs de paiement bancaire.");
      return;
    }
    
    this.isProcessingPayment = true;
    
    // Simulate secure 3D Secure / Stripe API call
    setTimeout(() => {
      this.isProcessingPayment = false;
      this.paymentSuccess = true;
      this.addToast(`Paiement de ${this.selectedPlan.price} TND accepté ! Création de votre accès Studio...`);
      
      // Navigate to login/studio entry after success
      setTimeout(() => {
        this.closePaymentModal();
        this.scrollToLogin();
        // Prefill login with a user account to simulate seamless transition
        this.loginData.username = 'user';
      }, 2500);
    }, 2000);
  }

  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
}
