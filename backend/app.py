import time

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import logging
import uuid  # 用于生成唯一ID
import sqlite3
from ai import action, get_talk

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)  # 设置日志级别为 DEBUG
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
CORS(app)

# 假设的数据库数据
events = []

# 用于生成唯一事件ID的方法
def generate_event_id():
    return str(uuid.uuid4())

def get_db_connection():
    conn = sqlite3.connect('events.db')
    conn.row_factory = sqlite3.Row  # This enables column access by name: row['column_name']
    return conn

@app.route('/api/events', methods=['GET', 'POST'])
def handle_events():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json
        event_id = generate_event_id()
        conn.execute('INSERT INTO events (id, title, start, end, destination) VALUES (?, ?, ?, ?, ?)',
                     (event_id, data['title'], data['start'], data['end'], data['destination']))
        conn.commit()
        conn.close()
        data['id'] = event_id
        return jsonify(data), 201

    else:
        cur = conn.cursor()
        cur.execute('SELECT * FROM events')
        events = cur.fetchall()
        conn.close()
        return jsonify([dict(event) for event in events])

@app.route('/api/events/<event_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_event(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM events WHERE id = ?', (event_id,))
    event = cur.fetchone()

    if event is None:
        conn.close()
        return jsonify({'message': 'Event not found'}), 404

    if request.method == 'PUT':
        data = request.json
        cur.execute('UPDATE events SET title = ?, start = ?, end = ?, destination = ? WHERE id = ?',
                    (data['title'], data['start'], data['end'], data['destination'], event_id))
        conn.commit()
        conn.close()
        return jsonify(dict(data))

    elif request.method == 'DELETE':
        cur.execute('DELETE FROM events WHERE id = ?', (event_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Event deleted'}), 204

    else:
        conn.close()
        return jsonify(dict(event))

@app.route('/api/interact', methods=['POST'])
def handle_interactions():
    data = request.json
    content = data['content']

    # Perform AI interaction handling here
    # For example, you can process the provided content and return a response
    action(content)
    response = "AI interaction received!"
    return jsonify({'response': response}), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json  # 获取 JSON 数据
    user_input = data['input']

    # 假设的预测逻辑，这里只是简单地返回输入
    # time.sleep(2)
    # prediction = f"不，你不要'{user_input}' "
    prediction = get_talk(user_input)
    return jsonify({
        'prediction': prediction
    })

@app.route('/api/todayevents', methods=['GET'])
def get_today_events():
    today = datetime.now().strftime('%Y-%m-%d')  # 获取当前日期，格式为YYYY-MM-DD
    conn = get_db_connection()
    cur = conn.cursor()
    # 注意，这里假设 `start` 列是一个存储日期的文本列，格式为 'YYYY-MM-DD HH:MM:SS'
    cur.execute('SELECT * FROM events WHERE date(start) = ?', (today,))
    events = cur.fetchall()
    conn.close()
    return jsonify([dict(event) for event in events])

@app.route('/get_ip', methods=['GET'])
def get_ip():
    client_ip = request.remote_addr
    return {'ip': client_ip}

if __name__ == '__main__':
    app.run(debug=True)