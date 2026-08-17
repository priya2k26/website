import os

folder = r"c:\Users\Hope3\Desktop\website"
for file in os.listdir(folder):
    if file.endswith(".html"):
        filepath = os.path.join(folder, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the mangled string
        content = content.replace("â‚¹", "₹")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
print("Replaced.")
