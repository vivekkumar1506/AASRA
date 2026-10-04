from sentence_transformers import SentenceTransformer


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


class EmbeddingModel:
    """Wrapper around the sentence-transformers embedding model."""

    def __init__(self):
        print(f"Loading embedding model: {MODEL_NAME}")
        self.model = SentenceTransformer(MODEL_NAME)
        print(
            f"Embedding model loaded. "
            f"Dimensions: {self.model.get_embedding_dimension()}"
        )

    def encode(self, texts):
        """Convert text into numerical embeddings."""

        return self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True,
        )


if __name__ == "__main__":
    embedding_model = EmbeddingModel()

    test_text = [
        "What is CARA?",
        "What is the adoption process in India?",
    ]

    embeddings = embedding_model.encode(test_text)

    print("\nEmbedding test successful.")
    print("Number of texts:", len(embeddings))
    print("Vector dimensions:", len(embeddings[0]))