const commentContentInput = document.querySelector('.input-content')

let author = null;
let articles = null;
let comments = [];
let commentId = null;
let loggedInUserId = null;
let users = null;

window.addEventListener('DOMContentLoaded', async () => {
    // const urlParams = new URLSearchParams(window.location.search);
    // const postId = urlParams.get('postId');
    const postId = localStorage.getItem('postId');
    console.log('Post ID for comment page:', postId);

    try {
        const response = await fetch(`/comments/get-comments/${postId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        let { comments, posts, user } = data;

        author = posts.author;
        comments = comments;
        articles = posts;
        loggedInUserId = user.userId;
        users = user;

        console.log('Fetched author', author);
        console.log('All fetched comments', comments);
        console.log('Fetched user', users);
        renderComments();
    } catch (error) {
        console.error('Error fetching all comments on post:', error.message);
    }
});

async function createComment() {
    try {
        const content = commentContentInput.value;
        const date = new Date();

        const comment = {
            content,
            date,
            likeCount: 0,
        }

        const response = await fetch('/comments/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });

        if (response.ok) {
            const newComment = await response.json();
            comments.push(newComment);
            await fetchComments();
            commentContentInput.value = '';
        } else {
            const errorResponse = await response.json();
            console.error('Failed to create comment:', errorResponse);
        }

    } catch (error) {
        console.error('Error createing comment:', error.message);
        alert('An error occurred while creating comment');
    }
}

function renderComments() {
    const postCommentContainer = document.querySelector('.comment-post-container');
    postCommentContainer.innerHTML = '';
    comments.forEach((comment) => {
        const postComment = document.createElement('div');
        
        postComment.classList.add('comment-post')
        postComment.id(`comment-${comment.commentId}`);

        console.log('Post authorId', comment.author.userId);
        console.log('Commenter ID', loggedInUserId);

        const isLiked = null;
        const commentLikeButtonState = null;
        const commentLikeButtonImg = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

        postComment.innerHTML = `
            <div class="comment-${comment.commentId}">

                <div class="commenter-profile-${comment.commentId}">
                    <img class="commenter-profile" src="/public/${comment.commenter.profilePicture}" alt="commenter-profile">
                    <h5 class="commenter-username">${comment.commenter.username}</h5>
                    ${userId === comment.commenter.userId ?
                        `<button class="more-info-comment" id="more-info-comment-${comment.commentId}" data-comment-id="${comment.commentId}">
                            <img src="/public/<%= Dots.svg" alt="more-info">
                        </button>` : ''
                    }
                </div>

                <p class="comment-content-${comment.commentId}">${comment.content}</p>

                <div class="comment-engagement-${comment.commentId}">

                    <div class="comment-like-${comment.commentId}">
                        <button id="comment-like-btn-${comment.commentId}" class="comment-like-btn ${commentLikeButtonState}">
                            <img src="${commentLikeButtonImg}" alt="post like button">
                        </button>
                        <p class="comment-like-count" id="comment-like-count-${comment.commentId}">${post.likeCount !== undefined ? post.likeCount : 'error'}</p>
                    </div>

                    <div class="comment-backpage">
                        <button id="comment-back-btn-${comment.commentId}" class="comment-back-btn" data-user-id="${loggedInUserId}">
                            <img src="/public/picture/Back.svg" alt="back to index button">
                        </button>
                    </div>

                </div>

            </div>
        `;

        const moreInfoBtn = document.querySelector(`#more-info-comment-${comment.commentId}`);
        if (moreInfoBtn) {
            renderInfoBanner(commentId);
        }

        const backBtn = document.querySelector('.comment-back-btn');
        backBtn.addEventListener('click', (event) => {
            const userId = event.target.getAttribute('data-user-id');

            if (!userId) {
                console.error('User ID is missing');
                return;
            }

            window.location.href = `/index?userId=${userId}`;
        });

        postCommentContainer.append(postComment);
    });
}

window.deleteComment = async function deleteComment(commentId) {
    try {
        console.log('CommentId to delete', commentId);
        const response = await fetch(`comments/delete/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            const commentElement = document.getElementById(`comment-${comment.commentId}`);
            if (commentElement) {
                commentElement.remove();
            } else {
                console.error(`Comment element with ID ${comment.commentId} does not found in DOM`);
            }

            const deletedComment = await response.json();
            console.log('Delete comment', deletedComment);

            comments = comments.filter((comment) => comment.commentId !== parseInt(commentId, 10));
            console.log('Comment deleted successfully');
            renderComments();
        } else {
            const result = await response.json();
            alert('Failed to remove comment', result.message);
            console.error('Failed to remove comment:', result.message)
        }
    } catch (error) {
        console.error('Failed to delete post', error.message);
    }
}

async function commentLike() {
    // toggle like state as same as postLike function
}

function renderInfoBanner(commentId) {
    // render delete option in the bannner and click to activate delete function
}