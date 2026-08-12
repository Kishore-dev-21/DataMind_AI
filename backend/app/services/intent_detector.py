import re

def detect_intent(question: str) -> dict:
    q = question.lower()

    intent_data = {
        "intent": "general",
        "aggregation_type": None,
        "chart_requested": None,
        "csv_only": False,
        "entities": [],
        "modifiers": {
            "limit": None,
            "order": None,
            "time_group": None,
            "group_by_field": None
        }
    }

    if "only csv" in q or "as csv" in q or "csv only" in q:
        intent_data["csv_only"] = True

    # ── Intent Classification ─────────────────────────────────
    if any(word in q for word in ["compare", "comparison", "versus", "vs"]):
        intent_data["intent"] = "comparison"
    elif any(word in q for word in ["total", "sum", "how much", "overall"]):
        intent_data["intent"] = "aggregation"
        intent_data["aggregation_type"] = "sum"
    elif any(word in q for word in ["average", "avg", "mean"]):
        intent_data["intent"] = "aggregation"
        intent_data["aggregation_type"] = "avg"
    elif any(word in q for word in ["highest", "maximum", "max", "largest", "most expensive", "biggest"]):
        intent_data["intent"] = "ranking"
        intent_data["aggregation_type"] = "max"
    elif any(word in q for word in ["lowest", "minimum", "min", "smallest", "cheapest", "least"]):
        intent_data["intent"] = "ranking"
        intent_data["aggregation_type"] = "min"
    elif any(word in q for word in ["top", "bottom", "best", "worst", "rank"]):
        intent_data["intent"] = "ranking"
    elif any(word in q for word in ["how many", "count", "number of", "total number"]):
        intent_data["intent"] = "count"
    elif any(word in q for word in ["trend", "over time", "monthly", "yearly", "growth", "decline"]):
        intent_data["intent"] = "trend"
    elif any(word in q for word in ["breakdown", "distribution", "proportion", "share", "percentage", "percent", " by "]):
        intent_data["intent"] = "distribution"

    # ── Chart Type Detection ───────────────────────────────────
    # Detect explicit chart requests: "show a bar chart", "create a line chart", "visualize"
    chart_keywords = ["chart", "graph", "plot", "visualize", "visualise", "draw", "heatmap", "histogram"]
    wants_chart = any(word in q for word in chart_keywords)

    # Also treat "show ... by ..." distribution questions as wanting a chart
    if not wants_chart and ("show" in q or "create" in q or "display" in q) and " by " in q:
        wants_chart = True

    if wants_chart:
        if "bar" in q:
            intent_data["chart_requested"] = "bar"
        elif "pie" in q:
            intent_data["chart_requested"] = "pie"
        elif "line" in q:
            intent_data["chart_requested"] = "line"
        elif "area" in q:
            intent_data["chart_requested"] = "area"
        elif "scatter" in q:
            intent_data["chart_requested"] = "scatter"
        elif "donut" in q:
            intent_data["chart_requested"] = "donut"
        elif "hbar" in q or "horizontal" in q:
            intent_data["chart_requested"] = "hbar"
        elif "heatmap" in q or "heat map" in q:
            intent_data["chart_requested"] = "heatmap"
        elif "histogram" in q:
            intent_data["chart_requested"] = "bar"  # histogram rendered as bar
        else:
            # Smart default: time series → line, categorical → bar
            if any(w in q for w in ["monthly", "month", "yearly", "year", "trend", "over time"]):
                intent_data["chart_requested"] = "line"
            elif any(w in q for w in ["percentage", "proportion", "share", "distribution"]):
                intent_data["chart_requested"] = "pie"
            else:
                intent_data["chart_requested"] = "bar"

    # ── Entity Detection ───────────────────────────────────────
    if any(w in q for w in ["payment", "revenue", "amount", "paid"]):
        intent_data["entities"].append("payment")
    if "order" in q:
        intent_data["entities"].append("order")
    if any(w in q for w in ["customer", "buyer"]):
        intent_data["entities"].append("customer")
    if any(w in q for w in ["product", "item"]):
        intent_data["entities"].append("product")
    if any(w in q for w in ["seller", "vendor"]):
        intent_data["entities"].append("seller")
    if any(w in q for w in ["review", "rating", "score"]):
        intent_data["entities"].append("review")
    if any(w in q for w in ["delivery", "shipping"]):
        intent_data["entities"].append("delivery")
    if "categor" in q:  # matches 'category' and 'categories'
        intent_data["entities"].append("category")
    if any(w in q for w in ["state", "city", "location"]):
        intent_data["entities"].append("geolocation")

    # ── Modifiers ─────────────────────────────────────────────
    # Extract "top N" / "bottom N"
    limit_match = re.search(r'(top|bottom)\s+(\d+)', q)
    if limit_match:
        direction = limit_match.group(1)
        limit = int(limit_match.group(2))
        intent_data["modifiers"]["limit"] = limit
        intent_data["modifiers"]["order"] = "desc" if direction == "top" else "asc"

    # Time grouping
    if any(w in q for w in ["monthly", "per month", "by month"]):
        intent_data["modifiers"]["time_group"] = "month"
    elif any(w in q for w in ["yearly", "annual", "per year", "by year"]):
        intent_data["modifiers"]["time_group"] = "year"
    elif any(w in q for w in ["quarterly", "per quarter", "by quarter"]):
        intent_data["modifiers"]["time_group"] = "quarter"

    # Group-by field
    if "by status" in q or "by order status" in q:
        intent_data["modifiers"]["group_by_field"] = "order_status"
    elif "by payment method" in q or "by payment type" in q:
        intent_data["modifiers"]["group_by_field"] = "payment_type"
    elif "by category" in q:
        intent_data["modifiers"]["group_by_field"] = "product_category_name"
    elif "by state" in q:
        intent_data["modifiers"]["group_by_field"] = "customer_state"
    elif "by city" in q:
        intent_data["modifiers"]["group_by_field"] = "customer_city"

    return intent_data
