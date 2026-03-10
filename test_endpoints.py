import urllib.request
import urllib.error
import json

base_url = "http://127.0.0.1:8431"

print("--- Test 4: 404 Error Format ---")
try:
    with urllib.request.urlopen(f"{base_url}/nonexistent-route") as response:
        print("Status Code:", response.getcode())
        print("Response:", response.read().decode())
except urllib.error.HTTPError as e:
    print("Status Code:", e.code)
    print("Response:", e.read().decode())
except Exception as e:
    print("Error:", e)

print("\n--- Test 3: Rate Limiting ---")
req = urllib.request.Request(f"{base_url}/api/tokenize", data=json.dumps({"text": "hello"}).encode(), headers={"Content-Type": "application/json"})
for i in range(1, 35):
    try:
        with urllib.request.urlopen(req) as response:
            pass
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print(f"Request {i} hit rate limit!")
            print("Status Code:", e.code)
            print("Response:", e.read().decode())
            break
    if i == 34:
        print("Rate limit not hit.")
