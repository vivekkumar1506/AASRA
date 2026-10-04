import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_FILE = (
    BASE_DIR
    / "knowledge"
    / "metadata"
    / "official_sources.json"
)


class OfficialSourceRegistry:
    """
    Loads the official CARA source registry.

    This component does not fetch or generate answers.
    It only provides trusted source metadata to the
    current-information retrieval layer.
    """

    def __init__(self):
        self.sources = self._load_sources()

    def _load_sources(self):
        if not SOURCE_FILE.exists():
            raise FileNotFoundError(
                f"Official source registry not found: {SOURCE_FILE}"
            )

        with open(SOURCE_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        sources = data.get("sources", [])

        if not sources:
            raise ValueError(
                "No official sources found in the registry."
            )

        return sorted(
            sources,
            key=lambda source: source.get("priority", 999)
        )

    def get_all_sources(self):
        return self.sources

    def get_source(self, source_id):
        for source in self.sources:
            if source.get("id") == source_id:
                return source

        return None


if __name__ == "__main__":
    registry = OfficialSourceRegistry()

    print("Official CARA source registry loaded.")
    print("Sources:", len(registry.get_all_sources()))

    for source in registry.get_all_sources():
        print(
            f"{source['priority']}. "
            f"{source['name']}"
        )