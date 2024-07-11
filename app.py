from flask import Flask, render_template, send_from_directory, jsonify, request
import os
import requests

app = Flask(__name__, static_folder='.')

STRAPI_URL = 'http://localhost:1337'  # Update this with your Strapi URL

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/blog-posts', methods=['GET', 'POST'])
def blog_posts():
    if request.method == 'GET':
        response = requests.get(f'{STRAPI_URL}/api/blog-posts')
        return jsonify(response.json())
    elif request.method == 'POST':
        data = request.json
        try:
            response = requests.post(f'{STRAPI_URL}/api/blog-posts', json=data)
            response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
            return jsonify(response.json()), response.status_code
        except requests.exceptions.RequestException as e:
            app.logger.error(f"Error creating blog post: {str(e)}")
            return jsonify({"error": str(e)}), 500

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)
