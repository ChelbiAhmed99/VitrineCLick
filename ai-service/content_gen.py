import os
import json
import requests
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
API_URL = "https://router.huggingface.co/hf-inference/models/Qwen/Qwen2.5-72B-Instruct"
headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

def generate_site_content_hf(company_name, description, industry, simulate=False):
    """
    Generates structured JSON website content using Hugging Face Inference API.
    Fails over safely to procedural fallback if API is busy or unauthorized.
    """
    if simulate or not HF_TOKEN:
        print(" [CONTENT] Using procedural fallback (simulate=True or no HF_TOKEN).")
        return get_fallback_content(company_name, description, industry)

    prompt_text = f"""
Output ONLY a valid JSON object matching exactly this structure for '{company_name}' in the '{industry}' sector:
{{
  "heroText": "A catchy, short primary headline",
  "heroSubtext": "A slightly longer explanatory subtitle focusing on value proposition",
  "aboutText": "A 2-3 sentence engaging paragraph based on: '{description}'",
  "features": [
     {{"title": "Feature 1", "desc": "Feature 1 brief explanation"}},
     {{"title": "Feature 2", "desc": "Feature 2 brief explanation"}},
     {{"title": "Feature 3", "desc": "Feature 3 brief explanation"}}
  ],
  "products": [
     {{"name": "Nom Produit 1", "price": "29.99 €", "desc": "Description 1", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"}},
     {{"name": "Nom Produit 2", "price": "49.99 €", "desc": "Description 2", "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"}},
     {{"name": "Nom Produit 3", "price": "89.99 €", "desc": "Description 3", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"}},
     {{"name": "Nom Produit 4", "price": "19.99 €", "desc": "Description 4", "image": "https://images.unsplash.com/photo-1572635196237-1d2194d97439?auto=format&fit=crop&w=400&q=80"}}
  ],
  "testimonials": [
     {{"name": "Client 1", "role": "Acheteur Vérifié", "quote": "Un service et une qualité exceptionnels !"}},
     {{"name": "Client 2", "role": "Acheteur Vérifié", "quote": "Exactement ce que je cherchais, livraison ultra rapide."}}
  ],
  "theme": {{
     "primary": "Hex color code matching the industry mood",
     "secondary": "Hex color code",
     "fontFamily": "Choose between 'Montserrat', 'Playfair Display', 'Inter', or 'Poppins'"
  }},
  "seo": {{
     "title": "SEO Optimized Title tag (~60 chars)",
     "description": "Meta description for Google (~155 chars)"
  }}
}}
Do NOT output Markdown formats like ```json. Output raw JSON braces ONLY.
"""

    payload = {
        "model": "Qwen/Qwen2.5-72B-Instruct",
        "messages": [
            {"role": "system", "content": "You are a professional AI copywriter specialized in creating French website structures. Always output strictly raw JSON matching the requested structure."},
            {"role": "user", "content": prompt_text}
        ],
        "parameters": {
            "max_new_tokens": 1000,
            "temperature": 0.3
        }
    }

    try:
        print(f" [CONTENT] Calling Hugging Face API for '{company_name}'...")
        response = requests.post(API_URL, headers=headers, json=payload, timeout=40)
        
        if response.status_code == 200:
            result = response.json()
            # Handle different common response formats from Inference API
            content = ""
            if isinstance(result, list) and len(result) > 0:
                content = result[0].get('generated_text', '')
            elif isinstance(result, dict):
                if 'choices' in result:
                    content = result['choices'][0]['message']['content']
                else:
                    content = result.get('generated_text', '')
            
            # Extract JSON from potential wrapper text
            start = content.find('{')
            end = content.rfind('}')
            if start != -1 and end != -1:
                json_str = content[start:end+1]
                return json.loads(json_str)
        else:
            print(f" [CONTENT] API Error ({response.status_code}): {response.text}")

    except Exception as e:
        print(f" [CONTENT] Request Error: {e}")
        
    print(" [CONTENT] Falling back to procedural content generator.")
    return get_fallback_content(company_name, description, industry)

def get_fallback_content(company_name, description, industry):
    """
    Procedural fallback generation that looks professional if AI fails.
    """
    comp = company_name or "Votre Entité"
    desc_clean = description if description and len(description) > 5 else f"L'excellence dans le secteur {industry}"
    return {
        "heroText": f"Bienvenue chez {comp}",
        "heroSubtext": f"La solution de référence en {industry.lower() if industry else 'innovation'}. Explorez une nouvelle dimension d'excellence.",
        "aboutText": f"Chez {comp}, notre mission est simple : transformer votre vision en réalité. {desc_clean}. Nous nous engageons à vous offrir la meilleure qualité avec une approche personnalisée.",
        "features": [
            {"title": "Expertise Reconnue", "desc": "Notre savoir-faire nous permet d'apporter des solutions robustes et éprouvées."},
            {"title": "Service Premium", "desc": "Nous mettons un point d'honneur à satisfaire nos clients avec une qualité inégalée."},
            {"title": "Innovation Continue", "desc": "Nous anticipons vos besoins futurs pour concevoir l'excellence d'aujourd'hui."}
        ],
        "products": [
             {"name": "Produit Essentiel", "price": "49.00 €", "desc": "Notre produit phare qui répond à tous vos besoins quotidiens avec brio.", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"},
             {"name": "Pack Premium", "price": "149.00 €", "desc": "La combinaison parfaite de fonctionnalités avancées et de design épuré.", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"},
             {"name": "Édition Limitée", "price": "299.00 €", "desc": "L'expérience ultime pour les utilisateurs exigeants. Matériaux nobles.", "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"},
             {"name": "Accessoire Pro", "price": "29.00 €", "desc": "Le complément idéal pour booster votre productivité au quotidien.", "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80"}
        ],
        "testimonials": [
             {"name": "Sophie M.", "role": "Entrepreneuse", "quote": "Cette plateforme a complètement transformé notre approche client. Un vrai game-changer !"},
             {"name": "Thomas O.", "role": "Acheteur Vérifié", "quote": "La qualité du service est bluffante, tout comme la rapidité de la livraison. Je suis ravi."}
        ],
        "theme": {
             "primary": "#FF6B2C",
             "secondary": "#2B3970",
             "fontFamily": "Inter"
        },
        "seo": {
             "title": f"Boutique {comp} | Officiel",
             "description": f"Découvrez les solutions haut de gamme de {comp}. Expertise, qualité et innovation à votre service."
        }
    }

@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.json
    company_name = data.get('companyName')
    description = data.get('description')
    industry = data.get('category', 'Technologie')
    
    # Optional simulation flag
    simulate = data.get('simulate', False)
    
    print(f" [AI-SERVICE] Received request for: {company_name} ({industry})")
    content = generate_site_content_hf(company_name, description, industry, simulate=simulate)
    return jsonify(content)

if __name__ == '__main__':
    # HF_TOKEN is required for real AI results, otherwise fallback is used
    if not HF_TOKEN:
        print(" [WARNING] HF_TOKEN not found in .env. Using procedural fallbacks.")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
