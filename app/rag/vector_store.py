import chromadb

from app.rag.ingest import load_cara_faqs, create_documents
from app.rag.embeddings import EmbeddingModel


CHROMA_PATH = "app/vectorstore/chroma"
COLLECTION_NAME = "cara_faq"


def build_vector_store():
    print("Loading CARA FAQ dataset...")

    _, faqs = load_cara_faqs()
    documents = create_documents(faqs)

    print(f"Documents loaded: {len(documents)}")

    print("\nLoading embedding model...")
    embedding_model = EmbeddingModel()

    print("\nCreating ChromaDB...")
    client = chromadb.PersistentClient(path=CHROMA_PATH)

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "CARA FAQ knowledge base for AASRA RAG"},
    )

    texts = [document["text"] for document in documents]
    metadata = [document["metadata"] for document in documents]
    ids = [document["metadata"]["faq_id"] for document in documents]

    print("\nGenerating embeddings...")
    embeddings = embedding_model.encode(texts)

    print("\nStoring documents in ChromaDB...")

    collection.upsert(
        ids=ids,
        documents=texts,
        embeddings=embeddings.tolist(),
        metadatas=metadata,
    )

    print("\nVector store created successfully.")
    print("Collection:", COLLECTION_NAME)
    print("Documents stored:", collection.count())


if __name__ == "__main__":
    build_vector_store()