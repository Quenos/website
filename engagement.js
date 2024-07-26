const STRAPI_TOKEN = window.config.STRAPI_TOKEN || '';

function loadComments(postId) {
    fetch(`https://quenos.technology/api/comments?filters[blog][id][$eq]=${postId}&filters[approved][$eq]=true&sort=createdAt:desc`, {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = '';
        data.data.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p><strong>${comment.attributes.name}</strong> - ${new Date(comment.attributes.createdAt).toLocaleString()}</p>
                <p>${comment.attributes.content}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    })
    .catch(error => {
        console.error('Error loading comments:', error);
    });
}

function submitComment(postId) {
    const name = document.getElementById('comment-name').value;
    const content = document.getElementById('comment-content').value;

    if (!name || !content) {
        alert('Please fill in both name and comment fields.');
        return;
    }

    fetch('https://quenos.technology/api/comments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                name: name,
                content: content,
                blog: postId,
                approved: false
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Your comment has been submitted for moderation.');
        document.getElementById('comment-name').value = '';
        document.getElementById('comment-content').value = '';
    })
    .catch(error => {
        console.error('Error submitting comment:', error);
        alert('There was an error submitting your comment. Please try again later.');
    });
}
