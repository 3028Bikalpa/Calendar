(function () {
  var eventsList = document.getElementById("events-list");
  var summary = document.getElementById("events-summary");
  var searchInput = document.getElementById("search-input");
  var categoryFilter = document.getElementById("category-filter");
  var sortOrder = document.getElementById("sort-order");

  if (!eventsList || !summary || !searchInput || !categoryFilter || !sortOrder) {
    return;
  }

  window.CalendarStore.categories.forEach(function (category) {
    var option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  function slugClass(prefix, value) {
    return prefix + "-" + value.toLowerCase().replace(/\s+/g, "-");
  }

  function renderEvents() {
    var searchTerm = searchInput.value.trim().toLowerCase();
    var category = categoryFilter.value;
    var sort = sortOrder.value;

    var events = window.CalendarStore.getAllEvents().filter(function (event) {
      var matchesSearch = !searchTerm || [event.title, event.location, event.description].join(" ").toLowerCase().indexOf(searchTerm) >= 0;
      var matchesCategory = category === "All" || event.category === category;
      return matchesSearch && matchesCategory;
    }).sort(function (left, right) {
      var difference = new Date(left.date + "T00:00:00").getTime() - new Date(right.date + "T00:00:00").getTime();
      return sort === "asc" ? difference : -difference;
    });

    summary.textContent = events.length + " event" + (events.length === 1 ? "" : "s") + " found";

    if (!events.length) {
      eventsList.innerHTML = window.CalendarUI.renderEmptyState("No events match the current search and filter settings.");
      return;
    }

    eventsList.innerHTML = events.map(function (event) {
      return (
        '<article class="event-card" data-category="' + event.category + '">' +
          '<span class="event-tag ' + slugClass("event-tag", event.category) + '">' + event.category + "</span>" +
          "<h3>" + event.title + "</h3>" +
          '<div class="event-meta"><span>' + window.CalendarUI.formatDate(event.date, {
            year: "numeric",
            month: "long",
            day: "numeric"
          }) + '</span><span>' + event.time + '</span><span>' + event.location + "</span></div>" +
          "<p>" + event.description + "</p>" +
        "</article>"
      );
    }).join("");
  }

  [searchInput, categoryFilter, sortOrder].forEach(function (control) {
    control.addEventListener("input", renderEvents);
    control.addEventListener("change", renderEvents);
  });

  renderEvents();
})();
