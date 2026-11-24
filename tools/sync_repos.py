#!/usr/bin/env python3
"""Fetch public non-fork GitHub repositories for cmduyeen into data/repos.json."""

from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path

USERNAME = "cmduyeen"
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data" / "repos.json"
API_URL = f"https://api.github.com/users/{USERNAME}/repos?sort=created&direction=desc&per_page=100"


def fetch_repos() -> list[dict[str, str]]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "cmduyeen-blog-builder",
    }
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(API_URL, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = json.loads(resp.read().decode("utf-8"))

    repos: list[dict[str, str]] = []
    for item in raw:
        if item.get("fork") or item.get("private") or item.get("archived"):
            continue
        created = str(item.get("created_at", ""))[:10]
        year = created[:4] if len(created) >= 4 else "Other"
        name = str(item.get("name", ""))
        has_pages = bool(item.get("has_pages")) and name != f"{USERNAME}.github.io"
        homepage = str(item.get("homepage") or "").strip()
        if has_pages and not homepage:
            homepage = f"https://{USERNAME}.github.io/{name}/"
        repos.append(
            {
                "name": name,
                "url": str(item.get("html_url", "")),
                "description": str(item.get("description") or ""),
                "created_at": created,
                "year": year,
                "homepage": homepage,
                "is_webapp": has_pages,
                "stars": int(item.get("stargazers_count") or 0),
            }
        )

    repos.sort(key=lambda r: r["created_at"], reverse=True)
    return repos


def main() -> int:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    try:
        repos = fetch_repos()
        OUTPUT_PATH.write_text(
            json.dumps(repos, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"Synced {len(repos)} repositories to {OUTPUT_PATH}")
        return 0
    except Exception as exc:
        print(f"Warning: could not sync GitHub repos ({exc}); keeping existing data if any.")
        if not OUTPUT_PATH.exists():
            OUTPUT_PATH.write_text("[]\n", encoding="utf-8")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
