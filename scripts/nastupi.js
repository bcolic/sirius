// Lista termina
const nastupi = [
  { datum: "2025-06-14", grad: "Čapljina", sala: "President" },
  { datum: "2025-06-20", grad: "Grude", sala: "Otok" },
  { datum: "2025-06-21", grad: "Sretnice", sala: "Afrodita" },
  { datum: "2025-06-22", grad: "Ljubuški", sala: "Antonela" },
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
