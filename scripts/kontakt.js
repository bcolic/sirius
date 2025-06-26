document.addEventListener("DOMContentLoaded", function () {
  // Prikaži/skrivaj call i sms gumbe ovisno o uređaju
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  const callBtn = document.getElementById("kontakt-call-btn");
  const smsBtn = document.getElementById("kontakt-sms-btn");
  if (!isMobile()) {
    if (callBtn) callBtn.style.display = "none";
    if (smsBtn) smsBtn.style.display = "none";
  }

  // Mailto gumb - popuni podatke iz forme
  const mailBtn = document.getElementById("kontakt-mail-btn");
  const form = document.getElementById("kontakt-form");
  const porukaDiv = document.getElementById("kontakt-poruka");

  if (mailBtn && form) {
    mailBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const ime = form.ime.value.trim();
      const email = form.email.value.trim();
      const telefon = form.telefon.value.trim();
      const datum = form.datum.value;
      const poruka = form.poruka.value.trim();
      let body = `Ime i prezime: ${ime}%0D%0AEmail: ${email}%0D%0ATelefon: ${telefon}%0D%0AŽeljeni datum: ${datum}%0D%0APoruka: ${poruka}`;
      mailBtn.href = `mailto:info@sirius-band.com?subject=Upit%20za%20rezervaciju%20termina&body=${body}`;
      mailBtn.click();
    });
  }

  // Validacija i prikaz poruke
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      porukaDiv.textContent = "";
      if (!form.checkValidity()) {
        porukaDiv.textContent = "Molimo ispunite sva obavezna polja ispravno.";
        porukaDiv.style.color = "#ff4d4d";
        return;
      }
      // Pripremi mailto link
      const ime = form.ime.value.trim();
      const email = form.email.value.trim();
      const predmet = form.predmet.value.trim();
      const poruka = form.poruka.value.trim();
      const mailto = `mailto:siriusgrupa@gmail.com?subject=${encodeURIComponent(
        predmet
      )}&body=${encodeURIComponent(
        `Ime: ${ime}\nE-mail: ${email}\n\nPoruka:\n${poruka}`
      )}`;
      window.location.href = mailto;
      porukaDiv.textContent = "Hvala na upitu! Otvoren je vaš e-mail klijent.";
      porukaDiv.style.color = "#4dff7a";
      form.reset();
    });
  }
});
