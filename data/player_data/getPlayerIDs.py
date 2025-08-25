import requests
import json
import re
import time
from datetime import datetime

# -------------------------------
# Resolve player name → Wikidata ID
# -------------------------------
def get_wikidata_id(player_name: str) -> str | None:
    url = "https://www.wikidata.org/w/api.php"
    params = {
        "action": "wbsearchentities",
        "language": "en",
        "format": "json",
        "type": "item",
        "search": player_name
    }
    r = requests.get(url, params=params).json()
    if "search" in r and len(r["search"]) > 0:
        return r["search"][0]["id"]
    return None

# -------------------------------
# Normalize years
# -------------------------------
def normalize_years(start: str | None, end: str | None) -> str:
    def extract_year(date_str):
        try:
            return datetime.fromisoformat(date_str).year
        except Exception:
            return None

    start_year = extract_year(start) if start else None
    end_year = extract_year(end) if end else None

    if start_year and end_year:
        return f"{start_year}–{end_year}"
    elif start_year and not end_year:
        return f"{start_year}–"
    elif start_year:
        return str(start_year)
    else:
        return ""

# -------------------------------
# Query Wikidata SPARQL for senior career
# -------------------------------
def get_senior_career(wikidata_id: str):
    query = f"""
    SELECT ?clubLabel ?start ?end ?apps ?goals WHERE {{
      wd:{wikidata_id} p:P54 ?statement.
      ?statement ps:P54 ?club.

      # ❌ Exclude national teams
      FILTER NOT EXISTS {{ ?club wdt:P31/wdt:P279* wd:Q6979593 }}

      OPTIONAL {{ ?statement pq:P580 ?start. }}
      OPTIONAL {{ ?statement pq:P582 ?end. }}
      OPTIONAL {{ ?statement pq:P1350 ?apps. }}
      OPTIONAL {{ ?statement pq:P1351 ?goals. }}

      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    ORDER BY ?start
    """

    url = "https://query.wikidata.org/sparql"
    headers = {"Accept": "application/json"}
    
    try:
        r = requests.get(url, params={"query": query}, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        print(f"⚠️ SPARQL query failed for {wikidata_id}: {e}")
        return []

    career = []
    for item in data.get("results", {}).get("bindings", []):
        start = item.get("start", {}).get("value", None)
        end = item.get("end", {}).get("value", None)

        career.append({
            "team": item.get("clubLabel", {}).get("value", ""),
            "years": normalize_years(start, end),
            "apps": int(item["apps"]["value"]) if "apps" in item else None,
            "goals": int(item["goals"]["value"]) if "goals" in item else None
        })
    return career

# -------------------------------
# Save JSON
# -------------------------------
def save_player_json(player_name: str, wikidata_id: str, career: list):
    safe_name = re.sub(r'\W+', '_', player_name).strip("_")
    filename = f"{safe_name}.json"

    data = {
        "id": wikidata_id,
        "name": player_name,
        "career": career
    }

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"✅ Saved {player_name} → {filename}")

# -------------------------------
# Main
# -------------------------------
def main():
    with open("players.txt", "r", encoding="utf-8") as f:
        players = [line.strip() for line in f if line.strip()]

    print(f"Loaded {len(players)} players from text file.")

    for player in players:
        wikidata_id = get_wikidata_id(player)
        if not wikidata_id:
            print(f"⚠️ Could not find Wikidata ID for {player}")
            continue

        print(f"🔎 Found {player} → {wikidata_id}")
        career = get_senior_career(wikidata_id)
        save_player_json(player, wikidata_id, career)

        time.sleep(1)  # 💤 be polite to Wikidata

if __name__ == "__main__":
    main()
