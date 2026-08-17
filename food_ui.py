import re

file_path = r'c:\Users\Hope3\Desktop\website\styles.css'
index_path = r'c:\Users\Hope3\Desktop\website\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# 1. Update Global Body Background
css_content = css_content.replace(
    'background: linear-gradient(135deg, #1f1c2c 0%, #928DAB 100%);',
    'background: #f4f7f6;'
)

# 2. Re-write Button CSS to Food Theme
button_styles = """
.btn-primary,
.btn-secondary,
.btn-success,
.btn-logout,
.btn-back,
.btn-add,
.btn-remove,
.btn-small {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
    position: relative;
    letter-spacing: 0.5px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary {
    background: #ff5722; /* Warm appetizing orange */
    color: white;
    box-shadow: 0 4px 10px rgba(255, 87, 34, 0.25);
}
.btn-primary:hover:not(:disabled) {
    background: #f4511e;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 87, 34, 0.35);
}
.btn-primary:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(255, 87, 34, 0.2);
}

.btn-secondary {
    background: white;
    color: #333;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.btn-secondary:hover {
    border-color: #ff5722;
    color: #ff5722;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 87, 34, 0.1);
}
.btn-secondary:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.btn-success, .btn-add {
    background: #4caf50; /* Fresh green */
    color: white;
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.25);
}
.btn-success:hover, .btn-add:hover {
    background: #43a047;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(76, 175, 80, 0.35);
}
.btn-success:active, .btn-add:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(76, 175, 80, 0.2);
}

.btn-logout, .btn-remove {
    background: #e53935; /* Warning red */
    color: white;
    box-shadow: 0 4px 10px rgba(229, 57, 53, 0.25);
}
.btn-logout:hover, .btn-remove:hover {
    background: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(229, 57, 53, 0.35);
}
.btn-logout:active, .btn-remove:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(229, 57, 53, 0.2);
}

.btn-back, .btn-small {
    background: white;
    color: #555;
    border: 1px solid #dcdcdc;
    padding: 8px 16px;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.btn-back:hover, .btn-small:hover {
    background: #f9f9f9;
    color: #333;
    border-color: #bbb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
.btn-back:active, .btn-small:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}
"""

# Replace the button chunk
pattern = re.compile(r'\.btn-primary,\n\.btn-secondary,\n\.btn-success,.*?box-shadow: 0 2px 5px rgba\(54, 209, 220, 0\.3\);\n}', re.DOTALL)
css_content = pattern.sub(button_styles, css_content)

# Update Login header colors to fit food theme
css_content = css_content.replace('color: #667eea;', 'color: #ff5722;')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

# 3. Update index.html background
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

# Replace purple podium background with a warm food-friendly background
index_content = index_content.replace(
    "background: url('images/login_bg_purple_podium.png') center/cover no-repeat fixed;",
    "background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); /* Warm food background */"
)
index_content = index_content.replace(
    "background: rgba(0, 0, 0, 0.35); /* Dark overlay to make fairy lights pop and text readable */",
    "background: rgba(255, 255, 255, 0.2); /* Soft light overlay for food theme */"
)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_content)

print("Food UI applied.")
