"use strict";

var commentContentInput = document.querySelector('.input-content');
var addCommentBtn = document.querySelector('.add-comment-btn');
var backBtn = document.querySelector('.post-back-btn');
var postEngagementContainer = document.querySelector('.post-engagement');
var comments = [];
var commentId = null;
var isLiked = null;
var postIsLiked = null;
var postLikeCount = null;
var post = null;
var postId = null;
var loggedInUserId = null;
var user = null;
document.addEventListener('DOMContentLoaded', function () {
  fetchComments();
  fetchPostLikeCount(postId);
});

function fetchComments() {
  var response, data, _post;

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
          _post = data.post;
          _post = _post;
          comments = _post.comments;
          postIsLiked = _post.isLiked;
          postId = _post.postId;
          user = _post.author;
          loggedInUserId = user.userId;
          console.log('Fetched post in comment page', _post);
          console.log('Fetched post like state in comment page', postIsLiked);
          console.log('Fetched postId in comment page', postId);
          console.log('All fetched comments', comments);
          console.log('Fetched user', user);
          console.log('Fetched logged in userId', loggedInUserId);
          renderComments();
          _context.next = 31;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](2);
          console.error('Error fetching all comments on post:', _context.t0.message);

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 28]]);
}

function createComment() {
  var content, _comment, response, responseData, newComment, errorResponse;

  return regeneratorRuntime.async(function createComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          content = commentContentInput.value;
          console.log('postId', postId);
          _comment = {
            content: content,
            date: new Date(),
            likeCount: 0,
            postId: postId,
            userId: loggedInUserId
          };
          console.log('User ID in create comment function:', _comment.userId);
          console.log('Comment object before sending to backend', _comment);
          _context2.next = 8;
          return regeneratorRuntime.awrap(fetch('/comments/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(_comment)
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
  var userId = event.target.getAttribute('data-user-id');

  if (!userId) {
    console.error('User ID is missing');
    return;
  }

  window.location.href = "/index?userId=".concat(userId);
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
    console.log('Commenter ID', loggedInUserId);
    var commentLikeButtonState = null;
    var commentLikeButtonImg = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
    postComment.innerHTML = "\n            <div class=\"comment\" id=\"comment-".concat(comment.commentId, "\">\n\n                <div class=\"comment-header\">\n                    <div class=\"commenter-profile\" id=\"commenter-profile-").concat(comment.commentId, "\">\n                        <img class=\"commenter-profile-img\" width=\"100px\" height=\"100px\" src=\"/public/").concat(comment.commenter.profilePicture, "\" alt=\"commenter-profile\">\n                        <h5 class=\"commenter-username\">").concat(comment.commenter.username, "</h5>\n                    </div>\n\n                    ").concat(loggedInUserId === comment.commenter.userId ? "<div class=\"more-info-element\">\n                            <button class=\"more-info-btn\" id=\"more-info-comment-".concat(comment.commentId, "\" data-comment-id=\"").concat(comment.commentId, "\">\n                                <img class=\"more-info-img\" src=\"/public/picture/Dots.svg\" alt=\"more-info\">\n                            </button>\n                        </div>") : '', "\n                </div>\n\n                <div class=\"comment-content-container\">\n                    <p class=\"comment-content\" id=\"comment-content-").concat(comment.commentId, "\">").concat(comment.content, "</p>\n                </div>\n\n                <div class=\"comment-engagement\" id=\"comment-engagement-").concat(comment.commentId, "\">\n\n                    <div class=\"comment-like\" id=\"comment-like-").concat(comment.commentId, "\">\n                        <button id=\"comment-like-btn-").concat(comment.commentId, "\" class=\"comment-like-btn ").concat(commentLikeButtonState, "\">\n                            <img class=\"comment-like-img\" src=\"").concat(commentLikeButtonImg, "\" alt=\"post like button\">\n                        </button>\n                        <p class=\"comment-like-count\" id=\"comment-like-count-").concat(comment.commentId, "\">").concat(comment.likeCount !== undefined ? comment.likeCount : 'error', "</p>\n                    </div>\n\n                </div>\n\n            </div>\n        ");
    var moreInfoBtn = document.querySelector("#more-info-comment-".concat(comment.commentId));

    if (moreInfoBtn) {
      renderInfoBanner(commentId);
    }

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

function postLike(postId) {
  var postLikeBtn, postLikeCountElement, currentPostLikeCount, img, postIsCurrentlyLiked, newPostLikeCount, response, updatedPost;
  return regeneratorRuntime.async(function postLike$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('Like post is activated on postId', postId);
          postLikeBtn = document.getElementById("post-like-btn-".concat(postId));
          postLikeCountElement = document.querySelector("#like-count-".concat(postId));
          currentPostLikeCount = parseInt(postLikeCountElement.textContent, 10) || 0;

          if (!loggedInUserId) {
            alert('User ID is not available, please login first');
          }

          if (!(!postLikeBtn || !postLikeCountElement)) {
            _context4.next = 8;
            break;
          }

          console.error('Post like button or post like count element not found');
          return _context4.abrupt("return");

        case 8:
          img = postLikeBtn.querySelector('img');
          postIsCurrentlyLiked = postLikeBtn.classList.contains('liked');
          newPostLikeCount = postIsCurrentlyLiked ? currentPostLikeCount - 1 : currentPostLikeCount + 1;
          updatePostLikeCount(postId, newPostLikeCount);
          postLikeBtn.classList.toggle('liked', !postIsCurrentlyLiked);
          postLikeBtn.classList.toggle('unliked', postIsCurrentlyLiked);
          img.src = postIsCurrentlyLiked ? '/public/picture/Vector.svg' : '/public/picture/Solid-Vector.svg';
          _context4.prev = 15;
          _context4.next = 18;
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
          response = _context4.sent;
          console.log('Fetch request completed.');

          if (!response.ok) {
            console.error('Failed to toggle like', error.message); // updatePostLikeCount(postId, currentPostLikeCount);
          }

          _context4.next = 23;
          return regeneratorRuntime.awrap(response.json());

        case 23:
          updatedPost = _context4.sent;
          console.log('Server response for like toggle:', updatedPost); // const { likeCount, isLiked } = updatedPost;

          updatePostLikeCount(postId, updatedPost.likeCount);
          postLikeBtn.classList.toggle('liked', updatedPost.isLiked);
          postLikeBtn.classList.toggle('unliked', !updatedPost.isLiked);
          img.src = updatedPost.isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';
          _context4.next = 38;
          break;

        case 31:
          _context4.prev = 31;
          _context4.t0 = _context4["catch"](15);
          console.error(_context4.t0);
          updatePostLikeCount(postId, currentPostLikeCount);
          postLikeBtn.classList.toggle('liked', postIsCurrentlyLiked);
          postLikeBtn.classList.toggle('unliked', !postIsCurrentlyLiked);
          img.src = isLiked ? '/public/picture/Solid-Vector.svg' : '/public/picture/Vector.svg';

        case 38:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[15, 31]]);
}

function fetchPostLikeCount(postId) {
  var response, likeCount;
  return regeneratorRuntime.async(function fetchPostLikeCount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(fetch("/post/get/likeCount/".concat(postId)));

        case 3:
          response = _context5.sent;

          if (response.ok) {
            _context5.next = 6;
            break;
          }

          throw new Error('Failed to fetch like count');

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          likeCount = _context5.sent;
          console.log('Fetched like count', likeCount);
          updatePostLikeCount(postId, likeCount);
          _context5.next = 16;
          break;

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);

        case 16:
        case "end":
          return _context5.stop();
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

function commentLike() {
  return regeneratorRuntime.async(function commentLike$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function renderInfoBanner(commentId) {// render delete option in the bannner and click to activate delete function
}