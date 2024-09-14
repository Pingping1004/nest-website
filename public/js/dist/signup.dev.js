"use strict";

var _role = require("./role.js");

var signupForm = document.querySelector("#signupform");
var signupBtn = document.querySelector('.signup-btn');

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var users = {
      username: formData.get("username"),
      password: formData.get("password"),
      role: formData.get("role") || 'user',
      profilePicture: formData.get("profilePicture") || null,
      googleId: formData.get("googleId") || ""
    };
    console.log('Users object before signup:', users);
    signupUser(users);
  });
}

function validateForm(users) {
  if (!users.username || !users.password) {
    alert("Username and password are required");
    return false;
  }

  return true;
}

function signupUser(users) {
  var response, error, data;
  return regeneratorRuntime.async(function signupUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (validateForm(users)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch("http://localhost:3000/user/signup", {
            method: "POST",
            body: JSON.stringify(users),
            headers: {
              "Content-Type": "application/json"
            }
          }));

        case 5:
          response = _context.sent;

          if (response.ok) {
            _context.next = 12;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          error = _context.sent;
          console.error('Signup failed:', error);
          alert("Signup failed: ".concat(error.message || 'Unknown Error'));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          data = _context.sent;
          console.log('User data from API:', data);
          (0, _role.authenticateUser)(data);
          console.log("Signup successful:", data);
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](2);
          console.error("Error:", _context.t0.message);
          alert("An error occurred during signup. Please try again.");

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 20]]);
}