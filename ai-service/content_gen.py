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

# Configuration
HF_TOKEN = os.getenv("HF_TOKEN")
API_URL = "https://router.huggingface.co/hf-inference/models/Qwen/Qwen2.5-Coder-32B-Instruct"
headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

def generate_site_content_pro(company_name, description, industry):
    """
    Generates professional, multi-page JSON website content.
    Includes Home, About, and Contact pages with advanced layout hints.
    """
    if not HF_TOKEN:
        print(" [WARNING] HF_TOKEN missing. Using high-quality fallback.")
        return get_fallback_content(company_name, description, industry)

    prompt = f"""
Output ONLY a valid raw JSON object. NO markdown, NO text.
Task: Design an enterprise-grade VITRINE website for '{company_name}' ({industry}).
Required Structure:
{{
  "theme": {{ "primary": "#hex", "secondary": "#hex", "fontFamily": "Inter" | "Montserrat", "borderRadius": "3xl" | "xl" }},
  "layout": {{ "heroType": "split" | "centered", "featureLayout": "bento" | "grid", "style": "premium" | "glassmorphism" }},
  "pages": {{
    "home": {{
      "heroText": "Impactful H1",
      "heroSubtext": "Value prop",
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
      "address": "Mock professional address",
      "hours": "Mon-Fri 9am-6pm"
    }}
  }},
  "seo": {{ "title": "...", "description": "..." }}
}}
"""

    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 1800, "temperature": 0.2}
    }

    try:
        print(f" [AI-SCALE] Generating Multi-Page content for {company_name}...")
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            content = result[0].get('generated_text', '') if isinstance(result, list) else result.get('generated_text', '')
            import re
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                return json.loads(match.group())
        else:
            print(f" [AI-SCALE] Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f" [AI-SCALE] Request failed: {e}")

    return get_fallback_content(company_name, description, industry)

def get_fallback_content(company_name, description, industry):
    comp = company_name or "Entreprise"
    return {
        "theme": {"primary": "#2B3970", "secondary": "#FF6B2C", "fontFamily": "Inter", "borderRadius": "3xl"},
        "layout": {"heroType": "centered", "featureLayout": "grid", "style": "premium"},
        "pages": {
            "home": {
                "heroText": f"L'Excellence avec {comp}",
                "heroSubtext": f"Solutions innovantes en {industry}.",
                "features": [{"title": "Expertise", "desc": "Savoir-faire reconnu."}],
                "products": [{"name": "Produit Star", "price": "99€", "desc": "Qualité premium.", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"}]
            },
            "about": {"story": "Une histoire d'audace.", "mission": "Vivre l'innovation."},
            "contact": {"message": "Contactez-nous.", "address": "Paris, France"}
        },
        "seo": {"title": f"{comp}", "description": "SaaS Website."}
    }

@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.json
    company_name = data.get('companyName')
    description = data.get('description')
    industry = data.get('category', 'Technologie')
    
    content = generate_site_content_pro(company_name, description, industry)
    return jsonify(content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
