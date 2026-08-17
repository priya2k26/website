import json
log_file = r"C:\Users\Hope3\.gemini\antigravity-ide\brain\3cf8c871-2ca1-423d-b6bd-5f2d10c1f9da\.system_generated\logs\transcript_full.jsonl"
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        if "data.js" in line or "script.js" in line:
            print(f"FOUND MATCH IN TYPE: {json.loads(line).get('type')} at step {json.loads(line).get('step_index')}")
