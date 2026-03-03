import pandas as pd

from project_data_config import path_oesm_2019, path_oesm_2023

# Wage files: oesm19nat and oesm23nat at project_data root
file_2019 = path_oesm_2019('national_M2019_dl.xlsx')
file_2023 = path_oesm_2023('national_M2023_dl.xlsx')
import matplotlib.pyplot as plt

# Reading the data from the Excel files
df_2019 = pd.read_excel(file_2019, sheet_name='national_M2019_dl')
df_2023 = pd.read_excel(file_2023, sheet_name='national_M2023_dl')

# Renaming columns for consistency
df_2019 = df_2019.rename(columns={'occ_code': 'occ_code', 'occ_title': 'occ_title', 'a_median': 'a_median_2019'})
df_2023 = df_2023.rename(columns={'OCC_CODE': 'occ_code', 'OCC_TITLE': 'occ_title', 'A_MEDIAN': 'a_median_2023'})

# Merging the two datasets on occupation code
merged_wages = pd.merge(df_2019[['occ_code', 'occ_title', 'a_median_2019']], 
                        df_2023[['occ_code', 'occ_title', 'a_median_2023']], 
                        on='occ_code', 
                        how='inner')

# Selecting one occ_title column (either occ_title_x or occ_title_y) since they are identical
merged_wages['occ_title'] = merged_wages['occ_title_x']  # You can also choose occ_title_y

# Extended occupations data (adding extra occupations like Software Developers, Registered Nurses, etc.)
extended_occupations = merged_wages[merged_wages['occ_title'].isin([
    'All Occupations', 'Management Occupations', 'Top Executives', 'Chief Executives',
    'Software Developers', 'Registered Nurses', 'Construction Laborers', 'Teachers'
])]

# Plotting the annual median wages
plt.figure(figsize=(14, 7))

# Plotting annual median wages with overlapping bars
plt.bar(extended_occupations['occ_title'], extended_occupations['a_median_2019'], label='2019', alpha=0.7, color='red', edgecolor='black', width=0.4, align='center')
plt.bar(extended_occupations['occ_title'], extended_occupations['a_median_2023'], label='2023', alpha=0.7, color='blue', edgecolor='black', width=0.4, align='edge')

# Adding labels and title
plt.xlabel('Occupation')
plt.ylabel('Annual Median Wage ($)')
plt.title('Annual Median Wages (2019 vs 2023)')
plt.xticks(rotation=45, ha='right')
plt.legend()

# Adjusting layout to prevent clipping
plt.tight_layout()

# Displaying the graph
plt.show()
