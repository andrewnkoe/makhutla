// Discover Lesotho: simple JavaScript features for the assignment
document.addEventListener("DOMContentLoaded", function () {
  // Feature 1: Dark/light mode. The choice is remembered in Local Storage.
  const themeButton = document.getElementById("themeButton");
  if (localStorage.getItem("tourismTheme") === "dark") {
    document.body.classList.add("dark-mode");
  }
  function updateThemeButton() {
    if (themeButton) {
      themeButton.textContent = document.body.classList.contains("dark-mode") ? "Light mode" : "Dark mode";
    }
  }
  updateThemeButton();
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("tourismTheme", document.body.classList.contains("dark-mode") ? "dark" : "light");
      updateThemeButton();
    });
  }

  // Feature 2: Search and filter destination cards.
  const searchInput = document.getElementById("destinationSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const destinationItems = document.querySelectorAll(".destination-item");
  const noResults = document.getElementById("noResults");
  function filterDestinations() {
    if (!searchInput || !categoryFilter) return;
    const searchText = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    let visibleCount = 0;
    destinationItems.forEach(function (item) {
      const words = (item.dataset.name + " " + item.innerText).toLowerCase();
      const matchesText = words.includes(searchText);
      const matchesCategory = category === "all" || item.dataset.category === category;
      item.classList.toggle("d-none", !(matchesText && matchesCategory));
      if (matchesText && matchesCategory) visibleCount++;
    });
    if (noResults) noResults.classList.toggle("d-none", visibleCount !== 0);
  }
  if (searchInput) searchInput.addEventListener("input", filterDestinations);
  if (categoryFilter) categoryFilter.addEventListener("change", filterDestinations);

  // Feature 3: Gallery preview modal with next and previous buttons.
  const galleryButtons = Array.from(document.querySelectorAll(".gallery-button"));
  const modalElement = document.getElementById("galleryModal");
  let currentImage = 0;
  function showGalleryImage(index) {
    if (!galleryButtons.length || !modalElement) return;
    currentImage = (index + galleryButtons.length) % galleryButtons.length;
    const selected = galleryButtons[currentImage];
    document.getElementById("modalImage").src = selected.dataset.image;
    document.getElementById("modalCaption").textContent = selected.dataset.caption;
    document.getElementById("galleryModalTitle").textContent = selected.dataset.caption;
  }
  if (modalElement && window.bootstrap) {
    const galleryModal = new bootstrap.Modal(modalElement);
    galleryButtons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        showGalleryImage(index);
        galleryModal.show();
      });
    });
    const previous = document.getElementById("previousImage");
    const next = document.getElementById("nextImage");
    if (previous) previous.addEventListener("click", function () { showGalleryImage(currentImage - 1); galleryModal.show(); });
    if (next) next.addEventListener("click", function () { showGalleryImage(currentImage + 1); galleryModal.show(); });
  }

  // Feature 4: Booking form validation and estimated cost calculator.
  const bookingForm = document.getElementById("bookingForm");
  const bookingMessage = document.getElementById("bookingMessage");
  const estimate = document.getElementById("estimate");
  function getBookings() {
    try { return JSON.parse(localStorage.getItem("tourismBookings") || "[]"); }
    catch (error) { return []; }
  }
  function displayBookings() {
    const container = document.getElementById("savedBookings");
    if (!container) return;
    const bookings = getBookings();
    if (!bookings.length) {
      container.innerHTML = "<p class='mb-0'>No saved enquiries yet.</p>";
      return;
    }
    container.innerHTML = "";
    bookings.forEach(function (booking) {
      const row = document.createElement("div");
      row.className = "border rounded p-3 mb-2";
      const details = document.createElement("p");
      details.className = "mb-0";
      details.textContent = booking.name + " — " + booking.activity + ", " + booking.people +
        " person(s), " + booking.date + ". Estimate: M" + booking.total;
      row.appendChild(details);
      container.appendChild(row);
    });
  }
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }
      const name = document.getElementById("bookingName").value.trim();
      const email = document.getElementById("bookingEmail").value.trim();
      const phone = document.getElementById("bookingPhone").value.trim();
      const activitySelect = document.getElementById("bookingActivity");
      const activity = activitySelect.options[activitySelect.selectedIndex].text;
      const rate = Number(activitySelect.value);
      const people = Number(document.getElementById("people").value);
      const date = document.getElementById("bookingDate").value;
      const total = rate * people;
      if (!name || !email || !phone || !date || rate <= 0 || people < 1) {
        bookingMessage.textContent = "Please complete every field correctly.";
        bookingMessage.className = "mt-3 text-danger";
        return;
      }
      const booking = { name: name, email: email, phone: phone, activity: activity, people: people, date: date, total: total };
      const bookings = getBookings();
      bookings.push(booking);
      localStorage.setItem("tourismBookings", JSON.stringify(bookings));
      bookingMessage.textContent = "Your demo enquiry has been saved in this browser.";
      bookingMessage.className = "mt-3 text-success";
      estimate.textContent = "Estimated activity cost: M" + total;
      bookingForm.reset();
      document.getElementById("people").value = "1";
      displayBookings();
    });
  }
  const clearBookings = document.getElementById("clearBookings");
  if (clearBookings) {
    clearBookings.addEventListener("click", function () {
      localStorage.removeItem("tourismBookings");
      displayBookings();
      if (bookingMessage) bookingMessage.textContent = "Saved enquiries have been cleared.";
    });
  }
  displayBookings();

  // Feature 5: Contact form validation with a success message.
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const feedback = document.getElementById("contactFeedback");
      feedback.textContent = "Thank you! Your demo message has been checked successfully. It has not been emailed.";
      feedback.className = "mt-3 text-success";
      contactForm.reset();
    });
  }
});
