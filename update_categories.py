import os
import re

# 1. Update food-categories.html
with open('c:/Users/Hope3/Desktop/website/food-categories.html', 'r', encoding='utf-8') as f:
    fc_content = f.read()

new_cards = '''
                    <div class="category-card" onclick="goToDrinks()">
                        <div class="category-icon">🥤</div>
                        <h3>Drinks</h3>
                        <p id="drinksCount">Loading...</p>
                    </div>
                    <div class="category-card" onclick="goToSnacks()">
                        <div class="category-icon">🍟</div>
                        <h3>Snacks</h3>
                        <p id="snacksCount">Loading...</p>
                    </div>
                    <div class="category-card" onclick="goToSweets()">
                        <div class="category-icon">🍰</div>
                        <h3>Sweets</h3>
                        <p id="sweetsCount">Loading...</p>
                    </div>
                    <div class="category-card" onclick="goToIceCream()">
                        <div class="category-icon">🍨</div>
                        <h3>Ice Cream</h3>
                        <p id="iceCreamCount">Loading...</p>
                    </div>
                </div>
'''

fc_content = re.sub(r'<div class="category-card" onclick="goToDrinks\(\)".*?</div>\s*</div>', new_cards.strip() + '\n                </div>', fc_content, flags=re.DOTALL)

with open('c:/Users/Hope3/Desktop/website/food-categories.html', 'w', encoding='utf-8') as f:
    f.write(fc_content)


# 2. Update script.js with new navigation functions and counts
with open('c:/Users/Hope3/Desktop/website/script.js', 'r', encoding='utf-8') as f:
    s_content = f.read()

new_nav = '''
function goToMainDishes() { transitionToPage('main-dishes.html'); }
function goToSideDishes() { transitionToPage('side-dishes.html'); }
function goToDrinks() { transitionToPage('drinks.html'); }
function goToSnacks() { transitionToPage('snacks.html'); }
function goToSweets() { transitionToPage('sweets.html'); }
function goToIceCream() { transitionToPage('ice-cream.html'); }
'''

s_content = re.sub(r'function goToMainDishes\(\) { transitionToPage\(\'main-dishes.html\'\); }.*?function goToDrinks\(\) { transitionToPage\(\'drinks.html\'\); }', new_nav.strip(), s_content, flags=re.DOTALL)

new_counts = '''
    const mainDishes = items.filter(item => item.category === 'Main Dish');
    const sideDishes = items.filter(item => item.category === 'Side Dish');
    const drinks = items.filter(item => item.category === 'Drinks');
    const snacks = items.filter(item => item.category === 'Snacks');
    const sweets = items.filter(item => item.category === 'Sweets');
    const iceCream = items.filter(item => item.category === 'Ice Cream');
    
    document.getElementById('mainDishCount').textContent = ${mainDishes.reduce((sum, item) => sum + item.quantity, 0)} Items;
    document.getElementById('sideDishCount').textContent = ${sideDishes.reduce((sum, item) => sum + item.quantity, 0)} Items;
    
    const dCount = document.getElementById('drinksCount');
    if(dCount) dCount.textContent = ${drinks.reduce((sum, item) => sum + item.quantity, 0)} Items;
    
    const snCount = document.getElementById('snacksCount');
    if(snCount) snCount.textContent = ${snacks.reduce((sum, item) => sum + item.quantity, 0)} Items;
    
    const swCount = document.getElementById('sweetsCount');
    if(swCount) swCount.textContent = ${sweets.reduce((sum, item) => sum + item.quantity, 0)} Items;
    
    const icCount = document.getElementById('iceCreamCount');
    if(icCount) icCount.textContent = ${iceCream.reduce((sum, item) => sum + item.quantity, 0)} Items;
'''

# We need to replace the counting block in loadFoodCategories
count_regex = r'const mainDishes = items\.filter\(item => item\.category === \'Main Dish\'\);.*?if \(drinksCount\) drinksCount\.textContent = \$\{drinks\.reduce\(\(sum, item\) => sum \+ item\.quantity, 0\)\} Items;'
s_content = re.sub(count_regex, new_counts.strip(), s_content, flags=re.DOTALL)

with open('c:/Users/Hope3/Desktop/website/script.js', 'w', encoding='utf-8') as f:
    f.write(s_content)


# 3. Create snacks.html, sweets.html, ice-cream.html by copying main-dishes.html
with open('c:/Users/Hope3/Desktop/website/main-dishes.html', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Make snacks
sn_content = md_content.replace('Main Dishes', 'Snacks').replace('mainDishesContainer', 'snacksContainer')
with open('c:/Users/Hope3/Desktop/website/snacks.html', 'w', encoding='utf-8') as f:
    f.write(sn_content)

# Make sweets
sw_content = md_content.replace('Main Dishes', 'Sweets').replace('mainDishesContainer', 'sweetsContainer')
with open('c:/Users/Hope3/Desktop/website/sweets.html', 'w', encoding='utf-8') as f:
    f.write(sw_content)

# Make ice-cream
ic_content = md_content.replace('Main Dishes', 'Ice Cream').replace('mainDishesContainer', 'iceCreamContainer')
with open('c:/Users/Hope3/Desktop/website/ice-cream.html', 'w', encoding='utf-8') as f:
    f.write(ic_content)
    
print("Updated all HTML and JS files.")
