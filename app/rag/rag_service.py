from app.rag.retriever import CARARetriever
from app.rag.query_guard import QueryGuard


class RAGService:
    def __init__(self):
        self.retriever = CARARetriever()
        self.query_guard = QueryGuard()

    def retrieve_context(self, query, top_k=3):
        query_analysis = self.query_guard.analyze(query)

        results = self.retriever.search(
            query=query,
            top_k=top_k,
        )

        if not results:
            return "", [], query_analysis

        context_parts = []

        for index, result in enumerate(results, start=1):
            metadata = result["metadata"]

            context_parts.append(
                f"RETRIEVED DOCUMENT {index}\n"
                f"FAQ ID: {metadata.get('faq_id', 'unknown')}\n"
                f"Source: {metadata.get('source', 'CARA')}\n"
                f"Topic: {metadata.get('topic', 'general')}\n"
                f"Adoption Type: "
                f"{metadata.get('adoption_type', 'all')}\n"
                f"Similarity Distance: "
                f"{result['distance']:.4f}\n"
                f"{result['text']}"
            )

        context = "\n\n" + (
            "\n" + "-" * 70 + "\n\n"
        ).join(context_parts)

        return context, results, query_analysis


if __name__ == "__main__":
    rag = RAGService()

    test_queries = [
        "Who can adopt a child in India?",
        "What is the exact adoption fee in my city?",
        "What are the current adoption rules?",
    ]

    for query in test_queries:

        print("\n" + "=" * 70)
        print("QUERY:")
        print(query)

        context, results, analysis = rag.retrieve_context(
            query,
            top_k=3,
        )

        print("\nQUERY ANALYSIS:")
        print(analysis)

        print("\nRETRIEVED RESULTS:")
        print("Number of results:", len(results))

        if context:
            print(context)
        else:
            print("No verified CARA context found.")