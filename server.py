#!/usr/bin/env python3
"""
Graduation RSVP Backend Server
Graduate: Ian Kiromo Githengu
Degree: B.Sc. Applied Computer Science - Daystar University

Features:
- Serves static front-end assets (HTML, CSS, JS)
- REST API endpoint: POST /api/rsvp (Stores submissions in rsvps.json)
- REST API endpoint: GET /api/rsvps (Protected admin endpoint for guest list & budgeting)
- REST API endpoint: GET /api/export-csv (Downloads CSV for budgeting)
"""

import http.server
import socketserver
import json
import os
import csv
import io
import sys
import urllib.parse
from datetime import datetime

# Ensure utf-8 encoding on standard output for Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8088
ADMIN_PASSWORDS = [os.environ.get("ORGANISER_PASSCODE", "IanBobians#2026")]
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "rsvps.json")

def load_rsvps():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {DATA_FILE}: {e}")
        return []

def save_rsvps(rsvps):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(rsvps, f, indent=2, ensure_ascii=False)

class RSVPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Pin')
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # GET /api/rsvps - Retrieve all RSVPs (Admin)
        if path == "/api/rsvps":
            pin = query.get("pin", [""])[0] or self.headers.get("X-Admin-Pin", "")
            if pin not in ADMIN_PASSWORDS:
                self.send_json_response({"error": "Unauthorized. Invalid Admin Passcode."}, status=401)
                return

            rsvps = load_rsvps()
            attending_count = 0
            headcount_total = 0
            declined_count = 0

            for r in rsvps:
                if r.get("attending") == "Yes":
                    attending_count += 1
                    try:
                        guests = int(r.get("guestCount", 1))
                    except (ValueError, TypeError):
                        guests = 1
                    headcount_total += guests
                else:
                    declined_count += 1

            self.send_json_response({
                "success": True,
                "rsvps": rsvps,
                "stats": {
                    "totalSubmissions": len(rsvps),
                    "attendingResponses": attending_count,
                    "totalHeadcount": headcount_total,
                    "declinedResponses": declined_count
                }
            })
            return

        # GET /api/export-csv - Download CSV spreadsheet
        if path == "/api/export-csv":
            pin = query.get("pin", [""])[0] or self.headers.get("X-Admin-Pin", "")
            if pin not in ADMIN_PASSWORDS:
                self.send_json_response({"error": "Unauthorized. Invalid Admin PIN."}, status=401)
                return

            rsvps = load_rsvps()
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(["Reference Code", "Timestamp", "Full Name", "Phone Number", "Attending", "Party Size (Guests)", "Message"])

            for r in rsvps:
                writer.writerow([
                    r.get("referenceCode", ""),
                    r.get("timestamp", ""),
                    r.get("fullName", ""),
                    r.get("phoneNumber", ""),
                    r.get("attending", ""),
                    r.get("guestCount", "1") if r.get("attending") == "Yes" else "0",
                    r.get("message", "")
                ])

            csv_data = output.getvalue().encode("utf-8-sig")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", 'attachment; filename="ian_kiromo_graduation_rsvps.csv"')
            self.send_header("Content-Length", str(len(csv_data)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(csv_data)
            return

        # Static files fallback
        super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        # POST /api/rsvp - Save new or updated RSVP
        if path == "/api/rsvp":
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)

            try:
                data = json.loads(post_body.decode('utf-8'))
            except Exception as e:
                self.send_json_response({"error": f"Invalid JSON payload: {e}"}, status=400)
                return

            full_name = data.get("fullName", "").strip()
            phone = data.get("phoneNumber", "").strip()
            attending = data.get("attending", "Yes")
            guest_count = str(data.get("guestCount", "1"))
            message = data.get("message", "").strip()
            ref_code = data.get("referenceCode") or f"IKG-ACS-{int(datetime.now().timestamp()) % 10000:04d}"

            if not full_name or not phone:
                self.send_json_response({"error": "Full Name and Phone Number are required fields."}, status=400)
                return

            record = {
                "referenceCode": ref_code,
                "fullName": full_name,
                "phoneNumber": phone,
                "attending": attending,
                "guestCount": guest_count if attending == "Yes" else "0",
                "message": message,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            rsvps = load_rsvps()
            
            existing_idx = -1
            for idx, item in enumerate(rsvps):
                if item.get("referenceCode") == ref_code or (phone and item.get("phoneNumber") == phone):
                    existing_idx = idx
                    break

            if existing_idx >= 0:
                rsvps[existing_idx] = record
            else:
                rsvps.append(record)

            save_rsvps(rsvps)

            print(f"[RSVP RECORDED] {record['fullName']} ({record['phoneNumber']}) - Attending: {record['attending']} (Guests: {record['guestCount']})")

            self.send_json_response({
                "success": True,
                "message": "RSVP recorded successfully in database.",
                "record": record,
                "totalSubmissions": len(rsvps)
            })
            return

        self.send_json_response({"error": "Endpoint not found"}, status=404)

    def send_json_response(self, data, status=200):
        body = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def run():
    ThreadedTCPServer.allow_reuse_address = True
    with ThreadedTCPServer(("", PORT), RSVPRequestHandler) as httpd:
        print("=" * 65)
        print(f"[GRADUATION RSVP SERVER] Running at http://localhost:{PORT}/")
        print(f"[DIRECTORY] {BASE_DIR}")
        print(f"[DATABASE] {DATA_FILE}")
        print(f"[ORGANISER PASSCODE] {ADMIN_PASSWORDS[0]}")
        print("=" * 65)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run()
