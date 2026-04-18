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
    Generates professional, exhaustive JSON website content using Qwen2.5-Coder-32B.
    Includes advanced layout hints and style intelligence.
    """
    if not HF_TOKEN:
        print(" [WARNING] HF_TOKEN missing. Using high-quality fallback.")
        return get_fallback_content(company_name, description, industry)

    prompt = f"""
Output ONLY a valid raw JSON object. NO markdown, NO text.
Task: Design an enterprise-grade website structure for '{company_name}' ({industry}).
Context: {description}

Required exhaustive JSON structure:
{{
  "heroText": "Impactful H1 headline",
  "heroSubtext": "Compelling sub-headline explaining the value prop",
  "aboutText": "3-4 professional and engaging sentences about the vision and mission",
  "layout": {{
    "heroType": "split" | "centered" | "minimal",
    "featureLayout": "grid" | "bento" | "list",
    "style": "premium" | "clean" | "glassmorphism",
    "borderRadius": "none" | "xl" | "3xl"
  }},
  "features": [
    {{"title": "Core Benefit 1", "desc": "Detailed explanation of why this matters"}},
    {{"title": "Core Benefit 2", "desc": "Detailed explanation"}},
    {{"title": "Core Benefit 3", "desc": "Detailed explanation"}}
  ],
  "products": [
    {{"name": "Pro Product 1", "price": "99€", "desc": "High-end product description", "image": "unsplash_url_matching_industry"}},
    {{"name": "Pro Product 2", "price": "149€", "desc": "Description", "image": "unsplash_url"}},
    {{"name": "Pro Product 3", "price": "199€", "desc": "Description", "image": "unsplash_url"}},
    {{"name": "Pro Product 4", "price": "299€", "desc": "Description", "image": "unsplash_url"}}
  ],
  "testimonials": [
    {{"name": "Jean Dupont", "role": "CEO of TechCorp", "quote": "Incredible partnership and results."}},
    {{"name": "Marie Curie", "role": "Founder", "quote": "The most professional solution I've used."}}
  ],
  "theme": {{ "primary": "#hex", "secondary": "#hex", "fontFamily": "Inter" | "Montserrat" | "Poppins" }},
  "seo": {{ "title": "Optimized Page Title", "description": "Compelling meta description" }}
}}
"""

    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 1500, "temperature": 0.2}
    }

    try:
        print(f" [AI-PRO] Generating exhaustive content for {company_name}...")
        response = requests.post(API_URL, headers=headers, json=payload, timeout=50)
        
        if response.status_code == 200:
            result = response.json()
            content = result[0].get('generated_text', '') if isinstance(result, list) else result.get('generated_text', '')
            
            # Use sophisticated JSON extraction
            import re
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                return json.loads(match.group())
        else:
            print(f" [AI-PRO] Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f" [AI-PRO] Request failed: {e}")

    return get_fallback_content(company_name, description, industry)

def get_fallback_content(company_name, description, industry):
    comp = company_name or "Entreprise"
    return {
        "heroText": f"L'Excellence avec {comp}",
        "heroSubtext": f"Solutions innovantes en {industry} pour transformer votre futur.",
        "aboutText": description or f"Leader certifié en {industry}.",
        "layout": {"heroType": "centered", "featureLayout": "grid", "style": "premium", "borderRadius": "3xl"},
        "features": [{"title": "Expertise", "desc": "Reconnue mondialement."}],
        "products": [],
        "testimonials": [],
        "theme": {"primary": "#2B3970", "secondary": "#FF6B2C", "fontFamily": "Inter"},
        "seo": {"title": f"{comp} | Officiel", "description": "Site professionnel."}
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
