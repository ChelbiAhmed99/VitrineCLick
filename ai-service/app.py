import os
import uuid
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from logo_gen import generate_logo_hf
from content_gen import generate_site_content_pro
from dotenv import load_dotenv
import random
from concurrent.futures import ThreadPoolExecutor

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Ensure static directories exist
os.makedirs('static/generated', exist_ok=True)

@app.route('/')
def index():
    """Renders the main dashboard."""
    return render_template('index.html')

def generate_single_logo(prompt, color, style, simulate, seed):
    filename = f"{uuid.uuid4().hex}.png"
    filepath = os.path.join('static/generated', filename)
    generate_logo_hf(prompt, output_file=filepath, color=color, style=style, seed=seed, simulate=simulate)
    return f"/static/generated/{filename}"

@app.route('/generate', methods=['POST'])
def generate():
    """API endpoint to generate multiple logos."""
    data = request.json
    prompt = data.get('prompt')
    color = data.get('color')
    style = data.get('style')
    batch_size = int(data.get('batchSize', 1))
    simulate = data.get('simulate', False)
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    try:
        results = []
        # Use ThreadPoolExecutor for concurrent generation if batch_size > 1
        with ThreadPoolExecutor(max_workers=batch_size) as executor:
            futures = [executor.submit(generate_single_logo, prompt, color, style, simulate, random.randint(0, 1000000)) for _ in range(batch_size)]
            results = [f.result() for f in futures]
        
        return jsonify({
            "success": True,
            "imageUrls": results
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/static/generated/<filename>')
def serve_generated_image(filename):
    """Serves the generated logo images."""
    return send_from_directory('static/generated', filename)

@app.route('/generate-copy', methods=['POST'])
def generate_copy():
    """API endpoint to generate text copy for the site using AI."""
    data = request.json
    company_name = data.get('companyName', '')
    description = data.get('description', '')
    category = data.get('category', '')
    simulate = data.get('simulate', False)
    
    try:
        primary_color = data.get('primaryColor', '#2B3970')
        font = data.get('font', 'Inter')
        style = data.get('style', 'premium')
        address = data.get('address', '')
        phone = data.get('phone', '')
        email = data.get('email', '')
        
        content_json = generate_site_content_pro(company_name, description, category, primary_color, font, style, address, phone, email)
        return jsonify({
            "success": True,
            "content": content_json
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
