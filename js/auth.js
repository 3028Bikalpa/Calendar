(function () {
  var page = document.body.getAttribute("data-page");

  function setMessage(element, message, type) {
    if (!element) {
      return;
    }
    element.textContent = message;
    element.className = "form-message" + (type ? " is-" + type : "");
  }

  if (page === "login") {
    var loginForm = document.getElementById("login-form");
    var loginMessage = document.getElementById("login-message");

    if (window.CalendarStore.isLoggedIn()) {
      window.location.href = "admin.html";
    }

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var username = document.getElementById("username").value.trim();
      var password = document.getElementById("password").value;

      if (!username || !password) {
        setMessage(loginMessage, "Enter both username and password.", "error");
        return;
      }

      if (window.CalendarStore.login(username, password)) {
        setMessage(loginMessage, "Login successful. Redirecting to admin page...", "success");
        window.setTimeout(function () {
          window.location.href = "admin.html";
        }, 500);
      } else {
        setMessage(loginMessage, "Invalid username or password. Use the testing credentials provided below.", "error");
      }
    });
  }

  if (page === "admin") {
    if (!window.CalendarStore.isLoggedIn()) {
      window.location.href = "login.html";
    }

    var categorySelect = document.getElementById("event-category");
    var adminForm = document.getElementById("admin-event-form");
    var adminMessage = document.getElementById("admin-message");
    var adminEventsList = document.getElementById("admin-events-list");
    var logoutButton = document.getElementById("logout-button");

    window.CalendarStore.categories.forEach(function (category) {
      var option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    function renderLocalEvents() {
      var allEvents = window.CalendarStore.getAllEvents().filter(function (event) {
        return String(event.id).indexOf("sample-") !== 0;
      }).slice().reverse();

      window.CalendarUI.renderStackItems(
        adminEventsList,
        allEvents.slice(0, 6),
        "No local events have been added yet."
      );
    }

    adminForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var payload = {
        title: document.getElementById("event-title").value.trim(),
        date: document.getElementById("event-date").value,
        time: document.getElementById("event-time").value.trim(),
        category: document.getElementById("event-category").value,
        location: document.getElementById("event-location").value.trim(),
        description: document.getElementById("event-description").value.trim()
      };

      if (!payload.title || !payload.date || !payload.time || !payload.category || !payload.location || !payload.description) {
        setMessage(adminMessage, "Complete every field before saving the event.", "error");
        return;
      }

      window.CalendarStore.addEvent(payload);
      adminForm.reset();
      setMessage(adminMessage, "Event saved. It is now available across the site.", "success");
      renderLocalEvents();
    });

    logoutButton.addEventListener("click", function () {
      window.CalendarStore.logout();
      window.location.href = "login.html";
    });

    renderLocalEvents();
  }
})();
