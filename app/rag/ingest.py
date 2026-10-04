import json
from pathlib import Path


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_FILE = BASE_DIR / "knowledge" / "documents" / "cara_faq.json"


def load_cara_faqs():
    """Load the CARA FAQ dataset."""

    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(
            f"CARA FAQ file not found: {KNOWLEDGE_FILE}"
        )

    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    faqs = data.get("faqs", [])

    if not faqs:
        raise ValueError("No FAQ records found in the CARA dataset.")

    return data, faqs


def create_documents(faqs):
    """
    Convert each CARA FAQ into a RAG document.

    Each FAQ becomes one document with:
    - question
    - answer
    - metadata
    """

    documents = []

    for faq in faqs:
        document_text = (
            f"Question: {faq['question']}\n"
            f"Answer: {faq['answer']}"
        )

        metadata = {
            "faq_id": faq["id"],
            "topic": faq["topic"],
            "adoption_type": faq["adoption_type"],
            "source": faq["source"],
        }

        documents.append(
            {
                "text": document_text,
                "metadata": metadata,
            }
        )

    return documents


def main():
    print("Loading CARA FAQ knowledge base...")

    dataset, faqs = load_cara_faqs()

    print(f"Dataset: {dataset['dataset_name']}")
    print(f"FAQ records found: {len(faqs)}")

    documents = create_documents(faqs)

    print(f"RAG documents created: {len(documents)}")

    print("\nSample document:")
    print("-" * 60)
    print(documents[0]["text"])

    print("\nMetadata:")
    print(documents[0]["metadata"])


if __name__ == "__main__":
    main()