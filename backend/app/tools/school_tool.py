import pandas as pd
import os

# Load data
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "schools.csv")
df = pd.read_csv(DATA_PATH)

def get_tool_definition():
    return {
        "name": "search_schools",
        "description": "Search for schools in Toronto by name, level, or location.",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Name of the school"},
                "level": {"type": "string", "description": "School level (e.g., Elementary, Secondary)"},
                "city": {"type": "string", "description": "City name"}
            }
        }
    }

def execute(name=None, level=None, city=None):
    filtered_df = df.copy()
    
    if name:
        filtered_df = filtered_df[filtered_df['school_name'].str.contains(name, case=False, na=False)]
    if level:
        filtered_df = filtered_df[filtered_df['school_level'].str.contains(level, case=False, na=False)]
    if city:
        filtered_df = filtered_df[filtered_df['city'].str.contains(city, case=False, na=False)]
        
    return filtered_df.to_dict(orient='records')
