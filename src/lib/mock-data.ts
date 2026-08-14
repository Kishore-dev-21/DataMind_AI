/**
 * mock-data.ts — Updated for Olist ecommerce database
 * - Removed catalog_docs (MongoDB/error DB)
 * - Updated prompts to match actual working queries
 * - Removed fake databases, kept only ecommerce SQLite
 */
import type { DatabaseInfo } from "@/types";

export const DATABASES: DatabaseInfo[] = [
  {
    id: "ecommerce-sqlite",
    name: "ecommerce",
    engine: "SQLite",
    host: "local file",
    size: "106.5 MB",
    latencyMs: 3,
    status: "connected",
    tables: [
      {
        name: "customers",
        description: "99,441 customers with location and unique IDs.",
        rows: 99441,
        columns: [
          { name: "customer_id", type: "TEXT", primaryKey: true },
          { name: "customer_unique_id", type: "TEXT" },
          { name: "customer_zip_code_prefix", type: "TEXT" },
          { name: "customer_city", type: "TEXT" },
          { name: "customer_state", type: "TEXT" },
        ],
      },
      {
        name: "orders",
        description: "99,441 orders with status and timestamps.",
        rows: 99441,
        columns: [
          { name: "order_id", type: "TEXT", primaryKey: true },
          { name: "customer_id", type: "TEXT", foreignKey: "customers.customer_id" },
          { name: "order_status", type: "TEXT" },
          { name: "order_purchase_timestamp", type: "TEXT" },
          { name: "order_delivered_customer_date", type: "TEXT" },
        ],
      },
      {
        name: "order_items",
        description: "112,650 order line items with prices.",
        rows: 112650,
        columns: [
          { name: "order_id", type: "TEXT", foreignKey: "orders.order_id" },
          { name: "product_id", type: "TEXT", foreignKey: "products.product_id" },
          { name: "seller_id", type: "TEXT", foreignKey: "sellers.seller_id" },
          { name: "price", type: "REAL" },
          { name: "freight_value", type: "REAL" },
        ],
      },
      {
        name: "payments",
        description: "103,886 payment records with type and value.",
        rows: 103886,
        columns: [
          { name: "order_id", type: "TEXT", foreignKey: "orders.order_id" },
          { name: "payment_sequential", type: "INTEGER" },
          { name: "payment_type", type: "TEXT" },
          { name: "payment_installments", type: "INTEGER" },
          { name: "payment_value", type: "REAL" },
        ],
      },
      {
        name: "products",
        description: "32,951 products with categories and dimensions.",
        rows: 32951,
        columns: [
          { name: "product_id", type: "TEXT", primaryKey: true },
          { name: "product_category_name", type: "TEXT", foreignKey: "category_translation.product_category_name" },
          { name: "product_weight_g", type: "REAL" },
          { name: "product_length_cm", type: "REAL" },
        ],
      },
      {
        name: "sellers",
        description: "3,095 sellers with location info.",
        rows: 3095,
        columns: [
          { name: "seller_id", type: "TEXT", primaryKey: true },
          { name: "seller_zip_code_prefix", type: "TEXT" },
          { name: "seller_city", type: "TEXT" },
          { name: "seller_state", type: "TEXT" },
        ],
      },
      {
        name: "reviews",
        description: "99,224 customer review scores and comments.",
        rows: 99224,
        columns: [
          { name: "review_id", type: "TEXT", primaryKey: true },
          { name: "order_id", type: "TEXT", foreignKey: "orders.order_id" },
          { name: "review_score", type: "INTEGER" },
          { name: "review_comment_title", type: "TEXT" },
          { name: "review_comment_message", type: "TEXT" },
        ],
      },
      {
        name: "category_translation",
        description: "71 category name translations (Portuguese → English).",
        rows: 71,
        columns: [
          { name: "product_category_name", type: "TEXT", primaryKey: true },
          { name: "product_category_name_english", type: "TEXT" },
        ],
      },
    ],
  },
];

export const EXAMPLE_PROMPTS = [
  "Show top 10 products by revenue",
  "Show the monthly revenue trend as a line chart",
  "Show total payment value by payment type",
  "Show the top 10 customers by total payment value",
  "Show the number of orders by order status",
  "Draw ER diagram",
  "Explain database schema",
  "Compare delivered and cancelled orders",
];

export const QUICK_ACTIONS = [
  { label: "Sales Analysis", prompt: "Show the monthly revenue trend as a line chart", icon: "TrendingUp" },
  { label: "Customer Insights", prompt: "Show the top 10 customers by total payment value", icon: "Users" },
  { label: "Inventory", prompt: "Show the top 10 products by total sales value", icon: "Boxes" },
  { label: "Orders", prompt: "Show the number of orders by order status", icon: "ShoppingCart" },
  { label: "Products", prompt: "Show top 10 products by revenue", icon: "Package" },
  { label: "Revenue", prompt: "Show total payment value by payment type", icon: "DollarSign" },
  { label: "Database Schema", prompt: "Explain database schema", icon: "Database" },
  { label: "Charts", prompt: "Show a bar chart of payment value by payment method", icon: "BarChart3" },
] as const;

export interface PopularCategory {
  label: string;
  icon: string;
  questions: string[];
}

export const POPULAR_QUESTIONS: PopularCategory[] = [
  {
    label: "Revenue & Payments",
    icon: "DollarSign",
    questions: [
      "Show the total payment value by payment type",
      "Show a bar chart of payment value by payment method",
      "Show the number of payments for each payment type",
      "Show the average payment value by payment method",
      "Show the highest payment value by payment method",
      "Show the distribution of payment values",
    ],
  },
  {
    label: "Order Analysis",
    icon: "ShoppingCart",
    questions: [
      "Show the number of orders by order status",
      "Create a bar chart showing delivered, cancelled, and pending orders",
      "Show the percentage of orders by order status",
      "Show the number of orders for each product category",
      "Show the top 10 products by number of orders",
      "Show the top 10 products by total sales value",
    ],
  },
  {
    label: "Customer Analysis",
    icon: "Users",
    questions: [
      "Show the number of orders by customer",
      "Show the top 10 customers by total payment value",
      "Show the average order value by customer",
      "Show the number of unique customers by order status",
    ],
  },
  {
    label: "Time-Based Charts",
    icon: "TrendingUp",
    questions: [
      "Show the number of orders by month",
      "Show total payment value by month",
      "Show average payment value by month",
      "Show the monthly order trend",
      "Show the monthly revenue trend as a line chart",
      "Show the number of delivered orders by month",
      "Show cancelled orders by month",
    ],
  },
  {
    label: "Top / Bottom Analysis",
    icon: "BarChart3",
    questions: [
      "Show the top 10 products by revenue",
      "Show the top 10 products by number of orders",
      "Show the bottom 10 products by revenue",
      "Show the top 10 customers by payment value",
      "Show the top 5 payment methods by total payment value",
    ],
  },
  {
    label: "Comparisons",
    icon: "GitCompare",
    questions: [
      "Compare delivered and cancelled orders",
      "Compare average payment values across payment methods",
      "Compare order counts across product categories",
      "Compare total revenue between different order statuses",
      "Compare the top 5 products by revenue",
    ],
  },
];

// Flat list used in sidebar quick-pick
export const FAVORITE_QUERIES = POPULAR_QUESTIONS.flatMap((c) => c.questions).slice(0, 8);
