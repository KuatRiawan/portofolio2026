import json

log_path = "/Users/mac/.gemini/antigravity/brain/1606eb58-8cd9-4a60-9de6-cd2a7304c101/.system_generated/logs/transcript.jsonl"
content = None

with open(log_path, "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("type") == "PLANNER_RESPONSE":
                for call in data.get("tool_calls", []):
                    if call.get("name") == "write_to_file":
                        args = call.get("args", {})
                        target = args.get("TargetFile", "")
                        if "ArcadeMascot.tsx" in target:
                            content = args.get("CodeContent")
        except:
            pass

if content:
    with open("restored_mascot.tsx", "w") as f:
        f.write(content)
    print("RESTORED!")
else:
    print("NOT FOUND")
