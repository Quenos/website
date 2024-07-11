from flask import Flask, render_template, send_from_directory, jsonify, request
import os
import requests

app = Flask(__name__, static_folder='.')

STRAPI_URL = 'http://localhost:1337'  # This is the default Strapi URL
STRAPI_TOKEN = 'your_strapi_token_here'  # Replace with your actual Strapi token

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/test', methods=['GET'])
def get_blog_posts():
    headers = {
        'Authorization': f'Bearer {STRAPI_TOKEN}'
    }
    response = requests.get(f'{STRAPI_URL}/api/blog-posts', headers=headers)
    return jsonify(response.json())

@app.route('/api/blog-posts', methods=['POST'])
def create_blog_post():
    data = request.json
    headers = {
        'Authorization': f'Bearer {STRAPI_TOKEN}',
        'Content-Type': 'application/json'
    }
    try:
        response = requests.post(f'{STRAPI_URL}/api/blog-posts', json=data, headers=headers)
        response.raise_for_status()
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error creating blog post: {str(e)}")
        error_message = str(e)
        if response.status_code == 500:
            try:
                error_message = response.json().get('error', {}).get('message', str(e))
            except ValueError:
                pass
        return jsonify({"error": error_message}), response.status_code or 500

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)
