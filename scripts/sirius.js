// Provjera termina
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("provjera-termina-form");
  const odgovor = document.getElementById("provjera-odgovor");
  const datumContainer = document.getElementById("provjera-datum-container");
  const input = document.getElementById("provjera-datum");
  const fakeBtn = document.getElementById("provjera-datum-fake-btn");
  if (fakeBtn && input) {
    fakeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (typeof input.showPicker === "function") {
        input.showPicker();
      } else {
        input.focus();
      }
    });
  }
  if (datumContainer && input) {
    datumContainer.addEventListener("click", function (e) {
      if (e.target === input) return;
      if (typeof input.showPicker === "function") {
        input.showPicker();
      } else {
        input.focus();
      }
    });
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const datum = input.value;
      if (!datum) return;
      function toISODate(str) {
        const m = str.match(/(\d{2})\.(\d{2})\.(\d{4})\./);
        if (!m) return null;
        return `${m[3]}-${m[2]}-${m[1]}`;
      }
      const isoDatum = toISODate(datum);
      if (!isoDatum) return;
      const n = (window.nastupi || []).find((x) => x.datum === isoDatum);
      if (n) {
        odgovor.innerHTML = `<span class="zauzeto">Nažalost, zauzeti smo taj dan! Sviramo u <b>${n.sala}, ${n.grad}</b>.</span>`;
      } else {
        odgovor.innerHTML = `<span class="slobodno">Taj datum je slobodan! Slobodno nas kontaktirajte za rezervaciju.</span>`;
      }
    });
  }
});

// Inicijalizacija Flatpickr na custom inputu
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("provjera-datum");
  const fakeBtn = document.getElementById("provjera-datum-fake-btn");
  function formatirajDatum(d) {
    const dan = String(d.getDate()).padStart(2, "0");
    const mj = String(d.getMonth() + 1).padStart(2, "0");
    const god = d.getFullYear();
    return `${dan}.${mj}.${god}.`;
  }
  if (input) {
    const danas = new Date();
    input.value = formatirajDatum(danas);
  }
  if (window.flatpickr && input) {
    flatpickr(input, {
      dateFormat: "d.m.Y.",
      minDate: "today",
      allowInput: false,
      theme: "dark",
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
          longhand: [
            "Nedjelja",
            "Ponedjeljak",
            "Utorak",
            "Srijeda",
            "Četvrtak",
            "Petak",
            "Subota",
          ],
        },
        months: {
          shorthand: [
            "Sij",
            "Velj",
            "Ožu",
            "Tra",
            "Svi",
            "Lip",
            "Srp",
            "Kol",
            "Ruj",
            "Lis",
            "Stu",
            "Pro",
          ],
          longhand: [
            "Siječanj",
            "Veljača",
            "Ožujak",
            "Travanj",
            "Svibanj",
            "Lipanj",
            "Srpanj",
            "Kolovoz",
            "Rujan",
            "Listopad",
            "Studeni",
            "Prosinac",
          ],
        },
      },
      disableMobile: true,
      static: true,
      position: "below",
      onReady: function (selectedDates, dateStr, instance) {
        const container = instance.calendarContainer;
        const style = document.createElement("style");
        style.innerHTML = `
          .flatpickr-months {
            background: transparent !important;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 100%;
            min-height: 2.7em;
            gap: 1.2em;
          }
          .flatpickr-months .flatpickr-prev-month,
          .flatpickr-months .flatpickr-next-month {
            z-index: 2;
          }
          .flatpickr-months .flatpickr-month {
            flex: 1 1 auto;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative;
            min-width: 0;
            padding: 0;
            background: transparent !important;
          }
          .custom-month-year-label {
            position: absolute;
            left: 0; right: 0;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffe066;
            font-weight: 600;
            font-size: 1.08em;
            letter-spacing: 1.5px;
            user-select: none;
            background: transparent !important;
            pointer-events: none;
            height: 2.2em;
          }
          .flatpickr-current-month,
          .flatpickr-current-month input.cur-year,
          .flatpickr-current-month .numInputWrapper,
          .flatpickr-current-month .flatpickr-yearDropdown,
          .flatpickr-current-month .arrowUp,
          .flatpickr-current-month .arrowDown {
            display: none !important;
          }
        `;
        container.appendChild(style);
        const monthHeader = container.querySelector(
          ".flatpickr-months .flatpickr-month"
        );
        if (monthHeader) {
          let oldLabel = monthHeader.querySelector(".custom-month-year-label");
          if (oldLabel) oldLabel.remove();
          const monthName =
            instance.l10n.months.longhand[instance.currentMonth];
          const year = instance.currentYear;
          const label = document.createElement("span");
          label.className = "custom-month-year-label";
          label.textContent = `${monthName}, ${year}`;
          monthHeader.appendChild(label);
          function updateCustomMonthYear() {
            const m = instance.l10n.months.longhand[instance.currentMonth];
            const y = instance.currentYear;
            label.textContent = `${m}, ${y}`;
          }
          instance._updateCustomMonthYear = updateCustomMonthYear;
          if (!instance._customMonthYearPatched) {
            const origChangeMonth = instance.changeMonth.bind(instance);
            instance.changeMonth = function () {
              origChangeMonth.apply(instance, arguments);
              instance._updateCustomMonthYear();
            };
            const origChangeYear = instance.changeYear.bind(instance);
            instance.changeYear = function () {
              origChangeYear.apply(instance, arguments);
              instance._updateCustomMonthYear();
            };
            const prevBtn = container.querySelector(".flatpickr-prev-month");
            const nextBtn = container.querySelector(".flatpickr-next-month");
            if (prevBtn)
              prevBtn.addEventListener("click", function () {
                setTimeout(updateCustomMonthYear, 1);
              });
            if (nextBtn)
              nextBtn.addEventListener("click", function () {
                setTimeout(updateCustomMonthYear, 1);
              });
            instance._customMonthYearPatched = true;
          }
        }
        const monthDropdown = container.querySelector(
          ".flatpickr-monthDropdown-months"
        );
        if (monthDropdown) monthDropdown.style.display = "none";
      },
      onChange: function (selectedDates) {
        if (selectedDates.length) {
          input.value = formatirajDatum(selectedDates[0]);
        }
      },
    });
  }
  if (fakeBtn && input) {
    fakeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      input._flatpickr && input._flatpickr.open();
    });
  }
});

// Header show/hide on scroll up/down
(function () {
  let lastScrollY = window.scrollY;
  let ticking = false;
  let header = document.querySelector(".header");
  let isHidden = false;
  function onScroll() {
    if (!header) return;
    const currentScroll = window.scrollY;
    if (currentScroll <= 0) {
      header.style.transform = "translateY(0)";
      isHidden = false;
    } else if (currentScroll > lastScrollY) {
      if (!isHidden) {
        header.style.transform = "translateY(-120%)";
        header.style.transition = "transform 0.35s cubic-bezier(.4,0,.2,1)";
        isHidden = true;
      }
    } else if (currentScroll < lastScrollY) {
      if (isHidden) {
        header.style.transform = "translateY(0)";
        header.style.transition = "transform 0.35s cubic-bezier(.4,0,.2,1)";
        isHidden = false;
      }
    }
    lastScrollY = currentScroll;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
})();
