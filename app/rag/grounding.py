class GroundingDecision:
    """
    Decides whether retrieved CARA information is suitable
    for answering the user's question.

    This layer does not generate the final answer.
    """

    def evaluate(self, query_analysis, results):

        if query_analysis["current_information_requested"]:
            return {
                "can_answer": False,
                "reason": "current_information_requires_verification",
            }

        if not results:
            return {
                "can_answer": False,
                "reason": "no_retrieved_context",
            }

        if query_analysis["location_requested"]:
            return {
                "can_answer": False,
                "reason": "location_specific_information_not_verified",
            }

        if query_analysis["exact_information_requested"]:
            best_distance = results[0]["distance"]

            if best_distance > 0.60:
                return {
                    "can_answer": False,
                    "reason": "exact_information_not_confidently_retrieved",
                }

        return {
            "can_answer": True,
            "reason": "retrieved_context_is_suitable",
        }


if __name__ == "__main__":
    grounding = GroundingDecision()

    test_cases = [
        {
            "analysis": {
                "location_requested": False,
                "current_information_requested": False,
                "exact_information_requested": False,
            },
            "results": [
                {"distance": 0.4025}
            ],
        },
        {
            "analysis": {
                "location_requested": True,
                "current_information_requested": False,
                "exact_information_requested": True,
            },
            "results": [
                {"distance": 0.6261}
            ],
        },
        {
            "analysis": {
                "location_requested": False,
                "current_information_requested": True,
                "exact_information_requested": False,
            },
            "results": [],
        },
    ]

    for index, case in enumerate(test_cases, start=1):
        decision = grounding.evaluate(
            case["analysis"],
            case["results"],
        )

        print(f"\nTest Case {index}")
        print("Decision:", decision)