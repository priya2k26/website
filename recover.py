import json
import re

log_file = r"C:\Users\Hope3\.gemini\antigravity-ide\brain\3cf8c871-2ca1-423d-b6bd-5f2d10c1f9da\.system_generated\logs\transcript_full.jsonl"

def recover_file(filename, output_path):
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get("type") == "VIEW_FILE" or data.get("type") == "TOOL_RESPONSE":
                    content = data.get("content", "")
                    if not content and "tool_calls" in data:
                        for tc in data.get("tool_calls", []):
                            content = tc.get("response", {}).get("output", "")
                            if f"File Path: ile:///c:/Users/Hope3/Desktop/website/{filename}" in content:
                                break
                    if f"File Path: ile:///c:/Users/Hope3/Desktop/website/{filename}" in content:
                        print(f"Found {filename}!")
                        extracted_lines = []
                        for l in content.split('\n'):
                            m = re.match(r'^\d+: (.*)', l)
                            if m:
                                extracted_lines.append(m.group(1))
                            elif l.strip() == '' and extracted_lines:
                                extracted_lines.append('')
                        
                        if extracted_lines:
                            with open(output_path, "w", encoding="utf-8") as out:
                                out.write('\n'.join(extracted_lines))
                            return True
            except Exception as e:
                pass
    print(f"Could not find {filename}")
    return False

recover_file("script.js", "c:/Users/Hope3/Desktop/website/script_restored.js")
recover_file("styles.css", "c:/Users/Hope3/Desktop/website/styles_restored.css")
recover_file("data.js", "c:/Users/Hope3/Desktop/website/data_restored.js")
