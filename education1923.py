import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from project_data_config import path_2019_29, path_2023_33

file_2019_new_path = path_2019_29('education.xlsx')
file_2023_path = path_2023_33('education.xlsx')

# Load the 2019 data (newly uploaded file)
xls_2019_new = pd.ExcelFile(file_2019_new_path)

# Load the relevant sheets for the 2019 data
df1_2019_new = pd.read_excel(xls_2019_new, sheet_name='Table 5.2')
df1_2019_new_cleaned = df1_2019_new.iloc[2:, [0, 1, 3]].reset_index(drop=True)
df1_2019_new_cleaned.columns = ['Education Level', 'Employment 2019', 'Employment Change 2019-29']
df1_2019_new_cleaned['Employment 2019'] = pd.to_numeric(df1_2019_new_cleaned['Employment 2019'], errors='coerce')

# Clean the 2019 data by removing rows with irrelevant information
df1_2019_new_cleaned = df1_2019_new_cleaned[~df1_2019_new_cleaned['Education Level'].str.contains("Total|Occupation", na=False)]
df1_2019_new_cleaned = df1_2019_new_cleaned.dropna(subset=['Employment 2019'])

# Load the 2023 data (already cleaned)
xls_2023 = pd.ExcelFile(file_2023_path)

# Load the relevant sheets for the 2023 data
df1_2023 = pd.read_excel(xls_2023, sheet_name='Table 5.2')
df1_2023_cleaned = df1_2023.iloc[2:, [0, 1, 3]].reset_index(drop=True)
df1_2023_cleaned.columns = ['Education Level', 'Employment 2023', 'Employment Change 2023-33']
df1_2023_cleaned['Employment 2023'] = pd.to_numeric(df1_2023_cleaned['Employment 2023'], errors='coerce')

# Clean the 2023 data by removing rows with irrelevant information
df1_2023_cleaned = df1_2023_cleaned[~df1_2023_cleaned['Education Level'].str.contains("Total|Occupation", na=False)]
df1_2023_cleaned = df1_2023_cleaned.dropna(subset=['Employment 2023'])

# Data preparation for the radar chart
categories = df1_2019_new_cleaned['Education Level'].tolist()
# values_2019 = df1_2019_new_cleaned['Employment 2019'].tolist()
# values_2023 = df1_2023_cleaned['Employment 2023'].tolist()

# # Normalize the values to a 0-1 scale
# max_value = max(max(values_2019), max(values_2023))
# values_2019_scaled = [v / max_value for v in values_2019]
# values_2023_scaled = [v / max_value for v in values_2023]

# # Create a radar chart
# angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()

# # Ensure the radar chart is circular by appending the first value to the end
# values_2019_scaled += values_2019_scaled[:1]
# values_2023_scaled += values_2023_scaled[:1]
# angles += angles[:1]

# # Set up the figure and axis
# fig, ax = plt.subplots(figsize=(8, 8), dpi=80, subplot_kw=dict(polar=True))

# # Plotting the data
# ax.plot(angles, values_2019_scaled, color='red', linewidth=2, label='2019')
# ax.fill(angles, values_2019_scaled, color='red', alpha=0.25)

# ax.plot(angles, values_2023_scaled, color='blue', linewidth=2, label='2023')
# ax.fill(angles, values_2023_scaled, color='blue', alpha=0.25)

# # Adding labels and title
# ax.set_yticklabels([])
# ax.set_xticks(angles[:-1])
# ax.set_xticklabels(categories, rotation=45, horizontalalignment='right')

# plt.title('Employment Distribution by Education Level: 2019 vs 2023', size=16)
# plt.legend(loc='upper right', bbox_to_anchor=(1.1, 1.1))

# # Show the plot
# plt.tight_layout()
# plt.show()

print(categories)