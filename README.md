# Persian AI Copilot 🤖🇮🇷

A comprehensive Persian language AI assistant that can process PDF documents and answer questions using Retrieval-Augmented Generation (RAG) technology.

## Features

- 📄 **PDF Document Processing**: Upload and process Persian PDF documents
- 🧠 **RAG Pipeline**: Advanced retrieval-augmented generation for accurate answers
- 🌐 **Persian Language Support**: Full RTL (Right-to-Left) interface and Persian text processing
- 🔍 **Vector Search**: Local embeddings with multilingual sentence transformers
- 💬 **Interactive Chat**: Clean, modern chat interface for document Q&A
- 🚀 **FastAPI Backend**: High-performance Python backend with async support
- 🗄️ **Supabase Integration**: Vector database for document storage and similarity search

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - Modern Python web framework
- **Sentence Transformers** - Local multilingual embeddings
- **Groq API** - Fast LLM inference for Persian text generation
- **PyPDF** - PDF text extraction
- **Supabase** - PostgreSQL with vector extensions

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Supabase account
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/darksudo22/Felmaden.git
   cd persian-copilot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create `backend/.env`:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Supabase Setup**
   Run the SQL in `backend/supabase_setup.sql` in your Supabase SQL editor to create the vector search function.

5. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

6. **Start Backend**
   ```bash
   cd backend
   python main.py
   ```

## Usage

1. Open [http://localhost:3000/chat](http://localhost:3000/chat)
2. Upload a Persian PDF document
3. Ask questions about the document content
4. Get AI-powered answers in Persian

## API Endpoints

### Backend (FastAPI)
- `POST /upload` - Upload and process PDF documents
- `POST /chat` - Ask questions about uploaded documents
- `GET /` - Health check

### Request Examples

Upload PDF:
```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@document.pdf" \
  -F "user_id=user123"
```

Ask Question:
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "چه موضوعاتی در این سند پوشش داده شده؟",
    "user_id": "user123"
  }'
```

## Project Structure

```
persian-copilot/
├── app/                    # Next.js frontend
│   ├── chat/
│   │   └── page.tsx       # Chat interface
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── backend/               # FastAPI backend
│   ├── main.py           # API server
│   ├── rag_pipeline.py   # RAG implementation
│   ├── supabase_setup.sql # Database setup
│   └── .env              # Environment variables
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with ❤️ for Persian language AI applications
- Special thanks to the open-source community for amazing tools
