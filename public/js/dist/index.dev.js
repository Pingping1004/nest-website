"use strict";

var titleInput = document.querySelector("#title-input");
var contentInput = document.querySelector("#content-input");
var backHomeBtn = document.querySelector("#back-home-btn");
var createPostBtn = document.querySelector("#create-post-btn");
var mainFeed = document.querySelector(".main-content");
var editPostBtn = document.querySelectorAll(".edit-post-btn");
var signUpLoginBtn = document.querySelector('.signup-login-btn');
var logoutBtn = document.querySelector('.logout-btn');
var articles = [];
var edittingIndex = null;

function addPost() {
  var currentDate, articleData;
  return regeneratorRuntime.async(function addPost$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // const userId = localstorage.getItem("user_id");
          currentDate = new Date();
          articleData = {
            // userId,
            title: titleInput.value,
            content: contentInput.value,
            date: currentDate
          };

          if (!(titleInput.value === null)) {
            _context.next = 5;
            break;
          }

          alert("You can't post will empty content :)");
          return _context.abrupt("return");

        case 5:
          articles.push(articleData);
          console.log(articles);
          renderPost();
          clearInput();

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

createPostBtn.addEventListener("click", addPost);

function clearInput() {
  titleInput.value = "";
  contentInput.value = "";
}

function renderPost() {
  return regeneratorRuntime.async(function renderPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          mainFeed.innerHTML = "";
          articles.forEach(function (article, index) {
            var mainFeedList = document.createElement("div");
            mainFeedList.classList.add("main-feed-list");
            mainFeedList.innerHTML = "<div>\n      <h3 class=\"article-title\">".concat(article.title, "</h3>\n      <p class=\"article-content\">").concat(article.content, "</p>\n      <button class=\"edit-post-btn btn btn-secondary\">Edit</button>\n      <button class=\"delete-post-btn btn btn-danger\">Delete</button>\n    </div>");
            mainFeedList.querySelector(".edit-post-btn").addEventListener("click", function () {
              if (edittingIndex === null) {
                editPost(index);
              } else {
                savePost(edittingIndex);
              }
            });
            mainFeedList.querySelector(".delete-post-btn").addEventListener("click", function () {
              deletePost(index);
            });
            mainFeed.append(mainFeedList);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function editPost(index) {
  var editPostBtn;
  return regeneratorRuntime.async(function editPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("Edit mode activated");
          titleInput.value = articles[index].title;
          contentInput.value = articles[index].content;
          console.log('Old Title', articles[index].title);
          console.log('Old Content', articles[index].content);
          edittingIndex = index;
          editPostBtn = document.querySelector('.edit-post-btn');
          editPostBtn.textContent = "Save";
          editPostBtn.classList.remove("btn-secondary");
          editPostBtn.classList.add("btn-primary"); // Remove any existing event listeners

          editPostBtn.removeEventListener("click", editPost);
          editPostBtn.removeEventListener("click", savePost);
          editPostBtn.addEventListener("click", savePost);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
}

;

function savePost(index) {
  var currentDate, editTitleInput, editContentInput, editPostBtn;
  return regeneratorRuntime.async(function savePost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("Save mode activated");
          currentDate = new Date();
          editTitleInput = titleInput.value;
          editContentInput = contentInput.value;
          console.log("New title:", editTitleInput);
          console.log("New content:", editContentInput);
          articles[index].title = editTitleInput;
          articles[index].content = editContentInput;
          articles[index].date = currentDate.toISOString();
          console.log("Update title", articles[index].title);
          console.log("Update content", articles[index].content);
          editPostBtn = document.querySelector('.edit-post-btn');
          editPostBtn.textContent = "Edit";
          editPostBtn.classList.remove("btn-primary");
          editPostBtn.classList.add("btn-secondary");
          edittingIndex = null; // Remove any existing event listeners

          editPostBtn.removeEventListener("click", savePost);
          editPostBtn.removeEventListener("click", editPost);
          editPostBtn.addEventListener("click", savePost);
          clearInput();
          renderPost();

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  });
}

window.deletePost = function deletePost(index) {
  return regeneratorRuntime.async(function deletePost$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (index > -1 && index < articles.length) {
            // const transactionId = user.id;
            articles.splice(index, 1);
            renderPost();
          }

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

signUpLoginBtn.addEventListener('click', function () {
  if (signUpLoginBtn) {
    window.location.href = '/signup';
  }
});