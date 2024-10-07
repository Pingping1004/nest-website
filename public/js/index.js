const titleInput = document.querySelector("#title-input");
const contentInput = document.querySelector("#content-input");
const createPostBtn = document.querySelector("#create-post-btn");
const mainFeed = document.querySelector(".main-content");
const editPostBtn = document.querySelectorAll(".edit-post-btn");
const signUpLoginBtn = document.querySelector('.signup-login-btn');
const logoutBtn = document.querySelector('.logout-btn');

let articles = [];
let edittingIndex = null;
let loggedInUserId = null;
let postId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchAllPosts();
})

async function fetchAllPosts() {
  try {
    const response = await fetch('/post/feed');

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    let { posts, userId } = data;

    articles = posts; // Update the articles array with the latest posts
    loggedInUserId = userId;
    
    // If you want to log each postId from the posts array:
    posts.forEach(post => {
      console.log('Post ID:', post.postId);  // Extract and log the postId from each post
    });

    console.log('All render posts:', articles);
    renderPost();
  } catch (error) {
      console.error('Error fetching all posts:', error.message);
  }
}

async function addPost() {
  const currentDate = new Date();
  const articleData = {
    title: titleInput.value,
    content: contentInput.value,
    date: currentDate,
  };

  if (titleInput.value === '') {
    alert(`You can't post will empty content :)`);
    return;
  }

  try {
    const response = await fetch('/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (response.ok) {
        const newPost = await response.json();
        articles.push(newPost);  // Add the new post to your local articles array
        console.log(articles);
        await fetchAllPosts();
        clearInput();
    } else {
        alert('Failed to create post');
    }
  } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
  }
}

createPostBtn.addEventListener("click", addPost);

function clearInput() {
  titleInput.value = "";
  contentInput.value = "";
}

async function renderPost() {
  mainFeed.innerHTML = "";

  articles.forEach((article) => {
    const mainFeedList = document.createElement("div");
    mainFeedList.classList.add("main-feed-list");

    mainFeedList.id = `post-${article.postId}`;

    console.log('Article UserID:', article.author.id);
    console.log('Logged in userID:', loggedInUserId);

    mainFeedList.innerHTML = `
    <div id="post-${article.postId}">
      <h3 class="article-title" id="title-input-${article.postId}">${article.title}</h3>
      <p class="article-content" id="content-input-${article.postId}">${article.content}</p>
      <p class="post-author-id">Author ID: ${article.author.id}</p>
      <p class="post-id">Post ID: ${article.postId}</p>
      <p class="login-user-id">Login ID: ${loggedInUserId}</p>
      ${article.author.id === loggedInUserId
        ? `<button id="edit-btn-${article.postId}" class="edit-post-btn btn btn-secondary" data-post-id="${article.postId}">Edit</button>
           <button id="delete-btn-${article.postId}" class="delete-post-btn btn btn-danger" data-post-id="${article.postId}">Delete</button>`
        : ''}
    </div>`;

    if (article.author.id === loggedInUserId) {
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
          deletePost(postId);
        });
      }
    }

    mainFeed.append(mainFeedList);
  });
}

function editPost(postId) {
  const postElement = document.querySelector(`#post-${postId}`);
  const editBtn= postElement.querySelector(`#edit-btn-${postId}`);
  const titleElement = postElement.querySelector('.article-title');
  const contentElement = postElement.querySelector('.article-content');
  const isEditing = editBtn.textContent === 'Save';
  
  console.log("Edit mode activated on the postId:", postId);

  if (isEditing) {
    // If already in "Save" mode, call the save function
    savePost(postId);
  } else {
    // Switch to edit mode
    editBtn.textContent = 'Save';
    editBtn.classList.remove('btn-secondary');
    editBtn.classList.add('btn-primary');
    createPostBtn.disabled = true; // Disable create button

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
      createPostBtn.disabled = false; // Re-enable create button

      // Reset contentEditable to false
      titleElement.contentEditable = false;
      contentElement.contentEditable = false;
      clearInput();
    } else {
      console.error('Failed to update post:', response.statusText);
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

        articles = articles.filter(article => article.postId !== parseInt(postId, 10));
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
}

signUpLoginBtn.addEventListener('click', () => {
  if (signUpLoginBtn) {
    window.location.href = '/signup'
  }
});