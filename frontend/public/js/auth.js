// Auth Manager Module for PlacePrep AI
const Auth = {
  getToken() {
    return localStorage.getItem('placeprep_token');
  },

  getUser() {
    const user = localStorage.getItem('placeprep_user');
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      localStorage.removeItem('placeprep_user');
      return null;
    }
  },

  setAuth(token, user) {
    localStorage.setItem('placeprep_token', token);
    localStorage.setItem('placeprep_user', JSON.stringify(user));
  },

  updateUser(user) {
    localStorage.setItem('placeprep_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('placeprep_token');
    localStorage.removeItem('placeprep_user');
    window.location.href = '/login.html';
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
    }
  },

  requireAdmin() {
    if (!this.isLoggedIn() || !this.isAdmin()) {
      alert('Access denied: Admin privileges required.');
      window.location.href = '/dashboard.html';
    }
  },

  updateNavState() {
    const user = this.getUser();
    const guestNavs = document.querySelectorAll('.nav-guest');
    const userNavs = document.querySelectorAll('.nav-user');
    const userNameEls = document.querySelectorAll('.nav-user-name');
    const adminNavs = document.querySelectorAll('.nav-admin-only');

    if (this.isLoggedIn() && user) {
      guestNavs.forEach((el) => (el.style.display = 'none'));
      userNavs.forEach((el) => (el.style.display = 'flex'));
      userNameEls.forEach((el) => (el.textContent = user.name));

      if (user.role === 'admin') {
        adminNavs.forEach((el) => (el.style.display = 'flex'));
      } else {
        adminNavs.forEach((el) => (el.style.display = 'none'));
      }
    } else {
      guestNavs.forEach((el) => (el.style.display = 'flex'));
      userNavs.forEach((el) => (el.style.display = 'none'));
      adminNavs.forEach((el) => (el.style.display = 'none'));
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.updateNavState();
});
