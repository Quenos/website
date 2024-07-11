import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = os.getenv('STRAPI_BASE_URL', 'http://localhost:1337')
API_TOKEN = os.getenv('STRAPI_API_TOKEN')
BLOGS_DIRECTORY = os.getenv('BLOGS_DIRECTORY', 'blogs')

def read_blog_files(directory):
    blogs = []
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            with open(os.path.join(directory, filename), 'r') as file:
                blog = json.load(file)
                blogs.append(blog)
    return blogs

def create_blog_post(blog):
    url = f"{BASE_URL}/api/blogs"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}"
    }
    response = requests.post(url, json=blog, headers=headers)
    if response.status_code == 200:
        print(f"Successfully created blog post: {blog['title']}")
    else:
        print(f"Failed to create blog post: {blog['title']}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")

def main():
    blogs = read_blog_files(BLOGS_DIRECTORY)
    for blog in blogs:
        create_blog_post(blog)

if __name__ == "__main__":
    main()
