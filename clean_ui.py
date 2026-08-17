import re

file_path = r'c:\Users\Hope3\Desktop\website\styles.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Simplify Button CSS
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
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
    font-weight: 600;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 1;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}
.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
}
.btn-primary:active:not(:disabled) {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
    background: #f5f7fa;
    color: #333;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.12);
}
.btn-secondary:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 5px rgba(0,0,0,0.08);
}

.btn-success, .btn-add {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(17, 153, 142, 0.3);
}
.btn-success:hover, .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.4);
}
.btn-success:active, .btn-add:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 5px rgba(17, 153, 142, 0.3);
}

.btn-logout, .btn-remove {
    background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(255, 65, 108, 0.3);
}
.btn-logout:hover, .btn-remove:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 65, 108, 0.4);
}
.btn-logout:active, .btn-remove:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 5px rgba(255, 65, 108, 0.3);
}

.btn-back, .btn-small {
    background: linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(54, 209, 220, 0.3);
}
.btn-back:hover, .btn-small:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(54, 209, 220, 0.4);
}
.btn-back:active, .btn-small:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 5px rgba(54, 209, 220, 0.3);
}
"""

# Replace the giant chunk of buttons CSS we added before
pattern = re.compile(r'\.btn-primary,\n\.btn-secondary,\n\.btn-success,.*?box-shadow: 0 4px 0 #0d7a71, 0 8px 15px rgba\(0,0,0,0\.2\), inset 0 1px 0 rgba\(255,255,255,0\.4\);\n}\n\.btn-add:active {\n    transform: translateY\(4px\);\n    box-shadow: 0 0 0 #0d7a71;\n}', re.DOTALL)
content = pattern.sub(button_styles, content)

# 2. Tone down animations from recently appended CSS
content = content.replace('animation: bounce 2s infinite ease-in-out;', '')
content = content.replace('.thank-you-msg:hover {\n    animation: pulse 1s infinite;\n}', '')
content = content.replace('animation: bounce 2s infinite;', '')
content = content.replace('animation: pulse 2s infinite;', '')
content = content.replace('animation: glow 2s infinite alternate;', '')
content = content.replace('transform: scale(1.1) rotate(2deg);', 'transform: scale(1.05);')

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS successfully cleaned up.")
