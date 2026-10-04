from app.rag.rag_service import RAGService
from app.rag.grounding import GroundingDecision


class RAGPipeline:
    """
    Coordinates the AASRA RAG pipeline.

    Flow:
    User Query
        ↓
    QueryGuard
        ↓
    CARA Retriever
        ↓
    Grounding Decision
    """

    def __init__(self):
        self.rag_service = RAGService()
        self.grounding = GroundingDecision()

    def process(self, query):
        context, results, query_analysis = (
            self.rag_service.retrieve_context(
                query=query,
                top_k=3,
            )
        )

        decision = self.grounding.evaluate(
            query_analysis=query_analysis,
            results=results,
        )

        return {
            "query": query,
            "query_analysis": query_analysis,
            "results": results,
            "context": context,
            "decision": decision,
        }


if __name__ == "__main__":
    pipeline = RAGPipeline()

    test_queries = [
        "Who can adopt a child in India?",
        "What is the exact adoption fee in my city?",
        "What are the current adoption rules?",
    ]

    for query in test_queries:

        print("\n" + "=" * 70)
        print("USER QUERY:")
        print(query)

        result = pipeline.process(query)

        print("\nQUERY ANALYSIS:")
        print(result["query_analysis"])

        print("\nGROUNDING DECISION:")
        print(result["decision"])

        print("\nRETRIEVED DOCUMENTS:")
        print("Count:", len(result["results"]))

        for index, item in enumerate(
            result["results"],
            start=1,
        ):
            print(
                f"{index}. "
                f"{item['metadata'].get('faq_id')} "
                f"| distance={item['distance']:.4f}"
            )