# -*- coding: utf-8 -*-
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Lire les reviews
with open("reviews.json", "r", encoding="utf-8") as f:
    reviews = json.load(f)

# Analyser chaque review
analyzed_reviews = []
for review in reviews:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"Review: {review['text']}\nAnalyse: sentiment, points clés, suggestions. Format JSON: {{\"sentiment\":\"positif/négatif/neutre\",\"points_cles\":[],\"suggestions\":[]}}"
        }],
        temperature=0,
        max_tokens=300
    )

    analysis = json.loads(response.choices[0].message.content)
    analyzed_reviews.append({
        "author": review["author"],
        "date": review["date"],
        "text": review["text"],
        **analysis
    })
    print(f"✓ Analysé: {review['author']}")

# Générer le résumé global
summary_prompt = "Reviews:\n" + "\n".join([
    f"- {r['sentiment']}: {', '.join(r['points_cles'][:2])}"
    for r in analyzed_reviews
])
summary_prompt += "\n\nRésumé global (3-5 phrases) avec recommandations principales. JSON: {\"resume\":\"\",\"points_forts\":[],\"axes_amelioration\":[]}"

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": summary_prompt}],
    temperature=0,
    max_tokens=400
)

global_summary = json.loads(response.choices[0].message.content)

# Sauvegarder les résultats
results = {
    "reviews_analyzed": len(analyzed_reviews),
    "summary": global_summary,
    "reviews": analyzed_reviews
}

with open("results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n✅ Analyse terminée! {len(analyzed_reviews)} reviews analysées → results.json")
