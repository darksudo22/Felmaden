import os
from dotenv import load_dotenv
from supabase import create_client, Client
from groq import Groq
from sentence_transformers import SentenceTransformer

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

print("⏳ Loading embedding model...")
embed_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
print("✅ Embedding model loaded!")

def get_embedding(text: str):
    return embed_model.encode(text).tolist()

def add_document_to_db(file_name: str, file_content: str):
    print(f"\n🔍 [DEBUG] Processing file: {file_name}")
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

def generate_answer(query: str, context_text: str = None, history: list = []):
    """
    Generates an answer using Context + History + Query
    """
    try:
        # 1. Format the history into a string
        # We take the last 5 messages to save tokens (Memory Limit)
        recent_history = history[-5:] 
        history_text = ""
        for msg in recent_history:
            role = "User" if msg['role'] == "user" else "Assistant"
            history_text += f"{role}: {msg['content']}\n"

        # 2. Build the System Prompt
        system_prompt = """
        You are a helpful Persian academic assistant.
        - If the user refers to previous messages (like "it", "that", "he"), look at the HISTORY.
        - If the user asks about documents, look at the CONTEXT.
        - Answer in Persian.
        """

        # 3. Build the User Prompt
        if context_text:
            user_content = f"""
            HISTORY (Previous Conversation):
            {history_text}

            CONTEXT (From Documents):
            {context_text}

            USER QUESTION:
            {query}
            """
        else:
            user_content = f"""
            HISTORY (Previous Conversation):
            {history_text}

            USER QUESTION:
            {query}
            """
        
        # 4. Call Groq
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.3
        )
        return completion.choices[0].message.content
        
    except Exception as e:
        print(f"❌ [RAG] Groq Error: {e}")
        return "خطا در تولید پاسخ."

def query_rag(query_text: str, history: list = []): 
    print(f"🤔 [RAG] Processing query: {query_text}")
    
    # 1. Embed the user's question locally
    query_vector = get_embedding(query_text)
    
    # 2. Search Supabase with a stricter threshold
    # If the user asks "George Bush", it should NOT match your contract PDF.
    params = {
        "query_embedding": query_vector,
        "match_threshold": 0.5,  # <--- Increased to avoid irrelevant matches
        "match_count": 5
    }
    
    matches = []
    try:
        response = supabase.rpc("match_documents", params).execute()
        matches = response.data
    except Exception as e:
        print(f"⚠️ [WARNING] Database search failed: {e}")

    # 3. Decide Mode
    if matches:
        # Found relevant docs -> Use RAG
        print(f"✅ [RAG] Found {len(matches)} relevant chunks.")
        context_text = "\n\n".join([doc['content'] for doc in matches])
        # PASS HISTORY HERE 👇
        return generate_answer(query_text, context_text, history)
    else:
        # No docs found -> Use General Knowledge
        print("🌍 [RAG] No relevant documents found. Switching to General Knowledge.")
        # PASS HISTORY HERE 👇
        return generate_answer(query_text, context_text=None, history=history)