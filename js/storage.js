(function () {
  var STORAGE_KEY = "dkuCalendarUserEvents";
  var AUTH_KEY = "dkuCalendarAuth";
  var categories = [
    "Academic",
    "Exams",
    "Registration",
    "Deadlines",
    "Holidays",
    "Campus Life",
    "Clubs",
    "Workshops",
    "Seminars"
  ];

  var sampleEvents = [
    {
      id: "sample-1",
      title: "Spring Semester Classes Begin",
      date: "2026-01-12",
      time: "08:30",
      category: "Academic",
      location: "Academic Building",
      description: "Official start of spring semester instruction for undergraduate and graduate courses."
    },
    {
      id: "sample-2",
      title: "Course Registration Deadline",
      date: "2026-01-23",
      time: "17:00",
      category: "Registration",
      location: "Student Information System",
      description: "Final deadline to confirm course registration and resolve schedule conflicts."
    },
    {
      id: "sample-3",
      title: "Club and Activities Fair",
      date: "2026-02-06",
      time: "16:00-18:30",
      category: "Clubs",
      location: "Campus Center Plaza",
      description: "Student organizations welcome new and returning students with booths and sign-up opportunities."
    },
    {
      id: "sample-4",
      title: "Guest Lecture: Global Health Policy",
      date: "2026-02-19",
      time: "19:00-20:30",
      category: "Seminars",
      location: "Conference Center Auditorium",
      description: "A visiting scholar discusses current global health policy challenges and interdisciplinary responses."
    },
    {
      id: "sample-5",
      title: "Midterm Assessment Period Opens",
      date: "2026-03-16",
      time: "09:00",
      category: "Exams",
      location: "Various Classrooms",
      description: "Beginning of the midterm assessment window for spring semester courses."
    },
    {
      id: "sample-6",
      title: "DKU Career Workshop: Internship Preparation",
      date: "2026-03-25",
      time: "15:00-16:30",
      category: "Workshops",
      location: "Career Services Hub",
      description: "Practical workshop on internship applications, interviews, and employer communication."
    },
    {
      id: "sample-7",
      title: "Reading Days",
      date: "2026-04-27",
      time: "All day",
      category: "Academic",
      location: "Campus-wide",
      description: "Reading days begin. Regular classes pause to support final preparation and review."
    },
    {
      id: "sample-8",
      title: "Final Exam Period Begins",
      date: "2026-04-29",
      time: "08:00",
      category: "Exams",
      location: "Exam Venues by Course",
      description: "Start of the final examination period for spring semester courses."
    },
    {
      id: "sample-9",
      title: "Labor Day Holiday",
      date: "2026-05-01",
      time: "All day",
      category: "Holidays",
      location: "China National Holiday",
      description: "University holiday observance during the Labor Day break."
    },
    {
      id: "sample-10",
      title: "Residence Hall Closing",
      date: "2026-05-12",
      time: "12:00",
      category: "Deadlines",
      location: "Residence Halls",
      description: "Spring residence halls close for non-graduating students after the exam and departure period."
    },
    {
      id: "sample-11",
      title: "Summer Session Registration Opens",
      date: "2026-05-18",
      time: "10:00",
      category: "Registration",
      location: "Student Information System",
      description: "Summer session registration opens for eligible students."
    },
    {
      id: "sample-12",
      title: "Faculty Workshop on Undergraduate Research Mentoring",
      date: "2026-06-03",
      time: "14:00-15:30",
      category: "Workshops",
      location: "Innovation Building Room 2047",
      description: "Workshop for faculty and staff focused on mentoring undergraduate research projects."
    }
  ];

  function readUserEvents() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function writeUserEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  function normalizeEvent(event) {
    return {
      id: event.id || "event-" + Date.now() + "-" + Math.random().toString(16).slice(2),
      title: (event.title || "").trim(),
      date: event.date,
      time: (event.time || "").trim(),
      category: categories.indexOf(event.category) >= 0 ? event.category : "Academic",
      location: (event.location || "").trim(),
      description: (event.description || "").trim(),
      source: event.source || "local"
    };
  }

  function getAllEvents() {
    return sampleEvents.concat(readUserEvents()).slice().sort(function (left, right) {
      return new Date(left.date + "T00:00:00").getTime() - new Date(right.date + "T00:00:00").getTime();
    });
  }

  function getEventsForDate(date) {
    return getAllEvents().filter(function (event) {
      return event.date === date;
    });
  }

  function addEvent(event) {
    var normalized = normalizeEvent(event);
    var events = readUserEvents();
    events.push(normalized);
    writeUserEvents(events);
    return normalized;
  }

  function getUpcomingEvents(limit, filterFn) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var items = getAllEvents().filter(function (event) {
      var eventDate = new Date(event.date + "T00:00:00");
      return eventDate.getTime() >= today.getTime();
    });
    if (typeof filterFn === "function") {
      items = items.filter(filterFn);
    }
    return items.slice(0, limit);
  }

  function login(username, password) {
    var isValid = username === "bikki" && password === "bikki";
    if (isValid) {
      sessionStorage.setItem(AUTH_KEY, "true");
    }
    return isValid;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
  }

  function isLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  }

  window.CalendarStore = {
    categories: categories,
    getAllEvents: getAllEvents,
    getEventsForDate: getEventsForDate,
    getUpcomingEvents: getUpcomingEvents,
    addEvent: addEvent,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout
  };
})();
