from app.rag.pipeline import RAGPipeline
from app.rag.answer_generator import AnswerGenerator


class RAGChatPipeline:
    """
    Complete Yuganshi RAG pipeline.

    Flow:

    User Question
        ↓
    QueryGuard
        ↓
    CARA Retrieval
        ↓
    Grounding Decision
        ↓
    DeepSeek
        ↓
    Final Answer
    """

    def __init__(self):
        self.pipeline = RAGPipeline()
        self.answer_generator = AnswerGenerator()

    def answer(self, question):

        result = self.pipeline.process(question)

        decision = result["decision"]

        # -------------------------------------------------
        # CASE 1: Retrieved information is not sufficient
        # -------------------------------------------------

        if not decision["can_answer"]:

            reason = decision["reason"]

            if reason == "current_information_requires_verification":
               return (
    "I don't have verified real-time CARA information for this question. "
    "For the latest adoption rules, regulations, announcements, fees, "
    "and other current official information, please check the "
    "CARA official website: https://cara.wcd.gov.in/"
)

            if reason == "location_specific_information_not_verified":
                return (
                    "The available CARA knowledge does not provide "
                    "verified location-specific information for this "
                    "question."
                )

            if reason == "exact_information_not_confidently_retrieved":
                return (
                    "I could not find sufficiently reliable CARA "
                    "information to answer this exact question."
                )

            return (
                "I could not find verified CARA information "
                "sufficient to answer this question."
            )

        # -------------------------------------------------
        # CASE 2: Verified context is suitable
        # -------------------------------------------------

        return self.answer_generator.generate(
            question=question,
            context=result["context"],
        )


if __name__ == "__main__":

    chatbot = RAGChatPipeline()

    test_queries = [
        "Who can adopt a child in India?",
        "What is the exact adoption fee in my city?",
        "What are the current adoption rules?",
    ]

    for question in test_queries:

        print("\n" + "=" * 70)
        print("USER:")
        print(question)

        print("\nYUGANSHI:")
        print("-" * 70)

        answer = chatbot.answer(question)

        print(answer)