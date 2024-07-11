// Assuming you have a way to securely store and retrieve the token
// For example, you might have it in a separate config file or get it from the server
const STRAPI_TOKEN = '5548d7aa99974cc013b6c34b718c14028b2f22b962471776513b9e4eaea96ff1307fd0fe14326a7be2960ac26641fda98913ca5dd5b83ed8c0c66c11becf033a01712b707c4f5520d70e9e8c2814ce98f118d08bb67dd3ff316197b09a66545c732056b8e66ce7d27a1af8e3da4abb60f190b49df0f2c2eea17c49b50aa20793';

let currentPage = 1;
const postsPerPage = 10;

function fetchBlogPosts(page = 1) {
    fetch(`http://localhost:1337/api/blogs?pagination[page]=${page}&pagination[pageSize]=${postsPerPage}&populate=*`, {
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
                    thumbnailHtml = `<img src="http://localhost:1337${post.attributes.thumbnail.data.attributes.url}" alt="${post.attributes.Title}" class="blog-thumbnail">`;
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
    fetch(`http://localhost:1337/api/blogs/${postId}`, {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const blogContent = document.getElementById('blog-content');
        let thumbnailHtml = '';
        if (data.data.attributes.thumbnail && data.data.attributes.thumbnail.data) {
            thumbnailHtml = `<img src="http://localhost:1337${data.data.attributes.thumbnail.data.attributes.url}" alt="${data.data.attributes.Title}" class="blog-thumbnail">`;
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
