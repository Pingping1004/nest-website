"use strict";

var userTableElement = document.querySelector('.user-table-element');
var users = [],
    role,
    userId,
    adminName;
document.addEventListener('DOMContentLoaded', function () {
  fetchAllUsers();
});

function fetchAllUsers() {
  var response, errorData, data, _users, _role, _userId;

  return regeneratorRuntime.async(function fetchAllUsers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('fetchAllUsers function is activated for dashboard page');
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch('/admin/api/dashboard/users'));

        case 4:
          response = _context.sent;

          if (response.ok) {
            _context.next = 11;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(response.text());

        case 8:
          errorData = _context.sent;
          console.error('Response error:', errorData);
          throw new Error('Failed to fetch users');

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(response.json());

        case 13:
          data = _context.sent;
          console.log('Raw data from server:', data);

          if (data.users) {
            _context.next = 17;
            break;
          }

          throw new Error('Users not found in response');

        case 17:
          _users = data.users, _role = data.role, _userId = data.userId;
          console.log('All render users:', _users);
          renderUsers(_users);
          _context.next = 25;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching all users for admin', _context.t0.message);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 22]]);
}

function renderUsers(users) {
  var userTableBody = document.querySelector('.user-table tbody'); // Clear existing table rows

  userTableBody.innerHTML = ''; // Loop through the users array and create table rows

  users.forEach(function (user) {
    var row = document.createElement('tr');
    row.innerHTML = "\n      <td>".concat(user.id, "</td>\n      <td>").concat(user.username, "</td>\n      <td class=\"role-cell\" data-user-id=\"").concat(user.id, "\">").concat(user.role, "</td>\n      <td>\n        <button class=\"edit-user-btn btn btn-secondary\" data-user-id=\"").concat(user.id, "\" data-editing=\"false\">Edit</button>\n        <button class=\"delete-user-btn btn btn-danger\" data-user-id=\"").concat(user.id, "\">Delete</button>\n      </td>\n    ");
    var editUserBtn = row.querySelector('.edit-user-btn'); // const roleCell = row.querySelector(`.role-cell[data-user-id="${user.id}]`);

    var deleteUserBtn = row.querySelector('.delete-user-btn');

    if (editUserBtn) {
      editUserBtn.addEventListener('click', function (event) {
        var userId = event.target.getAttribute('data-user-id');
        updateUsers(userId);
      });
    }

    if (deleteUserBtn) {
      deleteUserBtn.addEventListener('click', function (event) {
        var userId = event.target.getAttribute('data-user-id');
        deleteUsers(userId);
      });
    }

    userTableBody.appendChild(row);
  });
}

function updateUsers(userId) {
  var editUserBtn, roleCell, isEditing, dropdownElement, selectedRole, currentRole, _dropdownElement;

  return regeneratorRuntime.async(function updateUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Updating user with ID: ".concat(userId));
          editUserBtn = document.querySelector(".edit-user-btn[data-user-id=\"".concat(userId, "\"]"));
          roleCell = document.querySelector(".role-cell[data-user-id=\"".concat(userId, "\"]"));
          isEditing = editUserBtn.getAttribute('data-editing') === 'true'; // let isEditing = false;

          if (!isEditing) {
            _context2.next = 16;
            break;
          }

          // Save button is clicked
          dropdownElement = roleCell.querySelector('.role-dropdown');
          selectedRole = dropdownElement.value;
          _context2.next = 9;
          return regeneratorRuntime.awrap(saveUpdate(userId, selectedRole));

        case 9:
          editUserBtn.textContent = 'Edit';
          editUserBtn.classList.remove('btn-primary');
          editUserBtn.classList.add('btn-secondary');
          roleCell.textContent = selectedRole; // isEditing = false;

          editUserBtn.setAttribute('data-editing', 'false');
          _context2.next = 27;
          break;

        case 16:
          // Edit button is clicked
          currentRole = roleCell.textContent.trim();
          console.log('CurrentRole value is', currentRole);
          _dropdownElement = document.createElement('select');

          _dropdownElement.classList.add('role-dropdown');

          roleCell.textContent = '';
          ['user', 'admin'].forEach(function (role) {
            var option = document.createElement('option');
            option.value = role;
            option.textContent = role;

            if (role === currentRole) {
              option.selected = true;
            }

            _dropdownElement.appendChild(option);
          });
          roleCell.appendChild(_dropdownElement);
          editUserBtn.textContent = 'Save';
          editUserBtn.classList.remove('btn-secondary');
          editUserBtn.classList.add('btn-primary');
          editUserBtn.setAttribute('data-editing', 'true');

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function saveUpdate(userId, updatedRole) {
  var updatedUser, response, updatedUserData;
  return regeneratorRuntime.async(function saveUpdate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          updatedUser = {
            role: updatedRole
          };
          _context3.next = 4;
          return regeneratorRuntime.awrap(fetch("/admin/update/".concat(userId), {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
          }));

        case 4:
          response = _context3.sent;

          if (!response.ok) {
            _context3.next = 13;
            break;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          updatedUserData = _context3.sent;
          console.log("Updated user's role successfully", updatedUserData);
          fetchAllUsers();
          _context3.next = 14;
          break;

        case 13:
          throw new Error('Failed to update role: ' + response.statusText);

        case 14:
          _context3.next = 19;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.error('Error updating role', _context3.t0.message);

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

function deleteUsers(userId) {
  var response, userElement, deletedUser, result;
  return regeneratorRuntime.async(function deleteUsers$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log("Deleting user with ID: ".concat(userId));
          _context4.next = 4;
          return regeneratorRuntime.awrap(fetch("admin/delete/".concat(userId), {
            method: 'DELETE',
            credentials: 'include'
          }));

        case 4:
          response = _context4.sent;

          if (!response.ok) {
            _context4.next = 16;
            break;
          }

          userElement = document.getElementById("post-".concat(postId));

          if (userElement) {
            userElement.remove();
          } else {
            console.error("Post element with ID post-".concat(postId, " not found in DOM"));
          }

          _context4.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          deletedUser = _context4.sent;
          console.log('Delete user successfully', deletedUser);
          members = members.filter(function (member) {
            return member.id !== parseInt(userId, 10);
          });
          renderUsers();
          _context4.next = 20;
          break;

        case 16:
          _context4.next = 18;
          return regeneratorRuntime.awrap(response.json());

        case 18:
          result = _context4.sent;
          console.error('Failed to remove user', result.message);

        case 20:
          _context4.next = 25;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          console.error('Failed to delete user', _context4.t0.message);

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 22]]);
}