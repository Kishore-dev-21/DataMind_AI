import sqlite3
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "datasets"
DATABASE_DIR = BASE_DIR / "database"
DB_PATH = DATABASE_DIR / "ecommerce.db"

FILES = {
    "olist_customers_dataset.csv": "customers",
    "olist_orders_dataset.csv": "orders",
    "olist_products_dataset.csv": "products",
    "olist_order_items_dataset.csv": "order_items",
    "olist_order_payments_dataset.csv": "payments",
    "olist_order_reviews_dataset.csv": "reviews",
    "olist_sellers_dataset.csv": "sellers",
    "olist_geolocation_dataset.csv": "geolocation",
    "product_category_name_translation.csv": "category_translation",
}

def build_database():
    DATABASE_DIR.mkdir(exist_ok=True)
    if DB_PATH.exists():
        try:
            if DB_PATH.stat().st_size < 1_000_000:
                DB_PATH.unlink()
        except Exception:
            pass

    conn = sqlite3.connect(DB_PATH)

    for csv_file, table_name in FILES.items():
        csv_path = DATASET_DIR / csv_file
        if not csv_path.exists():
            print(f"[Database Build] File not found: {csv_file}")
            continue

        print(f"[Database Build] Importing {csv_file} -> {table_name}")
        df = pd.read_csv(csv_path)
        df.to_sql(table_name, conn, if_exists="replace", index=False)

    conn.close()
    print(f"[Database Build] Database ready at {DB_PATH}")

if __name__ == "__main__":
    build_database()