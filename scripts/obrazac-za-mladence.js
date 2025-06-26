// Firebase konfiguracija
const firebaseConfig = {
  apiKey: "AIzaSyCpxo1ci8LP9QTs35cmbWxkrmu--q7xJPE",
  authDomain: "sirius-obrazac.firebaseapp.com",
  projectId: "sirius-obrazac",
  storageBucket: "sirius-obrazac.appspot.com",
  messagingSenderId: "42072404300",
  appId: "1:42072404300:web:f23fe3501757efa90c5fe9",
  measurementId: "G-HWXG3PGMMH",
};

// Inicijalizacija Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mladenci-form");
  const porukaDiv = document.getElementById("obrazac-poruka");
  const datumInput = document.getElementById("datum");
  const vrijemeInput = document.getElementById("vrijeme-vecere");

  // Formatiranje datuma
  function formatirajDatum(d) {
    const dan = String(d.getDate()).padStart(2, "0");
    const mj = String(d.getMonth() + 1).padStart(2, "0");
    const god = d.getFullYear();
    return `${dan}.${mj}.${god}.`;
  }

  // Formatiranje vremena
  function formatirajVrijeme(d) {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  // Postavljanje početnog datuma
  if (datumInput) {
    const danas = new Date();
    datumInput.value = formatirajDatum(danas);
  }

  // Postavljanje početnog vremena i rukovanje unosom
  if (vrijemeInput) {
    vrijemeInput.value = "hh:mm";

    vrijemeInput.addEventListener("focus", function () {
      if (this.value === "hh:mm") {
        this.value = "";
      }
    });

    vrijemeInput.addEventListener("blur", function () {
      if (this.value === "") {
        this.value = "hh:mm";
      }
    });

    vrijemeInput.addEventListener("input", function (e) {
      let value = this.value.replace(/[^0-9]/g, "");

      if (value.length > 4) {
        value = value.substring(0, 4);
      }

      if (value.length > 2) {
        value = value.substring(0, 2) + ":" + value.substring(2);
      }

      this.value = value;

      if (value.length === 2 && e.inputType !== "deleteContentBackward") {
        this.value = value + ":";
      }
    });

    vrijemeInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasteData = e.clipboardData
        .getData("text/plain")
        .replace(/[^0-9]/g, "");
      document.execCommand("insertText", false, pasteData);
    });
  }

  // Kalendar za datum svatova
  if (window.flatpickr && datumInput) {
    flatpickr(datumInput, {
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

            if (prevBtn) {
              prevBtn.addEventListener("click", function () {
                setTimeout(updateCustomMonthYear, 1);
              });
            }

            if (nextBtn) {
              nextBtn.addEventListener("click", function () {
                setTimeout(updateCustomMonthYear, 1);
              });
            }

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
          datumInput.value = formatirajDatum(selectedDates[0]);
        }
      },
    });
  }

  // Slanje obrasca
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      porukaDiv.textContent = "";
      porukaDiv.style.color = "#ffe066";

      if (!form.checkValidity()) {
        porukaDiv.textContent = "Molimo ispunite sva obavezna polja ispravno.";
        porukaDiv.style.color = "#ff4d4d";
        return;
      }

      // Izdvajanje podataka iz forme
      const data = {};
      Array.from(form.elements).forEach((el) => {
        if (el.name) data[el.name] = el.value;
      });

      // Dodaj polje "imena" za prikaz (mladoženja + mlada)
      data.imena =
        (data.mladozenja ? data.mladozenja : "") +
        (data.mlada ? " & " + data.mlada : "");

      // Dodaj vrijeme ulaza (vrijeme večere)
      data["vrijeme-ulaza"] = data["vrijeme-vecere"] || "";

      // Dodaj pjesmu za ulazak barjaktara, yt link i napomene ako postoje
      const barjaktarPoljaDiv = document.getElementById(
        "barjaktar-polja-global"
      );
      if (barjaktarPoljaDiv && barjaktarPoljaDiv.style.display !== "none") {
        // Broj barjaktara
        data["barjaktar-broj"] =
          barjaktarPoljaDiv.querySelector(".barjaktar-select")?.value || "1";
        // Imena barjaktara (kao polje ili string)
        const imenaInputs = barjaktarPoljaDiv.querySelectorAll(
          ".barjaktar-ime-input"
        );
        data["barjaktar-imena"] = Array.from(imenaInputs)
          .map((inp) => inp.value)
          .filter(Boolean)
          .join(", ");
        // Pjesma za ulazak barjaktara
        data["barjaktar-pjesma"] =
          barjaktarPoljaDiv.querySelector(".barjaktar-pjesma-input")?.value ||
          "";
        // YT link i napomena (ako je checkbox označen)
        const ytChecked = barjaktarPoljaDiv.querySelector(
          "#barjaktar-internet"
        )?.checked;
        if (ytChecked) {
          data["barjaktar-link"] =
            barjaktarPoljaDiv.querySelector(".barjaktar-youtube-input")
              ?.value || "";
          data["barjaktar-napomena"] =
            barjaktarPoljaDiv.querySelector(".barjaktar-napomena-input")
              ?.value || "";
        } else {
          data["barjaktar-link"] = "";
          data["barjaktar-napomena"] = "";
        }
      } else {
        data["barjaktar-broj"] = "";
        data["barjaktar-imena"] = "";
        data["barjaktar-pjesma"] = "";
        data["barjaktar-link"] = "";
        data["barjaktar-napomena"] = "";
      }

      // Dodaj podatke za kumove
      const kumoviPoljaDiv = document.getElementById("kumovi-polja-global");
      if (kumoviPoljaDiv && kumoviPoljaDiv.style.display !== "none") {
        data["kumovi-ime-kuma"] =
          kumoviPoljaDiv.querySelector(".kumovi-ime-kuma")?.value || "";
        data["kumovi-ime-kume"] =
          kumoviPoljaDiv.querySelector(".kumovi-ime-kume")?.value || "";
        data["kumovi-pjesma"] =
          kumoviPoljaDiv.querySelector(".kumovi-pjesma-input")?.value || "";
        const ytChecked =
          kumoviPoljaDiv.querySelector("#kumovi-internet")?.checked;
        if (ytChecked) {
          data["kumovi-link"] =
            kumoviPoljaDiv.querySelector(".kumovi-youtube-input")?.value || "";
          data["kumovi-napomena"] =
            kumoviPoljaDiv.querySelector(".kumovi-napomena-input")?.value || "";
        } else {
          data["kumovi-link"] = "";
          data["kumovi-napomena"] = "";
        }
      } else {
        data["kumovi-ime-kuma"] = "";
        data["kumovi-ime-kume"] = "";
        data["kumovi-pjesma"] = "";
        data["kumovi-link"] = "";
        data["kumovi-napomena"] = "";
      }

      // Dodaj podatke za "drugi" (ako su prisutni)
      const drugiPoljaDiv = document.getElementById("drugi-polja-global");
      if (drugiPoljaDiv && drugiPoljaDiv.style.display !== "none") {
        data["drugi-naziv"] =
          drugiPoljaDiv.querySelector(".drugi-naziv-input")?.value || "";
        data["drugi-pjesma"] =
          drugiPoljaDiv.querySelector(".drugi-pjesma-input")?.value || "";
        const ytChecked =
          drugiPoljaDiv.querySelector("#drugi-internet")?.checked;
        if (ytChecked) {
          data["drugi-link"] =
            drugiPoljaDiv.querySelector(".drugi-youtube-input")?.value || "";
          data["drugi-napomena"] =
            drugiPoljaDiv.querySelector(".drugi-napomena-input")?.value || "";
        } else {
          data["drugi-link"] = "";
          data["drugi-napomena"] = "";
        }
      } else {
        data["drugi-naziv"] = "";
        data["drugi-pjesma"] = "";
        data["drugi-link"] = "";
        data["drugi-napomena"] = "";
      }

      // Dodaj podatke za mladence
      const mladenciPoljaDiv = document.getElementById("mladenci-polja-global");
      if (mladenciPoljaDiv && mladenciPoljaDiv.style.display !== "none") {
        data["mladenci-ime-mladozenja"] =
          mladenciPoljaDiv.querySelector(".mladenci-ime-mladozenja")?.value ||
          "";
        data["mladenci-ime-mlada"] =
          mladenciPoljaDiv.querySelector(".mladenci-ime-mlada")?.value || "";
        data["mladenci-pjesma"] =
          mladenciPoljaDiv.querySelector(".mladenci-pjesma-input")?.value || "";
        const ytChecked =
          mladenciPoljaDiv.querySelector("#mladenci-internet")?.checked;
        if (ytChecked) {
          data["mladenci-link"] =
            mladenciPoljaDiv.querySelector(".mladenci-youtube-input")?.value ||
            "";
          data["mladenci-napomena"] =
            mladenciPoljaDiv.querySelector(".mladenci-napomena-input")?.value ||
            "";
        } else {
          data["mladenci-link"] = "";
          data["mladenci-napomena"] = "";
        }
      } else {
        data["mladenci-ime-mladozenja"] = "";
        data["mladenci-ime-mlada"] = "";
        data["mladenci-pjesma"] = "";
        data["mladenci-link"] = "";
        data["mladenci-napomena"] = "";
      }

      // Dodavanje u Firestore
      firestore
        .collection("mladenci-obrasci")
        .add({
          ...data,
          datum: data.datum || null,
          timestamp: new Date(),
        })
        .then(() => {
          porukaDiv.textContent = "Obrazac je uspješno poslan!";
          porukaDiv.style.color = "#4dff7a";
          form.reset();

          // Reset vrijeme inputa nakon slanja obrasca
          if (vrijemeInput) {
            vrijemeInput.value = "hh:mm";
          }

          // Automatski sakrij poruku nakon 2 sekunde
          setTimeout(() => {
            porukaDiv.textContent = "";
          }, 2000);
        })
        .catch((err) => {
          console.error("Greška:", err);
          porukaDiv.textContent =
            "Greška pri slanju obrasca. Pokušajte ponovno.";
          porukaDiv.style.color = "#ff4d4d";
        });
    });
  }

  // --- Ulaz u salu: redoslijed i pjesme ---
  const ulazLista = document.getElementById("ulaz-lista");
  // Dodaj novi kontejner ispod liste za dinamička polja za pjesme
  let globalPjesmeContainer = document.createElement("div");
  globalPjesmeContainer.id = "ulaz-global-pjesme";
  globalPjesmeContainer.style.marginTop = "18px";
  const ulazOdabirContainer = document.getElementById("ulaz-odabir-container");
  if (ulazOdabirContainer && !document.getElementById("ulaz-global-pjesme")) {
    ulazOdabirContainer.appendChild(globalPjesmeContainer);
  }

  if (ulazLista) {
    // Dodaj drag handle na svaku stavku
    ulazLista.querySelectorAll("li").forEach((li) => {
      if (!li.querySelector(".drag-handle")) {
        const handle = document.createElement("span");
        handle.className = "drag-handle";
        handle.title = "Povucite za promjenu redoslijeda";
        handle.innerHTML = "&#9776;";
        li.appendChild(handle);
      }
      li.setAttribute("draggable", "false"); // default: nije draggable
    });

    let draggedEl = null;

    // Samo handle pokreće drag
    ulazLista.addEventListener("mousedown", function (e) {
      const handle = e.target.closest(".drag-handle");
      if (handle) {
        const li = handle.closest("li");
        li.setAttribute("draggable", "true");
      }
    });

    // On mouseup, makni draggable
    ulazLista.addEventListener("mouseup", function (e) {
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.setAttribute("draggable", "false"));
    });

    // On dragstart, samo ako je handle
    ulazLista.addEventListener("dragstart", function (e) {
      const handle = e.target.querySelector(".drag-handle");
      if (!handle || e.target !== e.target.closest("li")) {
        e.preventDefault();
        return;
      }
      draggedEl = e.target;
      draggedEl.classList.add("dragging");
      handle.style.pointerEvents = "none";
      e.dataTransfer.effectAllowed = "move";
    });

    ulazLista.addEventListener("dragend", function (e) {
      if (draggedEl) {
        draggedEl.classList.remove("dragging");
        const handle = draggedEl.querySelector(".drag-handle");
        if (handle) handle.style.pointerEvents = "";
        draggedEl = null;
      }
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("drag-over"));
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.setAttribute("draggable", "false"));
    });

    ulazLista.addEventListener("dragover", function (e) {
      e.preventDefault();
      const afterElement = getDragAfterElement(ulazLista, e.clientY);
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("drag-over"));
      if (afterElement) afterElement.classList.add("drag-over");
    });

    ulazLista.addEventListener("dragleave", function (e) {
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("drag-over"));
    });

    ulazLista.addEventListener("drop", function (e) {
      e.preventDefault();
      const afterElement = getDragAfterElement(ulazLista, e.clientY);
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("drag-over"));
      if (draggedEl) {
        if (afterElement == null) {
          ulazLista.appendChild(draggedEl);
        } else {
          ulazLista.insertBefore(draggedEl, afterElement);
        }
      }
      ulazLista
        .querySelectorAll("li")
        .forEach((li) => li.setAttribute("draggable", "false"));
    });

    // Spriječi drag na checkbox/label
    ulazLista.addEventListener("dragstart", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "LABEL") {
        e.preventDefault();
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [
        ...container.querySelectorAll("li:not(.dragging)"),
      ];
      let closest = null;
      let closestOffset = Number.NEGATIVE_INFINITY;
      draggableElements.forEach((child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          closest = child;
        }
      });
      return closest;
    }

    // --- Dodaj globalni cache za privremeno spremanje vrijednosti polja ---
    const ulazPoljaCache = {
      barjaktar: {},
      kumovi: {},
      drugi: {},
      mladenci: {},
    };

    // Funkcija za generiranje polja za barjaktara ispod liste
    function renderBarjaktarFieldsGlobal() {
      const barjaktarFieldsId = "barjaktar-polja-global";
      let barjaktarPoljaDiv = document.getElementById(barjaktarFieldsId);
      if (!barjaktarPoljaDiv) {
        barjaktarPoljaDiv = document.createElement("div");
        barjaktarPoljaDiv.id = barjaktarFieldsId;
        barjaktarPoljaDiv.className = "barjaktar-polja";
        // umetni odmah ispod ulaz-lista
        const ulazOdabirContainer = document.getElementById(
          "ulaz-odabir-container"
        );
        const ulazLista = document.getElementById("ulaz-lista");
        if (ulazOdabirContainer && ulazLista) {
          ulazOdabirContainer.insertBefore(
            barjaktarPoljaDiv,
            ulazLista.nextSibling
          );
        }
      }

      // Prikaži samo ako je barjaktar označen
      const barjaktarLi = ulazLista.querySelector('li[data-id="barjaktar"]');
      if (
        !barjaktarLi ||
        !barjaktarLi.querySelector('input[type="checkbox"]').checked
      ) {
        // Spremi podatke prije brisanja DOM-a
        if (barjaktarPoljaDiv.innerHTML) {
          cacheBarjaktarFields();
        }
        barjaktarPoljaDiv.innerHTML = "";
        barjaktarPoljaDiv.style.display = "none";
        delete barjaktarPoljaDiv.dataset.broj;
        return;
      }
      barjaktarPoljaDiv.style.display = "";

      // --- Vrati vrijednosti iz cachea ---
      const cache = ulazPoljaCache.barjaktar || {};
      let broj = cache.broj || 1;

      barjaktarPoljaDiv.innerHTML = `
        <div class="barjaktar-broj-wrap">
          <label for="broj-barjaktara" style="color:#ffe066;">Broj barjaktara:</label>
          <select id="broj-barjaktara" name="broj-barjaktara" class="barjaktar-select">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<option value="${n}"${
                    n == broj ? " selected" : ""
                  }>${n}</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="form-group barjaktar-imena-wrap">
          ${Array.from({ length: broj })
            .map(
              (_, i) =>
                `<input type="text" name="barjaktar_ime_${
                  i + 1
                }" maxlength="40" placeholder="Ime barjaktara ${
                  i + 1
                }" class="barjaktar-ime-input" required>`
            )
            .join("")}
        </div>
        <div class="form-group barjaktar-pjesma-wrap">
          <label style="color:#ffe066;">Pjesma za ulazak barjaktara:</label>
          <input type="text" name="pjesma_barjaktar" placeholder="Naziv pjesme" class="barjaktar-pjesma-input" style="width:100%;">
          <div class="barjaktar-internet-wrap" style="margin-top:8px;">
            <label style="display:flex;align-items:center;gap:7px;font-size:1.01rem;color:#ffe066;">
              <input type="checkbox" id="barjaktar-internet" name="barjaktar-internet" style="width:18px;height:18px;accent-color:#ffe066;">
              Link s YouTube-a
            </label>
          </div>
          <div id="barjaktar-internet-fields" style="display:none;margin-top:8px;">
            <input type="url" name="barjaktar_youtube" class="barjaktar-youtube-input" placeholder="YouTube link" style="width:100%;margin-bottom:7px;">
            <input type="text" name="barjaktar_napomena" class="barjaktar-napomena-input" placeholder="Dodatne napomene (opcionalno)" style="width:100%;">
          </div>
        </div>
      `;
      barjaktarPoljaDiv.dataset.broj = broj;

      // Vrati vrijednosti iz cachea
      barjaktarPoljaDiv
        .querySelectorAll(".barjaktar-ime-input")
        .forEach((inp, i) => {
          if (cache["ime_" + i]) inp.value = cache["ime_" + i];
        });
      barjaktarPoljaDiv.querySelector(".barjaktar-pjesma-input").value =
        cache.pjesma || "";
      const internetCheckbox = barjaktarPoljaDiv.querySelector(
        "#barjaktar-internet"
      );
      if (internetCheckbox) internetCheckbox.checked = !!cache.internet;
      const internetFields = barjaktarPoljaDiv.querySelector(
        "#barjaktar-internet-fields"
      );
      if (internetFields)
        internetFields.style.display = cache.internet ? "" : "none";
      if (cache.internet) {
        barjaktarPoljaDiv.querySelector(".barjaktar-youtube-input").value =
          cache.yt || "";
        barjaktarPoljaDiv.querySelector(".barjaktar-napomena-input").value =
          cache.napomena || "";
      }

      // Spremi vrijednosti u cache na svaki input/select
      barjaktarPoljaDiv.querySelectorAll("input,select").forEach((el) => {
        el.addEventListener("input", cacheBarjaktarFields);
        el.addEventListener("change", cacheBarjaktarFields);
      });

      function cacheBarjaktarFields() {
        const broj =
          barjaktarPoljaDiv.querySelector(".barjaktar-select")?.value || "1";
        ulazPoljaCache.barjaktar = {
          broj: parseInt(broj, 10),
          internet:
            barjaktarPoljaDiv.querySelector("#barjaktar-internet")?.checked ||
            false,
          yt:
            barjaktarPoljaDiv.querySelector(".barjaktar-youtube-input")
              ?.value || "",
          napomena:
            barjaktarPoljaDiv.querySelector(".barjaktar-napomena-input")
              ?.value || "",
          pjesma:
            barjaktarPoljaDiv.querySelector(".barjaktar-pjesma-input")?.value ||
            "",
        };
        barjaktarPoljaDiv
          .querySelectorAll(".barjaktar-ime-input")
          .forEach((inp, idx) => {
            ulazPoljaCache.barjaktar["ime_" + idx] = inp.value;
          });
      }

      // Promjena broja barjaktara
      barjaktarPoljaDiv
        .querySelector(".barjaktar-select")
        .addEventListener("change", function (e) {
          cacheBarjaktarFields();
          barjaktarPoljaDiv.dataset.broj = parseInt(this.value, 10);
          renderBarjaktarFieldsGlobal();
        });

      // Prikaz/skrivanje internet polja
      if (internetCheckbox && internetFields) {
        // Ukloni stare event listenere
        internetCheckbox.onchange = null;
        internetCheckbox.addEventListener("change", function () {
          cacheBarjaktarFields();
          internetFields.style.display = this.checked ? "" : "none";
        });
        // Prikaži odmah ako je već označen
        internetFields.style.display = internetCheckbox.checked ? "" : "none";
      }
    }

    // Funkcija za generiranje polja za kumove ispod liste
    function renderKumoviFieldsGlobal() {
      const kumoviFieldsId = "kumovi-polja-global";
      let kumoviPoljaDiv = document.getElementById(kumoviFieldsId);
      // Ako ne postoji, umetni ga odmah ispod ulaz-lista, iznad pjesama
      if (!kumoviPoljaDiv) {
        kumoviPoljaDiv = document.createElement("div");
        kumoviPoljaDiv.id = kumoviFieldsId;
        kumoviPoljaDiv.className = "kumovi-polja";
        const ulazOdabirContainer = document.getElementById(
          "ulaz-odabir-container"
        );
        const ulazLista = document.getElementById("ulaz-lista");
        if (ulazOdabirContainer && ulazLista) {
          ulazOdabirContainer.insertBefore(
            kumoviPoljaDiv,
            ulazLista.nextSibling
          );
        }
      }

      // Prikaži samo ako su kumovi označeni
      const kumoviLi = ulazLista.querySelector('li[data-id="kumovi"]');
      if (
        !kumoviLi ||
        !kumoviLi.querySelector('input[type="checkbox"]').checked
      ) {
        if (kumoviPoljaDiv.innerHTML) cacheKumoviFields();
        kumoviPoljaDiv.innerHTML = "";
        kumoviPoljaDiv.style.display = "none";
        return;
      }
      kumoviPoljaDiv.style.display = "";

      const cache = ulazPoljaCache.kumovi || {};
      kumoviPoljaDiv.innerHTML = `
        <div class="kumovi-imena-wrap obrasci-grupa-razmak" style="display:flex;justify-content:center;gap:18px;margin-bottom:10px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <label style="color:#ffe066;font-weight:600;text-align:center;margin-bottom:4px;">Ime kume</label>
            <input type="text" name="kumovi_ime_kume" maxlength="40" placeholder="Ime kume" class="kumovi-ime-kume" style="width:140px;text-align:center;" required>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <label style="color:#ffe066;font-weight:600;text-align:center;margin-bottom:4px;">Ime kuma</label>
            <input type="text" name="kumovi_ime_kuma" maxlength="40" placeholder="Ime kuma" class="kumovi-ime-kuma" style="width:140px;text-align:center;" required>
          </div>
        </div>
        <div class="form-group kumovi-pjesma-wrap">
          <label style="color:#ffe066;">Pjesma za ulazak kumova:</label>
          <input type="text" name="pjesma_kumovi" placeholder="Naziv pjesme" class="kumovi-pjesma-input" style="width:100%;">
          <div class="kumovi-internet-wrap" style="margin-top:8px;">
            <label style="display:flex;align-items:center;gap:7px;font-size:1.01rem;color:#ffe066;">
              <input type="checkbox" id="kumovi-internet" name="kumovi-internet" style="width:18px;height:18px;accent-color:#ffe066;">
              Link s YouTube-a
            </label>
          </div>
          <div id="kumovi-internet-fields" style="display:none;margin-top:8px;">
            <input type="url" name="kumovi_youtube" class="kumovi-youtube-input" placeholder="YouTube link" style="width:100%;margin-bottom:7px;">
            <input type="text" name="kumovi_napomena" class="kumovi-napomena-input" placeholder="Dodatne napomene (opcionalno)" style="width:100%;">
          </div>
        </div>
      `;
      kumoviPoljaDiv.querySelector(".kumovi-ime-kuma").value =
        cache.imeKuma || "";
      kumoviPoljaDiv.querySelector(".kumovi-ime-kume").value =
        cache.imeKume || "";
      kumoviPoljaDiv.querySelector(".kumovi-pjesma-input").value =
        cache.pjesma || "";
      const internetCheckbox = kumoviPoljaDiv.querySelector("#kumovi-internet");
      if (internetCheckbox) internetCheckbox.checked = !!cache.internet;
      const internetFields = kumoviPoljaDiv.querySelector(
        "#kumovi-internet-fields"
      );
      if (internetFields)
        internetFields.style.display = cache.internet ? "" : "none";
      if (cache.internet) {
        kumoviPoljaDiv.querySelector(".kumovi-youtube-input").value =
          cache.yt || "";
        kumoviPoljaDiv.querySelector(".kumovi-napomena-input").value =
          cache.napomena || "";
      }

      kumoviPoljaDiv.querySelectorAll("input").forEach((el) => {
        el.addEventListener("input", cacheKumoviFields);
        el.addEventListener("change", cacheKumoviFields);
      });
      function cacheKumoviFields() {
        ulazPoljaCache.kumovi = {
          imeKuma:
            kumoviPoljaDiv.querySelector(".kumovi-ime-kuma")?.value || "",
          imeKume:
            kumoviPoljaDiv.querySelector(".kumovi-ime-kume")?.value || "",
          pjesma:
            kumoviPoljaDiv.querySelector(".kumovi-pjesma-input")?.value || "",
          internet:
            kumoviPoljaDiv.querySelector("#kumovi-internet")?.checked || false,
          yt:
            kumoviPoljaDiv.querySelector(".kumovi-youtube-input")?.value || "",
          napomena:
            kumoviPoljaDiv.querySelector(".kumovi-napomena-input")?.value || "",
        };
      }
      if (internetCheckbox && internetFields) {
        // Ukloni stare event listenere
        internetCheckbox.onchange = null;
        internetCheckbox.addEventListener("change", function () {
          cacheKumoviFields();
          internetFields.style.display = this.checked ? "" : "none";
        });
        // Prikaži odmah ako je već označen
        internetFields.style.display = internetCheckbox.checked ? "" : "none";
      }
    }

    // Funkcija za generiranje polja za "drugi" ispod liste
    function renderDrugiFieldsGlobal() {
      const drugiFieldsId = "drugi-polja-global";
      let drugiPoljaDiv = document.getElementById(drugiFieldsId);
      // Ako ne postoji, umetni ga odmah ispod ulaz-lista, iznad pjesama
      if (!drugiPoljaDiv) {
        drugiPoljaDiv = document.createElement("div");
        drugiPoljaDiv.id = drugiFieldsId;
        drugiPoljaDiv.className = "drugi-polja";
        const ulazOdabirContainer = document.getElementById(
          "ulaz-odabir-container"
        );
        const ulazLista = document.getElementById("ulaz-lista");
        if (ulazOdabirContainer && ulazLista) {
          ulazOdabirContainer.insertBefore(
            drugiPoljaDiv,
            ulazLista.nextSibling
          );
        }
      }

      // Prikaži samo ako je "drugi" označen
      const drugiLi = ulazLista.querySelector('li[data-id="drugi"]');
      if (
        !drugiLi ||
        !drugiLi.querySelector('input[type="checkbox"]').checked
      ) {
        if (drugiPoljaDiv.innerHTML) cacheDrugiFields();
        drugiPoljaDiv.innerHTML = "";
        drugiPoljaDiv.style.display = "none";
        return;
      }
      drugiPoljaDiv.style.display = "";

      const cache = ulazPoljaCache.drugi || {};
      drugiPoljaDiv.innerHTML = `
        <div class="form-group drugi-pjesma-wrap obrasci-grupa-razmak">
          <label style="color:#ffe066;">Drugi (navedite):</label>
          <input type="text" name="drugi_naziv" placeholder="Npr. roditelji, djeveruše..." class="drugi-naziv-input" style="margin-bottom:6px; width:100%;">
          <label style="color:#ffe066;">Pjesma za ulazak:</label>
          <input type="text" name="pjesma_drugi" placeholder="Naziv pjesme" class="drugi-pjesma-input" style="width:100%;">
          <div class="drugi-internet-wrap" style="margin-top:8px;">
            <label style="display:flex;align-items:center;gap:7px;font-size:1.01rem;color:#ffe066;">
              <input type="checkbox" id="drugi-internet" name="drugi-internet" style="width:18px;height:18px;accent-color:#ffe066;">
              Link s YouTube-a
            </label>
          </div>
          <div id="drugi-internet-fields" style="display:none;margin-top:8px;">
            <input type="url" name="drugi_youtube" class="drugi-youtube-input" placeholder="YouTube link" style="width:100%;margin-bottom:7px;">
            <input type="text" name="drugi_napomena" class="drugi-napomena-input" placeholder="Dodatne napomene (opcionalno)" style="width:100%;">
          </div>
        </div>
      `;

      drugiPoljaDiv.querySelector(".drugi-naziv-input").value =
        cache.naziv || "";
      drugiPoljaDiv.querySelector(".drugi-pjesma-input").value =
        cache.pjesma || "";
      const internetCheckbox = drugiPoljaDiv.querySelector("#drugi-internet");
      if (internetCheckbox) internetCheckbox.checked = !!cache.internet;
      const internetFields = drugiPoljaDiv.querySelector(
        "#drugi-internet-fields"
      );
      if (internetFields)
        internetFields.style.display = cache.internet ? "" : "none";
      if (cache.internet) {
        drugiPoljaDiv.querySelector(".drugi-youtube-input").value =
          cache.yt || "";
        drugiPoljaDiv.querySelector(".drugi-napomena-input").value =
          cache.napomena || "";
      }

      drugiPoljaDiv.querySelectorAll("input").forEach((el) => {
        el.addEventListener("input", cacheDrugiFields);
        el.addEventListener("change", cacheDrugiFields);
      });
      function cacheDrugiFields() {
        ulazPoljaCache.drugi = {
          naziv: drugiPoljaDiv.querySelector(".drugi-naziv-input")?.value || "",
          pjesma:
            drugiPoljaDiv.querySelector(".drugi-pjesma-input")?.value || "",
          internet:
            drugiPoljaDiv.querySelector("#drugi-internet")?.checked || false,
          yt: drugiPoljaDiv.querySelector(".drugi-youtube-input")?.value || "",
          napomena:
            drugiPoljaDiv.querySelector(".drugi-napomena-input")?.value || "",
        };
      }
      if (internetCheckbox && internetFields) {
        // Ukloni stare event listenere
        internetCheckbox.onchange = null;
        internetCheckbox.addEventListener("change", function () {
          cacheDrugiFields();
          internetFields.style.display = this.checked ? "" : "none";
        });
        // Prikaži odmah ako je već označen
        internetFields.style.display = internetCheckbox.checked ? "" : "none";
      }
    }

    // Funkcija za generiranje polja za mladence ispod liste
    function renderMladenciFieldsGlobal() {
      const mladenciFieldsId = "mladenci-polja-global";
      let mladenciPoljaDiv = document.getElementById(mladenciFieldsId);
      if (!mladenciPoljaDiv) {
        mladenciPoljaDiv = document.createElement("div");
        mladenciPoljaDiv.id = mladenciFieldsId;
        mladenciPoljaDiv.className = "mladenci-polja";
        const ulazOdabirContainer = document.getElementById(
          "ulaz-odabir-container"
        );
        const ulazLista = document.getElementById("ulaz-lista");
        if (ulazOdabirContainer && ulazLista) {
          ulazOdabirContainer.insertBefore(
            mladenciPoljaDiv,
            ulazLista.nextSibling
          );
        }
      }

      // Prikaži samo ako su mladenci označeni
      const mladenciLi = ulazLista.querySelector('li[data-id="mladenci"]');
      if (
        !mladenciLi ||
        !mladenciLi.querySelector('input[type="checkbox"]').checked
      ) {
        if (mladenciPoljaDiv.innerHTML) cacheMladenciFields();
        mladenciPoljaDiv.innerHTML = "";
        mladenciPoljaDiv.style.display = "none";
        return;
      }
      mladenciPoljaDiv.style.display = "";

      const cache = ulazPoljaCache.mladenci || {};
      mladenciPoljaDiv.innerHTML = `
        <div class="mladenci-imena-wrap obrasci-grupa-razmak" style="display:flex;justify-content:center;gap:18px;margin-bottom:10px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <label style="color:#ffe066;font-weight:600;text-align:center;margin-bottom:4px;">Ime mlade</label>
            <input type="text" name="mladenci_ime_mlade" maxlength="40" placeholder="Ime mlade" class="mladenci-ime-mlada" style="width:140px;text-align:center;">
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <label style="color:#ffe066;font-weight:600;text-align:center;margin-bottom:4px;">Ime mladoženje</label>
            <input type="text" name="mladenci_ime_mladozenja" maxlength="40" placeholder="Ime mladoženje" class="mladenci-ime-mladozenja" style="width:140px;text-align:center;">
          </div>
        </div>
        <div class="form-group mladenci-pjesma-wrap">
          <label style="color:#ffe066;">Pjesma za ulazak mladenaca:</label>
          <input type="text" name="pjesma_mladenci" placeholder="Naziv pjesme" class="mladenci-pjesma-input" style="width:100%;">
          <div class="mladenci-internet-wrap" style="margin-top:8px;">
            <label style="display:flex;align-items:center;gap:7px;font-size:1.01rem;color:#ffe066;">
              <input type="checkbox" id="mladenci-internet" name="mladenci-internet" style="width:18px;height:18px;accent-color:#ffe066;">
              Link s YouTube-a
            </label>
          </div>
          <div id="mladenci-internet-fields" style="display:none;margin-top:8px;">
            <input type="url" name="mladenci_youtube" class="mladenci-youtube-input" placeholder="YouTube link" style="width:100%;margin-bottom:7px;">
            <input type="text" name="mladenci_napomena" class="mladenci-napomena-input" placeholder="Dodatne napomene (opcionalno)" style="width:100%;">
          </div>
        </div>
      `;

      // Ispravno postavi vrijednosti iz cachea (bez dijakritika!)
      mladenciPoljaDiv.querySelector(".mladenci-ime-mladozenja").value =
        cache.imeMladozenja || "";
      mladenciPoljaDiv.querySelector(".mladenci-ime-mlada").value =
        cache.imeMlada || "";
      mladenciPoljaDiv.querySelector(".mladenci-pjesma-input").value =
        cache.pjesma || "";
      const internetCheckbox =
        mladenciPoljaDiv.querySelector("#mladenci-internet");
      if (internetCheckbox) internetCheckbox.checked = !!cache.internet;
      const internetFields = mladenciPoljaDiv.querySelector(
        "#mladenci-internet-fields"
      );
      if (internetFields)
        internetFields.style.display = cache.internet ? "" : "none";
      if (cache.internet) {
        mladenciPoljaDiv.querySelector(".mladenci-youtube-input").value =
          cache.yt || "";
        mladenciPoljaDiv.querySelector(".mladenci-napomena-input").value =
          cache.napomena || "";
      }

      mladenciPoljaDiv.querySelectorAll("input").forEach((el) => {
        el.addEventListener("input", cacheMladenciFields);
        el.addEventListener("change", cacheMladenciFields);
      });
      function cacheMladenciFields() {
        ulazPoljaCache.mladenci = {
          imeMladozenja:
            mladenciPoljaDiv.querySelector(".mladenci-ime-mladozenja")?.value ||
            "",
          imeMlada:
            mladenciPoljaDiv.querySelector(".mladenci-ime-mlada")?.value || "",
          pjesma:
            mladenciPoljaDiv.querySelector(".mladenci-pjesma-input")?.value ||
            "",
          internet:
            mladenciPoljaDiv.querySelector("#mladenci-internet")?.checked ||
            false,
          yt:
            mladenciPoljaDiv.querySelector(".mladenci-youtube-input")?.value ||
            "",
          napomena:
            mladenciPoljaDiv.querySelector(".mladenci-napomena-input")?.value ||
            "",
        };
      }
      if (internetCheckbox && internetFields) {
        // Ukloni stare event listenere
        internetCheckbox.onchange = null;
        internetCheckbox.addEventListener("change", function () {
          cacheMladenciFields();
          internetFields.style.display = this.checked ? "" : "none";
        });
        // Prikaži odmah ako je već označen
        internetFields.style.display = internetCheckbox.checked ? "" : "none";
      }
    }

    // Funkcija za generiranje polja za sve članove ispod liste
    function renderGlobalPjesmeFields() {
      // Dohvati sve označene opcije i njihov redoslijed
      const checkedLis = Array.from(ulazLista.querySelectorAll("li")).filter(
        (li) => li.querySelector("input[type=checkbox]").checked
      );

      let html = "";
      const poljaDivs = [];

      checkedLis.forEach((li) => {
        if (li.dataset.id === "barjaktar") {
          poljaDivs.push({ type: "barjaktar" });
        } else if (li.dataset.id === "kumovi") {
          poljaDivs.push({ type: "kumovi" });
        } else if (li.dataset.id === "drugi") {
          poljaDivs.push({ type: "drugi" });
        } else if (li.dataset.id === "mladenci") {
          poljaDivs.push({ type: "mladenci" });
        } else {
          // fallback za buduće opcije
        }
      });

      // Prvo ukloni postojeće polja za sve članove (ako postoje)
      [
        "barjaktar-polja-global",
        "kumovi-polja-global",
        "drugi-polja-global",
        "mladenci-polja-global",
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });

      // Renderiraj i umetni polja za sve članove u pravom redoslijedu
      poljaDivs.forEach((item) => {
        if (item.type === "barjaktar") {
          renderBarjaktarFieldsGlobal();
          const barjaktarDiv = document.getElementById(
            "barjaktar-polja-global"
          );
          if (barjaktarDiv) globalPjesmeContainer.appendChild(barjaktarDiv);
        }
        if (item.type === "kumovi") {
          renderKumoviFieldsGlobal();
          const kumoviDiv = document.getElementById("kumovi-polja-global");
          if (kumoviDiv) globalPjesmeContainer.appendChild(kumoviDiv);
        }
        if (item.type === "drugi") {
          renderDrugiFieldsGlobal();
          const drugiDiv = document.getElementById("drugi-polja-global");
          if (drugiDiv) globalPjesmeContainer.appendChild(drugiDiv);
        }
        if (item.type === "mladenci") {
          renderMladenciFieldsGlobal();
          const mladenciDiv = document.getElementById("mladenci-polja-global");
          if (mladenciDiv) globalPjesmeContainer.appendChild(mladenciDiv);
        }
      });
    }

    // Pozovi kad se promijeni checkbox ili select
    ulazLista.addEventListener("change", function (e) {
      if (
        e.target.type === "checkbox" ||
        e.target.classList.contains("barjaktar-select")
      ) {
        renderGlobalPjesmeFields();
      }
    });

    // Prikaži polja odmah ako je nešto već označeno (npr. kod reload-a)
    renderGlobalPjesmeFields();

    // Ukloni stare strelice ako postoje (za čistoću DOM-a)
    ulazLista.querySelectorAll(".ulaz-controls").forEach((el) => el.remove());
  }
});
