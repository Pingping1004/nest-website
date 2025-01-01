const commentContentInput = document.querySelector('.input-content');
const addCommentBtn = document.querySelector('.add-comment-btn');
const backBtn = document.querySelector('.post-back-btn');
const postEngagementContainer = document.querySelector('.post-engagement');

let comments = [];
let commentId = null;
let commentLikeCount = [];
let isLiked = null;
let postIsLiked = null;
let postLikeCount = null;
let post = null;
let postId = null;
let loggedInUserId = null;
let loggedInUser = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchComments();
    fetchPostLikeCount(postId);
    document.body.addEventListener('click', (event) => {
        const moreInfoBtn = event.target.closest('.more-info-btn');
        if (moreInfoBtn) {
            const commentId = moreInfoBtn.getAttribute('data-comment-id');
            console.log('More info clicked for comment ID:', commentId);
            renderPopup(postId, commentId);
        }
    })
});

async function fetchComments() {
    postId = localStorage.getItem('postId');
    console.log('Post ID for comment page:', postId);

    try {
        const response = await fetch(`/comments/get-comments/${postId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        console.log('Fetched comments data:', data);
        let { user, post } = data;

        post = post;
        comments = post.comments;
        postIsLiked = post.isLiked;
        postId = post.postId;
        loggedInUser = user;
        loggedInUserId = user.userId;

        console.log('Fetched post in comment page', post);
        console.log('Logged in user object detail', loggedInUser);
        console.log('Fetched post like state in comment page', postIsLiked);
        console.log('Fetched postId in comment page', postId);
        console.log('All fetched comments', comments);

        console.log('Fetched user', user);
        console.log('Fetched logged in userId', loggedInUserId);
        console.log('Post ID ', postId, ' like state ', postIsLiked);

        renderComments();
    } catch (error) {
        console.error('Error fetching all comments on post:', error.message);
    }
}

async function createComment() {
    try {
        const content = commentContentInput.value;

        console.log('postId', postId);

        const comment = {
            content,
            date: new Date(),
            likeCount: 0,
            postId,
            userId: loggedInUserId,
        }

        console.log('User ID in create comment function:', comment.userId);
        console.log('Comment object before sending to backend', comment);

        const response = await fetch('/comments/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });

        if (response.ok) {
            console.log('Response from creating', response)
            const responseData = await response.json();
            console.log('Response data:', responseData)
            const newComment = responseData.comment;

            comments.push(newComment);
            console.log('New comment:', newComment);
            renderComments();

            commentContentInput.value = '';
        } else {
            const errorResponse = await response.json();
            console.error('Failed to create comment:', errorResponse);
            throw new Error(errorResponse.message || 'Unknown error');
        }

    } catch (error) {
        console.error('Error createing comment:', error.message);
        alert('An error occurred while creating comment');
    }
}

addCommentBtn.addEventListener('click', createComment);
backBtn.addEventListener('click', (event) => {
    // const userId = event.target.getAttribute('data-user-id');
    const userRole = loggedInUser.role;
    const userId = loggedInUserId;

    if (!userId) {
        console.error('User ID is missing');
        return;
    }

    if (userRole === 'admin') {
        window.location.href = `/auth/admin/index/${userId}`;
    } else {
        window.location.href = `/auth/index/${userId}`;
    }
});

function renderComments() {
    const postCommentContainer = document.querySelector('.comment-post-container');
    postCommentContainer.innerHTML = '';
    console.log('Comments to render', comments);
    comments.forEach((comment) => {
        const postComment = document.createElement('div');
        postComment.classList.add('comment-post')
        postComment.id= `comment-${comment.commentId}`;

        console.log('Post authorId', comment.commenter.userId);
        console.log('Post ID:', postId);
        console.log('Commenter ID', loggedInUserId);
        console.log('Comment ID:', comment.commentId);
        console.log('Comment like state', comment.isLiked);

        const isLiked = comment.isLiked;
        const commentLikeButtonState = isLiked ? 'liked' : 'unliked';
        const commentLikeButtonImg = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

        postComment.innerHTML = `
            <div class="comment" id="comment-${comment.commentId}">

                <div class="comment-header">
                    <div class="commenter-profile" id="commenter-profile-${comment.commentId}">
                        <img class="commenter-profile-img" width="100px" height="100px" src="/public/${comment.commenter.profilePicture}" alt="commenter-profile">
                        <h5 class="commenter-username">${comment.commenter.username}</h5>
                    </div>

                    ${loggedInUserId === comment.commenter.userId ?
                        `<div class="more-info-element">
                            <button class="more-info-btn" id="more-info-comment-${comment.commentId}" data-comment-id="${comment.commentId}">
                                <img class="more-info-img" src="/public/picture/Dots.svg" alt="more-info">
                            </button>
                        </div>` : ''
                    }
                </div>

                <div class="comment-content-container">
                    <p class="comment-content" id="comment-content-${comment.commentId}">${comment.content}</p>
                </div>

                <div class="comment-engagement" id="comment-engagement-${comment.commentId}">

                    <div class="comment-like" id="comment-like-${comment.commentId}">
                        <button id="comment-like-btn-${comment.commentId}" class="comment-like-btn ${commentLikeButtonState}" data-comment-id="${comment.commentId}">
                            <img class="comment-like-img" src="${commentLikeButtonImg}" alt="post like button">
                        </button>
                        <p class="comment-like-count" id="comment-like-count-${comment.commentId}">${comment.likeCount !== undefined ? comment.likeCount : 'error'}</p>
                    </div>

                </div>

            </div>
        `;

        const commentLikeBtn = document.getElementById(`comment-like-btn-${comment.commentId}`);
        if (commentLikeBtn) {
            if (comment.isLiked) {
                commentLikeBtn.classList.add('liked');
                commentLikeBtn.classList.remove('unliked');
                
            } else {
                commentLikeBtn.classList.add('unliked');
                commentLikeBtn.classList.remove('liked');
            }
        }

        postComment.addEventListener('click', (event) => {
            const commentLikeBtn = event.target.closest('.comment-like-btn');
            if (commentLikeBtn) {
            //   const commentId = commentLikeBtn.getAttribute('data-post-id');
              console.log('Comment like button is activated for commentId:', comment.commentId);
              commentLike(postId, comment.commentId);
            }
          });

        const moreInfoBtn = document.querySelector(`#more-info-comment-${comment.commentId}`);
        if (moreInfoBtn) {
            renderPopup(postId, comment.commentId);
        }

        fetchCommentLikeCount(postId, comment.commentId)
        postCommentContainer.append(postComment);
    });
}

async function postLike(postId) {
    console.log('Like post is activated on postId', postId);

    const postLikeBtn = document.getElementById(`post-like-btn-${postId}`);
    const postLikeCountElement = document.querySelector(`#like-count-${postId}`);
    let currentPostLikeCount = parseInt(postLikeCountElement.textContent, 10) || 0;

    if (!loggedInUserId) {
        alert('User ID is not available, please login first');
    }

    if (!postLikeBtn || !postLikeCountElement) {
        console.error('Post like button or post like count element not found');
        return;
    }

    const img = postLikeBtn.querySelector('img');
    const postIsCurrentlyLiked = postLikeBtn.classList.contains('liked');

    const newPostLikeCount = postIsCurrentlyLiked ? currentPostLikeCount - 1 : currentPostLikeCount + 1;

    updatePostLikeCount(postId, newPostLikeCount);
    postLikeBtn.classList.toggle('liked', !postIsCurrentlyLiked);
    postLikeBtn.classList.toggle('unliked', postIsCurrentlyLiked);
    img.src = postIsCurrentlyLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg';

    try {
        const response = await fetch(`/post/update/like/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, userId: loggedInUserId }),
        });
        console.log('Fetch request completed.');

        if (!response.ok) {
            console.error('Failed to toggle like', error.message);
            // updatePostLikeCount(postId, currentPostLikeCount);
        }

        const updatedPost = await response.json();
        console.log('Server response for like toggle:', updatedPost);

        // const { likeCount, isLiked } = updatedPost;
        updatePostLikeCount(postId, updatedPost.likeCount);

        postLikeBtn.classList.toggle('liked', updatedPost.isLiked);
        postLikeBtn.classList.toggle('unliked', !updatedPost.isLiked);
        img.src = updatedPost.isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    } catch (error) {
        console.error('Failed to like post in comment page', error.message);

        updatePostLikeCount(postId, currentPostLikeCount);
        postLikeBtn.classList.toggle('liked', postIsCurrentlyLiked);
        postLikeBtn.classList.toggle('unliked', !postIsCurrentlyLiked);
        img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    }
}

async function fetchPostLikeCount(postId) {
    try {
        const response = await fetch(`/post/get/likeCount/${postId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch like count');
        }

        const likeCount = await response.json();
        console.log('Fetched like count', likeCount);
        updatePostLikeCount(postId, likeCount);
    } catch (error) {
        console.error('Failed to fetch post like count', error.message);
    }
}

function updatePostLikeCount(postId, likeCount) {
    console.log(`Updating post ${postId} likeCount to: ${likeCount}`);
    const postLikeCountElement = document.getElementById(`like-count-${postId}`);

    if (postLikeCountElement) {
        postLikeCountElement.textContent = likeCount;
    }
}

const postLikeButton = document.getElementById(`post-like-btn-${postId}`);
if (postLikeButton) {
    if (postIsLiked) {
        postLikeButton.classList.add('liked');
        postLikeButton.classList.remove('unliked');
    } else {
        postLikeButton.classList.add('unliked');
        postLikeButton.classList.remove('liked');
    }
}

postEngagementContainer.addEventListener('click', (event) => {
    const postLikeBtn = event.target.closest('.post-like-btn');

    if (postLikeBtn) {
        const postId = postLikeBtn.getAttribute('data-post-id');
        if (postId) {
            console.log('Post like button is activated for postId:', postId);
            postLike(postId);
        }
    }
});

window.deleteComment = async function deleteComment(postId, commentId) {
    try {
        const commentModalContainer = document.querySelector('.comment-modal-container');
        console.log('CommentId to delete', commentId, ' on post ID:', postId);
        const response = await fetch(`/comments/delete/${postId}/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            const commentElement = document.getElementById(`comment-${commentId}`);
            if (commentElement) {
                commentElement.remove();
            } else {
                console.error(`Comment element with ID ${commentId} does not found in DOM`);
            }

            const deletedComment = await response.json();
            console.log('Delete comment', deletedComment);

            comments = comments.filter((comment) => comment.commentId !== parseInt(commentId, 10));
            console.log('Comment deleted successfully');
            renderComments();
            commentModalContainer.innerHTML = '';
        } else {
            const result = await response.json();
            alert('Failed to remove comment', result.message);
            console.error('Failed to remove comment:', result.message)
        }
    } catch (error) {
        console.error('Failed to delete post', error.message);
    }
}

function renderPopup(postId, commentId) {
    console.log(typeof deleteComment);
    console.log('Post ID in render popup function', postId);
    console.log('Comment ID in render popup function', commentId);

    const commentModalContainer = document.querySelector('.comment-modal-container');
    if (!commentModalContainer) {
        console.error('comment-modal-container not found');
        return;
    }

    commentModalContainer.innerHTML = '';

    const commentModal = document.createElement('div');
    commentModal.classList.add('comment-modal');
    commentModal.id = `comment-modal-${commentId}`;

    commentModal.innerHTML = `
        <div class="modal-content">
            <h5 class="modal-header">Are you sure you want to delete this comment?</h5>

            <div class="modal-cta" id="modal-cta-${commentId}">
                <button class="delete-comment-btn btn btn-danger" id="delete-comment-btn-${commentId} data-comment-id="${commentId}">
                    Delete
                </button>
                <button class="close-modal btn btn-secondary">Cancel</button>
            </div>

        </div>
    `;

    commentModalContainer.append(commentModal);

    const deleteCommentBtn = commentModal.querySelector(`.delete-comment-btn`);
    if (deleteCommentBtn) {
        deleteCommentBtn.addEventListener('click', (event) => {
            // const commentId = event.target.getAttribute('data-comment-id');
            console.log(`Delete mode activated for commentId: ${commentId}`);
            deleteComment(postId, commentId);
        });
    }

    const closeModal = commentModal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            commentModalContainer.innerHTML = '';
        })
    }
}

async function commentLike(postId, commentId) {
    console.log('Post ID in comment like function', postId);
    console.log('Comment like function is activated on commentId', commentId);

    const commentLikeBtn = document.getElementById(`comment-like-btn-${commentId}`);
    const commentLikeCountElement = document.querySelector(`#comment-like-count-${commentId}`);
    console.log('Comment like count element', commentLikeCountElement);
    let currentCommentLikeCount = parseInt(commentLikeCountElement.textContent, 10) || 0;

    if (!loggedInUserId) {
        alert('User ID is not available, please login first');
    }

    if (!commentLikeBtn || !commentLikeCountElement) {
        console.error('Comment like button or comment like count element not found');
        return;
    }

    const img = commentLikeBtn.querySelector('img');
    const commentIsCurrentLiked = commentLikeBtn.classList.contains('liked');

    const newCommentLikeCount = commentIsCurrentLiked ? currentCommentLikeCount - 1 : currentCommentLikeCount + 1;

    updateCommentLikeCount(commentId, newCommentLikeCount);
    commentLikeBtn.classList.toggle('liked', !commentIsCurrentLiked);
    commentLikeBtn.classList.toggle('unliked', commentIsCurrentLiked);
    img.src = commentIsCurrentLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg';

    try {
        const response = await fetch(`/comments/update/like/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, commentId, userId: loggedInUserId }),
        });
        console.log('Fetch request completed.');

        if (!response.ok) {
            console.error('Failed to toggle like', error.message);
            // updateCommentLikeCount(commentId, currentCommentLikeCount);
        }

        const updatedComment = await response.json();
        console.log('Server response for comment like toggle:', updatedComment);

        // const { likeCount, isLiked } = updatedComment;
        updateCommentLikeCount(commentId, updatedComment.likeCount);

        commentLikeBtn.classList.toggle('liked', updatedComment.isLiked);
        commentLikeBtn.classList.toggle('unliked', !updatedComment.isLiked);
        img.src = updatedComment.isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    } catch (error) {
        console.error('Failed to like comment in comment page', error.message);

        updateCommentLikeCount(commentId, currentCommentLikeCount);
        commentLikeBtn.classList.toggle('liked', commentIsCurrentLiked);
        commentLikeBtn.classList.toggle('unliked', !commentIsCurrentLiked);
        img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    }
}

async function fetchCommentLikeCount(postId, commentId) {
    try {
        const response = await fetch(`/comments/get/likeCount/${postId}/${commentId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch like count');
        }

        const commentLikeCount = await response.json();
        console.log('Fetched like count', commentLikeCount);
        updateCommentLikeCount(commentId, commentLikeCount);
    } catch (error) {
        console.error('Failed to fetch comment like count', error.message);
    }
}

function updateCommentLikeCount(commentId, commentLikeCount) {
    console.log(`Updating post ${commentId} likeCount to: ${commentLikeCount}`);
    const commentLikeCountElement = document.getElementById(`comment-like-count-${commentId}`);

    if (commentLikeCountElement) {
        commentLikeCountElement.textContent = commentLikeCount;
    }
}