const STRAPI_TOKEN = window.config.STRAPI_TOKEN || '';
// Check if the token is available
if (!STRAPI_TOKEN) {
    console.error('STRAPI_TOKEN is not set in the environment variables');
}

let currentPage = 1;
const postsPerPage = 10;

function fetchBlogPosts(page = 1) {
    fetch(`https://quenos.technology/api/blogs?pagination[page]=${page}&pagination[pageSize]=${postsPerPage}&populate=*`, {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const blogContent = document.getElementById('blog-content');
        blogContent.innerHTML = ''; // Clear existing content

        if (data.data && data.data.length > 0) {
            const postsContainer = document.createElement('div');
            postsContainer.className = 'blog-posts-container';
            
            data.data.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-post';
                let thumbnailHtml = '';
                if (post.attributes.thumbnail && post.attributes.thumbnail.data) {
                    thumbnailHtml = `<img src="https://quenos.technology${post.attributes.thumbnail.data.attributes.url}" alt="${post.attributes.Title}"
                    class="blog-thumbnail">`;
                }
                article.innerHTML = `
                    <div class="blog-post-content">
                        ${thumbnailHtml}
                        <h2>${post.attributes.Title}</h2>
                        <p class="blog-date">Published on ${new Date(post.attributes.publishedAt).toLocaleDateString()}</p>
                        <p class="blog-summary">${post.attributes.Summary}</p>
                    </div>
                    <a href="#" class="read-more-link" onclick="showFullPost(${post.id}); return false;">read more...</a>
                `;
                postsContainer.appendChild(article);
            });
            
            blogContent.appendChild(postsContainer);

            // Add pagination controls
            const paginationControls = document.createElement('div');
            paginationControls.className = 'pagination-controls';
            paginationControls.innerHTML = `
                <button ${page === 1 ? 'disabled' : ''} onclick="changePage(${page - 1})">Previous</button>
                <span>Page ${page}</span>
                <button ${data.data.length < postsPerPage ? 'disabled' : ''} onclick="changePage(${page + 1})">Next</button>
            `;
            blogContent.appendChild(paginationControls);
        } else {
            blogContent.innerHTML = '<p>No blog posts found.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('blog-content').innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    });
}

function showFullPost(postId) {
    fetch(`https://quenos.technology/api/blogs/${postId}`, {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const blogContent = document.getElementById('blog-content');
        let thumbnailHtml = '';
        if (data.data.attributes.thumbnail && data.data.attributes.thumbnail.data) {
            thumbnailHtml = `<img src="https://quenos.technology${data.data.attributes.thumbnail.data.attributes.url}" alt="${data.data.attributes.Title}"
            class="blog-thumbnail">`;
        }
        blogContent.innerHTML = `
            <article class="blog-post full-post">
                ${thumbnailHtml}
                <h2>${data.data.attributes.Title}</h2>
                <p class="blog-date">Published on ${new Date(data.data.attributes.publishedAt).toLocaleDateString()}</p>
                <div class="blog-content">${marked.parse(data.data.attributes.Content)}</div>
                <button onclick="fetchBlogPosts(${currentPage})">Back to List</button>
            </article>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('blog-content').innerHTML = '<p>Error loading blog post. Please try again later.</p>';
    });
}

function changePage(newPage) {
    currentPage = newPage;
    fetchBlogPosts(currentPage);
}

function fetchLatestBlogPost() {
    fetch(`https://quenos.technology/api/blogs?pagination[page]=1&pagination[pageSize]=1&sort=publishedAt:desc&populate=*`, {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data && data.data.length > 0) {
            const post = data.data[0];
            const latestPostContainer = document.getElementById('latest-blog-post');
            if (latestPostContainer) {
                let thumbnailHtml = '';
                if (post.attributes.thumbnail && post.attributes.thumbnail.data) {
                    thumbnailHtml = `<img src="https://quenos.technology${post.attributes.thumbnail.data.attributes.url}" alt="${post.attributes.Title}" class="blog-thumbnail">`;
                }
                latestPostContainer.innerHTML = `
                    <h3>${post.attributes.Title}</h3>
                    ${thumbnailHtml}
                    <p class="blog-date">Published on ${new Date(post.attributes.publishedAt).toLocaleDateString()}</p>
                    <p class="blog-summary">${post.attributes.Summary}</p>
                    <a href="blog.html" class="read-more-link">Read more...</a>
                `;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const latestPostContainer = document.getElementById('latest-blog-post');
        if (latestPostContainer) {
            latestPostContainer.innerHTML = '<p>Error loading latest blog post. Please try again later.</p>';
        }
    });
}

// Call this function when the home page loads
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    fetchLatestBlogPost();
}
