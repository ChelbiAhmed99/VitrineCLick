# AI Logo Generator

A simple Python tool to generate professional logos using AI (DALL-E 3).

## Features
- Generate high-quality, professional logos from text prompts.
- Customizable output filenames.
- Easy-to-use CLI interface.

## Quick Start

### 1. Prerequisites
Ensure you have Python 3.8+ installed.

### 2. Setup Environment
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install openai requests python-dotenv flask
```

### 3. Configuration
1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Hugging Face Access Token:
   ```text
   HF_TOKEN=your_actual_token_here
   ```

### 4. Run the Web Interface
For the best experience, use the interactive web dashboard:
```bash
python3 app.py
```
```
