"""
SQL Templates — DataMind AI

Covers all questions from the list without requiring Gemini.
Priority order matters: more specific rules come BEFORE general ones.
"""

def match_template(question: str, intent: dict) -> str | None:
    q = question.lower()
    limit = intent.get("modifiers", {}).get("limit") or 10

    # ─────────────────────────────────────────────────────
    # PAYMENT / REVENUE QUERIES
    # ─────────────────────────────────────────────────────

    # "show the distribution of payment values" — histogram buckets
    if "distribution" in q and "payment" in q:
        return """
SELECT
    CASE
        WHEN payment_value < 50   THEN '< 50'
        WHEN payment_value < 100  THEN '50 - 100'
        WHEN payment_value < 200  THEN '100 - 200'
        WHEN payment_value < 500  THEN '200 - 500'
        WHEN payment_value < 1000 THEN '500 - 1000'
        ELSE '1000+'
    END AS payment_range,
    COUNT(*) AS count
FROM payments
GROUP BY payment_range
ORDER BY MIN(payment_value)
""".strip()

    # "highest payment value by payment method"
    if ("highest" in q or "maximum" in q or "max" in q) and "payment" in q and ("method" in q or "type" in q):
        return """
SELECT payment_type, ROUND(MAX(payment_value), 2) AS highest_payment_value
FROM payments
GROUP BY payment_type
ORDER BY highest_payment_value DESC
""".strip()

    # "highest payment value" (single row)
    if ("highest" in q or "maximum" in q or "max" in q) and "payment" in q:
        return "SELECT order_id, payment_type, ROUND(payment_value, 2) AS payment_value FROM payments ORDER BY payment_value DESC LIMIT 1"

    # "average payment value by payment method / payment type"
    if ("average" in q or "avg" in q or "mean" in q) and "payment" in q and ("method" in q or "type" in q or "by" in q):
        return """
SELECT payment_type, ROUND(AVG(payment_value), 2) AS average_payment_value
FROM payments
GROUP BY payment_type
ORDER BY average_payment_value DESC
""".strip()

    # "average payment value" — overall scalar
    if ("average" in q or "avg" in q or "mean" in q) and "payment" in q:
        return "SELECT ROUND(AVG(payment_value), 2) AS average_payment_value FROM payments"

    # "number of payments for each payment type" / "count of payments by type"
    if ("number of" in q or "count" in q or "how many" in q) and "payment" in q and ("type" in q or "method" in q or "each" in q):
        return """
SELECT payment_type, COUNT(*) AS number_of_payments
FROM payments
GROUP BY payment_type
ORDER BY number_of_payments DESC
""".strip()

    # "top 5 payment methods by total payment value"
    if ("top" in q) and "payment" in q and ("method" in q or "type" in q) and ("value" in q or "revenue" in q or "total" in q):
        return """
SELECT payment_type, ROUND(SUM(payment_value), 2) AS total_payment_value
FROM payments
GROUP BY payment_type
ORDER BY total_payment_value DESC
LIMIT 5
""".strip()

    # "total payment value by payment type" / "payment value by payment method"
    if "payment" in q and ("method" in q or "type" in q):
        return """
SELECT payment_type,
       COUNT(*) AS number_of_payments,
       ROUND(SUM(payment_value), 2) AS total_payment_value,
       ROUND(AVG(payment_value), 2) AS average_payment_value
FROM payments
GROUP BY payment_type
ORDER BY total_payment_value DESC
""".strip()

    # "total payment value" — overall scalar (guard: not customer/top/seller/product queries)
    if (("total" in q or "sum" in q or "overall" in q) and ("payment" in q or "revenue" in q)
            and "month" not in q and "status" not in q and "category" not in q
            and "customer" not in q and "top" not in q and "seller" not in q and "product" not in q):
        return "SELECT ROUND(SUM(payment_value), 2) AS total_payment_value FROM payments"

    # ─────────────────────────────────────────────────────
    # TIME-BASED / MONTHLY QUERIES
    # ─────────────────────────────────────────────────────

    # "cancelled orders by month"
    if ("cancelled" in q or "canceled" in q) and "month" in q and "order" in q:
        return """
SELECT strftime('%Y-%m', o.order_purchase_timestamp) AS month,
       COUNT(*) AS cancelled_orders
FROM orders o
WHERE o.order_status = 'canceled'
GROUP BY month
ORDER BY month
""".strip()

    # "delivered orders by month"
    if "delivered" in q and "month" in q and "order" in q:
        return """
SELECT strftime('%Y-%m', o.order_purchase_timestamp) AS month,
       COUNT(*) AS delivered_orders
FROM orders o
WHERE o.order_status = 'delivered'
GROUP BY month
ORDER BY month
""".strip()

    # "average payment value by month"
    if ("average" in q or "avg" in q) and ("payment" in q or "revenue" in q) and "month" in q:
        return """
SELECT strftime('%Y-%m', o.order_purchase_timestamp) AS month,
       ROUND(AVG(p.payment_value), 2) AS average_payment_value
FROM orders o
JOIN payments p ON o.order_id = p.order_id
GROUP BY month
ORDER BY month
""".strip()

    # "total payment value by month" / "monthly revenue" / "monthly revenue trend"
    if ("month" in q or "monthly" in q) and ("revenue" in q or "payment" in q or "sales" in q or "trend" in q):
        return """
SELECT strftime('%Y-%m', o.order_purchase_timestamp) AS month,
       ROUND(SUM(p.payment_value), 2) AS total_revenue,
       COUNT(DISTINCT o.order_id) AS total_orders
FROM orders o
JOIN payments p ON o.order_id = p.order_id
GROUP BY month
ORDER BY month
""".strip()

    # "number of orders by month" / "monthly order trend"
    if ("month" in q or "monthly" in q) and "order" in q:
        return """
SELECT strftime('%Y-%m', order_purchase_timestamp) AS month,
       COUNT(*) AS order_count
FROM orders
GROUP BY month
ORDER BY month
""".strip()

    # "yearly revenue"
    if ("yearly" in q or "annual" in q or "year" in q) and ("revenue" in q or "sales" in q):
        return """
SELECT strftime('%Y', o.order_purchase_timestamp) AS year,
       ROUND(SUM(p.payment_value), 2) AS total_revenue
FROM orders o
JOIN payments p ON o.order_id = p.order_id
GROUP BY year
ORDER BY year
""".strip()

    # ─────────────────────────────────────────────────────
    # ORDER QUERIES
    # ─────────────────────────────────────────────────────

    # "percentage of orders by order status"
    if ("percentage" in q or "proportion" in q or "share" in q or "percent" in q) and "order" in q and "status" in q:
        return """
SELECT order_status,
       COUNT(*) AS count,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM orders
GROUP BY order_status
ORDER BY count DESC
""".strip()

    # "compare delivered and cancelled orders" / "delivered, cancelled, and pending orders"
    if ("delivered" in q or "cancelled" in q or "canceled" in q or "pending" in q or "status" in q) and "order" in q and ("compare" in q or "status" in q or "chart" in q or "showing" in q):
        return """
SELECT order_status,
       COUNT(*) AS order_count,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM orders
GROUP BY order_status
ORDER BY order_count DESC
""".strip()

    # "delivered orders" count
    if "delivered" in q and "order" in q and "month" not in q:
        return "SELECT COUNT(*) AS delivered_orders FROM orders WHERE order_status = 'delivered'"

    # "cancelled orders" count
    if ("cancelled" in q or "canceled" in q) and "order" in q and "month" not in q:
        return "SELECT COUNT(*) AS cancelled_orders FROM orders WHERE order_status = 'canceled'"

    # "number of orders by order status" / "orders by status"
    if "order" in q and "status" in q:
        return """
SELECT order_status,
       COUNT(*) AS order_count,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM orders
GROUP BY order_status
ORDER BY order_count DESC
""".strip()

    # "most expensive orders"
    if "expensive" in q and "order" in q:
        return f"""
SELECT o.order_id,
       o.order_status,
       ROUND(SUM(oi.price + oi.freight_value), 2) AS total_value
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id
ORDER BY total_value DESC
LIMIT {limit}
""".strip()

    # "revenue by order status" / "compare total revenue between different order statuses"
    if ("revenue" in q or "payment" in q) and "status" in q and "order" in q:
        return """
SELECT o.order_status,
       COUNT(DISTINCT o.order_id) AS orders,
       ROUND(SUM(p.payment_value), 2) AS total_revenue
FROM orders o
JOIN payments p ON o.order_id = p.order_id
GROUP BY o.order_status
ORDER BY total_revenue DESC
""".strip()

    # "how many orders" / "total orders" — simple count
    if ("how many" in q or "number of" in q or "count" in q or "total" in q) and "order" in q and "value" not in q and "status" not in q and "category" not in q and "product" not in q and "customer" not in q and "month" not in q:
        return "SELECT COUNT(*) AS total_orders FROM orders"

    # ─────────────────────────────────────────────────────
    # PRODUCT QUERIES
    # ─────────────────────────────────────────────────────

    # "compare order counts across product categories"
    if "compare" in q and ("order" in q or "count" in q) and "categor" in q:
        return f"""
SELECT COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       COUNT(DISTINCT oi.order_id) AS order_count
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY category
ORDER BY order_count DESC
LIMIT {limit}
""".strip()

    # "number of orders for each product category / categories"
    if "order" in q and "categor" in q:
        return f"""
SELECT COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       COUNT(DISTINCT oi.order_id) AS order_count
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY category
ORDER BY order_count DESC
LIMIT {limit}
""".strip()

    # "bottom 10 products by revenue"
    if "bottom" in q and "product" in q and ("revenue" in q or "sales" in q or "value" in q):
        return f"""
SELECT p.product_id,
       COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       ROUND(SUM(oi.price), 2) AS total_revenue,
       COUNT(oi.order_id) AS items_sold
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY p.product_id
ORDER BY total_revenue ASC
LIMIT {limit}
""".strip()

    # "top 10 products by total sales value" / "top 10 products by revenue" / "compare top 5 products by revenue"
    if ("top" in q or "best" in q or "compare" in q) and "product" in q and ("revenue" in q or "sales" in q or "value" in q) and "category" not in q:
        return f"""
SELECT p.product_id,
       COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       ROUND(SUM(oi.price), 2) AS total_revenue,
       COUNT(oi.order_id) AS items_sold
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY p.product_id
ORDER BY total_revenue DESC
LIMIT {limit}
""".strip()

    # "top 10 products by number of orders"
    if ("top" in q or "best" in q) and "product" in q and ("order" in q or "number" in q or "count" in q):
        return f"""
SELECT p.product_id,
       COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       COUNT(DISTINCT oi.order_id) AS order_count,
       ROUND(SUM(oi.price), 2) AS total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY p.product_id
ORDER BY order_count DESC
LIMIT {limit}
""".strip()

    # "products by category / categories" / "number of products per category"
    if "product" in q and "categor" in q and "order" not in q:
        return f"""
SELECT COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       COUNT(*) AS product_count
FROM products p
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY category
ORDER BY product_count DESC
LIMIT {limit}
""".strip()

    # "top categories by revenue"
    if ("top" in q or "best" in q) and "categor" in q and ("revenue" in q or "sales" in q or "selling" in q):
        return f"""
SELECT COALESCE(ct.product_category_name_english, p.product_category_name) AS category,
       COUNT(oi.order_id) AS items_sold,
       ROUND(SUM(oi.price), 2) AS total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
GROUP BY category
ORDER BY total_revenue DESC
LIMIT {limit}
""".strip()

    # "total products"
    if ("total" in q or "how many" in q or "count" in q) and "product" in q and "order" not in q and "category" not in q:
        return "SELECT COUNT(*) AS total_products FROM products"

    # ─────────────────────────────────────────────────────
    # CUSTOMER QUERIES
    # ─────────────────────────────────────────────────────

    # "top 10 customers by total payment value"
    if ("top" in q) and "customer" in q and ("payment" in q or "value" in q or "spent" in q or "revenue" in q):
        return f"""
SELECT c.customer_unique_id,
       COUNT(DISTINCT o.order_id) AS total_orders,
       ROUND(SUM(p.payment_value), 2) AS total_payment_value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN payments p ON o.order_id = p.order_id
GROUP BY c.customer_unique_id
ORDER BY total_payment_value DESC
LIMIT {limit}
""".strip()

    # "average order value by customer"
    if ("average" in q or "avg" in q) and ("order" in q) and "customer" in q:
        return f"""
SELECT c.customer_unique_id,
       COUNT(DISTINCT o.order_id) AS order_count,
       ROUND(AVG(p.payment_value), 2) AS average_order_value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN payments p ON o.order_id = p.order_id
GROUP BY c.customer_unique_id
ORDER BY average_order_value DESC
LIMIT {limit}
""".strip()

    # "unique customers by order status" / "number of unique customers by status"
    if "customer" in q and "status" in q:
        return """
SELECT o.order_status,
       COUNT(DISTINCT c.customer_unique_id) AS unique_customers
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY o.order_status
ORDER BY unique_customers DESC
""".strip()

    # "number of orders by customer" / "orders per customer"
    if "order" in q and "customer" in q and ("number" in q or "count" in q or "by" in q or "per" in q):
        return f"""
SELECT c.customer_unique_id,
       COUNT(o.order_id) AS order_count
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_unique_id
ORDER BY order_count DESC
LIMIT {limit}
""".strip()

    # "customers by state"
    if "customer" in q and "state" in q:
        return "SELECT customer_state, COUNT(*) AS count FROM customers GROUP BY customer_state ORDER BY count DESC"

    # "customers by city"
    if "customer" in q and "city" in q:
        return "SELECT customer_city, COUNT(*) AS count FROM customers GROUP BY customer_city ORDER BY count DESC LIMIT 20"

    # "total customers"
    if ("how many" in q or "count" in q or "number of" in q or "total" in q) and "customer" in q:
        return "SELECT COUNT(DISTINCT customer_unique_id) AS total_customers FROM customers"

    # ─────────────────────────────────────────────────────
    # SELLER QUERIES
    # ─────────────────────────────────────────────────────

    # "top sellers"
    if "top" in q and "seller" in q:
        return f"""
SELECT s.seller_id, s.seller_city, s.seller_state,
       COUNT(oi.order_id) AS items_sold,
       ROUND(SUM(oi.price), 2) AS total_revenue
FROM sellers s
JOIN order_items oi ON s.seller_id = oi.seller_id
GROUP BY s.seller_id
ORDER BY total_revenue DESC
LIMIT {limit}
""".strip()

    # "sellers by state"
    if "seller" in q and "state" in q:
        return "SELECT seller_state, COUNT(*) AS count FROM sellers GROUP BY seller_state ORDER BY count DESC"

    # "total sellers"
    if ("total" in q or "how many" in q or "count" in q) and "seller" in q:
        return "SELECT COUNT(*) AS total_sellers FROM sellers"

    # ─────────────────────────────────────────────────────
    # REVIEW QUERIES
    # ─────────────────────────────────────────────────────

    # "review score distribution" / "distribution of review scores"
    if "review" in q and ("score" in q or "distribution" in q or "rating" in q):
        return "SELECT review_score, COUNT(*) AS count FROM reviews GROUP BY review_score ORDER BY review_score DESC"

    # "average review score"
    if ("average" in q or "avg" in q) and "review" in q:
        return "SELECT ROUND(AVG(review_score), 2) AS average_review_score FROM reviews"

    # ─────────────────────────────────────────────────────
    # CROSS-ENTITY / COMPARISON QUERIES
    # ─────────────────────────────────────────────────────

    # "compare average payment values across payment methods"
    if "compare" in q and ("average" in q or "avg" in q) and "payment" in q:
        return """
SELECT payment_type,
       COUNT(*) AS payment_count,
       ROUND(AVG(payment_value), 2) AS average_payment_value,
       ROUND(MIN(payment_value), 2) AS min_value,
       ROUND(MAX(payment_value), 2) AS max_value
FROM payments
GROUP BY payment_type
ORDER BY average_payment_value DESC
""".strip()

    # "average order value" — overall
    if ("average order value" in q or ("average" in q and "order" in q and "value" in q)):
        return """
SELECT ROUND(AVG(total), 2) AS avg_order_value
FROM (
    SELECT o.order_id, SUM(p.payment_value) AS total
    FROM orders o
    JOIN payments p ON o.order_id = p.order_id
    GROUP BY o.order_id
)
""".strip()

    # ─────────────────────────────────────────────────────
    # SINGLE-WORD & CORE ENTITY FALLBACK QUERIES
    # ─────────────────────────────────────────────────────
    clean_q = q.strip().rstrip("!?.")

    if clean_q in ("orders", "order", "show orders", "get orders", "all orders", "list orders"):
        return "SELECT order_status, COUNT(*) AS count FROM orders GROUP BY order_status ORDER BY count DESC"

    if clean_q in ("products", "product", "show products", "get products", "all products", "list products"):
        return "SELECT product_category_name, COUNT(*) AS product_count FROM products GROUP BY product_category_name ORDER BY product_count DESC LIMIT 10"

    if clean_q in ("customers", "customer", "show customers", "get customers", "all customers", "list customers"):
        return "SELECT customer_state, COUNT(*) AS customer_count FROM customers GROUP BY customer_state ORDER BY customer_count DESC LIMIT 10"

    if clean_q in ("payments", "payment", "show payments", "get payments", "all payments", "list payments"):
        return "SELECT payment_type, COUNT(*) AS count, ROUND(SUM(payment_value), 2) AS total_value FROM payments GROUP BY payment_type ORDER BY total_value DESC"

    if clean_q in ("sellers", "seller", "show sellers", "get sellers", "all sellers", "list sellers"):
        return "SELECT seller_state, COUNT(*) AS count FROM sellers GROUP BY seller_state ORDER BY count DESC LIMIT 10"

    if clean_q in ("reviews", "review", "show reviews", "get reviews", "all reviews", "list reviews"):
        return "SELECT review_score, COUNT(*) AS count FROM reviews GROUP BY review_score ORDER BY review_score DESC"

    return None
