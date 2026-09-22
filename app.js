const WA_NUMBER = "5500000000000";
const $ = (s) => document.querySelector(s);
const form = $("#config");
const resumo = $("#resumo");

function updateResumo() {
  const t = $("#tipo").value, i = $("#inst").value, c = $("#cor").value;
  const n = $("#nome").value.trim();
  resumo.textContent = "Resumo: " + t + ", " + i + ", " + c + (n ? ", nome: " + n : ".");
}
["tipo", "inst", "cor", "nome"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateResumo);
});
updateResumo();

document.querySelectorAll("[data-kit]").forEach((a) => {
  a.addEventListener("click", () => {
    const kit = a.getAttribute("data-kit");
    const sel = $("#tipo");
    if ([...sel.options].some((o) => o.text === kit)) sel.value = kit;
    updateResumo();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const t = $("#tipo").value, i = $("#inst").value, c = $("#cor").value;
  const n = $("#nome").value.trim() || "sem gravação";
  const msg = "Olá Aécio! Quero orçamento: " + t + " | " + i + " | " + c + " | nome: " + n;
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});

// Números do hero com contagem simples
const nums = document.querySelectorAll("[data-count]");
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, end = Number(el.dataset.count);
    const t0 = performance.now(), dur = 900;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * p).toLocaleString("pt-BR") + "+";
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    io.unobserve(el);
  });
}, { threshold: 0.4 });
nums.forEach((n) => io.observe(n));

// Entrada escalonada, uma por vista
const rev = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("on"); rev.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll("section, .card, .pbh-card").forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
  rev.observe(el);
});
