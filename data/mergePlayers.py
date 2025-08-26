import os
import json

# folder containing per-player json files
data_dir = r"d:\DATA\Programming\Projects\PlayerID\data\player_data"
output_file = os.path.join(r"d:\DATA\Programming\Projects\PlayerID\application/PlayerID/assets/data", "allPlayers.json")

all_players = []

# loop through all json files in data
for filename in os.listdir(data_dir):
    if filename.endswith(".json") and filename != "allPlayers.json":
        filepath = os.path.join(data_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            player = json.load(f)
            all_players.append(player)

# write merged list to allPlayers.json
with open(output_file, "w", encoding="utf-8") as out:
    json.dump(all_players, out, indent=2, ensure_ascii=False)

print(f"✅ Merged {len(all_players)} players into {output_file}")
