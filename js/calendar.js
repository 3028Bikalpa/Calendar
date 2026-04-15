(function () {
  var monthLabel = document.getElementById("calendar-month-label");
  var grid = document.getElementById("calendar-grid");
  var selectedDateLabel = document.getElementById("selected-date-label");
  var selectedDayEvents = document.getElementById("selected-day-events");

  if (!monthLabel || !grid || !selectedDateLabel || !selectedDayEvents) {
    return;
  }

  var today = new Date();
  var viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  var selectedDate = formatISO(today);

  function formatMonth(date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function formatISO(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function slugify(value) {
    return value.toLowerCase().replace(/\s+/g, "-");
  }

  function renderSelectedDay() {
    var events = window.CalendarStore.getEventsForDate(selectedDate);
    selectedDateLabel.textContent = window.CalendarUI.formatDate(selectedDate, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    window.CalendarUI.renderStackItems(
      selectedDayEvents,
      events,
      "No events scheduled for the selected date."
    );
  }

  function renderCalendar() {
    monthLabel.textContent = formatMonth(viewDate);
    grid.innerHTML = "";

    var year = viewDate.getFullYear();
    var month = viewDate.getMonth();
    var firstDay = new Date(year, month, 1);
    var startDay = firstDay.getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrevMonth = new Date(year, month, 0).getDate();
    var events = window.CalendarStore.getAllEvents();

    for (var i = 0; i < 42; i += 1) {
      var dayNumber;
      var date;
      var isOtherMonth = false;

      if (i < startDay) {
        dayNumber = daysInPrevMonth - startDay + i + 1;
        date = new Date(year, month - 1, dayNumber);
        isOtherMonth = true;
      } else if (i >= startDay + daysInMonth) {
        dayNumber = i - startDay - daysInMonth + 1;
        date = new Date(year, month + 1, dayNumber);
        isOtherMonth = true;
      } else {
        dayNumber = i - startDay + 1;
        date = new Date(year, month, dayNumber);
      }

      var iso = formatISO(date);
      var dayEvents = events.filter(function (event) {
        return event.date === iso;
      });
      var isToday = iso === formatISO(today);
      var isSelected = iso === selectedDate;

      var button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day" +
        (isOtherMonth ? " is-other-month" : "") +
        (isToday ? " is-today" : "") +
        (isSelected ? " is-selected" : "");
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", iso + ", " + dayEvents.length + " event(s)");
      button.dataset.date = iso;
      button.innerHTML =
        '<span class="calendar-day__number">' + dayNumber + "</span>" +
        '<div class="calendar-day__badges">' +
        dayEvents.slice(0, 4).map(function (event) {
          return '<span class="calendar-badge calendar-badge--' + slugify(event.category) + '" title="' + event.title + '"></span>';
        }).join("") +
        "</div>";

      button.addEventListener("click", function (event) {
        selectedDate = event.currentTarget.dataset.date;
        renderCalendar();
        renderSelectedDay();
      });

      grid.appendChild(button);
    }
  }

  document.getElementById("prev-month").addEventListener("click", function () {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", function () {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
  renderSelectedDay();
})();
