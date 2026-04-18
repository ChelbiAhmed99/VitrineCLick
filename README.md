# VitrineClick: Professional AI Website Builder

VitrineClick is a high-end, AI-driven SaaS platform designed to transform user prompts into professional, fully-functional websites in seconds. Inspired by leading platforms like YouCan, it features a premium design system, context-aware content generation, and a real-time interactive wizard.

## 🚀 Key Features

- **AI-Driven Personalization:** Generates contextually relevant text, product catalogs, and themes using the Hugging Face Inference API.
- **Interactive Live Preview:** Watch your website being built in real-time with our sophisticated frontend wizard.
- **Professional Theme System:** Automatically selects color palettes and typography based on the industry sector.
- **SEO Optimized:** Every site comes with AI-generated Meta Titles and Descriptions for search visibility.
- **Dynamic Site Viewer:** A premium standalone component that renders generated sites with sleek animations and responsive layouts.

## 🛠️ Technology Stack

- **Frontend:** Angular 21, TailwindCSS.
- **Backend:** Spring Boot (Java 21), Spring Data JPA, H2/MySQL.
- **AI Service:** Flask (Python 3.10+), Hugging Face Inference API (Qwen2.5-72B).

---

## 💻 Running Locally (Windows Environment)

Follow these steps to set up and run VitrineClick on your Windows machine.

### Prerequisites

- **Java**: Install [JDK 21+](https://www.oracle.com/java/technologies/downloads/).
- **Node.js**: Install [Node 20+](https://nodejs.org/).
- **Python**: Install [Python 3.10+](https://www.python.org/downloads/windows/).
- **Git**: [Git for Windows](https://git-scm.com/download/win).

### Step 1: Clone the Repository
```bash
git clone git@github.com:ChelbiAhmed99/VitrineCLick.git
cd VitrineClick
```

### Step 2: Configure AI Service
Navigate to the `ai-service` folder.
1. Create a `.env` file and add your Hugging Face API Token:
   ```env
   HF_TOKEN=your_token_here
   ```
2. Install dependencies:
   ```powershell
   cd ai-service
   pip install flask flask-cors requests python-dotenv
   ```
3. Start the service:
   ```powershell
   python content_gen.py
   ```
   *The service runs on Port 5000.*

### Step 3: Start the Backend
Navigate to the `backend` folder.
1. Clean and build the project:
   ```powershell
   cd backend
   .\gradlew clean build
   ```
2. Run the application:
   ```powershell
   .\gradlew bootRun
   ```
   *The API runs on Port 8080.*

### Step 4: Launch the Frontend
Navigate to the `frontend` folder.
1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Start the development server:
   ```powershell
   npm start
   ```
   *Access the Studio at `http://localhost:4200`.*

---

## 🏗️ Architecture Note

VitrineClick uses an **Orchestration Pattern** where the Backend coordinates with the AI Service to generate content based on the user's prompt, which is then stored and served dynamically to the Angular Site Viewer.
