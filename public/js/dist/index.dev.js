"use strict";

var titleInput = document.querySelector("#title-input");
var contentInput = document.querySelector("#content-input");
var createPostBtn = document.querySelector("#create-post-btn");
var mainFeed = document.querySelector(".main-content");
var editPostBtn = document.querySelectorAll(".edit-post-btn");
var signUpLoginBtn = document.querySelector('.signup-login-btn');
var logoutBtn = document.querySelector('.logout-btn');
var articles = [];
var edittingIndex = null;
var loggedInUserId = null;
var postId = null;
document.addEventListener('DOMContentLoaded', function () {
  fetchAllPosts();
});

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

          loggedInUserId = userId; // If you want to log each postId from the posts array:

          posts.forEach(function (post) {
            console.log('Post ID:', post.postId); // Extract and log the postId from each post
          });
          console.log('All render posts:', articles);
          renderPost();
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching all posts:', _context.t0.message);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
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
          articles.forEach(function (article) {
            var mainFeedList = document.createElement("div");
            mainFeedList.classList.add("main-feed-list");
            mainFeedList.id = "post-".concat(article.postId);
            console.log('Article UserID:', article.author.id);
            console.log('Logged in userID:', loggedInUserId);
            mainFeedList.innerHTML = "\n    <div id=\"post-".concat(article.postId, "\">\n      <h3 class=\"article-title\" id=\"title-input-").concat(article.postId, "\">").concat(article.title, "</h3>\n      <p class=\"article-content\" id=\"content-input-").concat(article.postId, "\">").concat(article.content, "</p>\n      <p class=\"post-author-id\">Author ID: ").concat(article.author.id, "</p>\n      <p class=\"post-id\">Post ID: ").concat(article.postId, "</p>\n      <p class=\"login-user-id\">Login ID: ").concat(loggedInUserId, "</p>\n      ").concat(article.author.id === loggedInUserId ? "<button class=\"edit-post-btn btn btn-secondary\" data-post-id=\"".concat(article.postId, "\">Edit</button>\n           <button class=\"delete-post-btn btn btn-danger\" data-post-id=\"").concat(article.postId, "\">Delete</button>") : '', "\n    </div>");

            if (article.author.id === loggedInUserId) {
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
  console.log('Edit mode is activated on the postId:', postId);
  var oldTitle = postElement.querySelector('.article-title');
  var oldContent = postElement.querySelector('.article-content');
  console.log('Old title:', oldTitle);
  console.log('Old content:', oldContent);
  titleInput.textContent = oldTitle;
  contentInput.textContent = oldContent;
  var editBtn = postElement;
} // function editPost(postId, editBtn) {
//   const postElement = document.querySelector(`#post-${postId}`);
//   console.log('Post element in the save post function:', postElement);
//   if (!postElement) {
//     console.error('Post element not found for postId:', postId);
//     return;
//   }
//     // Old text to edit
//     const titleElement = postElement.querySelector('.article-title');
//     const contentElement = postElement.querySelector('.article-content');
//       // Check if titleElement and contentElement exist before proceeding
//     if (!titleElement || !contentElement) {
//       console.error('Title or content elements not found in postElement.');
//       return;
//     }
//     const oldTitle = titleElement.textContent;
//     const oldContent = contentElement.textContent;
//     // Replace the title and content with input fields
//     titleElement.innerHTML = `<input type="text" class="edit-title-input" id="edit-title-input-${postId}" value="${oldTitle}">`;
//     contentElement.innerHTML = `<textarea class="edit-content-input" id="edit-content-input-${postId}">${oldContent}</textarea>`;
//     editBtn.textContent = "Save";
//     editBtn.classList.remove("btn-secondary");
//     editBtn.classList.add("btn-primary");
//     editBtn.removeEventListener('click', () => editPost(postId, editBtn));
//     editBtn.addEventListener('click', () => {
//       savePost(postId, editBtn);
//     }, { once: true });  // Use { once: true } to ensure the save handler is triggered only once
// }


function savePost(postId, editBtn) {
  var postElement, newTitle, newContent, sanitizedTitle, sanitizedContent, updatedPost, response, updatedPostData, titleElement, contentElement;
  return regeneratorRuntime.async(function savePost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          postElement = document.querySelector("#post-".concat(postId));
          console.log('Post element in the save post function:', postElement);

          if (!postElement) {
            _context4.next = 42;
            break;
          }

          // Get the updated values from the input fields
          newTitle = postElement.querySelector("#edit-title-input-".concat(postId)).value;
          newContent = postElement.querySelector("#edit-content-input-".concat(postId)).value;

          if (!(!newTitle || !newContent)) {
            _context4.next = 8;
            break;
          }

          console.error('Title or content input not found.');
          return _context4.abrupt("return");

        case 8:
          sanitizedTitle = DOMPurify.sanitize(newTitle);
          sanitizedContent = DOMPurify.sanitize(newContent); // Prepare the data to be sent to the server

          updatedPost = {
            title: sanitizedTitle,
            content: sanitizedContent
          };
          console.log('New Title:', sanitizedTitle);
          console.log('New Content:', sanitizedContent);
          editBtn.disabled = true; // Send the update request to the server

          _context4.prev = 14;
          _context4.next = 17;
          return regeneratorRuntime.awrap(fetch("/post/update/".concat(postId), {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPost)
          }));

        case 17:
          response = _context4.sent;

          if (!response.ok) {
            _context4.next = 34;
            break;
          }

          _context4.next = 21;
          return regeneratorRuntime.awrap(response.json());

        case 21:
          updatedPostData = _context4.sent;
          console.log('Post update successfully:', updatedPostData);
          titleElement = postElement.querySelector('.article-title');
          contentElement = postElement.querySelector('.article-content'); // Update the post's title and content in the UI with the new values

          titleElement.textContent = sanitizedTitle;
          contentElement.textContent = sanitizedContent; // Change the "Save" button back to "Edit"

          editBtn.textContent = 'Edit';
          editBtn.classList.remove('btn-primary');
          editBtn.classList.add('btn-secondary'); // Re-add the click event listener for editing

          editBtn.removeEventListener('click', function () {
            return savePost(postId, editBtn);
          });
          editBtn.addEventListener('click', function () {
            editPost(postId, editBtn); // Revert back to edit mode
          }, {
            once: true
          });
          _context4.next = 36;
          break;

        case 34:
          console.error('Failed to update post:', response.statusText);
          editBtn.disabled = false;

        case 36:
          _context4.next = 42;
          break;

        case 38:
          _context4.prev = 38;
          _context4.t0 = _context4["catch"](14);
          console.error('Error updating post:', _context4.t0);
          editBtn.disabled = false;

        case 42:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[14, 38]]);
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

signUpLoginBtn.addEventListener('click', function () {
  if (signUpLoginBtn) {
    window.location.href = '/signup';
  }
});