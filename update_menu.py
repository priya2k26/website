import json
import re
import random

# Raw text from prompt
raw_data = '''
### 🍛 Main Dish

**🌅 Morning**

* Idli
* Plain Dosa
* Masala Dosa
* Pongal
* Poori
* Vada
* Upma
* Idiyappam
* Appam
* Puttu

**☀️ Afternoon**

* Sambar Rice
* Curd Rice
* Lemon Rice
* Tomato Rice
* Tamarind Rice
* Vegetable Biryani
* Chicken Biryani
* Mutton Biryani
* Chicken Rice
* Veg Meals

**🌙 Night**

* Chapati
* Parotta
* Kothu Parotta
* Naan
* Roti
* Fried Rice
* Chicken Fried Rice
* Veg Fried Rice
* Chicken Noodles
* Veg Noodles

### 🍽️ Side Dishes

**🌅 Morning**

* Sambar
* Coconut Chutney
* Tomato Chutney
* Mint Chutney
* Onion Chutney
* Peanut Chutney
* Vada Curry
* Potato Masala

**☀️ Afternoon**

* Vegetable Poriyal
* Potato Fry
* Beans Poriyal
* Carrot Poriyal
* Cabbage Poriyal
* Avial
* Kootu
* Rasam
* Sambar
* Appalam
* Pickle
* Curd

**🌙 Night**

* Vegetable Kurma
* Chicken Gravy
* Mutton Gravy
* Paneer Gravy
* Chana Masala
* Dal Fry
* Mushroom Masala
* Onion Raita
* Cucumber Raita
* Mixed Vegetable Curry

### 🥤 Drinks

**🌅 Morning**

* Tea
* Coffee
* Milk
* Horlicks
* Badam Milk
* Fresh Lime Juice

**☀️ Afternoon**

* Fresh Lime Soda
* Lemon Juice
* Watermelon Juice
* Orange Juice
* Pineapple Juice
* Mango Juice
* Buttermilk
* Lassi
* Tender Coconut Water

**🌙 Night**

* Tea
* Coffee
* Milk
* Badam Milk
* Rose Milk
* Hot Chocolate
* Fresh Lime Juice
* Milkshake                          

### 🍟 Snacks

**🌅 Morning**

* Medu Vada
* Masala Vada
* Bonda
* Bajji
* Samosa
* Paniyaram
* Murukku

**☀️ Afternoon**

* Samosa
* Vegetable Cutlet
* French Fries
* Onion Rings
* Bajji
* Pakoda
* Chicken 65
* Chicken Nuggets
* Spring Rolls

**🌙 Night**

* Samosa
* French Fries
* Chicken 65
* Chicken Nuggets
* Paneer Tikka
* Gobi 65
* Pakoda
* Spring Rolls
* Bread Roll
* Cutlet

### 🍰 Sweets

* Gulab Jamun
* Rasgulla
* Rasmalai
* Jalebi
* Kaju Katli
* Mysore Pak
* Laddu
* Halwa
* Payasam
* Carrot Halwa
* Kulfi
* Ice Cream
* Brownie
* Chocolate Cake
* Fruit Salad
* Falooda

### 🍨 Ice Cream

* Vanilla Ice Cream
* Chocolate Ice Cream
* Strawberry Ice Cream
* Butterscotch Ice Cream
* Mango Ice Cream
* Pista Ice Cream
* Black Currant Ice Cream
* Kulfi
* Chocolate Sundae
* Fruit Sundae
* Ice Cream Falooda
* Brownie with Ice Cream
* Ice Cream Cake
* Tender Coconut Ice Cream
* Cookies & Cream Ice Cream
'''

menu_items = []
current_cat = None
current_time = 'All'
item_id = 1

lines = raw_data.strip().split('\n')
for line in lines:
    line = line.strip()
    if not line:
        continue
    
    if line.startswith('###'):
        raw_cat = line.replace('###', '').strip()
        # Clean emojis
        raw_cat = re.sub(r'^[^\w\s]+', '', raw_cat).strip()
        if 'Side Dish' in raw_cat:
            current_cat = 'Side Dish'
        else:
            current_cat = raw_cat
        current_time = 'All'  # reset time
    elif line.startswith('**'):
        if 'Morning' in line:
            current_time = 'Morning'
        elif 'Afternoon' in line:
            current_time = 'Afternoon'
        elif 'Night' in line:
            current_time = 'Night'
    elif line.startswith('*'):
        name = line.replace('*', '').strip()
        price = random.choice([30, 40, 50, 60, 80, 100, 120, 150, 180])
        if 'Biryani' in name or 'Meals' in name:
            price = random.choice([150, 180, 200, 250])
        elif 'Chutney' in name or 'Sambar' in name or 'Pickle' in name:
            price = random.choice([20, 30])
        elif current_cat == 'Drinks':
            price = random.choice([20, 30, 40, 50, 60])
        
        item = {
            'id': item_id,
            'name': name,
            'category': current_cat,
            'price': price,
            'description': f'Delicious {name}',
            'timeOfDay': current_time
        }
        menu_items.append(item)
        item_id += 1

# Generate JS code
js_array = "const MENU_ITEMS = [\n"
for item in menu_items:
    js_array += f"    {{ id: {item['id']}, name: '{item['name']}', category: '{item['category']}', price: {item['price']}, description: '{item['description']}', timeOfDay: '{item['timeOfDay']}' }},\n"
js_array += "];"

# Replace in data.js
with open(r'c:\Users\Hope3\Desktop\website\data.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'const MENU_ITEMS = \[.*?\];', js_array, content, flags=re.DOTALL)

with open(r'c:\Users\Hope3\Desktop\website\data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Generated {len(menu_items)} items successfully!")
