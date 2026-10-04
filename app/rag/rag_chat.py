import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from app.rag.rag_service import RAGService


load_dotenv()


class RAGChat:
    """Generate grounded answers using CARA RAG context."""

    def __init__(self):
        self.rag = RAGService()

        self.hf_client = InferenceClient(
            token=os.getenv("HF_TOKEN"),
            provider="auto",
        )

        self.model = "deepseek-ai/DeepSeek-V3-0324"

    def answer(self, question):
        """Retrieve CARA context and generate an answer."""

        context, results = self.rag.retrieve_context(
            question,
            top_k=3,
        )

        if not context:
            return (
                "I could not find verified CARA information "
                "for this question."
            )

        system_prompt = """
You are Yuganshi, the AI assistant for AASRA.

AASRA provides adoption guidance and child-care support.

Answer the user's question using ONLY the verified CARA
context provided below.

Rules:
1. Do not invent laws, eligibility rules, fees, documents,
   procedures, timelines, or government requirements.
2. If the context does not contain enough information,
   clearly say that the available CARA knowledge does not
   provide enough information.
3. Do not present yourself as a lawyer or government official.
4. Keep the answer simple and helpful.
5. When appropriate, mention the source provided in the context.

VERIFIED CARA CONTEXT:
----------------------
"""

        system_prompt += context

        response = self.hf_client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": question.strip(),
                },
            ],
            max_tokens=300,
        )

        answer = response.choices[0].message.content.strip()

        return answer


if __name__ == "__main__":
    chatbot = RAGChat()

    question = "Who can adopt a child in India?"

    print("\nUser:")
    print(question)

    print("\nYuganshi:")
    print("=" * 70)

    answer = chatbot.answer(question)

    print(answer)