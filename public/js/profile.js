const profilePictureInput = document.querySelector('#profile-picture-input');
const displayNameInput = document.querySelector('#display-name-input');
const updateProfileBtn = document.querySelector('#update-profile-btn');

let userId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchProfileData();
});

async function fetchProfileData() {
    console.log('Fetch profile function is called');

    try {
        const response = await fetch(`/user/profile/data`, {
            credentials: 'include',
        });

        console.log('Fetch response status:', response.status);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error('Failed to fetch profile', errorResponse);
        }

        const data = await response.json();
        console.log('User profile data', data);

        console.log(data.user.displayName);
        console.log(data.user.profilePicture);

        userId = data.userID;
        displayNameInput.value = data.user.displayName;
        // profilePictureInput.src = data.profilePicture || 'default.jpg';

        console.log('User profile ID:', userId);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
    }
}

async function updateProfile(userId) {
    const formData = new FormData();
    formData.append('displayName', displayNameInput.value);
    formData.append('profilePicture', profilePictureInput.files[0]);

    console.log('Update profile function is activated on userId:', userId)

    try {
        const response = await fetch(`/user/updateProfile/${userId}`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
        });

        if (response.ok) {
            const updatedProfile = await response.json();
            console.log('Updated user profile:', updatedProfile);
            // await renderUpdateProfile();
            clearInput();
            console.log('Successfully update profile for userId', userId);
        } else {
            const errorResponse = await response.json();
            console.error('Failed to update user profile:', errorResponse);
            alert('Failed to update user profile:' + errorResponse.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Failed to update user profile', error.message);
    }
}

function clearInput() {
    profilePictureInput.value = "";
    displayNameInput.value = "";
}

updateProfileBtn.addEventListener('click', () => updateProfile(userId));