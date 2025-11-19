#!/usr/bin/env python3
"""
PDF Extraction Script for pdf-mcp-server
Uses pdfplumber for text extraction and basic heuristics for field parsing.
Outputs JSON to stdout for Node.js to consume.
"""

import sys
import json
import re
from datetime import datetime
import pdfplumber

def extract_text_from_pdf(pdf_path):
    """Extract full text from PDF."""
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def parse_load_offer(text):
    """Heuristic parsing to extract LoadOffer fields."""
    load = {
        "load_id": None,
        "shipper": {"name": None, "mc_number": None, "contact": None},
        "broker": {"name": None, "mc_number": None, "contact": None},
        "equipment": None,
        "commodity": None,
        "weight_lbs": None,
        "pallets": None,
        "hazmat": None,
        "temp_requirements": None,
        "pickup": {"date": None, "window_start": None, "window_end": None, "location": {"name": None, "address": None, "city": None, "state": None, "zip": None}, "notes": None},
        "delivery": {"date": None, "window_start": None, "window_end": None, "location": {"name": None, "address": None, "city": None, "state": None, "zip": None}, "notes": None},
        "miles": None,
        "deadhead_miles": None,
        "linehaul_usd": None,
        "fuel_surcharge_usd": None,
        "accessorials": [],
        "detention_terms": None,
        "layover_terms": None,
        "payment_terms": {"days": None, "quickpay": None},
        "notes": None,
        "source": {"filename": None, "received_at_iso": datetime.now().isoformat(), "page_count": None}
    }

    # Simple regex heuristics (expand as needed)
    load["load_id"] = re.search(r'(?:Load|Rate|Confirmation)\s*(?:ID|Number|Ref)[:\s]*([A-Z0-9\-]+)', text, re.I)
    if load["load_id"]:
        load["load_id"] = load["load_id"].group(1)

    # Equipment
    equip_match = re.search(r'Equipment[:\s]*([a-zA-Z\s]+)', text, re.I)
    if equip_match:
        load["equipment"] = equip_match.group(1).strip().lower().replace(' ', '_')

    # Rate
    rate_match = re.search(r'(?:Rate|Linehaul)[:\s]*\$?([0-9,]+)', text, re.I)
    if rate_match:
        load["linehaul_usd"] = float(rate_match.group(1).replace(',', ''))

    # Miles
    miles_match = re.search(r'Miles[:\s]*([0-9]+)', text, re.I)
    if miles_match:
        load["miles"] = int(miles_match.group(1))

    # Pickup/Delivery locations (basic)
    pickup_match = re.search(r'Pickup[:\s]*([A-Za-z\s,]+)', text, re.I)
    if pickup_match:
        load["pickup"]["location"]["city"] = pickup_match.group(1).strip()

    delivery_match = re.search(r'(?:Delivery|Destination)[:\s]*([A-Za-z\s,]+)', text, re.I)
    if delivery_match:
        load["delivery"]["location"]["city"] = delivery_match.group(1).strip()

    # Add more heuristics here...

    return load

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python extract_pdf.py <pdf_path>"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    try:
        text = extract_text_from_pdf(pdf_path)
        load = parse_load_offer(text)
        load["source"]["filename"] = pdf_path.split('/')[-1]
        print(json.dumps(load))
    except Exception as e:
        print(json.dumps({"error": str(e)}))