"use strict";

var titleInput = document.querySelector('#title-input');
var contentInput = document.querySelector('#content-input');
var postPicture = document.querySelector('#post-picture-input');
var createPostBtn = document.querySelector('#create-post-btn');
var mainFeed = document.querySelector('.main-content');
var editPostBtn = document.querySelectorAll('.edit-post-btn');
var signUpLoginBtn = document.querySelector('.signup-login-btn');
var logoutBtn = document.querySelector('.logout-btn');
var postAudience = document.querySelector('.post-audience');
var articles = [];
var edittingIndex = null;
var loggedInUserId = null;
var postId = null;
var loggedInUserRole = null;
var users = null;
var likeCount = {};
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
  var currentDate, formData, likeCount, i, response, newPost, errorResponse;
  return regeneratorRuntime.async(function addPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          currentDate = new Date();
          formData = new FormData();
          likeCount = 0;

          if (!(titleInput.value === '')) {
            _context2.next = 6;
            break;
          }

          alert("You can't post with empty content");
          return _context2.abrupt("return");

        case 6:
          formData.append('title', titleInput.value);
          formData.append('content', contentInput.value);
          formData.append('audience', postAudience.value);
          formData.append('date', currentDate.toISOString());
          formData.append('likeCount', likeCount);

          if (postPicture && postPicture.files.length > 0) {
            for (i = 0; i < postPicture.files.length; i++) {
              formData.append('files', postPicture.files[i]);
              console.log('Upload file in post:', postPicture.files[i]);
            }
          }

          _context2.prev = 12;
          _context2.next = 15;
          return regeneratorRuntime.awrap(fetch('/post/create', {
            method: 'POST',
            body: formData
          }));

        case 15:
          response = _context2.sent;

          if (!response.ok) {
            _context2.next = 27;
            break;
          }

          _context2.next = 19;
          return regeneratorRuntime.awrap(response.json());

        case 19:
          newPost = _context2.sent;
          articles.push(newPost);
          console.log('Uploaded picture in post', postPicture.files);
          _context2.next = 24;
          return regeneratorRuntime.awrap(fetchAllPosts());

        case 24:
          clearInput();
          _context2.next = 32;
          break;

        case 27:
          _context2.next = 29;
          return regeneratorRuntime.awrap(response.json());

        case 29:
          errorResponse = _context2.sent;
          // Get error response details if available
          console.error('Failed to create post:', errorResponse);
          alert('Failed to create post: ' + errorResponse.message || 'Unknown error');

        case 32:
          _context2.next = 38;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](12);
          console.error('Error createing post:', _context2.t0);
          alert('An error occurred while creating the post');

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[12, 34]]);
}

createPostBtn.addEventListener('click', addPost);

function clearInput() {
  titleInput.value = '';
  contentInput.value = '';
  postPicture.value = '';
}

function renderPost() {
  var initialLike,
      _args3 = arguments;
  return regeneratorRuntime.async(function renderPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          initialLike = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : 0;
          mainFeed.innerHTML = '';
          articles.forEach(function (article) {
            var mainFeedList = document.createElement('div');
            mainFeedList.classList.add('main-feed-list');
            mainFeedList.id = "post-".concat(article.postId);
            console.log('Article UserID:', article.author.userId);
            console.log('Logged in userID:', loggedInUserId);
            console.log('Picture to render in post', article.pictures);
            likeCount[postId] = initialLike;
            mainFeedList.innerHTML = "\n    <div id=\"post-".concat(article.postId, "\">\n      <h3 class=\"article-title\" id=\"title-input-").concat(article.postId, "\">").concat(article.title, "</h3>\n      <p class=\"article-content\" id=\"content-input-").concat(article.postId, "\">").concat(article.content, "</p>\n      <p class=\"post-author-id\">Author ID: ").concat(article.author.userId, "</p>\n      <p class=\"post-id\">Post ID: ").concat(article.postId, "</p>\n      <p class=\"login-user-id\">Login ID: ").concat(loggedInUserId, "</p>\n      <div class=\"post-pictures\">\n        ").concat(article.pictures.map(function (picture) {
              return "<img src=\"/public/".concat(picture.pictureUrl, "\" alt=\"Post picture\" />");
            }).join(''), "\n      </div>\n      <div id=\"post-engagement").concat(article.postId, "\">\n        <button id=\"post-like-btn-").concat(article.postId, "\" class=\"post-like-btn ").concat(article.postLikeCount > 0 ? 'liked' : 'unliked', "\" data-post-id=\"").concat(article.postId, "\">\n          <img src=\"").concat(article.postLikeCount > 0 ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg', "\" alt=\"post like button\">\n        </button>\n        <p class=\"article-like-count\" id=\"like-count-").concat(article.postId, "\">").concat(article.postLikeCount, "</p>\n      </div>\n\n        ").concat(article.author.userId === loggedInUserId ? "<button id=\"edit-btn-".concat(article.postId, "\" class=\"edit-post-btn btn btn-secondary\" data-post-id=\"").concat(article.postId, "\">Edit</button>\n        <button id=\"delete-btn-").concat(article.postId, "\" class=\"delete-post-btn btn btn-danger\" data-post-id=\"").concat(article.postId, "\">Delete</button>") : '', "\n    ").concat(loggedInUserRole === 'admin' && article.author.userId !== loggedInUserId ? "<button id=\"delete-btn-".concat(article.postId, "\" class=\"delete-post-btn btn btn-danger\" data-post-id=\"").concat(article.postId, "\">Delete</button>") : '', "\n    ").concat(article.author.id === loggedInUserId && loggedInUserRole === 'admin' ? '' : '', "\n  </div>\n  ");

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
                  console.log("Delete mode activated for postId: ".concat(postId));
                  deletePost(postId);
                });
              }
            }

            mainFeedList.addEventListener('click', function (event) {
              var postLikeBtn = event.target.closest('.post-like-btn');

              if (postLikeBtn) {
                var _postId = postLikeBtn.getAttribute('data-post-id');

                console.log('Post like button is activated for postId:', _postId);
                likePost(_postId);
              }
            });
            mainFeed.append(mainFeedList);
          });

        case 3:
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
  console.log('Edit mode activated on the postId:', postId);

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

function likePost(postId) {
  var postLikeBtn, likeCountElement, img, isLiked, currentCount, updatedCount, response, updatedPostLikeCountData, revertCount;
  return regeneratorRuntime.async(function likePost$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('Like post activated on postId', postId);
          postLikeBtn = document.getElementById("post-like-btn-".concat(postId));
          likeCountElement = document.querySelector("#like-count-".concat(postId));

          if (!(!postLikeBtn || !likeCountElement)) {
            _context6.next = 6;
            break;
          }

          console.error('Post like button or like count element not found');
          return _context6.abrupt("return");

        case 6:
          img = postLikeBtn.querySelector('img');
          isLiked = postLikeBtn.classList.contains('liked'); // Current count from UI

          currentCount = parseInt(likeCountElement.textContent) || 0; // Update UI Optimistically

          updatedCount = isLiked ? currentCount - 1 : currentCount + 1;
          updatedCount = Math.max(updatedCount, 0); // Ensure count doesn't go below 0
          // Toggle Button State

          postLikeBtn.classList.toggle('liked', !isLiked);
          postLikeBtn.classList.toggle('unliked', isLiked);
          img.src = isLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg'; // Update Count in UI

          likeCountElement.textContent = updatedCount;
          _context6.prev = 15;
          _context6.next = 18;
          return regeneratorRuntime.awrap(fetch("/post/update/likecount/".concat(postId), {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              postLikeCount: updatedCount
            }) // Correct property name

          }));

        case 18:
          response = _context6.sent;

          if (!response.ok) {
            _context6.next = 27;
            break;
          }

          _context6.next = 22;
          return regeneratorRuntime.awrap(response.json());

        case 22:
          updatedPostLikeCountData = _context6.sent;
          console.log('Update like count successfully:', updatedPostLikeCountData); // Update UI with server-confirmed count

          likeCountElement.textContent = updatedPostLikeCountData.postLikeCount;
          _context6.next = 28;
          break;

        case 27:
          throw new Error("Failed to update post like count: ".concat(response.statusText));

        case 28:
          _context6.next = 38;
          break;

        case 30:
          _context6.prev = 30;
          _context6.t0 = _context6["catch"](15);
          console.error('Failed to update post like count:', _context6.t0.message); // Revert UI Changes on Failure

          revertCount = isLiked ? currentCount : currentCount - 1;
          likeCountElement.textContent = revertCount;
          postLikeBtn.classList.toggle('liked', isLiked);
          postLikeBtn.classList.toggle('unliked', !isLiked);
          img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

        case 38:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[15, 30]]);
}