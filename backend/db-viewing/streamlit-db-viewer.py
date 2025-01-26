import sqlite3
import streamlit as st
import pandas as pd
import os

# Absolute path to the database
DB_PATH = r"C:\Users\igodo\OneDrive\Desktop\Github-repos\Geesehacks\backend\data\cameras.db"

# Debugging: Print current working directory
st.write(f"**Current Working Directory:** `{os.getcwd()}`")

# Function to get the list of tables
def get_tables(db_path):
    if not os.path.exists(db_path):
        st.error(f"Database file not found at: {db_path}")
        return []
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
    finally:
        connection.close()
    return tables

# Function to fetch data from a table
def get_table_data(db_path, table_name):
    connection = sqlite3.connect(db_path)
    try:
        data = pd.read_sql_query(f"SELECT * FROM {table_name}", connection)
    finally:
        connection.close()
    return data

# Streamlit app
st.title("SQLite Database Viewer")

# Display the database path
st.write(f"**Database Path:** `{DB_PATH}`")

# Get the list of tables
tables = get_tables(DB_PATH)

if tables:
    # Dropdown to select a table
    selected_table = st.selectbox("Select a table to view:", tables)

    # Display table data
    if selected_table:
        st.write(f"**Data from `{selected_table}` table:**")
        table_data = get_table_data(DB_PATH, selected_table)
        st.dataframe(table_data)
else:
    st.warning("No tables found in the database.")
