"use strict";

var profilePictureInput = document.querySelector('#profile-picture-input');
var displayNameInput = document.querySelector('#display-name-input');
var updateProfileBtn = document.querySelector('#update-profile-btn');
var userId = null;
document.addEventListener('DOMContentLoaded', function () {
  fetchProfileData();
});

function fetchProfileData() {
  var response, errorResponse, data;
  return regeneratorRuntime.async(function fetchProfileData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Fetch profile function is called');
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("/user/profile/data", {
            credentials: 'include'
          }));

        case 4:
          response = _context.sent;
          console.log('Fetch response status:', response.status);

          if (response.ok) {
            _context.next = 11;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          errorResponse = _context.sent;
          throw new Error('Failed to fetch profile', errorResponse);

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(response.json());

        case 13:
          data = _context.sent;
          console.log('User profile data', data);
          console.log(data.user.displayName);
          console.log(data.user.profilePicture);
          userId = data.userID;
          displayNameInput.value = data.user.displayName; // profilePictureInput.src = data.profilePicture || 'default.jpg';

          console.log('User profile ID:', userId);
          _context.next = 25;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching profile:', _context.t0.message);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 22]]);
}

function updateProfile(userId) {
  var formData, response, updatedProfile, errorResponse;
  return regeneratorRuntime.async(function updateProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          formData = new FormData();
          formData.append('displayName', displayNameInput.value);
          formData.append('profilePicture', profilePictureInput.files[0]);
          console.log('Update profile function is activated on userId:', userId);
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(fetch("/user/updateProfile/".concat(userId), {
            method: 'PATCH',
            credentials: 'include',
            body: formData
          }));

        case 7:
          response = _context2.sent;

          if (!response.ok) {
            _context2.next = 17;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(response.json());

        case 11:
          updatedProfile = _context2.sent;
          console.log('Updated user profile:', updatedProfile); // await renderUpdateProfile();

          clearInput();
          console.log('Successfully update profile for userId', userId);
          _context2.next = 22;
          break;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(response.json());

        case 19:
          errorResponse = _context2.sent;
          console.error('Failed to update user profile:', errorResponse);
          alert('Failed to update user profile:' + errorResponse.message || 'Unknown error');

        case 22:
          _context2.next = 27;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](4);
          console.error('Failed to update user profile', _context2.t0.message);

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 24]]);
}

function clearInput() {
  profilePictureInput.value = "";
  displayNameInput.value = "";
}

updateProfileBtn.addEventListener('click', function () {
  return updateProfile(userId);
});