from flask import Flask, render_template, send_from_directory, jsonify, request
import os
import requests

app = Flask(__name__, static_folder='.')

STRAPI_URL = 'http://localhost:1337'  # This is the default Strapi URL
STRAPI_TOKEN = '5548d7aa99974cc013b6c34b718c14028b2f22b962471776513b9e4eaea96ff1307fd0fe14326a7be2960ac26641fda98913ca5dd5b83ed8c0c66c11becf033a01712b707c4f5520d70e9e8c2814ce98f118d08bb67dd3ff316197b09a66545c732056b8e66ce7d27a1af8e3da4abb60f190b49df0f2c2eea17c49b50aa20793'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/blogs', methods=['GET'])
def get_blog_posts():
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    headers = {
        'Authorization': f'Bearer {STRAPI_TOKEN}'
    }
    response = requests.get(f'{STRAPI_URL}/api/blog-posts?pagination[page]={page}&pagination[pageSize]={page_size}', headers=headers)
    return jsonify(response.json())

@app.route('/api/blogs/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    headers = {
        'Authorization': f'Bearer {STRAPI_TOKEN}'
    }
    response = requests.get(f'{STRAPI_URL}/api/blog-posts/{post_id}', headers=headers)
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
