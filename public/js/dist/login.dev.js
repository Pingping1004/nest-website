"use strict";

var _role = require("./role.js");

var loginForm = document.querySelector("#loginform");
var logOutBtn = document.querySelector('.logout-btn');

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var users = {
      username: formData.get("username"),
      password: formData.get("password") // role: formData.get("role"),

    };
    loginUser(users);
  });
} else {
  console.error("Login form not found");
}

function loginUser(users) {
  var response, errorText, data;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("http://localhost:3000/auth/login", {
            method: "POST",
            body: JSON.stringify(users),
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include"
          }));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 10;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(response.text());

        case 7:
          errorText = _context.sent;
          // Fetch the response text (likely HTML)
          console.error("Login failed:", errorText);
          throw new Error("Login failed");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          data = _context.sent;
          console.log("Login successful:", data); // authenticateUser(data);

          window.location.href = "/auth/index/".concat(data.userId);
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.error("Error:", _context.t0.message);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

logOutBtn.addEventListener('click', logout);