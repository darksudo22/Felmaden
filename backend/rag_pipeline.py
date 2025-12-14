import os
from dotenv import load_dotenv
from supabase import create_client, Client
from groq import Groq
from sentence_transformers import SentenceTransformer

# 1. Setup
load_dotenv()

# --- Setup Supabase ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Setup Groq ---
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# --- Setup Embeddings ---
print("⏳ Loading embedding model...")
embed_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
print("✅ Embedding model loaded!")

def get_embedding(text: str):
    return embed_model.encode(text).tolist()

# 👇 این همان تابعی است که سیستم شما می‌گوید گم شده است 👇
def add_document_to_db(file_name: str, file_content: str):
    print(f"\n🔍 [DEBUG] Processing file: {file_name}")
    
    # تقسیم متن به تکه‌های کوچکتر
    chunk_size = 500
    chunks = [file_content[i:i+chunk_size] for i in range(0, len(file_content), chunk_size)]
    
    print(f"📄 Processing {len(chunks)} chunks...")

    for i, chunk in enumerate(chunks):
        vector = get_embedding(chunk)
        data = {
            "content": chunk,
            "metadata": {"file_name": file_name, "chunk_index": i},
            "embedding": vector
        }
        supabase.table("documents").insert(data).execute()
    
    print(f"✅ Successfully added {file_name} to database.")

def generate_answer(query: str, context_text: str):
    try:
        prompt = f"""
        You are a helpful Persian academic assistant. 
        Answer the user's question using ONLY the context provided below.
        If the answer is not in the context, say "I don't know" in Persian.
        
        Context:
        {context_text}
        
        User Question:
        {query}
        
        Answer (in Persian):
        """
        
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"❌ [RAG] Groq Error: {e}")
        return "خطا در تولید پاسخ."

def query_rag(query_text: str):
    print(f"🤔 [RAG] Processing query: {query_text}")
    query_vector = get_embedding(query_text)
    
    params = {
        "query_embedding": query_vector,
        "match_threshold": 0.0, # حساسیت صفر برای تست
        "match_count": 5
    }
    
    try:
        response = supabase.rpc("match_documents", params).execute()
        matches = response.data
    except Exception as e:
        print(f"❌ [RAG] Supabase Search Error: {e}")
        return "خطا در جستجو."

    if not matches:
        return "متاسفانه هیچ اطلاعاتی پیدا نکردم."
        
    context_text = "\n\n".join([doc['content'] for doc in matches])
    return generate_answer(query_text, context_text)