from flask import Flask, jsonify,request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),   # mysql (container name)
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )

@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users")
    data = cur.fetchall()
    usuario = [{"id":id,"user":nome} for id, nome in data]
    return jsonify(usuario)

@app.route("/users", methods=["POST"])
def create_user():
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    name = dados.get("name")

    cur.execute("INSERT INTO users (name) VALUES (%s)", (name,))
    conn.commit()

    return jsonify({"status": "ok"})

app.run(host="0.0.0.0", port=5000)