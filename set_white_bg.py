import os
import glob

html_files = glob.glob(r'c:\Users\Hope3\Desktop\website\*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for various background definitions we might have added
    content = content.replace('style="background: #f4f7f6;"', 'style="background: #ffffff;"')
    content = content.replace('background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); /* Warm food background */', 'background: #ffffff;')
    
    # Just in case there's any remaining purple podium or table_bg
    content = content.replace("background: url('images/login_bg_purple_podium.png') center/cover no-repeat fixed;", "background: #ffffff;")
    content = content.replace("background: url('images/table_bg.png') center/cover no-repeat fixed;", "background: #ffffff;")

    # In index.html, we had a dark overlay that might look weird on a white background, let's remove it
    content = content.replace('background: rgba(255, 255, 255, 0.2); /* Soft light overlay for food theme */', 'background: transparent;')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("White backgrounds applied across all HTML files.")
