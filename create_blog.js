document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('create-blog-form');
    form.addEventListener('submit', createBlogPost);
});

function createBlogPost(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const summary = document.getElementById('summary').value;
    const content = document.getElementById('content').value;

    const data = {
        data: {
            title: title,
            summary: summary,
            content: content
        }
    };

    fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-message').textContent = 'Blog post created successfully!';
        document.getElementById('create-blog-form').reset();
    })
    .catch((error) => {
        document.getElementById('response-message').textContent = 'Error creating blog post. Please try again.';
        console.error('Error:', error);
    });
}
