import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load datasets
def load_data(resume_file, skills_file):
    resume_data = pd.read_csv(resume_file)
    skills_data = pd.read_csv(skills_file)
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
        for category in categories:
            if category.lower() in str(row['skills']).lower():  # Case-insensitive matching
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
    job_title = resume_data['category'].iloc[0]  # Assuming job title is in the first row of resume_data
    if '2023 National Employment Matrix title' in skills_data.columns and 'Element Name' in skills_data.columns:
        suggested_skills = skills_data[skills_data['2023 National Employment Matrix title'] == job_title]['Element Name'].tolist()
        print(f"\nSuggested skills for {job_title}:")
        for skill in suggested_skills:
            print(f"- {skill}")
    else:
        print("The skills data file does not contain the required columns.")

# Main function
def main():
    resume_file = 'project_data/content/linkedin.csv'  # Path to resume CSV
    skills_file = 'project_data/content/skills.csv'  # Path to skills CSV
    resume_data, skills_data = load_data(resume_file, skills_file)

    # Define personality categories
    categories = ['Analytical', 'Creativity', 'Communication', 'Leadership', 'Teamwork']  # Customize as needed

    # Get survey scores from user
    personality_scores = get_survey_scores(categories)

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
