(function () {
  function $(selector) {
    return document.querySelector(selector);
  }

  function formatDate(dateString, options) {
    return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", options || {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function slugClass(prefix, value) {
    return prefix + "-" + value.toLowerCase().replace(/\s+/g, "-");
  }

  function renderEmptyState(message) {
    return '<div class="empty-state">' + message + "</div>";
  }

  function renderStackItems(container, events, emptyMessage) {
    if (!container) {
      return;
    }

    if (!events.length) {
      container.innerHTML = renderEmptyState(emptyMessage);
      return;
    }

    container.innerHTML = events.map(function (event) {
      return (
        '<article class="stack-item" data-category="' + event.category + '">' +
          '<span class="event-tag ' + slugClass("event-tag", event.category) + '">' + event.category + "</span>" +
          "<h3>" + event.title + "</h3>" +
          '<div class="meta"><span>' + formatDate(event.date) + '</span><span>' + event.time + '</span><span>' + event.location + "</span></div>" +
          "<p>" + event.description + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function fillHomepageSections() {
    var upcomingContainer = $("#homepage-upcoming");
    var deadlinesContainer = $("#homepage-deadlines");

    if (upcomingContainer) {
      renderStackItems(
        upcomingContainer,
        window.CalendarStore.getUpcomingEvents(4),
        "No upcoming events are currently scheduled."
      );
    }

    if (deadlinesContainer) {
      renderStackItems(
        deadlinesContainer,
        window.CalendarStore.getUpcomingEvents(4, function (event) {
          return ["Deadlines", "Registration", "Exams", "Academic"].indexOf(event.category) >= 0;
        }),
        "No imminent deadlines are currently available."
      );
    }
  }

  function initNav() {
    var button = $(".nav-toggle");
    var nav = $("#primary-nav");

    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Asset candidates are tested in order so official files can replace placeholders without changing markup.
  function assetExists(path, callback) {
    var image = new Image();
    image.onload = function () {
      callback(true);
    };
    image.onerror = function () {
      callback(false);
    };
    image.src = path;
  }

  function resolveAssets() {
    var assetNodes = document.querySelectorAll("[data-asset-candidates]");
    assetNodes.forEach(function (node) {
      var candidates = node.getAttribute("data-asset-candidates").split(",");
      var index = 0;

      function tryNext() {
        if (index >= candidates.length) {
          return;
        }

        var candidate = candidates[index].trim();
        index += 1;

        assetExists(candidate, function (exists) {
          if (exists) {
            node.src = candidate;
          } else {
            tryNext();
          }
        });
      }

      tryNext();
    });
  }

  window.CalendarUI = {
    formatDate: formatDate,
    renderStackItems: renderStackItems,
    renderEmptyState: renderEmptyState
  };

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    resolveAssets();
    fillHomepageSections();
  });
})();
