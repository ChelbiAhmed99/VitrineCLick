# VitrineClick: Professional AI Website Builder

VitrineClick is a high-end, AI-driven SaaS platform designed to transform user prompts into professional, fully-functional websites in seconds. Inspired by leading platforms like YouCan, it features a premium design system, context-aware content generation, and a real-time interactive wizard.

##  Key Features

- **Multi-Page AI Synthesis:** Automatically generates Home, About, and Contact pages with cohesive brand storytelling.
- **Enterprise-Grade AI:** Powered by **Qwen2.5-Coder-32B** (Hugging Face) for superior logic and complex JSON structures.
- **E-commerce Ready:** Integrated shopping cart system with real-time subtotal calculation and premium slide-over UI.
- **Interactive Live Customizer:** Tweak brand colors and hero layouts (Bento vs Standard) instantly without re-generation.
- **SEO Optimized:** Automated generation of Meta Titles, Descriptions, and semantic HTML5 structures.
- **Advanced Layouts:** Supports modern "Bento Grid" designs and sophisticated glassmorphism effects.

##  Technology Stack

- **Frontend:** Angular 21, TailwindCSS.
- **Backend:** Spring Boot (Java 21), Spring Data JPA, PostgreSQL.
- **AI Service:** Flask (Python 3.10+), Hugging Face Inference API.

---

## 💻 Running Locally

Follow these steps to set up and run VitrineClick on your machine.

### Prerequisites

- **Java**: Install [JDK 21+](https://www.oracle.com/java/technologies/downloads/).
- **Node.js**: Install [Node 20+](https://nodejs.org/).
- **Python**: Install [Python 3.10+](https://www.python.org/downloads/).
- **Docker**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine (required for PostgreSQL).
- **Git**: [Git SCM](https://git-scm.com/downloads).

### Step 1: Clone the Repository
```bash
git clone git@github.com:ChelbiAhmed99/VitrineCLick.git
cd VitrineClick
```

### Step 2: Start the Database
VitrineClick now uses PostgreSQL. You can start it easily using Docker:
```bash
docker-compose up -d
```

### Step 3: Configure AI Service
Navigate to the `ai-service` folder.
1. Create a `.env` file and add your Hugging Face API Token:
   ```env
   HF_TOKEN=your_token_here
   ```
2. Install dependencies (recommended to use a virtual environment):
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Start the service:
   ```bash
   python content_gen.py
   ```
   *The service runs on Port 5000.*

### Step 4: Start the Backend
Navigate to the `backend` folder.
1. Clean and build the project:
   ```bash
   cd backend
   ./gradlew clean build  # On Windows use `.\gradlew.bat`
   ```
2. Run the application:
   ```bash
   ./gradlew bootRun
   ```
   *The API runs on Port 8080.*

### Step 5: Launch the Frontend
Navigate to the `frontend` folder.
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   *Access the Studio at `http://localhost:4200`.*

---

##  Architecture Note

VitrineClick uses an **Orchestration Pattern** where the Backend coordinates with the AI Service to generate content based on the user's prompt, which is then stored and served dynamically to the Angular Site Viewer.
