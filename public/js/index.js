const titleInput = document.querySelector('#title-input');
const contentInput = document.querySelector('#content-input');
const postPicture = document.querySelector('#post-picture-input');
const createPostBtn = document.querySelector('#create-post-btn');
const mainFeed = document.querySelector('.main-content');
const editPostBtn = document.querySelectorAll('.edit-post-btn');
const signUpLoginBtn = document.querySelector('.signup-login-btn');
const logoutBtn = document.querySelector('.logout-btn');
const postAudience = document.querySelector('.post-audience');

let articles = [];
let loggedInUserId = null;
let postId = null;
let loggedInUserRole = null;
let users = null;
let likeCount = {};

document.addEventListener('DOMContentLoaded', () => {
  fetchAllPosts();
});

async function fetchAllPosts() {
  try {
    const response = await fetch('/post/feed');

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    let { posts, userId, role, user } = data;

    articles = posts; // Update the articles array with the latest posts
    loggedInUserId = userId;
    loggedInUserRole = role;
    users = user;

    // If you want to log each postId from the posts array:
    posts.forEach((post) => {
      console.log('Post ID:', post.postId); // Extract and log the postId from each post
    });

    console.log('All render posts:', articles);
    renderPost();
  } catch (error) {
    console.error('Error fetching all posts:', error.message);
  }
}

async function addPost() {
  const currentDate = new Date();
  const formData = new FormData();
  const likeCount = 0;
  const comments = [];

  if (titleInput.value === '') {
    alert(`You can't post with empty content`);
    return;
  }
  formData.append('title', titleInput.value);
  formData.append('content', contentInput.value);
  formData.append('audience', postAudience.value);
  formData.append('date', currentDate.toISOString());
  formData.append('likeCount', likeCount);
  formData.append('comments', comments);

  if (postPicture && postPicture.files.length > 0) {
    for (let i = 0; i < postPicture.files.length; i++) {
      formData.append('files', postPicture.files[i]);
      console.log('Upload file in post:', postPicture.files[i]);
    }
  }

  try {
    const response = await fetch('/post/create', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const newPost = await response.json();
      articles.push(newPost);
      console.log('Uploaded picture in post', postPicture.files);
      await fetchAllPosts();
      clearInput();
    } else {
      const errorResponse = await response.json(); // Get error response details if available
      console.error('Failed to create post:', errorResponse);
      alert(
        'Failed to create post: ' + errorResponse.message || 'Unknown error',
      );
    }
  } catch (error) {
    console.error('Error createing post:', error);
    alert('An error occurred while creating the post');
  }
}

createPostBtn.addEventListener('click', addPost);

function clearInput() {
  titleInput.value = '';
  contentInput.value = '';
  postPicture.value = '';
}

async function renderPost() {
  mainFeed.innerHTML = '';

  articles.forEach((article) => {
    const mainFeedList = document.createElement('div');
    mainFeedList.classList.add('main-feed-list');

    mainFeedList.id = `post-${article.postId}`;

    console.log('Article UserID:', article.author.userId);
    console.log('Logged in userID:', loggedInUserId);
    console.log('Picture to render in post', article.pictures);
    console.log(`Post ${article.postId} likeCount:`, article.likeCount);

    const isLiked = article.isLiked;
    const likeButtonState = isLiked ? 'liked' : 'unliked';
    const likeButtonImg = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

    mainFeedList.innerHTML = `
    <div id="post-${article.postId}">

      <h3 class="article-title" id="title-input-${article.postId}">${article.title}</h3>
      <p class="article-content" id="content-input-${article.postId}">${article.content}</p>
      <p class="post-author-id">Author ID: ${article.author.userId}</p>
      <p class="post-id">Post ID: ${article.postId}</p>
      <p class="login-user-id">Login ID: ${loggedInUserId}</p>

      <div class="post-pictures">
        ${article.pictures.map((picture) => `<img src="/public/${picture.pictureUrl}" alt="Post picture" />`).join('')}
      </div>

      <div id="post-engagement-${article.postId}" class="post-engagement">

        <div class="post-like">
          <button id="post-like-btn-${article.postId}" class="post-like-btn ${likeButtonState}" data-post-id="${article.postId}">
            <img src="${likeButtonImg}" alt="Post like button" class="like-post-img">
          </button>
          <p class="post-like-count" id="like-count-${article.postId}">${article.likeCount !== undefined ? article.likeCount : 'error'}</p>
        </div>

        <div class="post-comment">
          <button id="post-comment-btn-${article.postId}" class="post-comment-btn" data-post-id="${article.postId}">
            <img src="/public/picture/Comment.svg" alt="Post comment button" class="comment-post-img">
          </button>
        </div>

      </div>

        ${
      article.author.userId === loggedInUserId
        ? `<button id="edit-btn-${article.postId}" class="edit-post-btn btn btn-secondary" data-post-id="${article.postId}">Edit</button>
        <button id="delete-btn-${article.postId}" class="delete-post-btn btn btn-danger" data-post-id="${article.postId}">Delete</button>`
      : ''
    }
    ${
      loggedInUserRole === 'admin' && article.author.userId !== loggedInUserId
        ? `<button id="delete-btn-${article.postId}" class="delete-post-btn btn btn-danger" data-post-id="${article.postId}">Delete</button>`
        : ''
    }
    ${article.author.id === loggedInUserId && loggedInUserRole === 'admin' ? '' : ''}
  </div>
  `;

    const likeButton = document.getElementById(`post-like-btn-${article.postId}`);
    if (likeButton) {
        if (article.isLiked) {
            likeButton.classList.add('liked');
        } else {
            likeButton.classList.remove('liked');
        }
    }

    if (article.author.userId === loggedInUserId || loggedInUserRole === 'admin') {
      const editBtn = mainFeedList.querySelector('.edit-post-btn');
      if (editBtn) {
        editBtn.addEventListener('click', (event) => {
          const postId = event.target.getAttribute('data-post-id');
          console.log(`Edit mode activated for postId: ${postId}`);
          editPost(postId, editBtn);
        });
      }

      const deleteBtn = mainFeedList.querySelector('.delete-post-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (event) => {
          const postId = event.target.getAttribute('data-post-id');
          console.log(`Delete mode activated for postId: ${postId}`);
          deletePost(postId);
        });
      }
    }

    mainFeedList.addEventListener('click', (event) => {
      const postLikeBtn = event.target.closest('.post-like-btn');
      if (postLikeBtn) {
        const postId = postLikeBtn.getAttribute('data-post-id');
        console.log('Post like button is activated for postId:', postId);
        postLikeCount(postId);
      }
    });

    mainFeedList.addEventListener('click', (event) => {
      const postCommentBtn = event.target.closest('.post-comment-btn');
      if (postCommentBtn) {
        const postId = postCommentBtn.getAttribute('data-post-id');
        const userId = loggedInUserId;
        console.log('Post comment button is activated for postId:', postId, 'by userId', userId);

        if (!postId) {
          console.error('Post ID is missing');
          return;
        }

        localStorage.setItem('postId', postId);
        window.location.href = `/comments/render/${postId}/${userId}`;
        // window.location.href = `/comments/render/${encodeURIComponent(postId)}/${encodeURIComponent(userId)}`;
      }
    });

    fetchLikeCount(article.postId);
    mainFeed.append(mainFeedList);
  });
}

function editPost(postId) {
  const postElement = document.querySelector(`#post-${postId}`);
  const editBtn = postElement.querySelector(`#edit-btn-${postId}`);
  const titleElement = postElement.querySelector('.article-title');
  const contentElement = postElement.querySelector('.article-content');
  const isEditing = editBtn.textContent === 'Save';

  console.log('Edit mode activated on the postId:', postId);

  if (isEditing) {
    // If already in "Save" mode, call the save function
    savePost(postId);
  } else {
    // Switch to edit mode
    editBtn.textContent = 'Save';
    editBtn.classList.remove('btn-secondary');
    editBtn.classList.add('btn-primary');

    // Change the UI to indicate editable mode
    titleElement.contentEditable = true;
    contentElement.contentEditable = true;
  }
}

async function savePost(postId) {
  const postElement = document.querySelector(`#post-${postId}`);
  const titleElement = postElement.querySelector('.article-title');
  const contentElement = postElement.querySelector('.article-content');
  const editBtn = postElement.querySelector(`#edit-btn-${postId}`);

  const newTitle = titleElement.textContent;
  const newContent = contentElement.textContent;

  if (!newTitle) {
    alert("You can't post with an empty title");
    return;
  }

  const updatedPost = {
    title: newTitle,
    content: newContent,
  };

  try {
    const response = await fetch(`/post/update/${postId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    });

    if (response.ok) {
      const updatedPostData = await response.json();
      console.log('Update post successfully', updatedPostData);

      // Update the DOM with the new title and content
      titleElement.textContent = updatedPost.title;
      contentElement.textContent = updatedPost.content;

      // Switch back to 'Edit' mode after saving
      editBtn.textContent = 'Edit';
      editBtn.classList.remove('btn-primary');
      editBtn.classList.add('btn-secondary');

      // Reset contentEditable to false
      titleElement.contentEditable = false;
      contentElement.contentEditable = false;
      clearInput();
    } else {
      throw new Error('Failed to update post:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving post:', error.message);
  }
}

window.deletePost = async function deletePost(postId) {
  try {
    console.log('postId to delete:', postId);
    const response = await fetch(`/post/delete/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const postElement = document.getElementById(`post-${postId}`);
      if (postElement) {
        postElement.remove();
      } else {
        console.error(`Post element with ID post-${postId} not found in DOM`);
      }

      const deletedPost = await response.json();
      console.log('Deleted post:', deletedPost);

      articles = articles.filter(
        (article) => article.postId !== parseInt(postId, 10),
      );
      console.log('Post deleted successfully');
      renderPost();
    } else {
      const result = await response.json();
      alert('Failed to remove post' + result.message);
      console.error('Failed to remove post:', result.message);
    }
  } catch (error) {
    console.error('Failed to delete post', error.message);
  }
};

async function postLikeCount(postId) {
  console.log('Like post activated on postId', postId);
  
  const postLikeBtn = document.getElementById(`post-like-btn-${postId}`);
  const likeCountElement = document.querySelector(`#like-count-${postId}`);
  let currentCount = parseInt(likeCountElement.textContent, 10) || 0;

  if (!loggedInUserId) {
    alert('User ID is not available, please login first');
  }

  if (!postLikeBtn || !likeCountElement) {
    console.error('Post like button or like count element not found');
    return;
  }

  const img = postLikeBtn.querySelector('img');
  const isLiked = postLikeBtn.classList.contains('liked');
  const newCount = isLiked ? currentCount - 1 : currentCount + 1;
  
  // Toggle Button State when click
  postLikeBtn.classList.toggle('liked', !isLiked);
  postLikeBtn.classList.toggle('unliked', isLiked);
  img.src = isLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg';
  updateLikeCount(postId, newCount);

  try {
    const response = await fetch(`/post/update/like/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, userId: loggedInUserId }),
    });
    if (!response.ok) {
      console.error('Failed to toggle like', error.message);
      updateLikeCount(postId, currentCount);
    }

    const updatedPost = await response.json();
    updateLikeCount(postId, updatedPost.likeCount);

    // Toggle Button State when render
    postLikeBtn.classList.toggle('liked', updatedPost.isLiked);
    postLikeBtn.classList.toggle('unliked', !updatedPost.isLiked);
  } catch (error) {
    console.error(error);
        
    // Revert optimistic UI update on error
    postLikeBtn.classList.toggle('liked', isLiked);
    postLikeBtn.classList.toggle('unliked', !isLiked);
    img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    postLikeBtn.classList.toggle('liked', isLiked);
    postLikeBtn.classList.toggle('unliked', !isLiked);
    updateLikeCount(postId, currentCount);
  }
}

async function fetchLikeCount(postId) {
  try {
    const response = await fetch(`/post/get/likeCount/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch like count');

    const likeCount = await response.json();
    console.log('Fetched like count', likeCount);
    updateLikeCount(postId, likeCount);
  } catch (error) {
    console.error(error);
  }
}

function updateLikeCount(postId, likeCount) {
  console.log(`Updating Post ${postId} likeCount to:`, likeCount);
  const likeCountElement = document.getElementById(`like-count-${postId}`);
  if (likeCountElement) {
    likeCountElement.textContent = likeCount;
  }
}
