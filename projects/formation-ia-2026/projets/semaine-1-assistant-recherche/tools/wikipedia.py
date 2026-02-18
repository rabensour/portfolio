"""
Outil de recherche Wikipedia
"""

import wikipedia


def search_wikipedia(query: str, max_results: int = 3) -> list:
    """
    Recherche sur Wikipedia

    Args:
        query: Requête de recherche
        max_results: Nombre maximum de résultats

    Returns:
        Liste de résultats avec titre et résumé
    """
    try:
        # Rechercher les pages pertinentes
        search_results = wikipedia.search(query, results=max_results)

        results = []
        for title in search_results:
            try:
                # Récupérer le résumé de chaque page
                summary = wikipedia.summary(title, sentences=3)
                page = wikipedia.page(title)

                results.append({
                    "title": title,
                    "summary": summary,
                    "url": page.url,
                    "source": "Wikipedia"
                })
            except wikipedia.exceptions.DisambiguationError as e:
                # Page d'ambiguïté, prendre la première option
                if e.options:
                    try:
                        summary = wikipedia.summary(e.options[0], sentences=3)
                        page = wikipedia.page(e.options[0])
                        results.append({
                            "title": e.options[0],
                            "summary": summary,
                            "url": page.url,
                            "source": "Wikipedia"
                        })
                    except:
                        continue
            except:
                continue

        return results

    except Exception as e:
        print(f"Erreur Wikipedia : {e}")
        return []


# Test
if __name__ == "__main__":
    results = search_wikipedia("Python programming language")
    for result in results:
        print(f"\n{result['title']}")
        print(f"{result['summary']}")
        print(f"Source : {result['url']}")
