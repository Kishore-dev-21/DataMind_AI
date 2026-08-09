# DataMind AI

> **Conversational Database Intelligence Platform**  
> Ask questions in plain English and instantly get SQL, charts, and insights from the Olist Brazilian E-Commerce dataset.

---

## 🏗 Architecture

`
                        INTERNET
                           |
                           v
                 +--------------------+
                 |  Vercel Frontend   |
                 |  React + Vite + TS |
                 +--------------------+
                           |
                           | HTTPS REST API
                           |
                           v
                 +--------------------+
                 |   FastAPI Backend  |
                 |   Cloud Hosted     |
                 +--------------------+
                      |          |
                      |          |
                      v          v
                Gemini API     SQLite
                               Olist DB

> The Gemini API key is EXCLUSIVELY held by the backend server.
> It is NEVER exposed to the browser or frontend bundle.
`

---

## ✨ Features

- **Conversational AI** — Natural language → SQL via Google Gemini
- **Live Query Execution** — Queries run against the real Olist SQLite database
- **Automatic Chart Generation** — Bar, Line, Area, Pie, Scatter charts
- **SQL Transparency** — Every AI-generated query is shown to the user
- **Data Explorer** — Browse tables, columns, and schemas
- **Dashboard Pages** — Pre-built analytics for Orders, Revenue, Products, Customers
- **ER Diagrams** — Mermaid-powered schema visualizations
- **Business Insights** — AI-generated summaries alongside results
- **Backend Health Indicator** — Live "Connected / Offline" badge in the UI

---

## 🛠 Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Frontend    | React 19, TypeScript, Vite, TanStack Router |
| Styling     | Tailwind CSS, shadcn/ui, Framer Motion    |
| Charts      | Recharts                                  |
| Backend     | Python 3.11, FastAPI, Uvicorn             |
| AI          | Google Gemini API (server-side only)      |
| Database    | SQLite (Olist E-Commerce Dataset)         |
| Frontend Deploy | Vercel                               |
| Backend Deploy  | Render (or Railway / Fly.io)         |

---

## 📦 Dataset

**Olist Brazilian E-Commerce Public Dataset**

- 99,441 orders
- 100K+ payment records
- 32K+ products
- 96K+ customers
- 3,095 sellers
- Period: September 2016 – August 2018

---

## 📁 Project Structure

`
datamind-ai/
├── backend/                   # FastAPI application
│   ├── main.py               # App entry point + CORS + health
│   ├── requirements.txt      # Python dependencies
│   ├── render.yaml           # Render deployment config
│   ├── .env.example          # Template (no real secrets)
│   ├── app/
│   │   ├── api/ask.py        # POST /api/ask endpoint
│   │   ├── services/
│   │   │   ├── gemini_service.py    # Gemini API calls
│   │   │   └── database_agent.py   # AI pipeline
│   │   └── tools/
│   │       └── execute_query.py    # SQLite query runner
│   └── database/
│       └── ecommerce.db      # Olist SQLite database
│
├── src/                       # React frontend
│   ├── services/api.ts       # Centralized API client
│   ├── components/           # UI components
│   ├── routes/               # TanStack Router pages
│   └── stores/               # Zustand state
│
├── vercel.json               # Vercel SPA config
├── .env.example              # Frontend env template
└── README.md
`

---

## 🚀 Local Development

### 1. Backend Setup

`ash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in GEMINI_API_KEY
`

Edit ackend/.env:
`
GEMINI_API_KEY=your_actual_key_here
GEMINI_MODEL=gemini-3.5-flash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
`

`ash
# Start backend
uvicorn main:app --reload --port 8000
`

Backend available at: http://127.0.0.1:8000  
Swagger UI at: http://127.0.0.1:8000/docs

---

### 2. Frontend Setup

`ash
# From project root

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# .env.local already has: VITE_API_BASE_URL=http://127.0.0.1:8000

# Start dev server
npm run dev
`

Frontend available at: http://localhost:5173

---

## 🔑 Environment Variables

### Backend (ackend/.env)

| Variable          | Description                                    | Required |
|-------------------|------------------------------------------------|----------|
| GEMINI_API_KEY  | Your Google Gemini API key                     | ✅ Yes   |
| GEMINI_MODEL    | Gemini model (default: gemini-3.5-flash)     | Optional |
| ALLOWED_ORIGINS | Comma-separated list of allowed CORS origins   | Optional |

### Frontend (Vercel Environment Variables or .env.local)

| Variable            | Description                         | Required |
|---------------------|-------------------------------------|----------|
| VITE_API_BASE_URL | URL of the deployed FastAPI backend | ✅ Yes   |

> ⚠️ **NEVER** set GEMINI_API_KEY as a VITE_ variable — it will be exposed in the browser bundle.

---

## 📡 API Endpoints

### GET /
Returns API status.

### GET /health
Health check for deployment validation.
`json
{ "status": "healthy", "service": "DataMind AI Backend" }
`

### POST /api/ask
Ask a natural-language question about the database.

**Request:**
`json
{ "question": "Show the total payment value by payment type" }
`

**Success Response:**
`json
{
  "success": true,
  "answer": "The total payment value by type is...",
  "sql": "SELECT payment_type, SUM(payment_value) ...",
  "result": {
    "columns": ["payment_type", "total"],
    "data": [...],
    "row_count": 4
  },
  "chart": { "type": "bar", ... },
  "summary": { "method": "gemini", "total_time_ms": 1240 }
}
`

**Error Response:**
`json
{
  "success": false,
  "error": {
    "code": "AI_QUOTA_EXHAUSTED",
    "message": "AI request limit reached. Please wait a moment and try again."
  }
}
`

### GET /docs
Swagger UI (interactive API documentation).

### GET /api/schema
Returns the full database schema used by the AI agent.

---

## ☁️ Deployment

### Backend — Render

1. Push the repository to GitHub.
2. Go to [render.com](https://render.com) → New Web Service → Connect your repo.
3. Set **Root Directory** to ackend.
4. Render auto-detects ender.yaml and configures the service.
5. Add environment variables in the Render dashboard:
   - GEMINI_API_KEY = your key
   - GEMINI_MODEL = gemini-3.5-flash
   - ALLOWED_ORIGINS = https://YOUR-PROJECT.vercel.app
6. Deploy. Your backend URL will be: https://datamind-ai-backend.onrender.com

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
2. Framework Preset: **Other** (Vite).
3. Build Command: 
pm run build
4. Output Directory: .output/public
5. Add Environment Variable:
   - VITE_API_BASE_URL = https://datamind-ai-backend.onrender.com
6. Deploy.

**Important:** After getting both URLs, update ALLOWED_ORIGINS on Render to include your Vercel URL.

---

## 🔒 Security

- ✅ Gemini API key is server-side only — never in the browser
- ✅ .env is in .gitignore — never committed
- ✅ Only SELECT and WITH SQL queries are allowed — no destructive operations
- ✅ CORS is configured to only accept requests from trusted origins
- ✅ Production uses HTTPS for both frontend (Vercel) and backend (Render)
- ✅ No credentials appear in Swagger examples
- ✅ User input is validated before processing

---

## 📸 Screenshots

*Add screenshots here after deployment.*

---

## 🔗 Links

- **Frontend (Vercel):** https://YOUR-PROJECT.vercel.app
- **Backend (Render):** https://datamind-ai-backend.onrender.com
- **Swagger UI:** https://datamind-ai-backend.onrender.com/docs
- **Health Check:** https://datamind-ai-backend.onrender.com/health
- **GitHub:** https://github.com/Kishore-dev-21/DataMind_AI

---

## 📄 License

MIT
