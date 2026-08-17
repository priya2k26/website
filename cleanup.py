import os
import glob

folder = r"c:\Users\Hope3\Desktop\website"
html_files = glob.glob(os.path.join(folder, "*.html"))

replacements = {
    "+? Back": "← Back",
    "+' Go to": "→ Go to",
    "o\" View": "✓ View",
    "o\" Mark": "✓ Mark",
    "o\" Complete": "✓ Complete",
    "dY-\",? Print": "🖨️ Print",
    "â‚¹": "₹",
    "ðŸ —": "🍗",
    "ðŸ¥¤": "🥤"
}

for file in html_files:
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Cleaned up encodings.")
