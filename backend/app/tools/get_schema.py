import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).resolve().parents[2] / "database" / "ecommerce.db"


def get_schema():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table'
        ORDER BY name;
    """)

    tables = cursor.fetchall()

    schema = {}

    for (table_name,) in tables:
        cursor.execute(f'PRAGMA table_info("{table_name}")')

        columns = cursor.fetchall()

        schema[table_name] = []
        for column in columns:
            col_name = column[1]
            col_type = column[2]
            
            if table_name == "orders" and col_name == "order_status":
                col_type += " (values: delivered, invoiced, shipped, processing, unavailable, canceled, created, approved)"
                
            schema[table_name].append({
                "column": col_name,
                "type": col_type
            })

    conn.close()

    return schema