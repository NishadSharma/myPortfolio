// Toggle mobile menu smoothly
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (!menu || !icon) return;
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (
    menu &&
    menu.classList.contains("open") &&
    hamburgerMenu &&
    !hamburgerMenu.contains(e.target)
  ) {
    menu.classList.remove("open");
    if (icon) icon.classList.remove("open");
  }
});

// Close mobile menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      if (icon) icon.classList.remove("open");
    }
  }
});

// Smoothly scroll to a section by ID, taking dynamic sticky header height into account
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const desktopNav = document.getElementById("desktop-nav");
  const hamburgerNav = document.getElementById("hamburger-nav");
  let headerHeight = 80;

  if (desktopNav && window.getComputedStyle(desktopNav).display !== "none") {
    headerHeight = desktopNav.offsetHeight;
  } else if (hamburgerNav) {
    headerHeight = hamburgerNav.offsetHeight;
  }

  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });

  if (window.history && window.history.pushState) {
    window.history.pushState(null, null, "#" + id);
  }
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.toggleMenu = toggleMenu;

// Initialize smooth interactions on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Intercept all internal anchor clicks for smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const targetId = href.replace(/^#/, "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        scrollToSection(targetId);

        // Smoothly close mobile menu if it is open
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        if (menu && menu.classList.contains("open")) {
          menu.classList.remove("open");
          if (icon) icon.classList.remove("open");
        }
      }
    });
  });

  // Sticky Navbar shadow, scroll progress bar & back-to-top button
  const desktopNav = document.getElementById("desktop-nav");
  const hamburgerNav = document.getElementById("hamburger-nav");
  const scrollProgress = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  let ticking = false;
  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Sticky nav elevation on scroll
    if (scrollTop > 20) {
      desktopNav?.classList.add("scrolled");
      hamburgerNav?.classList.add("scrolled");
    } else {
      desktopNav?.classList.remove("scrolled");
      hamburgerNav?.classList.remove("scrolled");
    }

    // Scroll Progress Bar
    if (scrollProgress && docHeight > 0) {
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      scrollProgress.style.width = `${progress}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Active Navbar link indicator (Scrollspy)
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    const scrollPos = scrollTop + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call to set active nav link and scrollbar state
  onScroll();

  // Scroll Reveal Animations with IntersectionObserver
  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      "section:not(#profile) .section__text__p1, " +
      "section:not(#profile) .title, " +
      "section:not(#profile) .section__pic-container, " +
      "section:not(#profile) .details-container, " +
      "section:not(#profile) .text-container, " +
      "section:not(#profile) .contact-info-upper-container"
    );

    revealTargets.forEach((el) => {
      el.classList.add("reveal");
    });

    // Stagger cards in containers
    document.querySelectorAll(".about-containers").forEach((container) => {
      const cards = container.querySelectorAll(".details-container");
      cards.forEach((card, index) => {
        card.classList.add(`delay-${(index % 3) + 1}`);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.1
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
});