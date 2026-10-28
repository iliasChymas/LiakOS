#!/usr/bin/env python3
"""Fetch and print the daily OASA schedule for a public-facing line ID."""

import argparse
import json
import os
import sys
from datetime import datetime, time, timedelta
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


API_URL = "https://telematics.oasa.gr/api/"
LINE_CATALOG_TTL = timedelta(days=7)
LATIN_TO_GREEK = str.maketrans({
    "A": "Α", "B": "Β", "E": "Ε", "Z": "Ζ", "H": "Η", "I": "Ι",
    "K": "Κ", "M": "Μ", "N": "Ν", "O": "Ο", "P": "Ρ", "T": "Τ",
    "Y": "Υ", "X": "Χ",
})


def api_post(action, params=None):
    query = {"act": action, **(params or {})}
    url = f"{API_URL}?{urlencode(query)}"
    request = Request(
        url,
        data=b"",
        method="POST",
    )
    with urlopen(request, timeout=20) as response:
        return json.load(response)


def clock_time(value):
    """Return HH:MM from OASA's 1900-based timestamp or a plain time."""
    if value is None or str(value).strip() == "":
        return None
    value = str(value).strip()
    try:
        # API values look like 1900-01-01T04:30:00; use only local clock time.
        return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%H:%M")
    except ValueError:
        try:
            return datetime.strptime(value, "%H:%M:%S").strftime("%H:%M")
        except ValueError:
            return value


def line_matches(lines, requested_id):
    normalized = requested_id.strip().upper().translate(LATIN_TO_GREEK)
    return [
        line for line in lines
        if str(line.get("line_id", "")).strip().upper().translate(LATIN_TO_GREEK) == normalized
    ]


def preferred_line(matches):
    masters = [line for line in matches if str(line.get("mld_master", "")) == "1"]
    return masters[0] if masters else matches[0]


def format_row(row):
    # A row can contain one or two service segments. Ignore empty segment pairs.
    segments = []
    for number in (1, 2):
        start = clock_time(row.get(f"sde_start{number}"))
        end = clock_time(row.get(f"sde_end{number}"))
        if start or end:
            segments.append(f"{start or '—'}–{end or '—'}")
    return " / ".join(segments) if segments else "(no time provided)"


def cache_file(line_id):
    cache_home = Path(os.environ.get("XDG_CACHE_HOME", Path.home() / ".cache"))
    return cache_home / "liakos" / "oasa-schedule" / f"{line_id}.json"


def line_catalog_file():
    cache_home = Path(os.environ.get("XDG_CACHE_HOME") or Path.home() / ".cache")
    return cache_home / "liakos" / "oasa-lines.json"


def fetch_line_catalog(force=False):
    path = line_catalog_file()
    if not force:
        try:
            cached = json.loads(path.read_text(encoding="utf-8"))
            updated_at = datetime.fromisoformat(cached["updated_at"])
            if datetime.now() - updated_at < LINE_CATALOG_TTL:
                return cached["lines"]
        except (OSError, ValueError, KeyError, TypeError):
            pass

    lines = api_post("webGetLinesWithMLInfo")
    catalog = {"updated_at": datetime.now().isoformat(), "lines": lines}
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        temp_path = path.with_suffix(f".{os.getpid()}.tmp")
        temp_path.write_text(json.dumps(catalog), encoding="utf-8")
        temp_path.replace(path)
    except OSError:
        # Keep the fetched catalog usable even if the cache directory is read-only.
        pass
    return lines


def upcoming_departures(schedule, now):
    departures = []
    now_hm = now.strftime("%H:%M")
    for direction in ("come", "go"):
        for row in schedule.get(direction) or []:
            for segment in (1, 2):
                start = clock_time(row.get(f"sde_start{segment}"))
                end = clock_time(row.get(f"sde_end{segment}"))
                if start and start >= now_hm:
                    departures.append((start, end or "", direction))
    return sorted(departures)


def load_or_fetch_line(line_id):
    now = datetime.now()
    path = cache_file(line_id)
    try:
        cached = json.loads(path.read_text(encoding="utf-8"))
        expires_at = datetime.fromisoformat(cached["expires_at"])
        if expires_at > now:
            if not line_catalog_file().exists():
                fetch_line_catalog()
            return cached["line"], cached["schedule"]
    except (OSError, ValueError, KeyError, TypeError):
        pass

    lines = fetch_line_catalog()
    matches = line_matches(lines, line_id)
    if not matches:
        raise LookupError(f"No OASA line found with line ID {line_id!r}.")
    line = preferred_line(matches)
    schedule = api_post("getDailySchedule", {"line_code": line["line_code"]})
    departures = upcoming_departures(schedule, now)
    if departures:
        next_start = datetime.combine(now.date(), time.fromisoformat(departures[0][0]))
        expires_at = next_start + timedelta(minutes=1)
    else:
        tomorrow = now.date() + timedelta(days=1)
        expires_at = datetime.combine(tomorrow, time.min)

    cached = {
        "line": line,
        "schedule": schedule,
        "expires_at": expires_at.isoformat(),
    }
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        temp_path = path.with_suffix(f".{os.getpid()}.tmp")
        temp_path.write_text(json.dumps(cached), encoding="utf-8")
        temp_path.replace(path)
    except OSError:
        # A cache write failure should not prevent showing the live schedule.
        pass
    return line, schedule


def main():
    parser = argparse.ArgumentParser(description="Print the OASA daily schedule for a bus line.")
    parser.add_argument("line_id", nargs="?", default="524", help="public OASA line ID (default: 524)")
    parser.add_argument("--next", action="store_true", help="print the next departure only")
    parser.add_argument("--upcoming", type=int, metavar="COUNT", help="print the next COUNT departures as JSON")
    parser.add_argument("--refresh-lines", action="store_true", help="refresh the local OASA line catalog")
    parser.add_argument("--validate-line", action="store_true", help="validate the line ID against the local OASA catalog")
    args = parser.parse_args()

    try:
        if args.refresh_lines:
            lines = fetch_line_catalog(force=True)
            unique_ids = {str(line.get("line_id", "")).strip() for line in lines}
            print(f"Cached {len(unique_ids - {''})} OASA line IDs in {line_catalog_file()}.")
            return 0
        if args.validate_line:
            lines = fetch_line_catalog()
            matches = line_matches(lines, args.line_id)
            if not matches:
                print(f"Unknown OASA line ID: {args.line_id}", file=sys.stderr)
                return 1
            line = preferred_line(matches)
            canonical_id = str(line.get("line_id", args.line_id)).strip()
            description = (line.get("line_descr_eng") or line.get("line_descr") or "").strip()
            print(json.dumps({"valid": True, "line_id": canonical_id, "description": description}, ensure_ascii=False))
            return 0
        line, schedule = load_or_fetch_line(args.line_id)
        description = line.get("line_descr_eng") or line.get("line_descr") or ""
        if args.next or args.upcoming is not None:
            departures = upcoming_departures(schedule, datetime.now())
            if args.upcoming is not None:
                payload = {
                    "line_id": str(line.get("line_id", args.line_id)).strip(),
                    "description": description.strip(),
                    "departures": [
                        {"time": start, "direction": direction}
                        for start, _end, direction in departures[:max(0, args.upcoming)]
                    ],
                }
                print(json.dumps(payload, ensure_ascii=False))
                return 0
            if not departures:
                print(f"No more departures today for line {args.line_id}.")
                return 0
            start, end, direction = departures[0]
            print(f"Line {args.line_id} — {description}\nNext bus: {start}" + (f"–{end}" if end else "") + f" ({direction})")
            return 0
        print(f"Line {args.line_id} — {description} (internal code {line['line_code']})")

        directions = (("come", "Come"), ("go", "Go"))
        for key, label in directions:
            rows = schedule.get(key) or []
            print(f"\n{label} direction:")
            if not rows:
                print("  No departures returned.")
                continue
            for index, row in enumerate(rows, start=1):
                print(f"  {index:>2}. {format_row(row)}")
        return 0
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
        print(f"OASA API request failed: {error}", file=sys.stderr)
        return 1
    except LookupError as error:
        print(error, file=sys.stderr)
        return 1
    except (KeyError, TypeError, AttributeError) as error:
        print(f"Unexpected OASA API response: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
