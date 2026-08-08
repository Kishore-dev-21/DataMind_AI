import sys
sys.path.insert(0, '.')
from app.services.sql_templates import match_template
from app.services.intent_detector import detect_intent
from app.tools.execute_query import execute_query

questions = [
    'Show the total payment value by payment type',
    'Show a bar chart of payment value by payment method',
    'Show the number of payments for each payment type',
    'Show the average payment value by payment method',
    'Show the highest payment value by payment method',
    'Show the distribution of payment values',
    'Show the number of orders by order status',
    'Create a bar chart showing delivered, cancelled, and pending orders',
    'Show the percentage of orders by order status',
    'Show the number of orders for each product category',
    'Show the top 10 products by number of orders',
    'Show the top 10 products by total sales value',
    'Show the number of orders by customer',
    'Show the top 10 customers by total payment value',
    'Show the average order value by customer',
    'Show the number of unique customers by order status',
    'Show the number of orders by month',
    'Show total payment value by month',
    'Show average payment value by month',
    'Show the monthly order trend',
    'Show the monthly revenue trend as a line chart',
    'Show the number of delivered orders by month',
    'Show cancelled orders by month',
    'Show the top 10 products by revenue',
    'Show the bottom 10 products by revenue',
    'Show the top 10 customers by payment value',
    'Show the top 5 payment methods by total payment value',
    'Compare delivered and cancelled orders',
    'Compare average payment values across payment methods',
    'Compare order counts across product categories',
    'Compare total revenue between different order statuses',
    'Compare the top 5 products by revenue',
    'What is the total payment value',
]

ok = 0
fail = 0
for q in questions:
    intent = detect_intent(q)
    sql = match_template(q, intent)
    if not sql:
        print('NO_TEMPLATE | ' + q[:60])
        fail += 1
        continue
    result = execute_query(sql)
    rows = result.get('row_count', 0)
    if result['success']:
        print('OK  rows=' + str(rows).rjust(6) + ' | ' + q[:60])
        ok += 1
    else:
        err = result.get('error', '')[:50]
        print('SQL_ERR     | ' + q[:60] + ' => ' + err)
        fail += 1

print('\nFINAL: ' + str(ok) + ' OK, ' + str(fail) + ' FAILED out of ' + str(len(questions)))
