import re

with open('c:/Users/Hope3/Desktop/website/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add to DOMContentLoaded block
new_init = '''
    if (document.getElementById('drinksContainer')) {
        loadDrinks();
    }
    if (document.getElementById('snacksContainer')) {
        loadSnacks();
    }
    if (document.getElementById('sweetsContainer')) {
        loadSweets();
    }
    if (document.getElementById('iceCreamContainer')) {
        loadIceCream();
    }
'''
content = re.sub(r'if \(document\.getElementById\(\'drinksContainer\'\)\) \{\s*loadDrinks\(\);\s*\}', new_init.strip(), content)

# 2. Add load functions
new_loads = '''
function loadDrinks() {
    loadCategoryPage('Drinks', 'drinksContainer');
}

function loadSnacks() {
    loadCategoryPage('Snacks', 'snacksContainer');
}

function loadSweets() {
    loadCategoryPage('Sweets', 'sweetsContainer');
}

function loadIceCream() {
    loadCategoryPage('Ice Cream', 'iceCreamContainer');
}
'''
content = re.sub(r'function loadDrinks\(\) \{\s*loadCategoryPage\(\'Drinks\', \'drinksContainer\'\);\s*\}', new_loads.strip(), content)

with open('c:/Users/Hope3/Desktop/website/script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added load handlers for new pages.")
