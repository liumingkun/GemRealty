import pandas as pd
import os
import logging

# Configure logger
logger = logging.getLogger(__name__)

# Load data
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "listing.csv")
df = pd.read_csv(DATA_PATH)

def get_tool_definition():
    return {
        "name": "search_real_estate",
        "description": "Search for real estate listings in Toronto based on various criteria like price, beds, and baths.",
        "parameters": {
            "type": "object",
            "properties": {
                "min_price": {"type": "number", "description": "Minimum price"},
                "max_price": {"type": "number", "description": "Maximum price"},
                "min_beds": {"type": "integer", "description": "Minimum number of bedrooms"},
                "min_baths": {"type": "integer", "description": "Minimum number of bathrooms"},
                "property_type": {
                    "type": "string", 
                    "description": "Type of property",
                    "enum": ["Condo", "Detached", "Semi"]
                },
                "city": {"type": "string", "description": "City or neighborhood name"}
            }
        }
    }

def execute(min_price=None, max_price=None, min_beds=None, min_baths=None, property_type=None, city=None):
    logger.info(f"Executing search_real_estate tool with params: min_price={min_price}, max_price={max_price}, min_beds={min_beds}, min_baths={min_baths}, property_type={property_type}, city={city}")
    filtered_df = df.copy()
    
    if min_price is not None:
        filtered_df = filtered_df[filtered_df['price'] >= min_price]
    if max_price is not None:
        filtered_df = filtered_df[filtered_df['price'] <= max_price]
    if min_beds is not None:
        filtered_df = filtered_df[filtered_df['bedrooms'] >= min_beds]
    if min_baths is not None:
        filtered_df = filtered_df[filtered_df['washrooms'] >= min_baths]
    if property_type:
        # Case-insensitive exact match for the supported types
        filtered_df = filtered_df[filtered_df['type'].str.fullmatch(property_type, case=False, na=False)]
    if city:
        filtered_df = filtered_df[filtered_df['city'].str.contains(city, case=False, na=False)]
        
    return filtered_df.to_dict(orient='records')
