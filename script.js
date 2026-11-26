const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link, .nav-contact");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("open", !isExpanded);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
  });
});

const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const skillsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.style.setProperty("--level", `${entry.target.dataset.level}%`);
    entry.target.classList.add("in-view");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll(".skill").forEach((skill) => skillsObserver.observe(skill));
document.querySelector("#year").textContent = new Date().getFullYear();

const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const requiredFields = [...form.querySelectorAll("[required]")];
const emailField = form.querySelector("#email");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.classList.remove("success");

  const invalidFields = requiredFields.filter((field) => {
    const isInvalid = !field.value.trim() || (field === emailField && !emailPattern.test(field.value.trim()));
    field.setAttribute("aria-invalid", String(isInvalid));
    return isInvalid;
  });

  if (invalidFields.length) {
    feedback.textContent = invalidFields.includes(emailField) && emailField.value.trim()
      ? "Please enter a valid email address."
      : "Please complete all fields with a valid email address.";
    invalidFields[0].focus();
    return;
  }

  feedback.classList.add("success");
  feedback.textContent = "Thanks for reaching out! This demo form is validated but isn’t connected to a mailbox yet.";
  form.reset();
  requiredFields.forEach((field) => field.removeAttribute("aria-invalid"));
});

requiredFields.forEach((field) => {
  field.addEventListener("input", () => {
    if (field.value.trim()) field.removeAttribute("aria-invalid");
  });
});
