(() => {
  const prefersLess = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const year = document.querySelector("[data-ano]");
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector(".topo");
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav?.classList.toggle("open", open);
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menu");
  }));

  const reserveForm = document.querySelector(".reserva-form");
  const reserveStatus = reserveForm?.querySelector(".reserva-status");
  reserveForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!reserveForm.reportValidity()) return;

    if (reserveStatus) {
      reserveStatus.textContent = "Simulação concluída. Nenhum dado foi enviado ou armazenado.";
      reserveStatus.classList.add("is-visible");
    }
    reserveForm.reset();
  });

  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    document.querySelector(".capitulo--um")?.classList.add("ativo");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (prefersLess) {
    document.querySelector(".capitulo--um")?.classList.add("ativo");
    return;
  }

  const opening = document.querySelector(".abertura");
  const image = document.querySelector(".abertura-imagem");
  const chapters = gsap.utils.toArray(".capitulo");
  const progress = document.querySelector(".progresso span");

  if (opening && image) {
    const story = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: opening,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          if (progress) gsap.set(progress, { scaleX: self.progress });
        },
      },
    });

    story.to(image, { scale: 1.17, yPercent: -3, duration: 1 }, 0);
    story.fromTo(chapters[0], { autoAlpha: 0, y: 28, filter: "blur(7px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.12 }, 0.02);
    story.to(chapters[0], { autoAlpha: 0, y: -18, filter: "blur(5px)", duration: 0.1 }, 0.29);
    story.fromTo(chapters[1], { autoAlpha: 0, y: 25, filter: "blur(7px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.12 }, 0.36);
    story.to(chapters[1], { autoAlpha: 0, y: -18, filter: "blur(5px)", duration: 0.1 }, 0.64);
    story.fromTo(chapters[2], { autoAlpha: 0, y: 24, filter: "blur(7px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.14 }, 0.72);
  }

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 34 }, {
      autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 84%", once: true },
    });
  });

  gsap.utils.toArray(".interludio-img, .foto-lateral img, .cardapio-foto img, .visita-img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -4, scale: 1.07 }, {
      yPercent: 4, scale: 1.12, ease: "none",
      scrollTrigger: { trigger: img.closest("section, figure"), start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
