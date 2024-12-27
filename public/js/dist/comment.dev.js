"use strict";

var commentContentInput = document.querySelector('.input-content');
var author = null;
var articles = null;
var comments = [];
var commentId = null;
var loggedInUserId = null;
var users = null;
window.addEventListener('DOMContentLoaded', function _callee() {
  var postId, response, data, _comments, posts, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // const urlParams = new URLSearchParams(window.location.search);
          // const postId = urlParams.get('postId');
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
          _comments = data.comments, posts = data.posts, user = data.user;
          author = posts.author;
          _comments = _comments;
          articles = posts;
          loggedInUserId = user.userId;
          users = user;
          console.log('Fetched author', author);
          console.log('All fetched comments', _comments);
          console.log('Fetched user', users);
          renderComments();
          _context.next = 26;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](2);
          console.error('Error fetching all comments on post:', _context.t0.message);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 23]]);
});

function createComment() {
  var content, date, _comment, response, newComment, errorResponse;

  return regeneratorRuntime.async(function createComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          content = commentContentInput.value;
          date = new Date();
          _comment = {
            content: content,
            date: date,
            likeCount: 0
          };
          _context2.next = 6;
          return regeneratorRuntime.awrap(fetch('/comments/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(_comment)
          }));

        case 6:
          response = _context2.sent;

          if (!response.ok) {
            _context2.next = 17;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          newComment = _context2.sent;
          comments.push(newComment);
          _context2.next = 14;
          return regeneratorRuntime.awrap(fetchComments());

        case 14:
          commentContentInput.value = '';
          _context2.next = 21;
          break;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(response.json());

        case 19:
          errorResponse = _context2.sent;
          console.error('Failed to create comment:', errorResponse);

        case 21:
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          console.error('Error createing comment:', _context2.t0.message);
          alert('An error occurred while creating comment');

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
}

function renderComments() {
  var postCommentContainer = document.querySelector('.comment-post-container');
  postCommentContainer.innerHTML = '';
  comments.forEach(function (comment) {
    var postComment = document.createElement('div');
    postComment.classList.add('comment-post');
    postComment.id("comment-".concat(comment.commentId));
    console.log('Post authorId', comment.author.userId);
    console.log('Commenter ID', loggedInUserId);
    var isLiked = null;
    var commentLikeButtonState = null;
    var commentLikeButtonImg = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    postComment.innerHTML = "\n            <div class=\"comment-".concat(comment.commentId, "\">\n\n                <div class=\"commenter-profile-").concat(comment.commentId, "\">\n                    <img class=\"commenter-profile\" src=\"/public/").concat(comment.commenter.profilePicture, "\" alt=\"commenter-profile\">\n                    <h5 class=\"commenter-username\">").concat(comment.commenter.username, "</h5>\n                    ").concat(userId === comment.commenter.userId ? "<button class=\"more-info-comment\" id=\"more-info-comment-".concat(comment.commentId, "\" data-comment-id=\"").concat(comment.commentId, "\">\n                            <img src=\"/public/<%= Dots.svg\" alt=\"more-info\">\n                        </button>") : '', "\n                </div>\n\n                <p class=\"comment-content-").concat(comment.commentId, "\">").concat(comment.content, "</p>\n\n                <div class=\"comment-engagement-").concat(comment.commentId, "\">\n\n                    <div class=\"comment-like-").concat(comment.commentId, "\">\n                        <button id=\"comment-like-btn-").concat(comment.commentId, "\" class=\"comment-like-btn ").concat(commentLikeButtonState, "\">\n                            <img src=\"").concat(commentLikeButtonImg, "\" alt=\"post like button\">\n                        </button>\n                        <p class=\"comment-like-count\" id=\"comment-like-count-").concat(comment.commentId, "\">").concat(post.likeCount !== undefined ? post.likeCount : 'error', "</p>\n                    </div>\n\n                    <div class=\"comment-backpage\">\n                        <button id=\"comment-back-btn-").concat(comment.commentId, "\" class=\"comment-back-btn\" data-user-id=\"").concat(loggedInUserId, "\">\n                            <img src=\"/public/picture/Back.svg\" alt=\"back to index button\">\n                        </button>\n                    </div>\n\n                </div>\n\n            </div>\n        ");
    var moreInfoBtn = document.querySelector("#more-info-comment-".concat(comment.commentId));

    if (moreInfoBtn) {
      renderInfoBanner(commentId);
    }

    var backBtn = document.querySelector('.comment-back-btn');
    backBtn.addEventListener('click', function (event) {
      var userId = event.target.getAttribute('data-user-id');

      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      window.location.href = "/index?userId=".concat(userId);
    });
    postCommentContainer.append(postComment);
  });
}

window.deleteComment = function deleteComment(commentId) {
  var response, commentElement, deletedComment, result;
  return regeneratorRuntime.async(function deleteComment$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log('CommentId to delete', commentId);
          _context3.next = 4;
          return regeneratorRuntime.awrap(fetch("comments/delete/".concat(commentId), {
            method: 'DELETE',
            credentials: 'include'
          }));

        case 4:
          response = _context3.sent;

          if (!response.ok) {
            _context3.next = 17;
            break;
          }

          commentElement = document.getElementById("comment-".concat(comment.commentId));

          if (commentElement) {
            commentElement.remove();
          } else {
            console.error("Comment element with ID ".concat(comment.commentId, " does not found in DOM"));
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          deletedComment = _context3.sent;
          console.log('Delete comment', deletedComment);
          comments = comments.filter(function (comment) {
            return comment.commentId !== parseInt(commentId, 10);
          });
          console.log('Comment deleted successfully');
          renderComments();
          _context3.next = 22;
          break;

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(response.json());

        case 19:
          result = _context3.sent;
          alert('Failed to remove comment', result.message);
          console.error('Failed to remove comment:', result.message);

        case 22:
          _context3.next = 27;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](0);
          console.error('Failed to delete post', _context3.t0.message);

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

function commentLike() {
  return regeneratorRuntime.async(function commentLike$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function renderInfoBanner(commentId) {// render delete option in the bannner and click to activate delete function
}