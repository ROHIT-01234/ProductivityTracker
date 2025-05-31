document.addEventListener('DOMContentLoaded', () => {
  // Authentication UI elements
  const authContainer = document.getElementById('authContainer');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authMessage = document.getElementById('authMessage');
  const dashboardContainer = document.getElementById('dashboardContainer');
  const logoutBtn = document.getElementById('logoutBtn');

  // Show login form by default
  loginTab.classList.add('bg-green-600', 'text-white', 'font-bold');
  signupTab.classList.remove('bg-green-600', 'text-white', 'font-bold');

  // Toggle login/signup forms
  loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('bg-green-600', 'text-white', 'font-bold');
    signupTab.classList.remove('bg-green-600', 'text-white', 'font-bold');
    authMessage.textContent = '';
  });

  signupTab.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupTab.classList.add('bg-green-600', 'text-white','font-bold');
    loginTab.classList.remove('bg-green-600', 'text-white', 'font-bold');
    authMessage.textContent = '';
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.textContent = '';
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      // Call backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Save token or user info in chrome.storage or localStorage
        chrome.storage.local.set({ authToken: data.token, user: data.user }, () => {
          // Hide auth UI, show dashboard
          authContainer.style.display = 'none';
          dashboardContainer.style.display = 'block';
          authMessage.textContent = '';
          // TODO: Load user-specific data
          updateUIAfterLogin(data.user);
        });
      } else {
        authMessage.textContent = data.message || 'Login failed';
      }
    } catch (error) {
      authMessage.textContent = 'Error connecting to server';
    }
  });

  // Handle signup form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.textContent = '';
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      // Call backend signup API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        authMessage.textContent = 'Signup successful. Please login.';
        // Switch to login form
        loginTab.click();
      } else {
        authMessage.textContent = data.message || 'Signup failed';
      }
    } catch (error) {
      authMessage.textContent = 'Error connecting to server';
    }
  });

  // Handle logout
  logoutBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['authToken', 'user'], () => {
      // Show auth UI, hide dashboard
      authContainer.style.display = 'block';
      dashboardContainer.style.display = 'none';
      resetUIAfterLogout();
    });
  });

  // On load, check if user is logged in
  chrome.storage.local.get(['authToken', 'user'], (result) => {
    if (result.authToken) {
      authContainer.style.display = 'none';
      dashboardContainer.style.display = 'block';
      updateUIAfterLogin(result.user);
    } else {
      authContainer.style.display = 'block';
      dashboardContainer.style.display = 'none';
    }
  });

  // Function to update UI after login
  function updateUIAfterLogin(user) {
    // Example: update dashboard header with user name
    const header = document.getElementById('userName');
    if (header) {
      header.textContent = `Welcome, ${user.name}`;
    }
  }

  // Function to reset UI after logout
  function resetUIAfterLogout() {
    const header = document.getElementById('userName');
    if (header) {
      header.textContent = 'Focus Flow';
    }
  }
});
