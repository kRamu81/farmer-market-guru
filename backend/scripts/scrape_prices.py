# ═══════════════════════════════════════════════════════════
#  Daily Price Scraper
#  Scrapes vegetablemarketprice.com for Andhra Pradesh prices
#  Schedule with cron: 0 8 * * * python scrape_prices.py
# ═══════════════════════════════════════════════════════════

import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
import json
from datetime import datetime, date

BASE_URL   = "https://vegetablemarketprice.com/market/andhrapradesh/today"
DATA_PATH  = os.path.join(os.path.dirname(__file__), "..", "data", "ap_vegetable_prices.csv")

# Map website names → our keys
VEG_MAP = {
    "Tomato":       "tomato",
    "Onion Big":    "onion",
    "Potato":       "potato",
    "Green Chilli": "greenchilli",
    # Extended (Phase 2)
    "Brinjal":      "brinjal",
    "Cabbage":      "cabbage",
    "Carrot":       "carrot",
    "Capsicum":     "capsicum",
    "Bitter Gourd": "bittergourd",
    "Cauliflower":  "cauliflower",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; FarmerGuruBot/1.0)",
    "Accept-Language": "en-US,en;q=0.9",
}


def scrape_today() -> dict:
    """Scrape today's vegetable prices from vegetablemarketprice.com."""
    print(f"Scraping prices for {date.today()}...")
    try:
        response = requests.get(BASE_URL, headers=HEADERS, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Failed to fetch: {e}")
        return {}

    soup = BeautifulSoup(response.text, "html.parser")
    prices = {}

    # Find price table rows
    rows = soup.find_all("tr")
    for row in rows:
        cells = row.find_all("td")
        if len(cells) < 3:
            continue

        veg_name = cells[1].get_text(strip=True) if len(cells) > 1 else ""
        price_text = cells[2].get_text(strip=True) if len(cells) > 2 else ""

        # Clean up price (remove ₹ symbol, spaces)
        price_text = price_text.replace("₹", "").replace(",", "").strip()
        try:
            price = float(price_text)
        except ValueError:
            continue

        # Map to our key
        for site_name, our_key in VEG_MAP.items():
            if site_name.lower() in veg_name.lower():
                prices[our_key] = price
                break

    print(f"✅ Scraped {len(prices)} vegetables: {list(prices.keys())}")
    return prices


def append_to_csv(prices: dict, date_str: str = None):
    """Append today's scraped prices to the historical CSV."""
    if not prices:
        print("No prices to append.")
        return

    date_str = date_str or str(date.today())
    row = {"date": date_str, **prices}

    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        # Avoid duplicate dates
        if date_str in df["date"].values:
            print(f"⚠️  Date {date_str} already exists — updating...")
            for key, val in prices.items():
                if key in df.columns:
                    df.loc[df["date"] == date_str, key] = val
                else:
                    df[key] = None
                    df.loc[df["date"] == date_str, key] = val
        else:
            new_row = pd.DataFrame([row])
            df = pd.concat([df, new_row], ignore_index=True)
    else:
        df = pd.DataFrame([row])

    df.to_csv(DATA_PATH, index=False)
    print(f"✅ Saved to {DATA_PATH} ({len(df)} total rows)")


def main():
    print("=" * 50)
    print("  Farmer Market Guru — Daily Scraper")
    print("=" * 50)
    prices = scrape_today()
    if prices:
        append_to_csv(prices)
        # Also save as JSON for quick API access
        json_path = DATA_PATH.replace(".csv", "_latest.json")
        with open(json_path, "w") as f:
            json.dump({"date": str(date.today()), "prices": prices}, f, indent=2)
        print(f"✅ JSON saved → {json_path}")
    else:
        print("❌ No prices scraped. Check internet connection or website structure.")


if __name__ == "__main__":
    main()
