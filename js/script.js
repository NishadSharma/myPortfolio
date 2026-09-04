"use strict";

const documentElement = document.documentElement;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-navigation");
const themeToggle = document.querySelector(".theme-toggle");
const navigationLinks = [...document.querySelectorAll("[data-nav-link]")];
const currentYear = document.querySelector("[data-current-year]");
const pageSections = [...document.querySelectorAll("main > section")];
const themeStorageKey = "portfolio-theme";

documentElement.dataset.js = "ready";
currentYear.textContent = new Date().getFullYear();

function setTheme(theme) {
	const isDark = theme === "dark";

	documentElement.dataset.theme = isDark ? "dark" : "light";
	themeToggle.setAttribute("aria-pressed", String(isDark));
	themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
}

function getInitialTheme() {
	const savedTheme = localStorage.getItem(themeStorageKey);

	if (savedTheme === "light" || savedTheme === "dark") {
		return savedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function closeNavigation() {
	navigation.classList.remove("is-open");
	menuToggle.setAttribute("aria-expanded", "false");
}

function updateScrollState() {
	header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function updateActiveLink() {
	const hash = window.location.hash.slice(1);

	setActiveLink(hash);
}

function setActiveLink(activeId) {
	navigationLinks.forEach((link) => {
		const isActive = link.dataset.navLink === activeId;

		link.classList.toggle("is-active", isActive);
		link.toggleAttribute("aria-current", isActive);
	});
}

function observeSections() {
	const sections = navigationLinks
		.map((link) => document.getElementById(link.dataset.navLink))
		.filter(Boolean);

	if (!sections.length || !("IntersectionObserver" in window)) {
		return;
	}

	const sectionObserver = new IntersectionObserver(
		(entries) => {
			const visibleEntry = entries.find((entry) => entry.isIntersecting);

			if (visibleEntry) {
				setActiveLink(visibleEntry.target.id);
			}
		},
		{ rootMargin: "-20% 0px -65%" },
	);

	sections.forEach((section) => sectionObserver.observe(section));
}

function revealSections() {
	if (!pageSections.length) {
		return;
	}

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
		pageSections.forEach((section) => section.classList.add("is-visible"));
		return;
	}

	const revealObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			});
		},
		{ rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
	);

	pageSections.forEach((section) => revealObserver.observe(section));
}

setTheme(getInitialTheme());
updateScrollState();
updateActiveLink();
observeSections();
revealSections();

menuToggle.addEventListener("click", () => {
	const isOpen = navigation.classList.toggle("is-open");
	menuToggle.setAttribute("aria-expanded", String(isOpen));
});

themeToggle.addEventListener("click", () => {
	const nextTheme = documentElement.dataset.theme === "dark" ? "light" : "dark";

	setTheme(nextTheme);
	localStorage.setItem(themeStorageKey, nextTheme);
});

navigationLinks.forEach((link) => {
	link.addEventListener("click", () => {
		closeNavigation();
		updateActiveLink();
	});
});

window.addEventListener("hashchange", updateActiveLink);
window.addEventListener("scroll", updateScrollState, { passive: true });

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && navigation.classList.contains("is-open")) {
		closeNavigation();
		menuToggle.focus();
	}
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
	});
});
