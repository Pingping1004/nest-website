export function authenticateUser(data) {
    const users = {
      username: data.username,
      role: data.role,
      profilePicture: data.profilePicture,
      token: data.token,
    };

    localStorage.setItem("user", JSON.stringify(users));

    if (users.role === "admin") {
      window.location.href = `/auth/admin/index/${data.userId}`;
    } else {
      window.location.href = `/auth/index/${data.userId}`;
    }
  }