import requests

from app.rag.official_source_registry import OfficialSourceRegistry


class OfficialSourceRetriever:
    """
    Retrieves content from registered official CARA sources.

    This component only retrieves source content.
    It does not generate answers and does not call DeepSeek.
    """

    def __init__(self):
        self.registry = OfficialSourceRegistry()

    def fetch_source(self, source_id, timeout=20):
        source = self.registry.get_source(source_id)

        if source is None:
            raise ValueError(
                f"Official source not found: {source_id}"
            )

        url = source["url"]

        response = requests.get(
            url,
            timeout=timeout,
            headers={
                "User-Agent": (
                    "AASRA-Yuganshi/1.0 "
                    "(official-source-retrieval)"
                )
            },
        )

        response.raise_for_status()

        return {
            "source_id": source["id"],
            "source_name": source["name"],
            "authority": source["authority"],
            "url": url,
            "status_code": response.status_code,
            "content_type": response.headers.get(
                "content-type",
                ""
            ),
            "content": response.text,
        }


if __name__ == "__main__":
    retriever = OfficialSourceRetriever()

    result = retriever.fetch_source(
        "cara_official_website"
    )

    print("Official source retrieved successfully.")
    print("Source:", result["source_name"])
    print("Status:", result["status_code"])
    print("Content type:", result["content_type"])
    print("Content length:", len(result["content"]))