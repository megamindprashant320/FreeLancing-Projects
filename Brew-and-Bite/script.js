
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".full-menu-card");

  if (!filterButtons.length || !menuCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      menuCards.forEach((card) => {
        card.hidden =
          selectedCategory !== "all" &&
          card.dataset.category !== selectedCategory;
      });
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const selectedItem = document.getElementById("selectedItem");
  const enquiryType = document.getElementById("enquiryType");
  const status = document.getElementById("formStatus");

  const params = new URLSearchParams(window.location.search);
  const item = params.get("item");

  if (item) {
    selectedItem.value = item;
    enquiryType.value = "Menu Enquiry";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const message = document.getElementById("customerMessage").value.trim();

    const subject = `Brew & Bite - ${enquiryType.value}`;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Enquiry Type: ${enquiryType.value}`,
      `Menu Item: ${selectedItem.value.trim() || "Not specified"}`,
      "",
      "Message:",
      message
    ].join("\n");

    // Replace with the real café email before enabling submission.
    const cafeEmail = "";

    if (!cafeEmail) {
      status.textContent =
        "Demo mode: The café email address has not been configured yet.";
      return;
    }

    const mailtoURL =
      `mailto:${cafeEmail}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoURL;

    status.textContent =
      "Your email application should open with a prepared message. Please send it there.";
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    });
  });
});
