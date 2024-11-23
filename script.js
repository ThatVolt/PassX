// Check if passwords are saved in localStorage
if (!localStorage.getItem("passwords")) {
  localStorage.setItem("passwords", JSON.stringify([]));
}

// Add new password
function addPassword() {
  const service = document.getElementById("service").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (service && username && password) {
    // Get existing passwords from localStorage
    let passwords = JSON.parse(localStorage.getItem("passwords"));
    
    // Store new password
    passwords.push({ service, username, password });
    
    // Save updated passwords to localStorage
    localStorage.setItem("passwords", JSON.stringify(passwords));

    // Clear input fields
    document.getElementById("service").value = '';
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    document.getElementById("passwordStrength").innerText = '';
    alert("Password added successfully!");
  } else {
    alert("Please fill all fields!");
  }
}

// View stored passwords
function viewPasswords() {
  const passwordList = document.getElementById("passwordList");
  passwordList.innerHTML = ""; // Clear previous list

  // Retrieve stored passwords
  const passwords = JSON.parse(localStorage.getItem("passwords"));

  if (passwords.length > 0) {
    passwords.forEach((entry, index) => {
      const div = document.createElement("div");
      div.classList.add("password-item");

      div.innerHTML = `
        <span><strong>Service:</strong> ${entry.service}</span>
        <span><strong>Username:</strong> ${entry.username}</span>
        <span><strong>Password:</strong> 
          <input type="password" class="password-field" value="${entry.password}" disabled />
          <button onclick="togglePasswordVisibility(this)">Show</button>
        </span>
        <button onclick="editPassword(${index})">Edit</button>
        <button onclick="deletePassword(${index})">Delete</button>
      `;

      passwordList.appendChild(div);
    });
  } else {
    passwordList.innerHTML = "No passwords saved!";
  }
}

// Delete a stored password
function deletePassword(index) {
  if (confirm("Are you sure you want to delete this password?")) {
    const passwords = JSON.parse(localStorage.getItem("passwords"));
    passwords.splice(index, 1); // Remove password at the given index
    localStorage.setItem("passwords", JSON.stringify(passwords));
    viewPasswords(); // Refresh the list
  }
}

// Edit a stored password
function editPassword(index) {
  const passwords = JSON.parse(localStorage.getItem("passwords"));
  const entry = passwords[index];

  // Pre-fill the form with the selected password details
  document.getElementById("service").value = entry.service;
  document.getElementById("username").value = entry.username;
  document.getElementById("password").value = entry.password;

  // Remove the password from storage after editing
  deletePassword(index);
}

// Toggle visibility of password
function togglePasswordVisibility(button) {
  const passwordInput = button.previousElementSibling; // Get the input field (password field)
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text"; // Show password
    button.innerText = "Hide";
  } else {
    passwordInput.type = "password"; // Hide password
    button.innerText = "Show";
  }
}

// Search functionality
function searchPasswords() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const passwords = JSON.parse(localStorage.getItem("passwords"));
  const filteredPasswords = passwords.filter(password =>
    password.service.toLowerCase().includes(searchQuery)
  );

  const passwordList = document.getElementById("passwordList");
  passwordList.innerHTML = ""; // Clear previous list

  filteredPasswords.forEach((entry, index) => {
    const div = document.createElement("div");
    div.classList.add("password-item");

    div.innerHTML = `
      <span><strong>Service:</strong> ${entry.service}</span>
      <span><strong>Username:</strong> ${entry.username}</span>
      <span><strong>Password:</strong> ${entry.password}</span>
      <button onclick="deletePassword(${index})">Delete</button>
    `;

    passwordList.appendChild(div);
  });
}

// Password strength indicator
document.getElementById("password").addEventListener("input", function () {
  const password = this.value;
  const strength = getPasswordStrength(password);
  const strengthElem = document.getElementById("passwordStrength");
  
  strengthElem.textContent = `Strength: ${strength.label}`;
  strengthElem.className = `password-strength ${strength.class}`;
});

// Function to determine password strength
function getPasswordStrength(password) {
  const patterns = {
    weak: /[a-zA-Z]{1,3}/,
    medium: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])/,
  };
  
  if (patterns.strong.test(password)) {
    return { label: "Strong", class: "strong" };
  } else if (patterns.medium.test(password)) {
    return { label: "Medium", class: "medium" };
  } else if (patterns.weak.test(password)) {
    return { label: "Weak", class: "weak" };
  } else {
    return { label: "Too Short", class: "weak" };
  }
}
