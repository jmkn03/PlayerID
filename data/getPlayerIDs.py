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
    headers = {"User-Agent": "PlayerCareerQuiz/1.0 (your_email@example.com)"}

    try:
        r = requests.get(url, params=params, headers=headers, timeout=15)
        r.raise_for_status()
        data = r.json()
    except requests.exceptions.JSONDecodeError:
        print(f"⚠️ Could not decode JSON for player '{player_name}'. Response text:")
        print(r.text[:200])  # print first 200 chars of raw response
        return None
    except Exception as e:
        print(f"⚠️ Request failed for '{player_name}': {e}")
        return None

    if "search" in data and len(data["search"]) > 0:
        return data["search"][0]["id"]
    return None


# -------------------------------
# Normalize years
# -------------------------------
def normalize_years(start: int | None, end: int | None) -> str:
    if start and end:
        return f"{start}–{end}"
    elif start and not end:
        return f"{start}–"
    elif start:
        return str(start)
    return ""

# -------------------------------
# Query Wikidata SPARQL for senior career
# -------------------------------
def parse_year(value):
    """Return the year as int if value looks like a date, else None."""
    if not value:
        return None
    # ISO date usually starts with 4-digit year
    match = re.match(r"^(\d{4})", value)
    if match:
        return int(match.group(1))
    return None

def get_senior_career(wikidata_id: str):
    query = f"""
    SELECT ?clubLabel ?start ?end ?apps ?goals WHERE {{
      wd:{wikidata_id} p:P54 ?statement.
      ?statement ps:P54 ?club.

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

    entries = []
    for item in data.get("results", {}).get("bindings", []):
        start = parse_year(item.get("start", {}).get("value"))
        end = parse_year(item.get("end", {}).get("value"))
        entries.append({
            "team": item.get("clubLabel", {}).get("value", ""),
            "start": start,
            "end": end,
            "apps": int(item["apps"]["value"]) if "apps" in item else None,
            "goals": int(item["goals"]["value"]) if "goals" in item else None,
        })

    # Sort by start year
    entries.sort(key=lambda x: x["start"] or 0)

    career = []
    owner_periods = {}

    for e in entries:
        team_name = e["team"]
        start_i = e["start"] or 0
        end_i = e["end"] or 9999
        loan = False

        # Check if this stint is fully contained in any owner period (other clubs)
        for owner_team, (owner_start, owner_end) in owner_periods.items():
            if start_i >= owner_start and end_i <= owner_end:
                loan = True
                break

        # If this is the first time we see this club, record its owner period
        if team_name not in owner_periods:
            owner_periods[team_name] = (start_i, end_i)

        career.append({
            "team": team_name,
            "years": normalize_years(e["start"], e["end"]),
            "apps": e["apps"],
            "goals": e["goals"],
            "loan": loan,
        })

    return career

# -------------------------------
# Difficulty scoring
# -------------------------------
def compute_difficulty(career: list) -> dict:
    score = 50  # start from a neutral baseline

    big_clubs = {
        "FC Barcelona", "Real Madrid", "Atlético de Madrid",
        "Manchester United", "Manchester City", "Liverpool", "Chelsea", "Arsenal", "Tottenham Hotspur",
        "Bayern Munich", "Borussia Dortmund",
        "Juventus", "AC Milan", "Inter Milan", "Napoli",
        "Paris Saint-Germain", "Olympique Lyonnais", "Olympique de Marseille",
        "Ajax", "PSV Eindhoven",
        "Porto", "Benfica"
    }

    clubs = [e["team"] for e in career if e.get("team")]
    unique_clubs = set(clubs)

    # --- Rules ---
    # 1. Last club big? (easiest clue)
    if clubs and clubs[-1] in big_clubs:
        score += 25

    # 2. First club big? (harder, less recognizable)
    if clubs and clubs[0] in big_clubs:
        score -= 10

    # 3. Few clubs total
    if len(unique_clubs) <= 3:
        score += 20
    elif len(unique_clubs) > 8:
        score -= 20

    # 4. Any big club at all
    if any(club in big_clubs for club in unique_clubs):
        score += 15
    else:
        score -= 15

    # 5. Loans (confusing = harder)
    num_loans = sum(1 for e in career if e.get("loan"))
    score -= min(num_loans * 5, 15)

    # --- Normalize ---
    score = max(0, min(100, score))

    if score >= 70:
        difficulty = "Easy"
    elif score >= 40:
        difficulty = "Medium"
    else:
        difficulty = "Hard"

    return {"score": score, "level": difficulty}




# -------------------------------
# Save JSON
# -------------------------------
def save_player_json(player_name: str, wikidata_id: str, career: list):
    safe_name = re.sub(r'\W+', '_', player_name).strip("_")
    filename = f"{safe_name}.json"
    filepath = f"player_data/{filename}"

    difficulty = compute_difficulty(career)

    data = {
        "id": wikidata_id,
        "name": player_name,
        "career": career,
        "difficulty": difficulty
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"✅ Saved {player_name} → {filename} (Difficulty: {difficulty['level']})")


# -------------------------------
# Main
# -------------------------------
def main():
    with open("player_names.txt", "r", encoding="utf-8") as f:
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
