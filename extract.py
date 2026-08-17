import json
import re

transcript_path = r"C:\Users\Hope3\.gemini\antigravity-ide\brain\3cf8c871-2ca1-423d-b6bd-5f2d10c1f9da\.system_generated\logs\transcript_full.jsonl"

def extract_original_file(filename):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get("type") == "TOOL_RESPONSE" and data.get("tool_calls"):
                    for tc in data.get("tool_calls", []):
                        if tc.get("tool_name") == "view_file" or tc.get("tool_name") == "default_api:view_file":
                            content = tc.get("response", {}).get("output", "")
                            if f"File Path: ile:///c:/Users/Hope3/Desktop/website/{filename}" in content:
                                return content
            except:
                pass
    return None

script_content = extract_original_file("script.js")
if script_content:
    print(f"FOUND script.js. length: {len(script_content)}")
    with open("c:/Users/Hope3/Desktop/website/script_original.txt", "w", encoding="utf-8") as out:
        out.write(script_content)

styles_content = extract_original_file("styles.css")
if styles_content:
    print(f"FOUND styles.css. length: {len(styles_content)}")
    with open("c:/Users/Hope3/Desktop/website/styles_original.txt", "w", encoding="utf-8") as out:
        out.write(styles_content)
        
data_content = extract_original_file("data.js")
if data_content:
    print(f"FOUND data.js. length: {len(data_content)}")
    with open("c:/Users/Hope3/Desktop/website/data_original.txt", "w", encoding="utf-8") as out:
        out.write(data_content)
