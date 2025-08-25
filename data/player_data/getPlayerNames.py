import requests
import json
from collections import defaultdict
import time

# -------------------------------
# SPARQL query template for paginated fetching
# -------------------------------
SPARQL_QUERY_TEMPLATE = """
SELECT ?player ?playerLabel ?nationalityLabel ?sitelinks WHERE {
  ?player wdt:P106 wd:Q937857;                  # occupation football player
          wdt:P54 ?team;                        # member of sports team
          wdt:P27 ?nationality;                 # nationality
          wikibase:sitelinks ?sitelinks.        # number of Wikipedia sitelinks
  ?team wdt:P118 ?league.                       # team is part of a league
  VALUES ?league { wd:Q9448 wd:Q324867 wd:Q32495 wd:Q15804 wd:Q1478437 wd:Q82595 }  # UEFA CL, Premier League, La Liga, Serie A, Bundesliga, Ligue 1
  ?article schema:about ?player;
           schema:isPartOf <https://en.wikipedia.org/>.  # has English Wikipedia article
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?sitelinks)
LIMIT %d
OFFSET %d
"""

# -------------------------------
# Function to run SPARQL query with retries and exponential backoff
# -------------------------------
def run_sparql(query: str, max_retries=3):
    url = "https://query.wikidata.org/sparql"
    headers = {"Accept": "application/json"}
    for attempt in range(max_retries):
        try:
            r = requests.get(url, params={"query": query}, headers=headers, timeout=30)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            print(f"⚠️ SPARQL query failed (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                delay = 5 * (2 ** attempt)  # Exponential backoff: 5s, 10s, 20s
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
    print("❌ All retries failed for this query chunk.")
    return None

# -------------------------------
# Extract player names, nationalities, and sitelinks
# -------------------------------
def extract_player_names_and_nationalities(data):
    players = []
    if not data:
        return players
    for item in data.get("results", {}).get("bindings", []):
        name = item.get("playerLabel", {}).get("value")
        nationality = item.get("nationalityLabel", {}).get("value", "Unknown")
        sitelinks = int(item.get("sitelinks", {}).get("value", "0"))
        if name:
            players.append({"name": name, "nationality": nationality, "sitelinks": sitelinks})
    return players

# -------------------------------
# Select diverse players by nationality
# -------------------------------
def select_diverse_players(players, max_per_nationality=100):
    # Group players by nationality
    nationality_groups = defaultdict(list)
    for player in players:
        nationality_groups[player["nationality"]].append(player)
    
    # Take up to max_per_nationality players per nationality
    diverse_players = []
    for nationality, group in nationality_groups.items():
        sorted_group = sorted(group, key=lambda x: x["sitelinks"], reverse=True)
        diverse_players.extend(sorted_group[:max_per_nationality])
    
    # Sort final list by sitelinks
    diverse_players = sorted(diverse_players, key=lambda x: x["sitelinks"], reverse=True)
    return diverse_players

# -------------------------------
# Fetch players with pagination
# -------------------------------
def fetch_paginated_players(total_limit=5000, page_size=500):
    players = []
    offset = 0
    while offset < total_limit:
        limit = min(page_size, total_limit - offset)
        print(f"Fetching players {offset + 1}–{offset + limit}...")
        query = SPARQL_QUERY_TEMPLATE % (limit, offset)
        data = run_sparql(query)
        if not data:
            print(f"⚠️ Failed to fetch players at offset {offset}. Stopping pagination.")
            break
        page_players = extract_player_names_and_nationalities(data)
        players.extend(page_players)
        if len(page_players) < limit:  # No more results
            break
        offset += limit
    return players

# -------------------------------
# Main
# -------------------------------
def main():
    print("🔎 Querying Wikidata for notable football players...")
    players = fetch_paginated_players(total_limit=5000, page_size=500)
    
    if not players:
        print("❌ No players fetched from Wikidata.")
        return

    print("📊 Processing players for diversity and popularity...")
    MAX_PER_NATIONALITY = 100
    notable_players = select_diverse_players(players, max_per_nationality=MAX_PER_NATIONALITY)
    
    print(f"✅ Found {len(notable_players)} notable players sorted by Wikipedia sitelinks:")
    for i, player in enumerate(notable_players[:20]):  # Show top 20 for brevity
        print(f"  - {player['name']} ({player['nationality']}, {player['sitelinks']} sitelinks)")
    if len(notable_players) > 20:
        print(f"  ... and {len(notable_players) - 20} more")

    # Save only player names to text file
    txt_file = "notable_players.txt"
    with open(txt_file, "w", encoding="utf-8") as f:
        for player in notable_players:
            f.write(f"{player['name']}\n")
    print(f"✅ Player names saved to {txt_file}")

if __name__ == "__main__":
    main()