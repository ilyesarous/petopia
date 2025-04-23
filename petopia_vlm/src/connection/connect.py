import mysql.connector

config = {
    "user": "root",
    "password": "",
    "host": "localhost",
    "database": "petopia",
}

conn = None

try:
    conn = mysql.connector.connect(**config)
    print("✅ Connected to MySQL!")
except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
