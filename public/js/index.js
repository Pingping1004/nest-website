const titleInput = document.querySelector("#title-input");
const contentInput = document.querySelector("#content-input");
const backHomeBtn = document.querySelector("#back-home-btn");
const createPostBtn = document.querySelector("#create-post-btn");
const mainFeed = document.querySelector(".main-content");
const editPostBtn = document.querySelectorAll(".edit-post-btn");
const signUpLoginBtn = document.querySelector('.signup-login-btn');
const logoutBtn = document.querySelector('.logout-btn');

let articles = [];
let edittingIndex = null;
let loggedInUserId = null;

async function fetchAllPosts() {
  try {
    const response = await fetch('/post/feed');

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    const { posts, userId } = data;
    articles = posts; // Update the articles array with the latest posts
    loggedInUserId = userId;
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

  articles.forEach((article, index) => {
    const mainFeedList = document.createElement("div");
    mainFeedList.classList.add("main-feed-list");

    console.log('Article UserID:', article.author.id);
    console.log('Logged in userID:', loggedInUserId);

    mainFeedList.innerHTML = `
    <div>
      <h3 class="article-title">${article.title}</h3>
      <p class="article-content">${article.content}</p>
      <p class="post-author-id">Author ID: ${article.author.id}</p>
      <p class="login-user-id">Login ID: ${loggedInUserId}</p>
      ${article.author.id === loggedInUserId
        ? `<button class="edit-post-btn btn btn-secondary">Edit</button>
           <button class="delete-post-btn btn btn-danger">Delete</button>`
        : ''}
    </div>`;

    if (article.author.id === loggedInUserId) {
      mainFeedList.querySelector('.edit-post-btn').addEventListener('click', () => {
        editPost(index);
      });

      mainFeedList.querySelector('.delete-post-btn').addEventListener('click', () => {
        deletePost(index);
      });
    }

    mainFeed.append(mainFeedList);
  });
}

async function editPost(index) {
  try {
      console.log("Edit mode activated");

      titleInput.value = articles[index].title;
      contentInput.value = articles[index].content;

      console.log('Old Title', articles[index].title)
      console.log('Old Content', articles[index].content)

      edittingIndex = index;

      const editPostBtn = document.querySelector('.edit-post-btn');
      editPostBtn.textContent = "Save";
      editPostBtn.classList.remove("btn-secondary");
      editPostBtn.classList.add("btn-primary");

      // Remove any existing event listeners
      editPostBtn.removeEventListener("click", editPost);
      editPostBtn.removeEventListener("click", savePost);
      editPostBtn.addEventListener("click", savePost);
  } catch (error) {
      console.error('Failed to edit post', error.message);
  }
};

async function savePost(index) {
  try {
      console.log("Save mode activated");

      const currentDate = new Date();
      const editTitleInput = titleInput.value;
      const editContentInput = contentInput.value;

      console.log("New title:", editTitleInput);
      console.log("New content:", editContentInput);

      articles[index].title = editTitleInput;
      articles[index].content = editContentInput;
      articles[index].date = currentDate.toISOString();

      const response = await fetch('/post/update/:id', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articles[index]),
      });

      if (response.ok) {
          const updatePost = await response.json();
          console.log(updatePost);
      } else {
          alert('Failed to edit and save post');
      }

      console.log("Update title", articles[index].title);
      console.log("Update content", articles[index].content);

      const editPostBtn = document.querySelector('.edit-post-btn');
      editPostBtn.textContent = "Edit";
      editPostBtn.classList.remove("btn-primary");
      editPostBtn.classList.add("btn-secondary");

      edittingIndex = null;

      // Remove any existing event listeners
      editPostBtn.removeEventListener("click", savePost);
      editPostBtn.removeEventListener("click", editPost);
      editPostBtn.addEventListener("click", savePost);

      clearInput();
      renderPost();
  } catch (error) {
      console.error('Error saving post:', error);
      alert('An error occurred while creating the post.');
  }
}

window.deletePost = async function deletePost(index) {
  try {
      if (index > -1 && index < articles.length) {
          articles.splice(index, 1);
          const response = await fetch('/post/delete/:id', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (!response.ok) {
              const deletedPost = await response.json();
              console.log(deletedPost);
          } else {
              alert('Failed to remove post');
          }

          renderPost();
      }
  } catch (error) {
      console.error('Failed to delete post', error.message);
  }
};

signUpLoginBtn.addEventListener('click', () => {
  if (signUpLoginBtn) {
    window.location.href = '/signup'
  }
});