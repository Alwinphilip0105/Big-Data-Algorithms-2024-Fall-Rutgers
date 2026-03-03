"""
Project data path: reads from project_data/ in this repo (upload data to GitHub).
Override with PROJECT_DATA_DIR env var if needed.
"""
import os
from pathlib import Path

_REPO_DATA = Path(__file__).resolve().parent / "project_data"
PROJECT_DATA_DIR = Path(os.environ.get("PROJECT_DATA_DIR", _REPO_DATA))

def path_2019_29(*parts):
    return PROJECT_DATA_DIR / "2019-29" / Path(*parts)

def path_2023_33(*parts):
    return PROJECT_DATA_DIR / "2023-33" / Path(*parts)

# Wage files in your data are at top level: oesm19nat, oesm23nat (not under 2019-29/2023-33)
def path_oesm_2019(*parts):
    return PROJECT_DATA_DIR / "oesm19nat" / Path(*parts)

def path_oesm_2023(*parts):
    return PROJECT_DATA_DIR / "oesm23nat" / Path(*parts)
