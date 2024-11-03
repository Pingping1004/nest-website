"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateUser = authenticateUser;

function authenticateUser(data) {
  var users = {
    username: data.username,
    role: data.role,
    profilePicture: data.profilePicture,
    token: data.token
  };
  localStorage.setItem("user", JSON.stringify(users)); // Check if userId exists in the data before redirecting

  if (!data.userId) {
    console.error('User ID is missing in the response data.');
    return;
  }

  console.log('Redirecting to:', users.role === 'admin' ? "/auth/admin/index/".concat(data.userId) : "/auth/index/".concat(data.userId));

  if (users.role === "admin") {
    window.location.href = "/auth/admin/index/".concat(data.userId);
  } else {
    window.location.href = "/auth/index/".concat(data.userId);
  }
}