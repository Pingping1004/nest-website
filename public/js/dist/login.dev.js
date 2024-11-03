"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = loginUser;

var _role = require("./role.js");

var loginForm = document.querySelector('#loginform');
var logoutBtn = document.querySelector('.logout-btn');

if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var users = {
      username: formData.get('username'),
      password: formData.get('password'),
      role: formData.get("role")
    };
    loginUser(users);
  });
} else {
  console.error('Login form not found');
}

function loginUser(users) {
  var response, errorText, data;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(users),
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
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
          console.error('Login failed:', errorText);
          throw new Error('Login failed');

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          data = _context.sent;
          console.log('User data from API:', data);
          (0, _role.authenticateUser)(data);
          console.log('Login successful:', data);
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error('Error:', _context.t0.message);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', function _callee() {
    var response, data;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(fetch('/auth/logout', {
              method: 'GET',
              credentials: 'include'
            }));

          case 3:
            response = _context2.sent;

            if (!response.ok) {
              _context2.next = 13;
              break;
            }

            _context2.next = 7;
            return regeneratorRuntime.awrap(response.json());

          case 7:
            data = _context2.sent;
            console.log('Logout response:', data);
            console.log('Cookie after logout', document.cookie);
            window.location.href = '/login'; // Redirect to login page

            _context2.next = 18;
            break;

          case 13:
            _context2.t0 = console;
            _context2.next = 16;
            return regeneratorRuntime.awrap(response.text());

          case 16:
            _context2.t1 = _context2.sent;

            _context2.t0.error.call(_context2.t0, 'Logout failed:', _context2.t1);

          case 18:
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t2 = _context2["catch"](0);
            console.error('Error during logout:', _context2.t2);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 20]]);
  });
}