from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import io
import rag_pipeline
from pydantic import BaseModel

app = FastAPI()

# تنظیمات CORS برای اجازه دسترسی فرانت‌اند
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    user_id: str = "default_user"

@app.get("/")
def read_root():
    return {"message": "Persian Copilot Backend is Running 🚀"}

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    print(f"💬 [SERVER] Chat Request: {request.query}")
    response = rag_pipeline.query_rag(request.query)
    print("💬 [SERVER] Sending Answer...")
    return {"answer": response}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"📂 [SERVER] Receiving file: {file.filename}")
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        # 1. خواندن فایل به صورت باینری
        file_bytes = await file.read()
        
        # 2. استخراج متن از PDF
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        full_text = ""
        
        print(f"📄 [SERVER] Extracting text from {len(reader.pages)} pages...")
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text += text + "\n"
            else:
                print(f"⚠️ [WARNING] Page {i+1} is empty or scanned image.")

        # 3. بررسی اینکه آیا متنی پیدا شد؟
        if not full_text.strip():
            print("❌ [ERROR] PDF content is empty! It might be an image scan.")
            return {"status": "error", "message": "متن فایل قابل خواندن نیست. شاید فایل اسکن شده است؟"}

        # 4. ذخیره در دیتابیس
        print(f"✅ [SERVER] Extracted {len(full_text)} characters.")
        rag_pipeline.add_document_to_db(file.filename, full_text)
        
        return {"status": "success", "filename": file.filename, "chars_extracted": len(full_text)}

    except Exception as e:
        print(f"❌ [UPLOAD ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))