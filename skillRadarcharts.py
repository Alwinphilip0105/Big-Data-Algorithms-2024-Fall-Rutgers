# It generates radar charts to visualize the skill distribution for different occupational groups (e.g., "Management occupations", "Business occupations").


import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from project_data_config import path_2023_33

# Load the Excel file and clean the data
file_path = path_2023_33('skills.xlsx')
import matplotlib.pyplot as plt
import numpy as np

# Step 1: Load the data from the Excel file
xls = pd.ExcelFile(file_path)

# Step 2: Load the sheet data (Table 6.1) for analysis
sheet_data = pd.read_excel(xls, sheet_name='Table 6.1')

# Step 3: Clean the data
# Dropping the first row (header) and setting correct column names
data_cleaned = sheet_data.drop(0)
data_cleaned.columns = sheet_data.iloc[0]
data_cleaned = data_cleaned.drop(1)

# Step 4: Selecting relevant columns for radar chart: skill columns (starting from column 6)
skills_columns = data_cleaned.columns[6:22]

# Step 5: Select a few rows (occupational groups) to visualize
occupational_groups = data_cleaned['2023 National Employment Matrix title'].values[1:4]
skill_data = data_cleaned[skills_columns].iloc[1:4].values.astype(float)

# Step 6: Function to create a radar chart with non-overlapping labels
def radar_chart(data, labels, title):
    num_vars = len(labels)

    # Compute angle of each axis
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()

    # The radar chart is a circle, so we need to "complete the loop" and append the first value to the end
    data = np.concatenate((data, data[:1]))
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles, data, color='blue', alpha=0.25)
    ax.plot(angles, data, color='blue', linewidth=2)
    ax.set_yticklabels([])

    # Adjust the labels to avoid overlap
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, rotation=45, horizontalalignment='right', fontsize=9)

    # Add title and display the chart
    ax.set_title(title, size=14, color='blue', fontweight='bold', va='bottom')
    plt.tight_layout()
    plt.show()

# Step 7: Generate radar charts for the selected occupational groups with updated label positioning
for i, group in enumerate(occupational_groups):
    radar_chart(skill_data[i], skills_columns.tolist(), group)

