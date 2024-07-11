function fetchBlogPosts() {
    fetch('/api/blogs')
        .then(response => response.json())
        .then(data => {
            const blogContent = document.getElementById('blog-content');
            blogContent.innerHTML = ''; // Clear existing content

            if (data.data && data.data.length > 0) {
                data.data.forEach(post => {
                    const article = document.createElement('article');
                    article.className = 'blog-post';
                    article.innerHTML = `
                        <h2>${post.attributes.title}</h2>
                        <p class="blog-date">Published on ${new Date(post.attributes.publishedAt).toLocaleDateString()}</p>
                        <div class="blog-summary">${post.attributes.summary}</div>
                        <div class="blog-content">${post.attributes.content}</div>
                    `;
                    blogContent.appendChild(article);
                });
            } else {
                blogContent.innerHTML = '<p>No blog posts found.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('blog-content').innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
        });
}
