/* ==========================================================================
   APORIA · interactions (communes à toutes les pages)
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
  initContact();
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* En-tête : fond opaque après l'accueil, lien actif, menu mobile ----------- */
function initHeader() {
  const header = $("[data-header]");
  const hero = $(".hero");
  const toggle = $("[data-nav-toggle]");
  const nav = $("#menu");
  const links = $$("a", nav);

  // Pages annexes : pas d'accueil plein écran, l'en-tête est opaque d'emblée
  if (hero) {
    new IntersectionObserver(([entry]) => header.classList.toggle("is-solid", !entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
    }).observe(hero);
  } else {
    header.classList.add("is-solid");
  }

  // Lien actif = section qui occupe le milieu de l'écran (page d'accueil)
  const anchors = links.filter((a) => a.pathname === location.pathname && a.hash);
  const sections = anchors.map((a) => $(a.hash)).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        anchors.forEach((a) => a.classList.toggle("is-active", a.hash === `#${entry.target.id}`));
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
    if (hero && !reduceMotion) {
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

/* Manifesto : chaque ligne s'éclaire en passant au centre de l'écran -------- */
function initManifesto() {
  const lines = $$(".manifesto__line");
  if (!lines.length) return;
  const lit = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-lit")),
    { rootMargin: "-25% 0px -35% 0px" }
  );
  lines.forEach((line) => lit.observe(line));
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
