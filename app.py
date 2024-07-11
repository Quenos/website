from flask import Flask, render_template, send_from_directory, jsonify
import os
import requests

app = Flask(__name__, static_folder='.')

STRAPI_URL = 'http://localhost:1337'  # Update this with your Strapi URL

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/blog-posts')
def get_blog_posts():
    response = requests.get(f'{STRAPI_URL}/api/blog-posts')
    return jsonify(response.json())

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)
