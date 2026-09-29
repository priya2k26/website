import re
import os

data_js_path = r'c:\Users\Hope3\Desktop\website\data.js'
schema_sql_path = r'c:\Users\Hope3\Desktop\website\backend\schema.sql'

with open(data_js_path, 'r', encoding='utf-8') as f:
    data_content = f.read()

# Extract MENU_ITEMS block
match = re.search(r'const MENU_ITEMS = \[([\s\S]*?)\];', data_content)
if not match:
    print("Could not find MENU_ITEMS in data.js")
    exit(1)

items_text = match.group(1)

# Parse each item
items = []
for line in items_text.split('\n'):
    line = line.strip()
    if not line.startswith('{'): continue
    
    # Extract fields
    id_m = re.search(r'id:\s*(\d+)', line)
    name_m = re.search(r"name:\s*'([^']+)'", line)
    cat_m = re.search(r"category:\s*'([^']+)'", line)
    price_m = re.search(r'price:\s*(\d+)', line)
    desc_m = re.search(r"description:\s*'([^']+)'", line)
    
    if id_m and name_m and cat_m and price_m and desc_m:
        items.append({
            'id': id_m.group(1),
            'name': name_m.group(1),
            'category': cat_m.group(1),
            'price': price_m.group(1),
            'description': desc_m.group(1).replace("'", "''")
        })

# Generate SQL
sql_statements = []
for i, item in enumerate(items):
    end_char = ';' if i == len(items) - 1 else ','
    sql_statements.append(f"({item['id']}, '{item['name']}', '{item['category']}', {item['price']}, '{item['description']}'){end_char}")

insert_block = "INSERT IGNORE INTO menu_items (id, name, category, price, description) VALUES\n" + "\n".join(sql_statements)

with open(schema_sql_path, 'r', encoding='utf-8') as f:
    schema_content = f.read()

# Replace the existing INSERT IGNORE INTO menu_items block
# It starts at "INSERT IGNORE INTO menu_items" and ends at the end of the file or the next statement
new_schema = re.sub(r'INSERT IGNORE INTO menu_items \(id, name, category, price, description\) VALUES[\s\S]*?(?=;);', insert_block, schema_content, flags=re.MULTILINE)

# If it didn't find the exact match (maybe because of trailing spaces), let's use a simpler regex or manual string split
if new_schema == schema_content:
    print("Regex replacement failed, trying alternative")
    parts = schema_content.split('INSERT IGNORE INTO menu_items (id, name, category, price, description) VALUES')
    if len(parts) > 1:
        before = parts[0]
        # remove everything after the first ';' in parts[1]
        after = parts[1].split(';', 1)[1] if ';' in parts[1] else ''
        new_schema = before + insert_block + after
    else:
        new_schema += "\n\n" + insert_block

with open(schema_sql_path, 'w', encoding='utf-8') as f:
    f.write(new_schema)

print(f"Successfully generated {len(items)} SQL insert statements and updated schema.sql.")
