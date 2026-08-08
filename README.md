# 🧠 DataMind AI — Conversational Database Intelligence Platform

> **AI Innovation Hackathon Showcase** — A production-ready, ChatGPT-like conversational intelligence platform that translates natural language into real-time SQL, interactive data visualizations, ER diagrams, and executive business insights across e-commerce databases.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Primary Goal & Design Vision

**DataMind AI** provides a seamless, natural-language interface for exploring complex SQL databases without writing a single line of SQL manually. 

Designed to combine the aesthetic excellence and UX paradigms of **ChatGPT**, **Perplexity**, **Vercel Dashboard**, **Linear**, and **Stripe**, DataMind AI presents database answers with:
- 💬 **Live AI Chat & Natural Language Queries**
- 📊 **Dynamic Interactive Recharts** (Area, Bar, Line, Pie, Donut, Scatter, Horizontal Bar)
- 📐 **Interactive Mermaid Diagrams** (ER Diagrams, Flowcharts, Decision Trees)
- 📋 **Integrated 8-Page Analytics Dashboard Console** (99,441 Olist e-commerce dataset)
- 🗄️ **Schema Browser & SQL Viewer** with live execution time & token telemetry
- 🎨 **Olist Slate & Warm Amber Gold (#F2B84B)** theme applied globally

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19, Vite 8, TypeScript 5.8 |
| **Routing & SSR** | TanStack Router, TanStack Start |
| **State & Data Fetching** | Zustand, TanStack React Query v5 |
| **Styling & UI** | TailwindCSS v4, shadcn/ui, Radix UI primitives, Lucide React Icons |
| **Animations** | Framer Motion 12 |
| **Visualizations** | Recharts, Mermaid.js |
| **Markdown Rendering** | React Markdown, Remark GFM, KaTeX math |
| **Backend API** | Python FastAPI, SQLite, Pandas, SQLAlechemy, Ollama / Groq |

---

## ✨ Key Features & Capabilities

### 1. 💬 Conversational AI Chat Interface
- **Natural Language to SQL**: Translates complex analytical questions into executable SQL.
- **7-Step Animated AI Thinking Process**:
  1. 🧠 *Understanding Question*
  2. 📖 *Reading Database Schema*
  3. ⚡ *Generating SQL*
  4. 🚀 *Executing Query*
  5. 📊 *Analyzing Data*
  6. 🎨 *Creating Visualization*
  7. 💡 *Generating Insights*
- **Rich Message Output**: Displays SQL code blocks with copy/download, raw data tables, interactive charts, and business summaries.
- **Voice Input Support**: Native Speech Recognition for voice-to-text querying.
- **Context Panel**: Real-time telemetry displaying token usage, SQL execution time, active database, and detected tables.

### 2. 📊 Embedded 8-Page Analytics Dashboard Console
Integrated directly from pre-aggregated e-commerce data (99,441 orders):
- 🏠 **Overview Dashboard**: High-level KPIs, 18-month revenue area chart, monthly order volume, status pie chart, key insights.
- 🛒 **Orders Dashboard**: Horizontal status breakdown, status share donut, delivery performance metrics, top 5 expensive orders.
- 💵 **Revenue Dashboard**: Revenue by payment method, payment distribution donut, breakdown table, revenue by status.
- 📦 **Products Dashboard**: Top 15 categories toggleable bar chart, top 10 products by revenue & volume, bottom 10 lowest sellers.
- 👥 **Customers Dashboard**: Top 15 state order/revenue distribution bar chart, top customer spenders.
- 🔍 **Data Explorer**: Interactive filterable & sortable data table with instant search, status/state filters, pagination, and **CSV export**.
- 🧪 **Statistics (EDA)**: Statistical summaries (Mean, Median, Std Dev, Q1/Q3, Outlier counts) for numerical attributes.
- 🛡️ **Data Quality**: 90.3 overall quality score ring, table-level missing value stats, known issue alerts, and data lineage documentation.

### 3. 🗄️ Database & Schema Explorer
- Multi-database support preview (SQLite, PostgreSQL, MySQL, MongoDB).
- Expandable schema viewer displaying tables, column data types, primary/foreign keys, and table relationships.
- Popular questions catalog with 1-click execution.

### 4. 🎨 Design Aesthetics & Micro-Animations
- Custom **Olist Slate Navy (`#0D1117`) & Warm Amber Gold (`#F2B84B`)** dark theme.
- Glassmorphism overlays (`backdrop-blur`).
- Animated cards, smooth page routing transitions, hover micro-interactions, and custom scrollbars.

---

## 📂 Project Structure

```
dataagent-main/
├── src/
│   ├── components/
│   │   ├── dashboard/          # KPICard and dashboard sub-components
│   │   ├── layout/             # AppShell, Navbar, Sidebar (with quick actions)
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── dashboard-data.ts   # Pre-aggregated Olist e-commerce dataset module
│   │   └── utils.ts            # Class merging & utility functions
│   ├── routes/
│   │   ├── __root.tsx          # TanStack Router root component
│   │   ├── index.tsx           # Home AI Chat page
│   │   ├── database.tsx        # Schema Explorer page
│   │   ├── settings.tsx        # User settings & theme configuration page
│   │   └── dashboard/          # Analytics Dashboard routes
│   │       ├── index.tsx       # Overview Dashboard
│   │       ├── orders.tsx      # Orders Analysis
│   │       ├── revenue.tsx     # Revenue & Payment Analysis
│   │       ├── products.tsx     # Products & Category Analysis
│   │       ├── customers.tsx    # Customer Analysis & State Breakdown
│   │       ├── explorer.tsx     # Data Explorer & CSV Export
│   │       ├── eda.tsx          # Exploratory Data Analysis (Statistics)
│   │       └── quality.tsx      # Data Quality & Lineage Report
│   ├── stores/
│   │   └── chat-store.ts       # Zustand store for chat history, settings, and themes
│   ├── styles.css              # Global Tailwind CSS v4 design tokens & theme variables
│   └── routeTree.gen.ts        # TanStack Router auto-generated route tree
├── vercel.json                 # Vercel single-page & SSR deployment configuration
└── README.md
```

---

## ⚡ Quick Start / Local Development

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation & Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Kishore-dev-21/DataMind_AI.git
   cd DataMind_AI
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` in your browser.

4. **Verify TypeScript Build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 🚀 Cloud Deployment

### Deploy on Vercel (1-Click Setup)
The repository includes a pre-configured `vercel.json` file ready for Vercel deployment:

1. Import repository `Kishore-dev-21/DataMind_AI` into **[Vercel](https://vercel.com)**.
2. Vercel will automatically detect `vercel.json`.
3. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
