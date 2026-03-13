import pytest
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.tools import real_estate_tool

def test_school_search():
    print("Running school search tests...")

    # Test Elementary School search
    print("\nTesting Elementary School (O'Connor PS):")
    results = real_estate_tool.execute(school="O'Connor PS")
    print(f"Found {len(results)} results.")
    for r in results:
        print(f" - {r['address']} (Elementary: {r['Elementary']})")
    assert any("O'Connor PS" in r['Elementary'] for r in results)

    # Test Intermediate School search
    print("\nTesting Intermediate School (Gordon A Brown MS):")
    results = real_estate_tool.execute(school="Gordon A Brown MS")
    print(f"Found {len(results)} results.")
    for r in results:
        print(f" - {r['address']} (Intermediate: {r['Intermediate']})")
    assert any("Gordon A Brown MS" in r['Intermediate'] for r in results)

    # Test Secondary School search
    print("\nTesting Secondary School (Victoria Park CI):")
    results = real_estate_tool.execute(school="Victoria Park CI")
    print(f"Found {len(results)} results.")
    for r in results:
        print(f" - {r['address']} (Secondary: {r['Secondary']})")
    assert any("Victoria Park CI" in r['Secondary'] for r in results)

    # Test Partial name search
    print("\nTesting Partial School Name (Waterfront):")
    results = real_estate_tool.execute(school="Waterfront")
    print(f"Found {len(results)} results.")
    for r in results:
        print(f" - {r['address']} (E: {r['Elementary']}, I: {r['Intermediate']}, S: {r['Secondary']})")
    assert len(results) > 0

    # Test school search combined with price filter
    print("\nTesting School + Price Filter (Victoria Park CI + max_price=1100000):")
    results = real_estate_tool.execute(school="Victoria Park CI", max_price=1100000)
    print(f"Found {len(results)} results.")
    for r in results:
        print(f" - {r['address']} (Price: {r['price']})")
    assert all(r['price'] <= 1100000 for r in results)

    print("\nAll school search tests passed!")

if __name__ == "__main__":
    test_school_search()
