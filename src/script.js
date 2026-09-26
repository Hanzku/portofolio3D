import "./style.css";
import Experience from "./Experience/Experience.js";

const faviconLink = document.querySelector("link[data-favicon]");
if (faviconLink) faviconLink.href = faviconLink.dataset.favicon;

const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || "";

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const contactSubmit = contactForm.querySelector('[type="submit"]');
const captchaQuestion = document.getElementById("captcha-question");
const captchaAnswer = document.getElementById("captcha-answer");
let correctCaptchaAnswer;

const showContactMessage = (message, state = "") => {
  contactStatus.textContent = message;
  contactStatus.dataset.state = state;
};

const createCaptcha = () => {
  const operators = ["+", "−", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let firstNumber = Math.floor(Math.random() * 12) + 1;
  let secondNumber = Math.floor(Math.random() * 12) + 1;

  if (operator === "−" && secondNumber > firstNumber) {
    [firstNumber, secondNumber] = [secondNumber, firstNumber];
  }

  correctCaptchaAnswer =
    operator === "+"
      ? firstNumber + secondNumber
      : operator === "−"
      ? firstNumber - secondNumber
      : firstNumber * secondNumber;

  captchaQuestion.textContent = `${firstNumber} ${operator} ${secondNumber} = ?`;
  captchaAnswer.value = "";
};

createCaptcha();

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
  if (!String(values.captcha || "").trim()) {
    showContactMessage("CAPTCHA wajib dijawab.", "error");
    captchaAnswer.focus();
    return;
  }
  if (
    !Number.isInteger(Number(values.captcha)) ||
    Number(values.captcha) !== correctCaptchaAnswer
  ) {
    showContactMessage("Jawaban CAPTCHA salah.", "error");
    createCaptcha();
    captchaAnswer.focus();
    return;
  }
  contactSubmit.disabled = true;
  contactSubmit.textContent = "Mengirim pesan...";
  showContactMessage("Mengirim pesan...");

  try {
    if (!WEB3FORMS_ACCESS_KEY.trim()) {
      throw new Error(
        "Konfigurasi email belum tersedia. Tambahkan WEB3FORMS_ACCESS_KEY di environment Production Vercel lalu deploy ulang."
      );
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        from_name: "Portofolio alfachridzy",
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(
        result.body?.message || result.message || "Web3Forms menolak pengiriman pesan."
      );
    }

    contactForm.reset();
    createCaptcha();
    showContactMessage("Pesan berhasil dikirim. Terima kasih sudah menghubungi saya.", "success");
  } catch (error) {
    showContactMessage(
      error instanceof TypeError
        ? "Tidak dapat terhubung ke Web3Forms. Periksa koneksi lalu coba lagi."
        : error.message || "Pesan gagal dikirim. Silakan coba lagi.",
      "error"
    );
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

const mobileLayout = window.matchMedia(
  "(max-width: 768px), (pointer: coarse)"
);
const updateMobileLayout = () => {
  document.body.classList.toggle("is-mobile", mobileLayout.matches);
};
updateMobileLayout();
mobileLayout.addEventListener?.("change", updateMobileLayout);

window.experience = new Experience({
  webglElement: document.querySelector("#webgl"),
  cssArcadeMachine: document.querySelector("#cssArcadeMachine"),
  cssLeftMonitor: document.querySelector("#cssLeftMonitor"),
  cssRightMonitor: document.querySelector("#cssRightMonitor"),
});
