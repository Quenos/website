document.addEventListener('DOMContentLoaded', (event) => {
    fetchBlogPosts();
});

function fetchBlogPosts() {
    fetch('/api/test')
        .then(response => response.json())
        .then(data => {
            const blogGrid = document.querySelector('.blog-grid');
            blogGrid.innerHTML = ''; // Clear existing content

            data.data.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-post-card';
                article.innerHTML = `
                    <h2><a href="blogpost.html?id=${post.id}">${post.attributes.title}</a></h2>
                    <p class="blog-date">Published on ${new Date(post.attributes.publishedAt).toLocaleDateString()}</p>
                    <p class="blog-summary">${post.attributes.summary}</p>
                `;
                blogGrid.appendChild(article);
            });
        })
        .catch(error => console.error('Error:', error));
}
