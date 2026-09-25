import "./style.css";
import Experience from "./Experience/Experience.js";

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const contactSubmit = contactForm.querySelector('[type="submit"]');

const showContactMessage = (message, state = "") => {
  contactStatus.textContent = message;
  contactStatus.dataset.state = state;
};

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const values = Object.fromEntries(formData.entries());
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const [field, label] of [["name", "Nama"], ["email", "Email"], ["subject", "Subjek"], ["message", "Pesan"]]) {
    if (!String(values[field] || "").trim()) {
      showContactMessage(`${label} wajib diisi.`, "error");
      contactForm.elements[field].focus();
      return;
    }
  }
  if (!emailPattern.test(values.email.trim())) {
    showContactMessage("Format email tidak valid.", "error");
    contactForm.elements.email.focus();
    return;
  }
  contactSubmit.disabled = true;
  contactSubmit.textContent = "Mengirim pesan...";
  showContactMessage("Mengirim pesan...");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error("Pengiriman formulir gagal.");

    contactForm.reset();
    showContactMessage("Pesan berhasil dikirim. Terima kasih sudah menghubungi saya.", "success");
  } catch (_error) {
    showContactMessage("Pesan gagal dikirim. Silakan coba lagi.", "error");
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.textContent = "Kirim Pesan";
  }
});

document.getElementById("copy-email").addEventListener("click", async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText("zandygege@gmail.com");
    } else {
      const emailCopyField = document.createElement("textarea");
      emailCopyField.value = "zandygege@gmail.com";
      emailCopyField.style.position = "fixed";
      emailCopyField.style.opacity = "0";
      document.body.appendChild(emailCopyField);
      emailCopyField.select();
      const copied = document.execCommand("copy");
      emailCopyField.remove();
      if (!copied) throw new Error("Penyalinan email gagal.");
    }
    showContactMessage("Email berhasil disalin.", "success");
  } catch (_error) {
    showContactMessage("Email tidak dapat disalin. Silakan salin secara manual.", "error");
  }
});

const isMobile =
  /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || navigator.userAgentData?.mobile;

if (window.innerWidth > 768 && !isMobile) {
  window.experience = new Experience({
    webglElement: document.querySelector("#webgl"),
    cssArcadeMachine: document.querySelector("#cssArcadeMachine"),
    cssLeftMonitor: document.querySelector("#cssLeftMonitor"),
    cssRightMonitor: document.querySelector("#cssRightMonitor"),
  });
} else {
  document.body.classList.add("is-mobile");
  window.experience = new Experience({
    webglElement: document.querySelector("#webgl"),
    cssArcadeMachine: document.querySelector("#cssArcadeMachine"),
    cssLeftMonitor: document.querySelector("#cssLeftMonitor"),
    cssRightMonitor: document.querySelector("#cssRightMonitor"),
  });
}
