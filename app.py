from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from the backend!'})

@app.route('/api/echo', methods=['POST'])
def echo():
    return jsonify({'received': request.get_json(silent=True)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
