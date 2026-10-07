document.getElementById("year").textContent = new Date().getFullYear();

// Fade sections in once as they enter the viewport.
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// Copy email to clipboard, with a short confirmation.
const copyBtn = document.querySelector(".copy");
if (copyBtn) {
  const label = copyBtn.querySelector(".copy__label");
  const icon = copyBtn.querySelector(".copy__icon use");
  const original = label.textContent;
  let timer;
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.copy);
      label.textContent = "Copied";
      icon.setAttribute("href", "assets/icons.svg#i-check");
      copyBtn.dataset.state = "done";
    } catch {
      window.location.href = "mailto:" + copyBtn.dataset.copy;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = original;
      icon.setAttribute("href", "assets/icons.svg#i-copy");
      delete copyBtn.dataset.state;
    }, 1800);
  });
}
