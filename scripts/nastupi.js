// Lista termina
const nastupi = [
  { datum: "2025-06-14", grad: "Čapljina", sala: "President" },
  { datum: "2025-06-20", grad: "Grude", sala: "Otok" },
  { datum: "2025-06-21", grad: "Sretnice", sala: "Afrodita" },
  { datum: "2025-07-28", grad: "Ljubuški", sala: "Antonela" },
  { datum: "2025-07-05", grad: "Međugorje", sala: "Etno selo" },
  { datum: "2025-07-11", grad: "Sretnice", sala: "Afrodita" },
  { datum: "2025-07-12", grad: "Grude", sala: "Otok" },
  { datum: "2025-07-19", grad: "Gabela", sala: "Lav" },
  { datum: "2025-07-20", grad: "Posušje", sala: "Viktorija" },
  { datum: "2025-07-25", grad: "Vitez", sala: "SS???" },
  { datum: "2025-08-02", grad: "Čapljina", sala: "Storia" },
  { datum: "2025-08-09", grad: "Čitluk", sala: "Hotel Brotnjo" },
  { datum: "2025-08-10", grad: "Međugorje", sala: "Etno selo" },
  { datum: "2025-08-15", grad: "Čapljina", sala: "Storia na otvorenom" },
  { datum: "2025-08-16", grad: "Grude", sala: "Otok" },
  { datum: "2025-08-23", grad: "Gabela", sala: "Lav" },
  { datum: "2025-08-24", grad: "Međugorje", sala: "Etno selo" },
  { datum: "2025-08-30", grad: "Međugorje", sala: "Dodig bazeni" },
  { datum: "2025-09-06", grad: "Opatija", sala: "SS???" },
  { datum: "2025-09-13", grad: "Neum", sala: "SS???" },
  { datum: "2025-09-19", grad: "Gabela", sala: "Lav" },
  { datum: "2025-09-20", grad: "Čule", sala: "Luna" },
  { datum: "2025-09-21", grad: "Gabela", sala: "Lav" },
  { datum: "2025-09-26", grad: "Mostar", sala: "Da da" },
  { datum: "2025-09-27", grad: "Mostar", sala: "Ruža" },
  { datum: "2025-10-04", grad: "Mostar", sala: "Venera" },
  { datum: "2025-10-05", grad: "Gabela polje", sala: "Dalmata" },
  { datum: "2025-10-11", grad: "Ljubuški", sala: "Bigeste" },
  { datum: "2025-10-12", grad: "Gabela", sala: "Lav" },
  { datum: "2025-10-18", grad: "Otok Pag", sala: "SS???" },
];

// Funkcija za formatiranje datuma u "14. lipnja 2025."
function formatirajDatum(isoDatum) {
  const mjeseci = [
    "siječnja",
    "veljače",
    "ožujka",
    "travnja",
    "svibnja",
    "lipnja",
    "srpnja",
    "kolovoza",
    "rujna",
    "listopada",
    "studenoga",
    "prosinca",
  ];
  const d = new Date(isoDatum);
  const dan = d.getDate();
  const mjesec = mjeseci[d.getMonth()];
  const godina = d.getFullYear();
  return `${dan}. ${mjesec} ${godina}.`;
}

// Dohvati današnji datum bez vremena
const danas = new Date();
danas.setHours(0, 0, 0, 0);

// Filtriraj i sortiraj nadolazeće nastupe
const buduciNastupi = nastupi
  .filter((n) => new Date(n.datum) >= danas)
  .sort((a, b) => new Date(a.datum) - new Date(b.datum));

// Dohvati HTML element
const nastupiSekcija = document.querySelector(".js-nastupi");

// Ako nema nadolazećih nastupa
if (buduciNastupi.length === 0) {
  nastupiSekcija.innerHTML =
    '<p class="nastupi-prazno">Trenutno nema zakazanih nastupa.</p>';
} else {
  // Kreiraj naslov
  nastupiSekcija.innerHTML =
    '<h2 class="nastupi-naslov">Nadolazeći nastupi</h2>';

  // Kreiraj container i listu
  const container = document.createElement("div");
  container.className = "nastupi-container";

  const lista = document.createElement("ul");
  lista.className = "nastupi-lista";

  // Dodaj svaki nastup kao karticu s separatorom
  buduciNastupi.forEach((n) => {
    const item = document.createElement("li");
    item.className = "nastup";

    item.innerHTML = `
      <span class="datum">${formatirajDatum(n.datum)}</span>
      <span class="separator"></span>
      <span class="mjesto">${n.sala}, ${n.grad}</span>
    `;

    lista.appendChild(item);
  });

  container.appendChild(lista);
  nastupiSekcija.appendChild(container);
}
