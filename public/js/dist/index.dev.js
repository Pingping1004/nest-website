"use strict";

var titleInput = document.querySelector("#title-input");
var contentInput = document.querySelector("#content-input");
var postPicture = document.querySelector('#post-picture-input');
var createPostBtn = document.querySelector("#create-post-btn");
var mainFeed = document.querySelector(".main-content");
var editPostBtn = document.querySelectorAll(".edit-post-btn");
var signUpLoginBtn = document.querySelector('.signup-login-btn');
var logoutBtn = document.querySelector('.logout-btn');
var articles = [];
var edittingIndex = null;
var loggedInUserId = null;
var postId = null;
var loggedInUserRole = null;
var users = null;
document.addEventListener('DOMContentLoaded', function () {
  fetchAllPosts();
});

function fetchAllPosts() {
  var response, data, posts, userId, role, user;
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
          posts = data.posts, userId = data.userId, role = data.role, user = data.user;
          articles = posts; // Update the articles array with the latest posts

          loggedInUserId = userId;
          loggedInUserRole = role;
          users = user; // If you want to log each postId from the posts array:

          posts.forEach(function (post) {
            console.log('Post ID:', post.postId); // Extract and log the postId from each post
          });
          console.log('All render posts:', articles);
          renderPost();
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching all posts:', _context.t0.message);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
}

function addPost() {
  var currentDate, formData, i, response, newPost, errorResponse;
  return regeneratorRuntime.async(function addPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          currentDate = new Date();
          formData = new FormData();

          if (!(titleInput.value === '')) {
            _context2.next = 5;
            break;
          }

          alert("You can't post with empty content");
          return _context2.abrupt("return");

        case 5:
          formData.append('title', titleInput.value);
          formData.append('content', contentInput.value);
          formData.append('date', currentDate.toISOString());

          if (postPicture && postPicture.files.length > 0) {
            for (i = 0; i < postPicture.files.length; i++) {
              formData.append('files', postPicture.files[i]);
              console.log('Upload file in post:', postPicture.files[i]);
            }
          }

          _context2.prev = 9;
          _context2.next = 12;
          return regeneratorRuntime.awrap(fetch('/post/create', {
            method: 'POST',
            body: formData
          }));

        case 12:
          response = _context2.sent;

          if (!response.ok) {
            _context2.next = 24;
            break;
          }

          _context2.next = 16;
          return regeneratorRuntime.awrap(response.json());

        case 16:
          newPost = _context2.sent;
          articles.push(newPost);
          console.log('Uploaded picture in post', postPicture.files);
          _context2.next = 21;
          return regeneratorRuntime.awrap(fetchAllPosts());

        case 21:
          clearInput();
          _context2.next = 29;
          break;

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(response.json());

        case 26:
          errorResponse = _context2.sent;
          // Get error response details if available
          console.error('Failed to create post:', errorResponse);
          alert('Failed to create post: ' + errorResponse.message || 'Unknown error');

        case 29:
          _context2.next = 35;
          break;

        case 31:
          _context2.prev = 31;
          _context2.t0 = _context2["catch"](9);
          console.error('Error createing post:', _context2.t0);
          alert('An error occurred while creating the post');

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[9, 31]]);
}

createPostBtn.addEventListener("click", addPost);

function clearInput() {
  titleInput.value = "";
  contentInput.value = "";
  postPicture.value = "";
}

function renderPost() {
  return regeneratorRuntime.async(function renderPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          mainFeed.innerHTML = "";
          articles.forEach(function (article) {
            var mainFeedList = document.createElement("div");
            mainFeedList.classList.add("main-feed-list");
            mainFeedList.id = "post-".concat(article.postId);
            console.log('Article UserID:', article.author.userId);
            console.log('Logged in userID:', loggedInUserId);
            console.log('Picture to render in post', article.pictures);
            mainFeedList.innerHTML = "\n<div id=\"post-".concat(article.postId, "\">\n  <h3 class=\"article-title\" id=\"title-input-").concat(article.postId, "\">").concat(article.title, "</h3>\n  <p class=\"article-content\" id=\"content-input-").concat(article.postId, "\">").concat(article.content, "</p>\n  <p class=\"post-author-id\">Author ID: ").concat(article.author.userId, "</p>\n  <p class=\"post-id\">Post ID: ").concat(article.postId, "</p>\n  <p class=\"login-user-id\">Login ID: ").concat(loggedInUserId, "</p>\n  <div class=\"post-pictures\">\n    ").concat(article.pictures.map(function (picture) {
              return "<img src=\"/public/".concat(picture.pictureUrl, "\" alt=\"Post picture\" />");
            }).join(''), "\n  </div>\n  ").concat(article.author.userId === loggedInUserId ? "<button id=\"edit-btn-".concat(article.postId, "\" class=\"edit-post-btn btn btn-secondary\" data-post-id=\"").concat(article.postId, "\">Edit</button>\n       <button id=\"delete-btn-").concat(article.postId, "\" class=\"delete-post-btn btn btn-danger\" data-post-id=\"").concat(article.postId, "\">Delete</button>") : '', "\n  ").concat(loggedInUserRole === 'admin' && article.author.userId !== loggedInUserId ? "<button id=\"delete-btn-".concat(article.postId, "\" class=\"delete-post-btn btn btn-danger\" data-post-id=\"").concat(article.postId, "\">Delete</button>") : '', "\n  ").concat(article.author.id === loggedInUserId && loggedInUserRole === 'admin' ? '' : '', "\n</div>");

            if (article.author.userId === loggedInUserId || loggedInUserRole === 'admin') {
              var editBtn = mainFeedList.querySelector('.edit-post-btn');

              if (editBtn) {
                editBtn.addEventListener('click', function (event) {
                  var postId = event.target.getAttribute('data-post-id');
                  console.log("Edit mode activated for postId: ".concat(postId));
                  editPost(postId, editBtn);
                });
              }

              var deleteBtn = mainFeedList.querySelector('.delete-post-btn');

              if (deleteBtn) {
                deleteBtn.addEventListener('click', function (event) {
                  var postId = event.target.getAttribute('data-post-id');
                  deletePost(postId);
                });
              }
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

function editPost(postId) {
  var postElement = document.querySelector("#post-".concat(postId));
  var editBtn = postElement.querySelector("#edit-btn-".concat(postId));
  var titleElement = postElement.querySelector('.article-title');
  var contentElement = postElement.querySelector('.article-content');
  var isEditing = editBtn.textContent === 'Save';
  console.log("Edit mode activated on the postId:", postId);

  if (isEditing) {
    // If already in "Save" mode, call the save function
    savePost(postId);
  } else {
    // Switch to edit mode
    editBtn.textContent = 'Save';
    editBtn.classList.remove('btn-secondary');
    editBtn.classList.add('btn-primary'); // Change the UI to indicate editable mode

    titleElement.contentEditable = true;
    contentElement.contentEditable = true;
  }
}

function savePost(postId) {
  var postElement, titleElement, contentElement, editBtn, newTitle, newContent, updatedPost, response, updatedPostData;
  return regeneratorRuntime.async(function savePost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          postElement = document.querySelector("#post-".concat(postId));
          titleElement = postElement.querySelector('.article-title');
          contentElement = postElement.querySelector('.article-content');
          editBtn = postElement.querySelector("#edit-btn-".concat(postId));
          newTitle = titleElement.textContent;
          newContent = contentElement.textContent;

          if (newTitle) {
            _context4.next = 9;
            break;
          }

          alert("You can't post with an empty title");
          return _context4.abrupt("return");

        case 9:
          updatedPost = {
            title: newTitle,
            content: newContent
          };
          _context4.prev = 10;
          _context4.next = 13;
          return regeneratorRuntime.awrap(fetch("/post/update/".concat(postId), {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPost)
          }));

        case 13:
          response = _context4.sent;

          if (!response.ok) {
            _context4.next = 29;
            break;
          }

          _context4.next = 17;
          return regeneratorRuntime.awrap(response.json());

        case 17:
          updatedPostData = _context4.sent;
          console.log('Update post successfully', updatedPostData); // Update the DOM with the new title and content

          titleElement.textContent = updatedPost.title;
          contentElement.textContent = updatedPost.content; // Switch back to 'Edit' mode after saving

          editBtn.textContent = 'Edit';
          editBtn.classList.remove('btn-primary');
          editBtn.classList.add('btn-secondary'); // Reset contentEditable to false

          titleElement.contentEditable = false;
          contentElement.contentEditable = false;
          clearInput();
          _context4.next = 30;
          break;

        case 29:
          throw new Error('Failed to update post:', response.statusText);

        case 30:
          _context4.next = 35;
          break;

        case 32:
          _context4.prev = 32;
          _context4.t0 = _context4["catch"](10);
          console.error('Error saving post:', _context4.t0.message);

        case 35:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[10, 32]]);
}

window.deletePost = function deletePost(postId) {
  var response, postElement, deletedPost, result;
  return regeneratorRuntime.async(function deletePost$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          console.log('postId to delete:', postId);
          _context5.next = 4;
          return regeneratorRuntime.awrap(fetch("/post/delete/".concat(postId), {
            method: 'DELETE',
            credentials: 'include'
          }));

        case 4:
          response = _context5.sent;

          if (!response.ok) {
            _context5.next = 17;
            break;
          }

          postElement = document.getElementById("post-".concat(postId));

          if (postElement) {
            postElement.remove();
          } else {
            console.error("Post element with ID post-".concat(postId, " not found in DOM"));
          }

          _context5.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          deletedPost = _context5.sent;
          console.log('Deleted post:', deletedPost);
          articles = articles.filter(function (article) {
            return article.postId !== parseInt(postId, 10);
          });
          console.log('Post deleted successfully');
          renderPost();
          _context5.next = 22;
          break;

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(response.json());

        case 19:
          result = _context5.sent;
          alert('Failed to remove post' + result.message);
          console.error('Failed to remove post:', result.message);

        case 22:
          _context5.next = 27;
          break;

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](0);
          console.error('Failed to delete post', _context5.t0.message);

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 24]]);
};