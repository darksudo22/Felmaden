import os
import google.generativeai as genai
from dotenv import load_dotenv

# Try to load from .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# --- FALLBACK: If .env fails, ask the user manually ---
if not api_key:
    print("⚠️  .env file not found or empty.")
    api_key = input("🔑 Please paste your GOOGLE_API_KEY here and press Enter: ").strip()

if not api_key:
    print("❌ Error: No API Key provided.")
else:
    print(f"\n✅ Using API Key: {api_key[:5]}...*****")
    genai.configure(api_key=api_key)

    print("\n🔍 contacting Google API to list available models...\n")
    
    try:
        found_any = False
        for m in genai.list_models():
            # Filter for models that can generate text
            if 'generateContent' in m.supported_generation_methods:
                print(f"👉 {m.name}")
                found_any = True
        
        if not found_any:
            print("⚠️ No text-generation models found. This API key might have limited permissions.")
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")