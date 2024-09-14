import { authenticateUser } from './role.js'

const loginForm = document.querySelector("#loginform");
const logOutBtn = document.querySelector('.logout-btn');

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const users = {
        username: formData.get("username"),
        password: formData.get("password"),
        // role: formData.get("role"),
      };

      loginUser(users);
    });
  } else {
    console.error("Login form not found");
  }

  async function loginUser(users) {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        body: JSON.stringify(users),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text(); // Fetch the response text (likely HTML)
        console.error("Login failed:", errorText);
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      // authenticateUser(data);
      window.location.href = `/auth/index/${data.userId}`;
    } catch (error) {
        console.error("Error:", error.message);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  logOutBtn.addEventListener('click', logout);