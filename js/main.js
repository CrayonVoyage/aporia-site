/* ==========================================================================
   APORIA · interactions
   Aucune bibliothèque. Sans JavaScript, tout le contenu reste lisible :
   les effets ne s'activent que si la classe "js" est posée sur <html>.
   ========================================================================== */

/* Adresse de contact des boutons "Nous écrire".
   Tant qu'elle est vide, les boutons affichent "Bientôt" et sont désactivés. */
const CONTACT_EMAIL = "";

document.documentElement.classList.replace("no-js", "js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initScrollEffects();
  initReveal();
  initManifesto();
  initCounters();
  initTabs();
  initContact();
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* En-tête : fond opaque après l'accueil, lien actif, menu mobile ----------- */
function initHeader() {
  const header = $("[data-header]");
  const hero = $(".hero");
  const toggle = $("[data-nav-toggle]");
  const nav = $("#menu");
  const links = $$("a[href^='#']", nav);

  new IntersectionObserver(([entry]) => header.classList.toggle("is-solid", !entry.isIntersecting), {
    rootMargin: "-80px 0px 0px 0px",
  }).observe(hero);

  // Lien actif = section qui occupe le milieu de l'écran
  const sections = links.map((a) => $(a.hash)).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.hash === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
}

/* Barre de progression et lever de soleil sur l'accueil -------------------- */
function initScrollEffects() {
  const root = document.documentElement;
  const hero = $(".hero");
  let ticking = false;

  const update = () => {
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
    if (!reduceMotion) {
      const shift = Math.min(Math.max(scrollY / hero.offsetHeight, 0), 1);
      hero.style.setProperty("--hero-shift", shift.toFixed(3));
    }
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) requestAnimationFrame(update), (ticking = true);
  }, { passive: true });
  addEventListener("resize", update);
  update();
}

/* Apparition des blocs au défilement --------------------------------------- */
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  $$("[data-reveal]").forEach((el) => io.observe(el));
}

/* Manifesto : chaque ligne s'éclaire en passant au centre, suite dépliable -- */
function initManifesto() {
  const box = $("[data-manifesto]");
  if (!box) return;

  const lit = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-lit")),
    { rootMargin: "-25% 0px -35% 0px" }
  );
  $$(".manifesto__line", box).forEach((line) => lit.observe(line));

  const more = $("[data-manifesto-more]", box);
  const toggle = $("[data-manifesto-toggle]", box);
  const label = $("span", toggle);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? toggle.dataset.labelLess : toggle.dataset.labelMore;

    // Animation de hauteur : on part de la hauteur réelle du contenu
    more.style.maxHeight = `${more.scrollHeight}px`;
    if (open) {
      more.addEventListener("transitionend", () => (more.style.maxHeight = "none"), { once: true });
    } else {
      requestAnimationFrame(() => (more.style.maxHeight = "0px"));
      box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  });
}

/* Compteurs de l'équation de la tribu -------------------------------------- */
function initCounters() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        countUp(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => {
    if (!reduceMotion) el.textContent = "0";
    io.observe(el);
  });

  function countUp(el) {
    const target = Number(el.dataset.count);
    if (reduceMotion) return (el.textContent = target);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/* Onglets des parcours (accessibles au clavier) ---------------------------- */
function initTabs() {
  $$("[data-tabs]").forEach((wrap) => {
    const tabs = $$("[role='tab']", wrap);
    const indicator = $(".tabs__indicator", wrap);

    const moveIndicator = (tab) => {
      indicator.style.setProperty("--w", `${tab.offsetWidth}px`);
      indicator.style.setProperty("--x", `${tab.offsetLeft}px`);
    };

    const select = (tab, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = $(`#${t.getAttribute("aria-controls")}`);
        panel.hidden = !on;
        if (on) {
          panel.classList.remove("is-entering");
          void panel.offsetWidth; // relance l'animation
          panel.classList.add("is-entering");
        }
      });
      moveIndicator(tab);
      if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        select(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });

    const current = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    moveIndicator(current);
    addEventListener("resize", () => moveIndicator(tabs.find((t) => t.tabIndex === 0) || current));
    document.fonts?.ready.then(() => moveIndicator(tabs.find((t) => t.tabIndex === 0) || current));
  });
}

/* Boutons de contact -------------------------------------------------------- */
function initContact() {
  $$("[data-contact]").forEach((btn) => {
    if (!CONTACT_EMAIL) {
      btn.textContent = "Bientôt";
      btn.classList.add("is-soon");
      btn.setAttribute("aria-disabled", "true");
      btn.removeAttribute("href");
      return;
    }
    const subject = encodeURIComponent(`Aporia · ${btn.dataset.contact}`);
    btn.href = `mailto:${CONTACT_EMAIL}?subject=${subject}`;
  });
}
