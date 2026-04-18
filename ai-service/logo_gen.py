import os
import argparse
import requests
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration for Hugging Face
HF_TOKEN = os.getenv("HF_TOKEN")
# Using FLUX.1-schnell for high-speed, high-quality results
API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"
headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

def generate_logo_hf(prompt, output_file="logo.png", color=None, style=None, seed=None, simulate=False, retries=2):
    """
    Generates a logo image using Hugging Face Inference API.
    """
    if simulate:
        print(" [SIMULATION]. Entering Simulation Mode...")
        return simulate_generation(prompt, output_file, seed)

    print(f" Generating for: '{prompt}'...")
    if color: print(f" Preferred Color: {color}")
    if style: print(f" Preferred Style: {style}")
    
    # Enhanced prompt with customization
    custom_details = []
    if color: custom_details.append(f"primary color: {color}")
    if style: custom_details.append(f"typography style: {style}")
    
    details_str = ", ".join(custom_details)
    enhanced_prompt = f"professional minimalist logo, {prompt}, {details_str}, clean vectors, white background, high-quality design, 4k"
    
    payload = {
        "inputs": enhanced_prompt,
        "parameters": {
            "negative_prompt": "ugly, blurry, low quality, photo, realistic, complex, busy, background text",
            "seed": seed if seed is not None else int(time.time())
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=40)
        
        # Check if the model is still loading
        if response.status_code == 503:
            if retries > 0:
                print(f" Model is loading on Hugging Face... waiting 10s and retrying... ({retries} left)")
                time.sleep(10)
                return generate_logo_hf(prompt, output_file, color, style, seed, simulate, retries - 1)
            else:
                print(" Hugging Face 503 Timeout exceeded.")
                return simulate_generation(prompt, output_file, seed)
            
        if response.status_code != 200:
            print(f" Hugging Face Error ({response.status_code}): {response.text}")
            if response.status_code == 401:
                print(" Note: Please add a valid HF_TOKEN to your .env file for higher rate limits.")
            return

        # Save the image
        with open(output_file, 'wb') as f:
            f.write(response.content)
        print(f" Logo saved successfully as '{output_file}'!")

    except Exception as e:
        print(f" Error during generation: {e}")

def simulate_generation(prompt, output_file, seed=None):
    print(f" Simulating generation strictly locally for: '{prompt}'...")
    import base64
    png_1x1 = b"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    with open(output_file, 'wb') as h:
        h.write(base64.b64decode(png_1x1))
    print(f" Simulation complete! Logo saved as '{output_file}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hugging Face Logo Generator (Stable Diffusion)")
    parser.add_argument("prompt", type=str, help="Text prompt for the logo")
    parser.add_argument("-o", "--output", type=str, default="logo.png", help="Output filename")
    parser.add_argument("-c", "--color", type=str, help="Primary color or palette (e.g., 'royal blue', 'gold and black')")
    parser.add_argument("-s", "--style", type=str, help="Writing/Typography style (e.g., 'modern sans-serif', 'elegant script', 'retro')")
    parser.add_argument("--seed", type=int, help="Seed for generation")
    parser.add_argument("--simulate", action="store_true", help="Run in simulation mode")
    
    args = parser.parse_args()
    
    generate_logo_hf(args.prompt, args.output, color=args.color, style=args.style, seed=args.seed, simulate=args.simulate)
