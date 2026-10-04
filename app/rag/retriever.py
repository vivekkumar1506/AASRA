import chromadb

from app.rag.embeddings import EmbeddingModel


CHROMA_PATH = "app/vectorstore/chroma"
COLLECTION_NAME = "cara_faq"


class CARARetriever:
    """Search the CARA FAQ knowledge base."""

    def __init__(self):
        print("Connecting to ChromaDB...")

        self.client = chromadb.PersistentClient(
            path=CHROMA_PATH
        )

        self.collection = self.client.get_collection(
            name=COLLECTION_NAME
        )

        print(
            f"Connected to collection '{COLLECTION_NAME}' "
            f"with {self.collection.count()} documents."
        )

        self.embedding_model = EmbeddingModel()

    def search(self, query, top_k=3, max_distance=0.65):
        """Retrieve relevant CARA FAQ documents."""

        query_embedding = self.embedding_model.encode([query])

        results = self.collection.query(
            query_embeddings=query_embedding.tolist(),
            n_results=top_k,
        )

        retrieved_documents = []

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances,
        ):
            if distance <= max_distance:
                retrieved_documents.append(
                    {
                        "text": document,
                        "metadata": metadata,
                        "distance": distance,
                    }
                )

        return retrieved_documents


if __name__ == "__main__":
    retriever = CARARetriever()

    query = "What is CARA?"

    print("\nQuery:")
    print(query)

    results = retriever.search(
        query,
        top_k=3,
    )

    print("\nRetrieved results:")
    print("=" * 70)

    for index, result in enumerate(results, start=1):
        print(f"\nResult {index}")
        print("-" * 70)
        print(result["text"])
        print("Metadata:", result["metadata"])
        print("Distance:", result["distance"])