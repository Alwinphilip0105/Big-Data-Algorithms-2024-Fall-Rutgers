# Project data

Data is read from the **`project_data/`** folder in this repo. Upload the required files there and push to GitHub so the repo is self-contained.

## Upload these files to the repo

Copy your BDA project data into `project_data/` with this layout:

```
project_data/
├── 2019-29/
│   └── education.xlsx
├── 2023-33/
│   ├── education.xlsx
│   └── skills.xlsx
├── oesm19nat/
│   └── national_M2019_dl.xlsx
└── oesm23nat/
    └── national_M2023_dl.xlsx
```

See **`project_data/README.md`** for the exact file list and which script uses each file.

After uploading, commit and push. Anyone who clones the repo will have the data and can run:

```bash
python education1923.py
python oesm19meanWage.py
python skillRadarcharts.py
```

## Override (optional)

To read from a different path (e.g. local only), set:

```powershell
$env:PROJECT_DATA_DIR = "C:\path\to\your\project_data"
```
