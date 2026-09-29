import requests
import json
import time

BASE_URL = "http://localhost:3000/api"

def run_api_tests():
    print("--- 1. Testing Login ---")
    login_url = f"{BASE_URL}/auth/login"
    login_data = {
        "email": "admin@restaurant.com",
        "password": "123456"
    }
    
    response = requests.post(login_url, json=login_data)
    if response.status_code != 200:
        print(f"Login Failed: {response.text}")
        return
        
    print("Login Successful!")
    token = response.json().get("token")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\n--- 2. Fetching Menu ---")
    menu_response = requests.get(f"{BASE_URL}/menu", headers=headers)
    if menu_response.status_code == 200:
        menu_items = menu_response.json()
        print(f"Successfully fetched {len(menu_items)} menu items.")
        print(f"First item: {menu_items[0]['name']} - ${menu_items[0]['price']}")
    else:
        print(f"Failed to fetch menu: {menu_response.text}")
        
    print("\n--- 3. Fetching Tables ---")
    tables_response = requests.get(f"{BASE_URL}/tables", headers=headers)
    if tables_response.status_code == 200:
        tables = tables_response.json()
        print(f"Successfully fetched {len(tables)} tables.")
        print(f"First table: ID {tables[0]['id']}, Status: {tables[0]['status']}")
    else:
        print(f"Failed to fetch tables: {tables_response.text}")
        
    print("\n--- 4. Creating a New Order ---")
    order_id = f"ORD-{int(time.time())}"
    order_data = {
        "id": order_id,
        "tableNumber": 1,
        "totalAmount": 20.98,
        "items": [
            {"id": 1, "quantity": 1},
            {"id": 12, "quantity": 1}
        ]
    }
    order_response = requests.post(f"{BASE_URL}/orders", headers=headers, json=order_data)
    if order_response.status_code == 201:
        print(f"Order {order_id} created successfully!")
    else:
        print(f"Failed to create order: {order_response.text}")

    print("\n--- 5. Updating the Order (Marking as Ready) ---")
    update_data = {
        "status": "Ready",
        "items": [
            {"id": 1, "preparationProgress": 100},
            {"id": 12, "preparationProgress": 100}
        ]
    }
    update_response = requests.put(f"{BASE_URL}/orders/{order_id}", headers=headers, json=update_data)
    if update_response.status_code == 200:
        print(f"Order {order_id} updated successfully!")
    else:
        print(f"Failed to update order: {update_response.text}")

if __name__ == "__main__":
    try:
        run_api_tests()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the Node.js server is running on port 3000.")
