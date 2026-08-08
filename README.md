# DataMind AI — Conversational Database Intelligence Platform

DataMind AI is an enterprise-grade, production-ready conversational database intelligence platform designed for natural language data interaction. Built for high-performance database exploration, the platform translates plain-English questions into real-time executable SQL, dynamic charts, ER flowcharts, automated statistical summaries, and executive business insights.

---

## Primary Vision and Design Principles

DataMind AI enables technical and non-technical stakeholders to explore complex relational databases without manual SQL syntax writing. Combining design patterns inspired by ChatGPT, Perplexity, Vercel, Linear, and Stripe, the application offers:

- Live AI Conversational Querying with step-by-step thinking telemetry
- Interactive Data Visualizations (Recharts: Area, Bar, Line, Pie, Donut, Scatter, Horizontal Bar)
- Dynamic Mermaid Diagrams (ER Diagrams, Flowcharts, Decision Trees)
- Comprehensive 8-Page Analytics Dashboard Console
- Database Schema Browser and SQL Execution Telemetry
- Olist Slate Navy & Warm Amber Gold (#F2B84B) Enterprise Dark Theme

---

## Dataset: Olist Brazilian E-Commerce Public Dataset

DataMind AI comes integrated with the official Olist Brazilian E-Commerce Public Dataset, comprising 100,000+ real e-commerce transactions across Brazil from 2016 to 2018.

### Primary Dataset Tables and Schema

1. olist_orders_dataset: 99,441 order records containing order IDs, customer IDs, order status (delivered, shipped, canceled, invoiced, processing, unavailable, created, approved), purchase timestamps, approval times, and delivery estimates.
2. olist_order_payments_dataset: 103,886 payment records detailing transaction values, payment types (credit card, boleto, voucher, debit card), and installment counts.
3. olist_order_items_dataset: 112,650 order item entries mapping products to sellers, price, freight value, and shipping limits.
4. olist_products_dataset: 32,951 unique product SKUs spanning 74 product categories with physical dimensions and weights.
5. olist_customers_dataset: 99,441 unique buyer profiles categorized by customer city, zip code prefix, and state across all 27 Brazilian states.
6. olist_sellers_dataset: 3,095 seller accounts with location and catalog metrics.
7. olist_order_reviews_dataset: 99,224 customer reviews with rating scores (1 to 5 stars), titles, and comments.
8. product_category_name_translation: Portuguese-to-English translation mappings for product category analysis.

---

## Technical Stack

### Frontend Core
- React 19.2
- Vite 8.1
- TypeScript 5.8 (Strict Mode)

### Routing and SSR
- TanStack Router
- TanStack Start

### State Management and Data Fetching
- Zustand 5.0
- TanStack React Query v5

### UI, Styling, and Iconography
- TailwindCSS v4
- shadcn/ui and Radix UI Primitives
- Framer Motion 12.4
- Lucide React Icons

### Visualizations and Rendering
- Recharts 2.15
- Mermaid.js 11.16
- React Markdown 10.1 with Remark GFM and KaTeX Math

### Backend API Infrastructure
- Python FastAPI
- SQLite / SQLAlchemy / Pandas
- Ollama / Groq Llama 3 AI Provider Support

---

## Platform Features

### 1. Conversational AI Chat Interface
- Natural Language to SQL Engine: Generates valid ANSI SQL queries from natural language user inputs.
- 7-Step Animated Process Telemetry:
  1. Understanding Question
  2. Reading Database Schema
  3. Generating SQL
  4. Executing Query
  5. Analyzing Data
  6. Creating Visualization
  7. Generating Insights
- Rich Message Cards: Displays formatted markdown text, executable SQL code blocks with copy/download options, tabular result sets, responsive charts, and business recommendations.
- Voice Recognition: Integrated Speech-to-Text for hands-free database querying.
- Side Telemetry Panel: Monitors active database instance, detected tables, token consumption, and query latency.

### 2. Embedded 8-Page Analytics Dashboard Console
Access pre-aggregated analytical insights across 99,441 orders via the Analytics Console:

- Overview Dashboard: Key performance indicators (Total Orders, Gross Revenue, Customer Count, AOV, Delivery Rate, Active Sellers, Average Rating), 18-month revenue trend, order volume bar, status distribution pie, and AI insights.
- Orders Dashboard: Horizontal status breakdown, status share donut chart, monthly volume trends, delivery timeline metrics, and top 5 highest value orders.
- Revenue Dashboard: Revenue by payment method, payment distribution donut, detailed method comparison table, and revenue per order status.
- Products Dashboard: Top 15 categories by revenue/volume, top 10 products by revenue, top 10 products by order volume, and bottom 10 lowest sellers.
- Customers Dashboard: Top 15 states by order volume and revenue, top 10 customer spenders, customer distribution maps.
- Data Explorer: Comprehensive tabular data view with instant search, multi-column filters (Status, State), column sorting, pagination, and CSV Export.
- Exploratory Data Analysis (EDA): Box-plot metrics (Mean, Median, Standard Deviation, Q1, Q3, Min, Max, Outliers) for price, freight, payment value, review score, and delivery duration.
- Data Quality and Lineage: Quality score calculation (90.3/100), per-table missing cell metrics, duplicate row verification, known issue notifications, and source data lineage.

### 3. Schema Browser and SQL Workspace
- Schema exploration for SQLite, PostgreSQL, MySQL, and MongoDB.
- Interactive table inspection displaying column types, primary keys, foreign key constraints, and table relationships.
- Popular questions catalog organized by analytical domains (Revenue, Orders, Customers, Time-based, Comparisons).

---

## Project Structure

```
DataMind_AI/
├── src/
│   ├── components/
│   │   ├── dashboard/          # KPICard and analytics dashboard components
│   │   ├── layout/             # AppShell, Navbar, Sidebar with quick actions
│   │   └── ui/                 # Core UI component library
│   ├── lib/
│   │   ├── dashboard-data.ts   # Pre-aggregated Olist e-commerce dataset module
│   │   └── utils.ts            # Utility functions and class merging
│   ├── routes/
│   │   ├── __root.tsx          # Root layout route
│   │   ├── index.tsx           # AI Chat interface page
│   │   ├── database.tsx        # Schema Explorer page
│   │   ├── settings.tsx        # Settings and theme selection page
│   │   └── dashboard/          # 8 Analytics Dashboard route pages
│   │       ├── index.tsx       # Overview Dashboard
│   │       ├── orders.tsx      # Orders Analysis
│   │       ├── revenue.tsx     # Revenue Analysis
│   │       ├── products.tsx    # Products Analysis
│   │       ├── customers.tsx   # Customer Analysis
│   │       ├── explorer.tsx    # Data Explorer
│   │       ├── eda.tsx         # EDA Statistics
│   │       └── quality.tsx     # Data Quality & Lineage
│   ├── stores/
│   │   └── chat-store.ts       # State management for chat history and settings
│   ├── styles.css              # Global design tokens and theme variables
│   └── routeTree.gen.ts        # TanStack Router generated route definitions
├── vercel.json                 # Vercel deployment configuration
└── README.md
```

---

## Installation and Local Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Local Setup Steps

1. Clone the Repository:
   ```bash
   git clone https://github.com/Kishore-dev-21/DataMind_AI.git
   cd DataMind_AI
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Run Development Server:
   ```bash
   npm run dev
   ```
   Open http://localhost:8080 in your web browser.

4. Verify Production Build:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## Deployment

### Vercel Deployment
The repository includes a pre-configured vercel.json file for immediate deployment on Vercel:

1. Import Kishore-dev-21/DataMind_AI into your Vercel account.
2. Vercel automatically detects build configuration.
3. Click Deploy.

---

## License

This project is licensed under the MIT License.
