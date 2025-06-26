// Firebase konfiguracija
const firebaseConfig = window.firebaseConfig || {
  apiKey: "AIzaSyCpxo1ci8LP9QTs35cmbWxkrmu--q7xJPE",
  authDomain: "sirius-obrazac.firebaseapp.com",
  projectId: "sirius-obrazac",
  storageBucket: "sirius-obrazac.appspot.com",
  messagingSenderId: "42072404300",
  appId: "1:42072404300:web:f23fe3501757efa90c5fe9",
  measurementId: "G-HWXG3PGMMH",
};

// Inicijalizacija Firebase samo ako već nije inicijaliziran
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

// Funkcija za formatiranje datuma u dd.mm.gggg
function formatirajDatum(datumString) {
  if (!datumString) return "";
  // Očekuje format d.m.Y. ili dd.mm.YYYY. ili dd.mm.YYYY.
  // Parsiraj ručno i vrati u obliku 01.07.2025
  const parts = datumString.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!parts) return datumString;
  const dan = parts[1].padStart(2, "0");
  const mj = parts[2].padStart(2, "0");
  const god = parts[3];
  return `${dan}.${mj}.${god}`;
}

function karticaHTML(data, id, proslo) {
  // Zamjena redoslijeda: prvo mlada, pa mladoženja
  const imena =
    data.mlada && data.mladozenja
      ? `${data.mlada} & ${data.mladozenja}`
      : data.mlada || data.mladozenja || "";
  return `<div class="obrasci-kartica${
    proslo ? " proslo" : ""
  }" data-id="${id}">
    <span class="obrasci-datum">${
      data.datum ? formatirajDatum(data.datum) : ""
    }</span>
    <span class="obrasci-imena">${imena}</span>
  </div>`;
}

// Prikaz thumbnaila (kartica) za svaki obrazac
function renderObrazacThumbnail(data) {
  const datum = formatirajDatum(data.datum);
  // Zamjena redoslijeda: prvo mlada, pa mladoženja
  const imena =
    data.mlada && data.mladozenja
      ? `${data.mlada} & ${data.mladozenja}`
      : data.mlada || data.mladozenja || "";
  return `
    <div class="obrazac-thumbnail">
      <div class="obrazac-thumbnail-header">
        <span class="obrazac-thumbnail-datum">${datum}</span>
        <span class="obrazac-thumbnail-imena">${imena}</span>
      </div>
      <!-- ...existing code... -->
    </div>
  `;
}

// Funkcija za dohvat naziva pjesme s YouTubea
async function getYoutubeTitle(link) {
  try {
    if (!link) return "";
    const url = new URL(link);
    if (
      !url.hostname.includes("youtube.com") &&
      !url.hostname.includes("youtu.be")
    )
      return "";

    let videoId = "";
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get("v");
    }
    if (!videoId) return "";

    const resp = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    if (!resp.ok) return "";
    const data = await resp.json();
    return data.title || "";
  } catch {
    return "";
  }
}

function ytLinkHtml(link, naziv) {
  if (!link) return "";
  // Ako postoji naziv, koristi ga, inače koristi link
  return `<a href="${link}" class="obrasci-link" target="_blank" rel="noopener">${
    naziv || link
  }</a>`;
}

async function modalHTMLasync(data, docId, forExport = false) {
  const ytBarjaktar = await getYoutubeTitle(data["barjaktar-link"]);
  const ytKumovi = await getYoutubeTitle(data["kumovi-link"]);
  const ytMladenci = await getYoutubeTitle(data["mladenci-link"]);
  const ytPrviPles = await getYoutubeTitle(data["prvi-ples-link"]);
  const ytDrugiPles = await getYoutubeTitle(data["drugi-ples-link"]);
  const ytBuket = await getYoutubeTitle(data["buket-link"]);
  const ytKravata = await getYoutubeTitle(data["kravata-link"]);

  // Grad i sala u istom redu, odmah na početku
  const grad = data.grad || "";
  const sala = data.sala || "";

  function polje(label, value) {
    if (!value) return "";
    return `<div class="obrasci-polje"><span class="obrasci-label">${label}</span> <span class="obrasci-polje-vrijednost">${value}</span></div>`;
  }

  // --- Barjaktar sekcija ---
  let barjaktarHtml = "";
  if (data["barjaktar-imena"]) {
    barjaktarHtml += `<div class="obrasci-polje"><span class="obrasci-label">Ime barjaktara:</span> <span class='obrasci-polje-vrijednost'>${data["barjaktar-imena"]}</span></div>`;
    barjaktarHtml += polje(
      "Pjesma za ulazak barjaktara:",
      data["barjaktar-pjesma"]
    );
    if (data["barjaktar-link"]) {
      const ytBarjaktar = await getYoutubeTitle(data["barjaktar-link"]);
      barjaktarHtml += polje(
        "YouTube link:",
        ytLinkHtml(data["barjaktar-link"], ytBarjaktar)
      );
    }
    barjaktarHtml += polje(
      "Napomena za barjaktara:",
      data["barjaktar-napomena"]
    );
  }

  // --- Kumovi sekcija ---
  let kumoviHtml = "";
  if (data["kumovi-ime-kume"] || data["kumovi-ime-kuma"]) {
    let imenaKumova = [data["kumovi-ime-kume"], data["kumovi-ime-kuma"]]
      .filter(Boolean)
      .join(data["kumovi-ime-kume"] && data["kumovi-ime-kuma"] ? " i " : "");
    kumoviHtml += `<div class="obrasci-polje"><span class="obrasci-label">Imena kumova:</span> <span class='obrasci-polje-vrijednost'>${imenaKumova}</span></div>`;
    kumoviHtml += polje("Pjesma za ulazak kumova:", data["kumovi-pjesma"]);
    if (data["kumovi-link"]) {
      const ytKumovi = await getYoutubeTitle(data["kumovi-link"]);
      kumoviHtml += polje(
        "YouTube link:",
        ytLinkHtml(data["kumovi-link"], ytKumovi)
      );
    }
    kumoviHtml += polje("Napomena za kumove:", data["kumovi-napomena"]);
  }

  // --- Drugi sekcija ---
  let drugiHtml = "";
  if (data["drugi-naziv"]) {
    drugiHtml += `<div style="margin-top:1.5em;margin-bottom:0.3em;font-weight:600;color:#ffe066;">Drugi:</div>`;
    drugiHtml += polje("Tko ulazi:", data["drugi-naziv"]);
    drugiHtml += polje("Pjesma za ulazak:", data["drugi-pjesma"]);
    if (data["drugi-link"]) {
      const ytDrugi = await getYoutubeTitle(data["drugi-link"]);
      drugiHtml += polje(
        "YouTube link:",
        ytLinkHtml(data["drugi-link"], ytDrugi)
      );
    }
    drugiHtml += polje("Napomena:", data["drugi-napomena"]);
  }

  // --- Mladenci sekcija ---
  let mladenciHtml = "";
  let mladaIme = data["mlada"] || "";
  let mladozenjaIme = data["mladozenja"] || "";
  if (mladaIme || mladozenjaIme) {
    function prvoIme(imePrezime) {
      return imePrezime ? imePrezime.split(" ")[0] : "";
    }
    let imenaMladenci = "";
    if (mladaIme && mladozenjaIme) {
      imenaMladenci = [prvoIme(mladaIme), prvoIme(mladozenjaIme)].join(" i ");
    } else if (mladaIme) {
      imenaMladenci = mladaIme;
    } else if (mladozenjaIme) {
      imenaMladenci = mladozenjaIme;
    }
    mladenciHtml += `<div class="obrasci-polje"><span class="obrasci-label">Imena mladenaca:</span> <span class='obrasci-polje-vrijednost'>${imenaMladenci}</span></div>`;
    mladenciHtml += polje(
      "Pjesma za ulazak mladenaca:",
      data["mladenci-pjesma"]
    );
    if (data["mladenci-link"]) {
      const ytMladenci = await getYoutubeTitle(data["mladenci-link"]);
      mladenciHtml += polje(
        "YouTube link:",
        ytLinkHtml(data["mladenci-link"], ytMladenci)
      );
    }
    mladenciHtml += polje("Napomena:", data["mladenci-napomena"]);
  }

  // --- Glavni prikaz ---
  return `
    <h2>${
      data["mlada"] && data["mladozenja"]
        ? `${data["mlada"]} & ${data["mladozenja"]}`
        : data["mlada"] || data["mladozenja"] || ""
    } (${data["datum"] ? formatirajDatum(data["datum"]) : ""})</h2>
    <div class="obrasci-polje"><span class="obrasci-label">Grad:</span> <span class="obrasci-polje-vrijednost">${grad}</span> &nbsp; <span class="obrasci-label">Sala:</span> <span class="obrasci-polje-vrijednost">${sala}</span></div>
    ${polje("Vrijeme ulaza u salu:", data["vrijeme-ulaza"])}
    ${barjaktarHtml}
    ${kumoviHtml}
    ${drugiHtml}
    ${mladenciHtml}
    <div style="margin-top:1.5em"></div>
    ${polje("Pjesma za prvi ples:", data["prvi-ples"])}
    ${
      data["prvi-ples-link"]
        ? polje(
            "YouTube link:",
            ytLinkHtml(
              data["prvi-ples-link"],
              await getYoutubeTitle(data["prvi-ples-link"])
            )
          )
        : ""
    }
    ${polje("Pjesma za drugi ples:", data["drugi-ples"])}
    ${
      data["drugi-ples-link"]
        ? polje(
            "YouTube link:",
            ytLinkHtml(
              data["drugi-ples-link"],
              await getYoutubeTitle(data["drugi-ples-link"])
            )
          )
        : ""
    }
    ${polje("Molitva i tko moli:", data["molitva"])}
    ${polje("Hrvatska himna:", data["hrvatska-himna"])}
    ${polje("Himna Herceg-Bosne:", data["hb-himna"])}
    ${polje("Torta:", data["torta"])}
    ${polje("Pjesma za bacanje buketa:", data["buket-pjesma"])}
    ${
      data["buket-link"]
        ? polje(
            "YouTube link:",
            ytLinkHtml(
              data["buket-link"],
              await getYoutubeTitle(data["buket-link"])
            )
          )
        : ""
    }
    ${polje("Pjesma za bacanje kravate:", data["kravata-pjesma"])}
    ${
      data["kravata-link"]
        ? polje(
            "YouTube link:",
            ytLinkHtml(
              data["kravata-link"],
              await getYoutubeTitle(data["kravata-link"])
            )
          )
        : ""
    }
    ${polje("DJ:", data["dj"])}
    ${polje("Žanrovi:", data["zanrovi"])}
    ${polje("Dodatne pjesme:", data["zeljene-pjesme"])}
    ${polje("Pjesme koje ne žele:", data["nezeljene-pjesme"])}
    ${polje("Imaju li roditelje:", data["roditelji"])}
    ${polje("Dogovorena cijena:", data["cijena"])}
    ${polje("Kapara:", data["kapara"])}
    ${polje("Napomena:", data["napomena"])}
    ${
      !forExport
        ? `
    <div class="obrasci-modal-actions">
      <button id="obrasci-delete-btn" class="obrasci-modal-btn" data-id="${docId}">Obriši obrazac</button>
      <button id="obrasci-export-pdf" class="obrasci-modal-btn">Spremi u PDF</button>
    </div>
    `
        : ""
    }
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const lista = document.getElementById("obrasci-lista");
  const modal = document.getElementById("obrasci-modal");
  // const modalContent = document.getElementById("obrasci-modal-content");
  // Nova linija (dodati ispod i zakomentirati staru)
  const modalContent = document.getElementById("obrasci-scroll-container");
  const modalClose = document.getElementById("obrasci-modal-close");

  if (!lista) return;

  lista.innerHTML = '<div class="obrasci-loading">Učitavanje...</div>';

  // Dohvat podataka iz Firestore
  firestore
    .collection("mladenci-obrasci")
    .orderBy("datum", "asc")
    .get()
    .then(async (snapshot) => {
      if (snapshot.empty) {
        lista.innerHTML =
          '<div class="obrasci-loading">Nema ispunjenih obrazaca.</div>';
        return;
      }

      let html = "";
      const danas = new Date();

      // Generiranje kartica
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Za provjeru prošlih datuma koristi parsanje stringa
        let datumObj = null;
        const parts = data.datum
          ? data.datum.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/)
          : null;
        if (parts) {
          datumObj = new Date(
            `${parts[3]}-${parts[2].padStart(2, "0")}-${parts[1].padStart(
              2,
              "0"
            )}`
          );
        }
        const proslo =
          datumObj && datumObj < new Date(new Date().setHours(0, 0, 0, 0));
        html += karticaHTML(data, doc.id, proslo);
      });
      lista.innerHTML = html;

      // Event listeneri za kartice
      lista.querySelectorAll(".obrasci-kartica").forEach((kartica) => {
        kartica.addEventListener("click", async function () {
          const id = this.getAttribute("data-id");
          const docData = snapshot.docs.find((d) => d.id === id);
          if (docData) {
            modalContent.innerHTML = await modalHTMLasync(docData.data(), id);
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
            document.querySelector(".header").style.display = "none";

            // Brisanje obrasca
            const deleteBtn = document.getElementById("obrasci-delete-btn");
            if (deleteBtn) {
              deleteBtn.onclick = function () {
                if (
                  confirm("Jeste li sigurni da želite obrisati ovaj obrazac?")
                ) {
                  firestore
                    .collection("mladenci-obrasci")
                    .doc(id)
                    .delete()
                    .then(() => {
                      modal.style.display = "none";
                      document.body.style.overflow = "";
                      document.querySelector(".header").style.display = "";
                      location.reload();
                    });
                }
              };
            }

            // Export u PDF
            const exportPdfBtn = document.getElementById("obrasci-export-pdf");
            if (exportPdfBtn) {
              exportPdfBtn.onclick = async function () {
                const exportHtml = `
                  <html>
                  <head>
                    <title>Obrazac</title>
                    <style>
                      body { background: #232526; color: #ffe066; font-family: Arial, sans-serif; padding: 2em; }
                      .obrasci-label { font-weight: 600; color: #ffe066; }
                      .obrasci-polje { margin-bottom: 0.5em; color: #fff; }
                      .obrasci-polje .obrasci-label { color: #ffe066; }
                      h2 { color: #ffe066; }
                      a { color: #ffe066; text-decoration: underline; }
                      .obrasci-ime-vrijednost {
                        display: inline-block;
                        color: #fff;
                        border-radius: 8px;
                        padding: 0.18em 0.7em;
                        font-size: 1.08rem;
                        font-weight: 600;
                      }
                      .obrasci-polje span:not(.obrasci-label),
                      .obrasci-polje .obrasci-ime-vrijednost,
                      .obrasci-polje .obrasci-polje-vrijednost {
                        color: #232526;
                        font-size: 1.08rem;
                        font-weight: 600;
                      }
                      .obrasci-polje-vrijednost {
                        color: #fff !important;
                        font-size: 1.08rem;
                        font-weight: 600;
                      }
                    </style>
                  </head>
                  <body>
                    ${await modalHTMLasync(docData.data(), id, true)}
                  </body>
                  </html>
                `;
                const printWindow = window.open("", "_blank");
                printWindow.document.write(exportHtml);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
              };
            }
          }
        });
      });
    })
    .catch(() => {
      lista.innerHTML =
        '<div class="obrasci-loading">Greška pri dohvaćanju podataka.</div>';
    });

  // Event listeneri za modal
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
      document.querySelector(".header").style.display = "";
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
        document.querySelector(".header").style.display = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        modal.style.display === "flex" &&
        (e.key === "Escape" || e.key === "Esc")
      ) {
        modal.style.display = "none";
        document.body.style.overflow = "";
        document.querySelector(".header").style.display = "";
      }
    });
  }
});
