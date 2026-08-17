import json
import re

log_file = r"C:\Users\Hope3\.gemini\antigravity-ide\brain\3cf8c871-2ca1-423d-b6bd-5f2d10c1f9da\.system_generated\logs\transcript_full.jsonl"

def extract_step(step_idx, out_file):
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            if data.get("step_index") == step_idx and data.get("type") == "VIEW_FILE":
                content = data.get("content", "")
                lines = content.split('\n')
                clean_lines = []
                started = False
                for l in lines:
                    if l.startswith("The following code has been modified"):
                        started = True
                        continue
                    if started and l.startswith("The above content shows the entire"):
                        break
                    if started:
                        if l.find(": ") != -1:
                            clean_lines.append(l.split(": ", 1)[1].rstrip('\r'))
                        elif l.strip() == '':
                            clean_lines.append('')
                
                # Update script/css tags with cache buster
                final_content = '\n'.join(clean_lines)
                final_content = re.sub(r'styles\.css(\?v=\w+)?', 'styles.css?v=r3', final_content)
                final_content = re.sub(r'data\.js(\?v=\w+)?', 'data.js?v=r3', final_content)
                final_content = re.sub(r'script\.js(\?v=\w+)?', 'script.js?v=r3', final_content)

                with open(out_file, "w", encoding="utf-8") as out:
                    out.write(final_content)
                print(f"Extracted and cache-busted step {step_idx} to {out_file}")
                return

extract_step(4, "c:/Users/Hope3/Desktop/website/order-confirmation.html")
extract_step(13, "c:/Users/Hope3/Desktop/website/tables.html")
extract_step(16, "c:/Users/Hope3/Desktop/website/food-selection.html")
extract_step(257, "c:/Users/Hope3/Desktop/website/food-categories.html")
# Let's also restore bill.html, index.html, etc. Wait, I didn't view index.html in the log until later.
