import json
log_file = r"C:\Users\Hope3\.gemini\antigravity-ide\brain\3cf8c871-2ca1-423d-b6bd-5f2d10c1f9da\.system_generated\logs\transcript_full.jsonl"
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get("type") == "VIEW_FILE":
            content = data.get("content", "")
            if "File Path:" in content:
                path_line = [l for l in content.split('\n') if l.startswith("File Path:")][0]
                print(f"Step {data.get('step_index')}: {path_line}")
