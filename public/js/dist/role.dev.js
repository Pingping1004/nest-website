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
  localStorage.setItem("user", JSON.stringify(users));

  if (users.role === "admin") {
    window.location.href = "/auth/admin/index/".concat(data.userId);
  } else {
    window.location.href = "/auth/index/".concat(data.userId);
  }
}