-- Create the match_documents RPC function for vector similarity search
-- This function finds the most similar document chunks using cosine similarity

CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(768),  -- 768 dimensions for text-embedding-004
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 5
)
RETURNS TABLE(
    id bigint,
    user_id text,
    filename text,
    content text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.user_id,
        d.filename,
        d.content,
        1 - (d.embedding <=> query_embedding) AS similarity
    FROM documents d
    WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;