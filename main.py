import sys
import os

# Add ai-service to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "ai-service"))

from main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
