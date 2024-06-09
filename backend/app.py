import time
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from datetime import datetime
import logging
import uuid  # 用于生成唯一ID
import sqlite3
from ai import get_talk, get_summary, generate_questions

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)  # 设置日志级别为 DEBUG
CORS(app)

# 用于生成唯一ID的方法
def generate_id():
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
        event_id = generate_id()
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

@app.route('/api/memos', methods=['GET', 'POST'])
def handle_memos():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json
        memo_id = generate_id()
        conn.execute('INSERT INTO memos (id, title, content, tags) VALUES (?, ?, ?, ?)',
                     (memo_id, data['title'], data['content'], ','.join(data['tags'])))
        conn.commit()
        conn.close()
        data['id'] = memo_id
        return jsonify(data), 201
    else:
        cur = conn.cursor()
        cur.execute('SELECT * FROM memos')
        memos = cur.fetchall()
        conn.close()
        return jsonify([dict(memo) for memo in memos])

@app.route('/api/memos/<memo_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_memo(memo_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM memos WHERE id = ?', (memo_id,))
    memo = cur.fetchone()
    if memo is None:
        conn.close()
        return jsonify({'message': 'Memo not found'}), 404

    if request.method == 'PUT':
        data = request.json
        cur.execute('UPDATE memos SET title = ?, content = ?, tags = ? WHERE id = ?',
                    (data['title'], data['content'], ','.join(data['tags']), memo_id))
        conn.commit()
        conn.close()
        return jsonify(dict(data))
    elif request.method == 'DELETE':
        cur.execute('DELETE FROM memos WHERE id = ?', (memo_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Memo deleted'}), 204
    else:
        conn.close()
        return jsonify(dict(memo))

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data['input']
    
    def generate():
        for partial_msg in get_talk(user_input):
            yield partial_msg  # 直接返回内容

    return Response(generate(), content_type='text/plain')

@app.route('/api/todayevents', methods=['GET'])
def get_today_events():
    today = datetime.now().strftime('%Y-%m-%d')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM events WHERE date(start) = ? ORDER BY start', (today,))
    events = cur.fetchall()
    conn.close()
    return jsonify([dict(event) for event in events])

# @app.route('/api/generate_summary', methods=['POST'])
# def generate_summary():
#     data = request.json
#     events = data['events']
#     summary = get_summary(events)
#     return jsonify({'summary': summary})
@app.route('/api/todaysummary', methods=['GET'])
def get_today_summary():
    today = datetime.now().strftime('%Y-%m-%d')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM events WHERE date(start) = ?', (today,))
    events = cur.fetchall()
    conn.close()
    summary = get_summary([dict(event) for event in events])
    return jsonify({'summary': summary})

@app.route('/get_ip', methods=['GET'])
def get_ip():
    client_ip = request.remote_addr
    return {'ip': client_ip}

@app.route('/api/generate_questions', methods=['GET'])
def generate_questions_endpoint():
    questions = generate_questions()
    return jsonify(questions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
