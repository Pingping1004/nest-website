"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var commentContentInput = document.querySelector('.input-content');
var addCommentBtn = document.querySelector('.add-comment-btn');
var backBtn = document.querySelector('.post-back-btn');
var postEngagementContainer = document.querySelector('.post-engagement');
var comments = [];
var commentId = null;
var commentLikeCount = [];
var isLiked = null;
var postIsLiked = null;
var postLikeCount = null;
var post = null;
var postId = null;
var loggedInUserId = null;
var loggedInUser = null;
document.addEventListener('DOMContentLoaded', function () {
  fetchComments();
  fetchPostLikeCount(postId);
  document.body.addEventListener('click', function (event) {
    var moreInfoBtn = event.target.closest('.more-info-btn');

    if (moreInfoBtn) {
      var _commentId = moreInfoBtn.getAttribute('data-comment-id');

      console.log('More info clicked for comment ID:', _commentId);
      renderPopup(postId, _commentId);
    }
  });
});

function fetchComments() {
  var response, data, user, _post;

  return regeneratorRuntime.async(function fetchComments$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          postId = localStorage.getItem('postId');
          console.log('Post ID for comment page:', postId);
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch("/comments/get-comments/".concat(postId)));

        case 5:
          response = _context.sent;

          if (response.ok) {
            _context.next = 8;
            break;
          }

          throw new Error('Failed to fetch comments');

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          data = _context.sent;
          console.log('Fetched comments data:', data);
          user = data.user, _post = data.post;
          _post = _post;
          comments = _post.comments;
          postIsLiked = _post.isLiked;
          postId = _post.postId;
          loggedInUser = user;
          loggedInUserId = user.userId;
          console.log('Fetched post in comment page', _post);
          console.log('Logged in user object detail', loggedInUser);
          console.log('Fetched post like state in comment page', postIsLiked);
          console.log('Fetched postId in comment page', postId);
          console.log('All fetched comments', comments);
          comments.forEach(function (comment) {
            console.log('All fetched comment ID', comment.commentId);
          });
          console.log('Fetched user', user);
          console.log('Fetched logged in userId', loggedInUserId);
          console.log('Post ID ', postId, ' like state ', postIsLiked);
          renderComments();
          _context.next = 34;
          break;

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](2);
          console.error('Error fetching all comments on post:', _context.t0.message);

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 31]]);
}

function createComment() {
  var content, comment, response, responseData, newComment, errorResponse;
  return regeneratorRuntime.async(function createComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          content = commentContentInput.value;
          console.log('postId', postId);
          comment = {
            content: content,
            date: new Date(),
            likeCount: 0,
            postId: postId,
            userId: loggedInUserId
          };
          console.log('User ID in create comment function:', comment.userId);
          console.log('Comment object before sending to backend', comment);
          _context2.next = 8;
          return regeneratorRuntime.awrap(fetch('/comments/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
          }));

        case 8:
          response = _context2.sent;

          if (!response.ok) {
            _context2.next = 22;
            break;
          }

          console.log('Response from creating', response);
          _context2.next = 13;
          return regeneratorRuntime.awrap(response.json());

        case 13:
          responseData = _context2.sent;
          console.log('Response data:', responseData);
          newComment = responseData.comment;
          comments.push(newComment);
          console.log('New comment:', newComment);
          renderComments();
          commentContentInput.value = '';
          _context2.next = 27;
          break;

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(response.json());

        case 24:
          errorResponse = _context2.sent;
          console.error('Failed to create comment:', errorResponse);
          throw new Error(errorResponse.message || 'Unknown error');

        case 27:
          _context2.next = 33;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](0);
          console.error('Error createing comment:', _context2.t0.message);
          alert('An error occurred while creating comment');

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29]]);
}

addCommentBtn.addEventListener('click', createComment);
backBtn.addEventListener('click', function (event) {
  // const userId = event.target.getAttribute('data-user-id');
  var userRole = loggedInUser.role;
  var userId = loggedInUserId;

  if (!userId) {
    console.error('User ID is missing');
    return;
  }

  if (userRole === 'admin') {
    window.location.href = "/auth/admin/index/".concat(userId);
  } else {
    window.location.href = "/auth/index/".concat(userId);
  }
});

function renderComments() {
  var postCommentContainer = document.querySelector('.comment-post-container');
  postCommentContainer.innerHTML = '';
  console.log('Comments to render', comments);
  comments.forEach(function (comment) {
    var postComment = document.createElement('div');
    postComment.classList.add('comment-post');
    postComment.id = "comment-".concat(comment.commentId);
    console.log('Post authorId', comment.commenter.userId);
    console.log('Post ID:', postId);
    console.log('Commenter ID', loggedInUserId);
    console.log('Comment ID:', comment.commentId);
    var commentLikeButtonState = null;
    var commentLikeButtonImg = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    postComment.innerHTML = "\n            <div class=\"comment\" id=\"comment-".concat(comment.commentId, "\">\n\n                <div class=\"comment-header\">\n                    <div class=\"commenter-profile\" id=\"commenter-profile-").concat(comment.commentId, "\">\n                        <img class=\"commenter-profile-img\" width=\"100px\" height=\"100px\" src=\"/public/").concat(comment.commenter.profilePicture, "\" alt=\"commenter-profile\">\n                        <h5 class=\"commenter-username\">").concat(comment.commenter.username, "</h5>\n                    </div>\n\n                    ").concat(loggedInUserId === comment.commenter.userId ? "<div class=\"more-info-element\">\n                            <button class=\"more-info-btn\" id=\"more-info-comment-".concat(comment.commentId, "\" data-comment-id=\"").concat(comment.commentId, "\">\n                                <img class=\"more-info-img\" src=\"/public/picture/Dots.svg\" alt=\"more-info\">\n                            </button>\n                        </div>") : '', "\n                </div>\n\n                <div class=\"comment-content-container\">\n                    <p class=\"comment-content\" id=\"comment-content-").concat(comment.commentId, "\">").concat(comment.content, "</p>\n                </div>\n\n                <div class=\"comment-engagement\" id=\"comment-engagement-").concat(comment.commentId, "\">\n\n                    <div class=\"comment-like\" id=\"comment-like-").concat(comment.commentId, "\">\n                        <button id=\"comment-like-btn-").concat(comment.commentId, "\" class=\"comment-like-btn ").concat(commentLikeButtonState, "\" data-comment-id=\"").concat(comment.commentId, "\">\n                            <img class=\"comment-like-img\" src=\"").concat(commentLikeButtonImg, "\" alt=\"post like button\">\n                        </button>\n                        <p class=\"comment-like-count\" id=\"comment-like-count-").concat(comment.commentId, "\">").concat(comment.likeCount !== undefined ? comment.likeCount : 'error', "</p>\n                    </div>\n\n                </div>\n\n            </div>\n        ");
    postComment.addEventListener('click', function (event) {
      var commentLikeBtn = event.target.closest('.comment-like-btn');

      if (commentLikeBtn) {
        //   const commentId = commentLikeBtn.getAttribute('data-post-id');
        console.log('Comment like button is activated for commentId:', comment.commentId);
        commentLike(postId, comment.commentId);
      }
    });
    var moreInfoBtn = document.querySelector("#more-info-comment-".concat(comment.commentId));

    if (moreInfoBtn) {
      renderPopup(postId, comment.commentId);
    }

    postCommentContainer.append(postComment);
  });
}

function postLike(postId) {
  var postLikeBtn, postLikeCountElement, currentPostLikeCount, img, postIsCurrentlyLiked, newPostLikeCount, response, updatedPost;
  return regeneratorRuntime.async(function postLike$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('Like post is activated on postId', postId);
          postLikeBtn = document.getElementById("post-like-btn-".concat(postId));
          postLikeCountElement = document.querySelector("#like-count-".concat(postId));
          currentPostLikeCount = parseInt(postLikeCountElement.textContent, 10) || 0;

          if (!loggedInUserId) {
            alert('User ID is not available, please login first');
          }

          if (!(!postLikeBtn || !postLikeCountElement)) {
            _context3.next = 8;
            break;
          }

          console.error('Post like button or post like count element not found');
          return _context3.abrupt("return");

        case 8:
          img = postLikeBtn.querySelector('img');
          postIsCurrentlyLiked = postLikeBtn.classList.contains('liked');
          newPostLikeCount = postIsCurrentlyLiked ? currentPostLikeCount - 1 : currentPostLikeCount + 1;
          updatePostLikeCount(postId, newPostLikeCount);
          postLikeBtn.classList.toggle('liked', !postIsCurrentlyLiked);
          postLikeBtn.classList.toggle('unliked', postIsCurrentlyLiked);
          img.src = postIsCurrentlyLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg';
          _context3.prev = 15;
          _context3.next = 18;
          return regeneratorRuntime.awrap(fetch("/post/update/like/".concat(postId), {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              postId: postId,
              userId: loggedInUserId
            })
          }));

        case 18:
          response = _context3.sent;
          console.log('Fetch request completed.');

          if (!response.ok) {
            console.error('Failed to toggle like', error.message); // updatePostLikeCount(postId, currentPostLikeCount);
          }

          _context3.next = 23;
          return regeneratorRuntime.awrap(response.json());

        case 23:
          updatedPost = _context3.sent;
          console.log('Server response for like toggle:', updatedPost); // const { likeCount, isLiked } = updatedPost;

          updatePostLikeCount(postId, updatedPost.likeCount);
          postLikeBtn.classList.toggle('liked', updatedPost.isLiked);
          postLikeBtn.classList.toggle('unliked', !updatedPost.isLiked);
          img.src = updatedPost.isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
          _context3.next = 38;
          break;

        case 31:
          _context3.prev = 31;
          _context3.t0 = _context3["catch"](15);
          console.error('Failed to like post in comment page', _context3.t0.message);
          updatePostLikeCount(postId, currentPostLikeCount);
          postLikeBtn.classList.toggle('liked', postIsCurrentlyLiked);
          postLikeBtn.classList.toggle('unliked', !postIsCurrentlyLiked);
          img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

        case 38:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[15, 31]]);
}

function fetchPostLikeCount(postId) {
  var response, likeCount;
  return regeneratorRuntime.async(function fetchPostLikeCount$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(fetch("/post/get/likeCount/".concat(postId)));

        case 3:
          response = _context4.sent;

          if (response.ok) {
            _context4.next = 6;
            break;
          }

          throw new Error('Failed to fetch like count');

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          likeCount = _context4.sent;
          console.log('Fetched like count', likeCount);
          updatePostLikeCount(postId, likeCount);
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error('Failed to fetch post like count', _context4.t0.message);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

function updatePostLikeCount(postId, likeCount) {
  console.log("Updating post ".concat(postId, " likeCount to: ").concat(likeCount));
  var postLikeCountElement = document.getElementById("like-count-".concat(postId));

  if (postLikeCountElement) {
    postLikeCountElement.textContent = likeCount;
  }
}

var postLikeButton = document.getElementById("post-like-btn-".concat(postId));

if (postLikeButton) {
  if (postIsLiked) {
    postLikeButton.classList.add('liked');
    postLikeButton.classList.remove('unliked');
  } else {
    postLikeButton.classList.add('unliked');
    postLikeButton.classList.remove('liked');
  }
}

postEngagementContainer.addEventListener('click', function (event) {
  var postLikeBtn = event.target.closest('.post-like-btn');

  if (postLikeBtn) {
    var _postId = postLikeBtn.getAttribute('data-post-id');

    if (_postId) {
      console.log('Post like button is activated for postId:', _postId);
      postLike(_postId);
    }
  }
});

window.deleteComment = function deleteComment(postId, commentId) {
  var commentModalContainer, response, commentElement, deletedComment, result;
  return regeneratorRuntime.async(function deleteComment$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          commentModalContainer = document.querySelector('.comment-modal-container');
          console.log('CommentId to delete', commentId, ' on post ID:', postId);
          _context5.next = 5;
          return regeneratorRuntime.awrap(fetch("/comments/delete/".concat(postId, "/").concat(commentId), {
            method: 'DELETE',
            credentials: 'include'
          }));

        case 5:
          response = _context5.sent;

          if (!response.ok) {
            _context5.next = 19;
            break;
          }

          commentElement = document.getElementById("comment-".concat(commentId));

          if (commentElement) {
            commentElement.remove();
          } else {
            console.error("Comment element with ID ".concat(commentId, " does not found in DOM"));
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(response.json());

        case 11:
          deletedComment = _context5.sent;
          console.log('Delete comment', deletedComment);
          comments = comments.filter(function (comment) {
            return comment.commentId !== parseInt(commentId, 10);
          });
          console.log('Comment deleted successfully');
          renderComments();
          commentModalContainer.innerHTML = '';
          _context5.next = 24;
          break;

        case 19:
          _context5.next = 21;
          return regeneratorRuntime.awrap(response.json());

        case 21:
          result = _context5.sent;
          alert('Failed to remove comment', result.message);
          console.error('Failed to remove comment:', result.message);

        case 24:
          _context5.next = 29;
          break;

        case 26:
          _context5.prev = 26;
          _context5.t0 = _context5["catch"](0);
          console.error('Failed to delete post', _context5.t0.message);

        case 29:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

function renderPopup(postId, commentId) {
  console.log(typeof deleteComment === "undefined" ? "undefined" : _typeof(deleteComment));
  console.log('Post ID in render popup function', postId);
  console.log('Comment ID in render popup function', commentId);
  var commentModalContainer = document.querySelector('.comment-modal-container');

  if (!commentModalContainer) {
    console.error('comment-modal-container not found');
    return;
  }

  commentModalContainer.innerHTML = '';
  var commentModal = document.createElement('div');
  commentModal.classList.add('comment-modal');
  commentModal.id = "comment-modal-".concat(commentId);
  commentModal.innerHTML = "\n        <div class=\"modal-content\">\n            <h5 class=\"modal-header\">Are you sure you want to delete this comment?</h5>\n\n            <div class=\"modal-cta\" id=\"modal-cta-".concat(commentId, "\">\n                <button class=\"delete-comment-btn btn btn-danger\" id=\"delete-comment-btn-").concat(commentId, " data-comment-id=\"").concat(commentId, "\">\n                    Delete\n                </button>\n                <button class=\"close-modal btn btn-secondary\">Cancel</button>\n            </div>\n\n        </div>\n    ");
  commentModalContainer.append(commentModal);
  var deleteCommentBtn = commentModal.querySelector(".delete-comment-btn");

  if (deleteCommentBtn) {
    deleteCommentBtn.addEventListener('click', function (event) {
      // const commentId = event.target.getAttribute('data-comment-id');
      console.log("Delete mode activated for commentId: ".concat(commentId));
      deleteComment(postId, commentId);
    });
  }

  var closeModal = commentModal.querySelector('.close-modal');

  if (closeModal) {
    closeModal.addEventListener('click', function () {
      commentModalContainer.innerHTML = '';
    });
  }
}

function commentLike(postId, commentId) {
  var commentLikeBtn, commentLikeCountElement, currentCommentLikeCount, img, commentIsCurrentLiked, newCommentLikeCount, response, updatedComment;
  return regeneratorRuntime.async(function commentLike$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('Post ID in comment like function', postId);
          console.log('Comment like function is activated on commentId', commentId);
          commentLikeBtn = document.getElementById("comment-like-btn-".concat(commentId));
          commentLikeCountElement = document.querySelector("#comment-like-count-".concat(commentId));
          console.log('Comment like count element', commentLikeCountElement);
          currentCommentLikeCount = parseInt(commentLikeCountElement.textContent, 10) || 0;

          if (!loggedInUserId) {
            alert('User ID is not available, please login first');
          }

          if (!(!commentLikeBtn || !commentLikeCountElement)) {
            _context6.next = 10;
            break;
          }

          console.error('Comment like button or comment like count element not found');
          return _context6.abrupt("return");

        case 10:
          img = commentLikeBtn.querySelector('img');
          commentIsCurrentLiked = commentLikeBtn.classList.contains('liked');
          newCommentLikeCount = commentIsCurrentLiked ? currentCommentLikeCount - 1 : currentCommentLikeCount + 1;
          updateCommentLikeCount(commentId, newCommentLikeCount);
          commentLikeBtn.classList.toggle('liked', !commentIsCurrentLiked);
          commentLikeBtn.classList.toggle('unliked', commentIsCurrentLiked);
          img.src = commentIsCurrentLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg';
          _context6.prev = 17;
          _context6.next = 20;
          return regeneratorRuntime.awrap(fetch("/comments/update/like/".concat(commentId), {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              postId: postId,
              commentId: commentId,
              userId: loggedInUserId
            })
          }));

        case 20:
          response = _context6.sent;
          console.log('Fetch request completed.');

          if (!response.ok) {
            console.error('Failed to toggle like', error.message); // updateCommentLikeCount(commentId, currentCommentLikeCount);
          }

          _context6.next = 25;
          return regeneratorRuntime.awrap(response.json());

        case 25:
          updatedComment = _context6.sent;
          console.log('Server response for comment like toggle:', updatedComment); // const { likeCount, isLiked } = updatedComment;

          updateCommentLikeCount(commentId, updatedComment.likeCount);
          commentLikeBtn.classList.toggle('liked', updatedComment.isLiked);
          commentLikeBtn.classList.toggle('unliked', !updatedComment.isLiked);
          img.src = updatedComment.isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
          _context6.next = 40;
          break;

        case 33:
          _context6.prev = 33;
          _context6.t0 = _context6["catch"](17);
          console.error('Failed to like comment in comment page', _context6.t0.message);
          updateCommentLikeCount(commentId, currentCommentLikeCount);
          commentLikeBtn.classList.toggle('liked', commentIsCurrentLiked);
          commentLikeBtn.classList.toggle('unliked', !commentIsCurrentLiked);
          img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

        case 40:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[17, 33]]);
}

function fetchCommentLikeCount(commentId) {
  var response, _commentLikeCount;

  return regeneratorRuntime.async(function fetchCommentLikeCount$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(fetch("/comments/get/likeCount/".concat(commentId)));

        case 3:
          response = _context7.sent;

          if (response.ok) {
            _context7.next = 6;
            break;
          }

          throw new Error('Failed to fetch like count');

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          _commentLikeCount = _context7.sent;
          console.log('Fetched like count', _commentLikeCount);
          updateCommentLikeCount(commentId, _commentLikeCount);
          _context7.next = 16;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.error('Failed to fetch comment like count', _context7.t0.message);

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

function updateCommentLikeCount(commentId, commentLikeCount) {
  console.log("Updating post ".concat(commentId, " likeCount to: ").concat(commentLikeCount));
  var commentLikeCountElement = document.getElementById("comment-like-count-".concat(commentId));

  if (commentLikeCountElement) {
    commentLikeCountElement.textContent = commentLikeCount;
  }
}