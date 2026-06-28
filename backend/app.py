from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        charset='utf8mb4'
    )

@app.after_request
def add_header(response):
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

# --- STATUSES ---
@app.route("/statuses", methods=["GET"])
def get_statuses():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM statuses")
    data = cur.fetchall()
    return jsonify(data)

# --- DEPARTMENTS ---
@app.route("/departments", methods=["GET"])
def get_departments():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM departments")
    data = cur.fetchall()
    return jsonify(data)

@app.route("/departments", methods=["POST"])
def create_department():
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    name = dados.get("name")
    cur.execute("INSERT INTO departments (name) VALUES (%s)", (name,))
    conn.commit()
    return jsonify({"status": "created"})

@app.route("/departments/<int:id>", methods=["PUT"])
def update_department(id):
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    name = dados.get("name")
    cur.execute("UPDATE departments SET name=%s WHERE id=%s", (name, id))
    conn.commit()
    return jsonify({"status": "updated"})

# --- USERS ---
@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT u.*, d.name as department_name 
        FROM users u 
        LEFT JOIN departments d ON u.department_id = d.id
    """)
    data = cur.fetchall()
    for user in data:
        if user['data_nacimento']:
            user['data_nacimento'] = user['data_nacimento'].isoformat()
    return jsonify(data)

@app.route("/users", methods=["POST"])
def create_user():
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    name = dados.get("name")
    email = dados.get("email")
    data_nac = dados.get("data_nacimento")
    idade = dados.get("idade")
    dept_id = dados.get("department_id")
    
    cur.execute("""
        INSERT INTO users (name, email, data_nacimento, idade, department_id) 
        VALUES (%s, %s, %s, %s, %s)
    """, (name, email, data_nac, idade, dept_id))
    conn.commit()
    return jsonify({"status": "created"})

@app.route("/users/<int:id>", methods=["PUT"])
def update_user(id):
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    name = dados.get("name")
    email = dados.get("email")
    data_nac = dados.get("data_nacimento")
    idade = dados.get("idade")
    dept_id = dados.get("department_id")
    cur.execute("""
        UPDATE users SET name=%s, email=%s, data_nacimento=%s, idade=%s, department_id=%s WHERE id=%s
    """, (name, email, data_nac, idade, dept_id, id))
    conn.commit()
    return jsonify({"status": "updated"})

@app.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id=%s", (id,))
    conn.commit()
    return jsonify({"status": "deletado"})

# --- ACTIVITIES (TASKS with JOIN) ---
@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    # JOIN entre Tasks, Users, Departments e Statuses
    cur.execute("""
        SELECT 
            t.id, 
            t.title, 
            t.description, 
            t.user_id,
            t.status_id,
            u.name as user_name, 
            d.name as department_name,
            s.name as status_name
        FROM tasks t 
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN statuses s ON t.status_id = s.id
    """)
    data = cur.fetchall()
    return jsonify(data)

@app.route("/tasks", methods=["POST"])
def create_task():
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    title = dados.get("title")
    desc = dados.get("description")
    user_id = dados.get("user_id")
    status_id = dados.get("status_id")
    cur.execute("INSERT INTO tasks (title, description, user_id, status_id) VALUES (%s, %s, %s, %s)", 
                (title, desc, user_id, status_id))
    conn.commit()
    return jsonify({"status": "created"})

@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    conn = get_db()
    cur = conn.cursor()
    dados = request.get_json()
    title = dados.get("title")
    desc = dados.get("description")
    user_id = dados.get("user_id")
    status_id = dados.get("status_id")
    cur.execute("""
        UPDATE tasks SET title=%s, description=%s, user_id=%s, status_id=%s WHERE id=%s
    """, (title, desc, user_id, status_id, id))
    conn.commit()
    return jsonify({"status": "updated"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
