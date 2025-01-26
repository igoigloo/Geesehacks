import sqlite3
import random

# Path to the database
db_path = r"C:\Users\igodo\OneDrive\Desktop\Github-repos\Geesehacks\backend\data\filtered_cameras.db"

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get the name of the only table in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
table_name = cursor.fetchone()
if not table_name:
    raise ValueError("No table found in the database.")
table_name = table_name[0]

# Check if the Accident column exists
cursor.execute(f"PRAGMA table_info({table_name})")
columns = [info[1] for info in cursor.fetchall()]
if 'Accident' not in columns:
    raise ValueError("Column 'Accident' does not exist in the table.")

# Select all row IDs
cursor.execute(f"SELECT rowid FROM {table_name}")
row_ids = [row[0] for row in cursor.fetchall()]

# Randomly select 1 in every 20 rows
sample_size = len(row_ids) // 20
selected_ids = random.sample(row_ids, sample_size)

# Update the Accident column for the selected rows
cursor.executemany(
    f"UPDATE {table_name} SET Accident = 'TRUE' WHERE rowid = ?",
    [(row_id,) for row_id in selected_ids]
)

# Commit changes and close the connection
conn.commit()
conn.close()

print("Column 'Accident' updated successfully.")
