import os
import json
import requests
import time
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Configuration
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Configuration
HF_TOKEN = os.getenv("HF_TOKEN")
if HF_TOKEN:
    print(f" [OK] HF_TOKEN loaded ({HF_TOKEN[:5]}...)")
else:
    print(" [ERROR] HF_TOKEN NOT FOUND in " + env_path)

# Reliable model via InferenceClient
MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"

# Initialize Client
client = None
if HF_TOKEN:
    print(f" [OK] HF_TOKEN loaded ({HF_TOKEN[:5]}...)")
    client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)
else:
    print(" [ERROR] HF_TOKEN NOT FOUND in " + env_path)

def generate_site_content_pro(company_name, description, industry, primary_color="#2B3970", font="Inter", template_style="premium", address="", phone="", email=""):
    """
    Generates professional, multi-page JSON website content.
    Includes Home, About, and Contact pages with advanced layout hints.
    """
    if not HF_TOKEN:
        print(" [WARNING] HF_TOKEN missing. Using high-quality fallback.")
        return get_fallback_content(company_name, description, industry, primary_color, font, address, phone, email)

    prompt = f"""
Output ONLY a valid raw JSON object. NO markdown, NO text.
Task: Design an enterprise-grade VITRINE website for '{company_name}' in the '{industry}' industry.
User's Description/Prompt: {description}
Style Context: {template_style}, Primary Color: {primary_color}, Font: {font}.
Contact Info: Address: {address}, Phone: {phone}, Email: {email}.

Required Structure:
{{
  "theme": {{ 
    "primary": "{primary_color}", 
    "secondary": "#ffffff", 
    "fontFamily": "{font}", 
    "borderRadius": "2xl",
    "mode": "light"
  }},
  "layout": {{ "heroType": "split" | "centered", "featureLayout": "bento" | "grid", "style": "{template_style}" }},
  "pages": {{
    "home": {{
      "heroText": "Impactful H1 headline about {company_name}",
      "heroSubtext": "Compelling value proposition based on: {description}",
      "features": [ 
        {{"title": "Feature 1", "desc": "Detailed description"}},
        {{"title": "Feature 2", "desc": "Detailed description"}},
        {{"title": "Feature 3", "desc": "Detailed description"}}
      ],
      "products": [ 
        {{"name": "Product/Service 1", "price": "Price or 'Starting at...'", "desc": "Compelling description", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"}},
        {{"name": "Product/Service 2", "price": "Price", "desc": "Description", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"}}
      ],
      "testimonials": [
        {{"name": "Client Name", "role": "CEO of TechCorp", "content": "Amazing service..."}},
        {{"name": "Client Name", "role": "Marketing Director", "content": "Transformed our business..."}}
      ]
    }},
    "about": {{
      "story": "A professional 3-paragraph company history and vision.",
      "mission": "Our core values and mission statement.",
      "team": [ 
        {{"name": "Name", "role": "Founder & CEO", "bio": "Expert in {industry}..."}},
        {{"name": "Name", "role": "Head of Operations", "bio": "10+ years of experience..."}}
      ]
    }},
    "contact": {{
      "message": "Enthusiastic invitation to reach out for a consultation or quote.",
      "address": "{address or '75008 Paris, France'}",
      "phone": "{phone or '+33 1 23 45 67 89'}",
      "email": "{email or 'contact@' + company_name.lower().replace(' ', '') + '.com'}",
      "hours": "Mon-Fri 9am-6pm",
      "faq": [
        {{"q": "Question related to {industry}?", "a": "Helpful answer."}},
        {{"q": "Another common question?", "a": "Professional answer."}}
      ]
    }}
  }},
  "seo": {{ "title": "{company_name} | Professional {industry} Services", "description": "{description}" }}
}}

Instructions:
- The content must be in French.
- Use the provided contact info if available.
- Ensure the tone is professional, trustworthy, and matches the '{template_style}' style.
- For images, use relevant Unsplash URLs if possible, or use the provided placeholders.
"""

    try:
        print(f" [AI-SCALE] Generating Multi-Page content for {company_name}...")
        
        messages = [{"role": "user", "content": prompt}]
        
        response = client.chat.completions.create(
            messages=messages,
            max_tokens=2000,
            temperature=0.7,
            timeout=45 
        )
        
        content = response.choices[0].message.content
        import re
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            # Force design attributes
            if "theme" in parsed:
                parsed["theme"]["primary"] = primary_color
                parsed["theme"]["fontFamily"] = font
            return parsed
    except Exception as e:
        print(f" [AI-SCALE] Generation failed or timed out: {e}")
        return get_fallback_content(company_name, description, industry, primary_color, font, address, phone, email)

    return get_fallback_content(company_name, description, industry, primary_color, font, address, phone, email)

def get_fallback_content(company_name, description, industry, primary_color="#2B3970", font="Inter", address="", phone="", email=""):
    comp = company_name or "Entreprise"
    return {
        "theme": {"primary": primary_color, "secondary": "#ffffff", "fontFamily": font, "borderRadius": "3xl"},
        "layout": {"heroType": "split", "featureLayout": "grid", "style": "premium"},
        "pages": {
            "home": {
                "heroText": f"L'Excellence avec {comp}",
                "heroSubtext": f"{description or 'Solutions innovantes en ' + industry}.",
                "features": [
                    {"title": "Expertise", "desc": "Savoir-faire reconnu dans notre domaine."},
                    {"title": "Innovation", "desc": "Toujours à la pointe de la technologie."},
                    {"title": "Accompagnement", "desc": "Une équipe dédiée à votre succès."}
                ],
                "products": [
                    {"name": "Solution Pro", "price": "Sur devis", "desc": "Performance optimisée.", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"},
                    {"name": "Pack Excellence", "price": "Sur devis", "desc": "Le meilleur de notre savoir-faire.", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"}
                ],
                "testimonials": [
                    {"name": "Jean Dupont", "role": "Directeur Innovation", "content": "Un service exceptionnel et une équipe très réactive."}
                ]
            },
            "about": {"story": f"{comp} est née d'une vision d'excellence et d'innovation.", "mission": "Offrir le meilleur service possible à nos clients."},
            "contact": {
                "message": "Notre équipe est à votre disposition pour toute question.", 
                "address": address or "75008 Paris, France",
                "phone": phone or "+33 1 23 45 67 89",
                "email": email or f"contact@{comp.lower().replace(' ', '')}.com",
                "hours": "Lun-Ven 9h-18h",
                "faq": [
                    {"q": "Quels sont vos délais ?", "a": "Nous intervenons généralement sous 48h."},
                    {"q": "Où êtes-vous situés ?", "a": f"Notre siège est à {address or 'Paris'}."}
                ]
            }
        },
        "seo": {"title": f"{comp} | Expertise {industry}", "description": description or f"Site officiel de {comp}"}
    }

    return get_fallback_content(company_name, description, industry, primary_color, font, address, phone, email)
