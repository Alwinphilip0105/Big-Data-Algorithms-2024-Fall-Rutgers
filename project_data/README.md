# Project data (upload to GitHub)

Scripts in this repo read from this `project_data` folder. **Upload the following files** so they exist in the repo and anyone cloning the repo can run the scripts.

## Required layout and files

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

| File | Used by |
|------|--------|
| `2019-29/education.xlsx` (sheet `Table 5.2`) | education1923.py |
| `2023-33/education.xlsx` (sheet `Table 5.2`) | education1923.py |
| `2023-33/skills.xlsx` (sheet `Table 6.1`) | skillRadarcharts.py, Linkedin.py |
| `oesm19nat/national_M2019_dl.xlsx` | oesm19meanWage.py |
| `oesm23nat/national_M2023_dl.xlsx` | oesm19meanWage.py |

Copy these from your BDA project data (e.g. from `Rutgers_Class/Sem1/BDA/Project/project_data/`) into the matching paths above, then commit and push to GitHub.
