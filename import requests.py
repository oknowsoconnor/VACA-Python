import requests

CITY = input("City: ")
KEY  = "YOUR_OPENWEATHER_KEY"
url  = f"https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={KEY}&units=metric"
data = requests.get(url, timeout=10).json()

temp = data["main"]["temp"]
desc = data["weather"][0]["description"]

if "rain" in desc.lower():
    vibe = "Lo-fi beats"
elif temp > 28:
    vibe = "Summer bops"
else:
    vibe = "Chill acoustic"

print(f"{CITY}: {temp}°C, {desc}. Playlist vibe → {vibe}")