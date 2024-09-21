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
var loggedInUserId = null;

function fetchAllPosts() {
  var response, data, posts, userId;
  return regeneratorRuntime.async(function fetchAllPosts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('/post/feed'));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Failed to fetch posts');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          posts = data.posts, userId = data.userId;
          articles = posts; // Update the articles array with the latest posts

          loggedInUserId = userId;
          console.log('All render posts:', articles);
          renderPost();
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching all posts:', _context.t0.message);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

function addPost() {
  var currentDate, articleData, response, newPost;
  return regeneratorRuntime.async(function addPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          currentDate = new Date();
          articleData = {
            title: titleInput.value,
            content: contentInput.value,
            date: currentDate
          };

          if (!(titleInput.value === '')) {
            _context2.next = 5;
            break;
          }

          alert("You can't post will empty content :)");
          return _context2.abrupt("return");

        case 5:
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(fetch('/post/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(articleData)
          }));

        case 8:
          response = _context2.sent;

          if (!response.ok) {
            _context2.next = 20;
            break;
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          newPost = _context2.sent;
          articles.push(newPost); // Add the new post to your local articles array

          console.log(articles);
          _context2.next = 17;
          return regeneratorRuntime.awrap(fetchAllPosts());

        case 17:
          clearInput();
          _context2.next = 21;
          break;

        case 20:
          alert('Failed to create post');

        case 21:
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](5);
          console.error('Error creating post:', _context2.t0);
          alert('An error occurred while creating the post.');

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 23]]);
}

createPostBtn.addEventListener("click", addPost);

function clearInput() {
  titleInput.value = "";
  contentInput.value = "";
}

function renderPost() {
  return regeneratorRuntime.async(function renderPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          mainFeed.innerHTML = "";
          articles.forEach(function (article, index) {
            var mainFeedList = document.createElement("div");
            mainFeedList.classList.add("main-feed-list");
            console.log('Article UserID:', article.author.id);
            console.log('Logged in userID:', loggedInUserId);
            mainFeedList.innerHTML = "\n    <div>\n      <h3 class=\"article-title\">".concat(article.title, "</h3>\n      <p class=\"article-content\">").concat(article.content, "</p>\n      <p class=\"post-author-id\">Author ID: ").concat(article.author.id, "</p>\n      <p class=\"login-user-id\">Login ID: ").concat(loggedInUserId, "</p>\n      ").concat(article.author.id === loggedInUserId ? "<button class=\"edit-post-btn btn btn-secondary\">Edit</button>\n           <button class=\"delete-post-btn btn btn-danger\">Delete</button>" : '', "\n    </div>");

            if (article.author.id === loggedInUserId) {
              mainFeedList.querySelector('.edit-post-btn').addEventListener('click', function () {
                editPost(index);
              });
              mainFeedList.querySelector('.delete-post-btn').addEventListener('click', function () {
                deletePost(index);
              });
            }

            mainFeed.append(mainFeedList);
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function editPost(index) {
  var _editPostBtn;

  return regeneratorRuntime.async(function editPost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            console.log("Edit mode activated");
            titleInput.value = articles[index].title;
            contentInput.value = articles[index].content;
            console.log('Old Title', articles[index].title);
            console.log('Old Content', articles[index].content);
            edittingIndex = index;
            _editPostBtn = document.querySelector('.edit-post-btn');
            _editPostBtn.textContent = "Save";

            _editPostBtn.classList.remove("btn-secondary");

            _editPostBtn.classList.add("btn-primary"); // Remove any existing event listeners


            _editPostBtn.removeEventListener("click", editPost);

            _editPostBtn.removeEventListener("click", savePost);

            _editPostBtn.addEventListener("click", savePost);
          } catch (error) {
            console.error('Failed to edit post', error.message);
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

;

function savePost(index) {
  var currentDate, editTitleInput, editContentInput, response, updatePost, _editPostBtn2;

  return regeneratorRuntime.async(function savePost$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          console.log("Save mode activated");
          currentDate = new Date();
          editTitleInput = titleInput.value;
          editContentInput = contentInput.value;
          console.log("New title:", editTitleInput);
          console.log("New content:", editContentInput);
          articles[index].title = editTitleInput;
          articles[index].content = editContentInput;
          articles[index].date = currentDate.toISOString();
          _context5.next = 12;
          return regeneratorRuntime.awrap(fetch('/post/update/:id', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(articles[index])
          }));

        case 12:
          response = _context5.sent;

          if (!response.ok) {
            _context5.next = 20;
            break;
          }

          _context5.next = 16;
          return regeneratorRuntime.awrap(response.json());

        case 16:
          updatePost = _context5.sent;
          console.log(updatePost);
          _context5.next = 21;
          break;

        case 20:
          alert('Failed to edit and save post');

        case 21:
          console.log("Update title", articles[index].title);
          console.log("Update content", articles[index].content);
          _editPostBtn2 = document.querySelector('.edit-post-btn');
          _editPostBtn2.textContent = "Edit";

          _editPostBtn2.classList.remove("btn-primary");

          _editPostBtn2.classList.add("btn-secondary");

          edittingIndex = null; // Remove any existing event listeners

          _editPostBtn2.removeEventListener("click", savePost);

          _editPostBtn2.removeEventListener("click", editPost);

          _editPostBtn2.addEventListener("click", savePost);

          clearInput();
          renderPost();
          _context5.next = 39;
          break;

        case 35:
          _context5.prev = 35;
          _context5.t0 = _context5["catch"](0);
          console.error('Error saving post:', _context5.t0);
          alert('An error occurred while creating the post.');

        case 39:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 35]]);
}

window.deletePost = function deletePost(index) {
  var response, deletedPost;
  return regeneratorRuntime.async(function deletePost$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;

          if (!(index > -1 && index < articles.length)) {
            _context6.next = 15;
            break;
          }

          articles.splice(index, 1);
          _context6.next = 5;
          return regeneratorRuntime.awrap(fetch('/post/delete/:id', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 5:
          response = _context6.sent;

          if (response.ok) {
            _context6.next = 13;
            break;
          }

          _context6.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          deletedPost = _context6.sent;
          console.log(deletedPost);
          _context6.next = 14;
          break;

        case 13:
          alert('Failed to remove post');

        case 14:
          renderPost();

        case 15:
          _context6.next = 20;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](0);
          console.error('Failed to delete post', _context6.t0.message);

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

signUpLoginBtn.addEventListener('click', function () {
  if (signUpLoginBtn) {
    window.location.href = '/signup';
  }
});