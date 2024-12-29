const commentContentInput = document.querySelector('.input-content');
const addCommentBtn = document.querySelector('.add-comment-btn');
const backBtn = document.querySelector('.post-back-btn');
const postEngagementContainer = document.querySelector('.post-engagement');

let comments = [];
let commentId = null;
let isLiked = null;
let postIsLiked = null;
let postLikeCount = null;
let post = null;
let postId = null;
let loggedInUserId = null;
let user = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchComments();
    fetchPostLikeCount(postId);
})

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
        let { post } = data;

        post = post;
        comments = post.comments;
        postIsLiked = post.isLiked;
        postId = post.postId;
        user = post.author;
        loggedInUserId = user.userId;

        console.log('Fetched post in comment page', post);
        console.log('Fetched post like state in comment page', postIsLiked);
        console.log('Fetched postId in comment page', postId);
        console.log('All fetched comments', comments);
        console.log('Fetched user', user);
        console.log('Fetched logged in userId', loggedInUserId);

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
    const userId = event.target.getAttribute('data-user-id');

    if (!userId) {
        console.error('User ID is missing');
        return;
    }

    window.location.href = `/index?userId=${userId}`;
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
        console.log('Commenter ID', loggedInUserId);

        const commentLikeButtonState = null;
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
                        <button id="comment-like-btn-${comment.commentId}" class="comment-like-btn ${commentLikeButtonState}">
                            <img class="comment-like-img" src="${commentLikeButtonImg}" alt="post like button">
                        </button>
                        <p class="comment-like-count" id="comment-like-count-${comment.commentId}">${comment.likeCount !== undefined ? comment.likeCount : 'error'}</p>
                    </div>

                </div>

            </div>
        `;

        const moreInfoBtn = document.querySelector(`#more-info-comment-${comment.commentId}`);
        if (moreInfoBtn) {
            renderInfoBanner(commentId);
        }

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
        console.error(error);

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
        console.error(error);
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


async function commentLike() {
    // toggle like state as same as postLike function
}

function renderInfoBanner(commentId) {
    // render delete option in the bannner and click to activate delete function
}