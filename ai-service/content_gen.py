import os
import json
import requests
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

app = Flask(__name__)
CORS(app)
# Robust .env loading
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

def generate_site_content_pro(company_name, description, industry, primary_color="#2B3970", font="Inter", template_style="premium"):
    """
    Generates professional, multi-page JSON website content.
    Includes Home, About, and Contact pages with advanced layout hints.
    """
    if not HF_TOKEN:
        print(" [WARNING] HF_TOKEN missing. Using high-quality fallback.")
        return get_fallback_content(company_name, description, industry, primary_color, font)

    prompt = f"""
Output ONLY a valid raw JSON object. NO markdown, NO text.
Task: Design an enterprise-grade VITRINE website for '{company_name}' ({industry}).
Style Context: {template_style}, Primary Color: {primary_color}, Font: {font}.

Required Structure:
{{
  "theme": {{ 
    "primary": "{primary_color}", 
    "secondary": "#ffffff", 
    "fontFamily": "{font}", 
    "borderRadius": "2xl",
    "mode": "light" | "dark"
  }},
  "layout": {{ "heroType": "split" | "centered", "featureLayout": "bento" | "grid", "style": "{template_style}" }},
  "pages": {{
    "home": {{
      "heroText": "Impactful H1 about {company_name}",
      "heroSubtext": "Value proposition: {description}",
      "features": [ {{"title": "...", "desc": "..."}}, ... ],
      "products": [ {{"name": "...", "price": "...", "desc": "...", "image": "unsplash_url"}}, ... ]
    }},
    "about": {{
      "story": "A compelling 3-paragraph company history.",
      "mission": "Our core values and mission statement.",
      "team": [ {{"name": "Name", "role": "Role", "bio": "..."}}, ... ]
    }},
    "contact": {{
      "message": "Enthusiastic invitation to reach out.",
      "address": "Mock professional address in France",
      "hours": "Mon-Fri 9am-6pm"
    }}
  }},
  "seo": {{ "title": "{company_name} | {industry} Expertise", "description": "{description}" }}
}}
"""

    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 1200, "temperature": 0.1, "top_p": 0.9}
    }

    try:
        print(f" [AI-SCALE] Generating Multi-Page content for {company_name}...")
        
        # Use Chat Completion for better structure instruction following
        messages = [{"role": "user", "content": prompt}]
        
        # Explicit timeout to prevent hanging the whole process
        response = client.chat.completions.create(
            messages=messages,
            max_tokens=1000,
            temperature=0.1,
            timeout=30 
        )
        
        content = response.choices[0].message.content
        import re
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            # Force design attributes to strictly follow parameters if AI deviates
            if "theme" in parsed:
                parsed["theme"]["primary"] = primary_color
                parsed["theme"]["fontFamily"] = font
            return parsed
    except Exception as e:
        print(f" [AI-SCALE] Generation failed or timed out: {e}")
        # Always return fallback immediately on error/timeout
        return get_fallback_content(company_name, description, industry, primary_color, font)

    return get_fallback_content(company_name, description, industry, primary_color, font)

def get_fallback_content(company_name, description, industry, primary_color="#2B3970", font="Inter"):
    comp = company_name or "Entreprise"
    return {
        "theme": {"primary": primary_color, "secondary": "#FF6B2C", "fontFamily": font, "borderRadius": "3xl"},
        "layout": {"heroType": "centered", "featureLayout": "grid", "style": "premium"},
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
                ]
            },
            "about": {"story": f"{comp} est née d'une vision d'excellence et d'innovation.", "mission": "Offrir le meilleur service possible à nos clients."},
            "contact": {"message": "Notre équipe est à votre disposition pour toute question.", "address": "75008 Paris, France"}
        },
        "seo": {"title": f"{comp} | Expertise {industry}", "description": description or f"Site officiel de {comp}"}
    }

@app.route('/generate-logo', methods=['POST'])
def generate_logo():
    """Returns a logo URL based on the prompt."""
    data = request.json
    company_name = data.get('companyName') or data.get('prompt')
    # We use a high-quality placeholder or a generated one
    # For now, let's use a nice colored text-based logo or Unsplash
    logo_type = data.get('style', 'modern')
    return jsonify({
        "success": True, 
        "imageUrls": [f"https://ui-avatars.com/api/?name={company_name}&background=random&color=fff&size=512&font-size=0.33"]
    })

@app.route('/generate-copy', methods=['POST'])
def generate_copy():
    """Returns the full site structure (Home, About, Contact)."""
    data = request.json
    company_name = data.get('companyName')
    description = data.get('description')
    industry = data.get('category', 'Technologie')
    
    primary_color = data.get('primaryColor', '#2B3970')
    font = data.get('font', 'Inter')
    template_style = data.get('style', 'premium')
    
    print(f" [DEBUG] generate_copy input: {company_name=}, {primary_color=}, {font=}, {template_style=}")
    
    content = generate_site_content_pro(company_name, description, industry, primary_color, font, template_style)
    return jsonify({
        "success": True,
        "content": content
    })

# Legacy / test route
@app.route('/generate', methods=['POST'])
def generate_legacy():
    data = request.json
    # If it's a logo request (has prompt)
    if 'prompt' in data:
        return generate_logo()
    # Otherwise site generation
    return generate_copy()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
