import re


class QueryGuard:
    """
    Detects important qualifiers in a user's question.

    This does not answer the question.
    It only identifies whether the question contains
    details that require special grounding.
    """

    LOCATION_WORDS = [
        "city",
        "location",
        "near me",
        "nearby",
        "district",
        "state",
        "indore",
        "bhopal",
        "delhi",
        "mumbai",
        "bangalore",
        "pune",
    ]

    CURRENT_WORDS = [
        "current",
        "currently",
        "latest",
        "today",
        "now",
        "2026",
        "this year",
    ]

    EXACT_WORDS = [
        "exact",
        "specific",
        "precise",
        "exactly",
    ]

    def analyze(self, query):
        query_lower = query.lower().strip()

        location_requested = any(
            word in query_lower
            for word in self.LOCATION_WORDS
        )

        current_information_requested = any(
            word in query_lower
            for word in self.CURRENT_WORDS
        )

        exact_information_requested = any(
            word in query_lower
            for word in self.EXACT_WORDS
        )

        return {
            "original_query": query,
            "location_requested": location_requested,
            "current_information_requested": current_information_requested,
            "exact_information_requested": exact_information_requested,
        }


if __name__ == "__main__":
    guard = QueryGuard()

    test_queries = [
        "Who can adopt a child in India?",
        "What is the exact adoption fee in my city?",
        "What are the current adoption rules?",
    ]

    for query in test_queries:
        print("\nQuery:")
        print(query)

        print("Analysis:")
        print(guard.analyze(query))