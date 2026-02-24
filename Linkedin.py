import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
import argparse


BASE_DIR = Path(__file__).resolve().parent

# Load datasets
def load_data(resume_file=None, skills_file=None, cli_job_title=None, cli_skills_input=None):
    default_resume = BASE_DIR / 'project_data' / 'content' / 'linkedin.csv'
    default_skills = BASE_DIR / 'project_data' / '2023-33' / 'skills.xlsx'

    resume_path = Path(resume_file) if resume_file else default_resume
    skills_path = Path(skills_file) if skills_file else default_skills

    if resume_path.exists():
        if resume_path.suffix.lower() == '.csv':
            resume_data = pd.read_csv(resume_path)
        else:
            resume_data = pd.read_excel(resume_path)
    else:
        print("Resume file not found. Using fallback profile input.")
        job_title = cli_job_title or input("Enter your target job title: ").strip() or "General and operations managers"
        skills_input = cli_skills_input if cli_skills_input is not None else input("Enter your resume skills (comma-separated): ").strip()
        resume_data = pd.DataFrame([
            {
                'category': job_title,
                'skills': skills_input
            }
        ])

    if not skills_path.exists():
        raise FileNotFoundError(f"Skills data file not found: {skills_path}")

    if skills_path.suffix.lower() == '.csv':
        skills_data = pd.read_csv(skills_path)
    else:
        skills_data = pd.read_excel(skills_path, sheet_name='Table 6.2', header=1)

    return resume_data, skills_data

# Get survey scores from user input
def get_survey_scores(categories):
    survey_scores = {}
    for category in categories:
        while True:
            try:
                score = int(input(f"Enter score (1-5) for {category}: "))
                if 1 <= score <= 5:
                    survey_scores[category] = score
                    break
                else:
                    print("Invalid score. Please enter a score between 1 and 5.")
            except ValueError:
                print("Invalid input. Please enter a number.")
    return survey_scores

# Process resume data
def process_resume(resume_data, categories):
    resume_scores = {category: 0 for category in categories}
    for _, row in resume_data.iterrows():
        skills_text = str(row.get('skills', ''))
        for category in categories:
            if category.lower() in skills_text.lower():  # Case-insensitive matching
                resume_scores[category] += 1
    return resume_scores

# Normalize scores
def normalize_scores(scores, max_value=100):
    if not scores:
        return {key: 0 for key in scores}
    max_score = max(scores.values())
    if max_score == 0:
        return scores
    return {key: (value / max_score) * max_value for key, value in scores.items()}

# Generate comparison radar chart
def generate_radar_chart(personality_scores, resume_scores):
    labels = list(personality_scores.keys())
    num_vars = len(labels)

    # Data for plotting
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    personality_values = list(personality_scores.values())
    resume_values = list(resume_scores.values())

    # Close the radar chart
    personality_values += personality_values[:1]
    resume_values += resume_values[:1]
    angles += angles[:1]

    # Plotting
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    ax.fill(angles, personality_values, color='blue', alpha=0.25, label='Personality Traits')
    ax.fill(angles, resume_values, color='red', alpha=0.25, label='Resume Skills')
    ax.set_yticks([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
    plt.title('Personality Traits vs Resume Skills')
    plt.show()

# Suggest suitable skills based on resume
def suggest_skills(resume_data, skills_data, categories):
    if 'category' not in resume_data.columns or resume_data.empty:
        print("No resume category found to suggest skills.")
        return

    job_title = str(resume_data['category'].iloc[0]).strip()
    if '2023 National Employment Matrix title' in skills_data.columns and 'Element Name' in skills_data.columns:
        suggested_skills = skills_data[skills_data['2023 National Employment Matrix title'] == job_title]['Element Name'].tolist()
        print(f"\nSuggested skills for {job_title}:")
        for skill in suggested_skills:
            print(f"- {skill}")
    elif '2023 National Employment Matrix title' in skills_data.columns:
        normalized_job_title = " ".join(job_title.split()).casefold()
        category_skill_columns = {
            'Analytical': 'Critical and analytical thinking',
            'Creativity': 'Creativity and innovation',
            'Communication': 'Speaking and listening',
            'Leadership': 'Leadership',
            'Teamwork': 'Interpersonal'
        }
        titles = skills_data['2023 National Employment Matrix title'].fillna('').astype(str)
        normalized_titles = titles.map(lambda value: " ".join(value.split()).casefold())

        row = skills_data.loc[normalized_titles == normalized_job_title]
        if row.empty:
            row = skills_data.loc[
                normalized_titles.str.contains(normalized_job_title, regex=False)
            ]
        if row.empty:
            print(f"No skill profile found for job title: {job_title}")
            return

        print(f"\nSuggested skill profile for {job_title}:")
        job_row = row.iloc[0]
        for category in categories:
            column_name = category_skill_columns.get(category)
            if column_name and column_name in skills_data.columns:
                print(f"- {category}: {job_row[column_name]}")
    else:
        print("The skills data file does not contain the required columns.")


def parse_args():
    parser = argparse.ArgumentParser(description="Compare personality scores against resume and suggest skills.")
    parser.add_argument("--resume-file", default="project_data/content/linkedin.csv", help="Path to resume file (csv/xlsx)")
    parser.add_argument("--skills-file", default="project_data/2023-33/skills.xlsx", help="Path to skills file (csv/xlsx)")
    parser.add_argument("--job-title", default=None, help="Fallback job title when resume file is missing")
    parser.add_argument("--resume-skills", default=None, help="Fallback comma-separated resume skills when resume file is missing")
    parser.add_argument("--analytical", type=int, default=None, help="Score 1-5 for Analytical")
    parser.add_argument("--creativity", type=int, default=None, help="Score 1-5 for Creativity")
    parser.add_argument("--communication", type=int, default=None, help="Score 1-5 for Communication")
    parser.add_argument("--leadership", type=int, default=None, help="Score 1-5 for Leadership")
    parser.add_argument("--teamwork", type=int, default=None, help="Score 1-5 for Teamwork")
    return parser.parse_args()


def get_cli_scores(args):
    score_map = {
        'Analytical': args.analytical,
        'Creativity': args.creativity,
        'Communication': args.communication,
        'Leadership': args.leadership,
        'Teamwork': args.teamwork,
    }
    provided = {key: value for key, value in score_map.items() if value is not None}
    if not provided:
        return None

    invalid = [f"{key}={value}" for key, value in provided.items() if value < 1 or value > 5]
    if invalid:
        raise ValueError(f"Scores must be between 1 and 5: {', '.join(invalid)}")
    return provided

# Main function
def main():
    args = parse_args()
    resume_data, skills_data = load_data(
        args.resume_file,
        args.skills_file,
        cli_job_title=args.job_title,
        cli_skills_input=args.resume_skills
    )

    # Define personality categories
    categories = ['Analytical', 'Creativity', 'Communication', 'Leadership', 'Teamwork']  # Customize as needed

    # Get survey scores from CLI args or user input
    cli_scores = get_cli_scores(args)
    personality_scores = cli_scores if cli_scores else get_survey_scores(categories)

    # Process resume data
    resume_scores = process_resume(resume_data, categories)

    # Normalize for comparison
    personality_scores = normalize_scores(personality_scores)
    resume_scores = normalize_scores(resume_scores)

    # Generate radar chart
    generate_radar_chart(personality_scores, resume_scores)

    # Suggest suitable skills
    suggest_skills(resume_data, skills_data, categories)

if __name__ == "__main__":
    main()
