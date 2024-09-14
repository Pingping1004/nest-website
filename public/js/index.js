const titleInput = document.querySelector("#title-input");
const contentInput = document.querySelector("#content-input");
const backHomeBtn = document.querySelector("#back-home-btn");
const createPostBtn = document.querySelector("#create-post-btn");
const mainFeed = document.querySelector(".main-content");
const editPostBtn = document.querySelectorAll(".edit-post-btn");
const signUpLoginBtn = document.querySelector('.signup-login-btn');
const logoutBtn = document.querySelector('.logout-btn');

const articles = [];
let edittingIndex = null;

async function addPost() {
  // const userId = localstorage.getItem("user_id");
  const currentDate = new Date();
  const articleData = {
    // userId,
    title: titleInput.value,
    content: contentInput.value,
    date: currentDate,
  };

  if (titleInput.value === null) {
    alert(`You can't post will empty content :)`);
    return;
  }

  articles.push(articleData);
  console.log(articles);
  renderPost();
  clearInput();
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

    mainFeedList.innerHTML = `<div>
      <h3 class="article-title">${article.title}</h3>
      <p class="article-content">${article.content}</p>
      <button class="edit-post-btn btn btn-secondary">Edit</button>
      <button class="delete-post-btn btn btn-danger">Delete</button>
    </div>`;

    mainFeedList.querySelector(".edit-post-btn").addEventListener("click", () => {
      if (edittingIndex === null) {
        editPost(index);
      } else {
        savePost(edittingIndex);
      }
    });

    mainFeedList.querySelector(".delete-post-btn").addEventListener("click", () => {
      deletePost(index);
    });

    mainFeed.append(mainFeedList);
  });
}

async function editPost(index) {
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
};

async function savePost(index) {
  console.log("Save mode activated");
  const currentDate = new Date();
  const editTitleInput = titleInput.value;
  const editContentInput = contentInput.value;

  console.log("New title:", editTitleInput);
  console.log("New content:", editContentInput);

  articles[index].title = editTitleInput;
  articles[index].content = editContentInput;
  articles[index].date = currentDate.toISOString();

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
}

window.deletePost = async function deletePost(index) {
  if (index > -1 && index < articles.length) {
    // const transactionId = user.id;
    articles.splice(index, 1);
    renderPost();
  }
};

signUpLoginBtn.addEventListener('click', () => {
  if (signUpLoginBtn) {
    window.location.href = '/signup'
  }
});