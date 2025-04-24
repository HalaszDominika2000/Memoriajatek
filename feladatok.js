let ido = 0;
let timerInterval;

// 🕒 időzítő indítása
export function inditIdozito() {
  const idoElem = document.getElementById("ido");
  ido = 0;
  if (timerInterval) clearInterval(timerInterval);
  if (idoElem) {
    idoElem.textContent = ido;
    timerInterval = setInterval(() => {
      ido++;
      idoElem.textContent = ido;
    }, 1000);
  }
}

// 🛑 időzítő törlése
export function torolIdozito() {
  clearInterval(timerInterval);
}

class Kartya {
  constructor(id, allapot, szuloElem) {
    this.fajlnev = id;
    this.allapot = allapot;
    this.blokkolt = false;

    this.divElem = document.createElement('div');
    this.divElem.classList.add('kartya');

    this.imgElem = document.createElement('img');
    this.divElem.appendChild(this.imgElem);
    szuloElem.appendChild(this.divElem);

    this.setLap();
    this.kattintasTrigger();
  }

  setAllapot() {
    this.allapot = !this.allapot;
    this.setLap();
  }

  getFajlnev() {
    return this.fajlnev;
  }

  setLap() {
    this.imgElem.src = this.allapot ? this.fajlnev : "kepek/hatter.jpg";
  }

  kattintasTrigger() {
    this.divElem.addEventListener("click", () => {
      if (!this.blokkolt) {
        const esemeny = new CustomEvent("fordit", { detail: this });
        window.dispatchEvent(esemeny);
      }
    });
  }
}

class JatekTer {
  constructor(kartyaLista) {
    this.kartyaLista = kartyaLista;
    this.kivalasztottKartyaLista = [];
    this.parokSzama = kartyaLista.length / 2;
    this.init();
  }

  init() {
    const jatekTerElem = document.getElementById("jatekTer");
    jatekTerElem.innerHTML = "";
    this.kivalasztottKartyaLista = [];

    this.kever();

    this.kartyaObjLista = this.kartyaLista.map(kep => new Kartya(kep, false, jatekTerElem));

    window.removeEventListener("fordit", this.kattintasKezelo); // duplikált elkerülés
    this.kattintasKezelo = (e) => this.kartyaKattintas(e.detail);
    window.addEventListener("fordit", this.kattintasKezelo);
  }

  kever() {
    this.kartyaLista.sort(() => Math.random() - 0.5);
  }

  kartyaKattintas(kartya) {
    if (kartya.blokkolt || this.kivalasztottKartyaLista.includes(kartya)) return;

    if (this.kivalasztottKartyaLista.length < 2) {
      kartya.setAllapot();
      this.kivalasztottKartyaLista.push(kartya);
    }

    if (this.kivalasztottKartyaLista.length === 2) {
      this.TriggerBlocked();
      setTimeout(() => this.ellenorzes(), 1000);
    }
  }

  ellenorzes() {
    const [kartya1, kartya2] = this.kivalasztottKartyaLista;

    if (kartya1.getFajlnev() === kartya2.getFajlnev()) {
      kartya1.divElem.style.transition = "opacity 0.5s";
      kartya2.divElem.style.transition = "opacity 0.5s";
      kartya1.divElem.style.opacity = "0";
      kartya2.divElem.style.opacity = "0";

      setTimeout(() => {
        kartya1.divElem.style.display = "none";
        kartya2.divElem.style.display = "none";
      }, 500);

      this.parokSzama--;
      if (this.parokSzama === 0) {
        setTimeout(() => alert("🎉 Gratulálok! Megtaláltad az összes párt! 🎉"), 600);
      }
    } else {
      kartya1.setAllapot();
      kartya2.setAllapot();
    }

    this.kivalasztottKartyaLista = [];
    this.TriggerUnBlocked();
  }

  TriggerBlocked() {
    window.dispatchEvent(new Event("gameBlocked"));
  }

  TriggerUnBlocked() {
    window.dispatchEvent(new Event("gameUnBlocked"));
  }
}

// 🕹️ Játék indítása
export function inditJatekot() {
  const kepek = [];
  for (let i = 1; i <= 20; i++) {
    kepek.push(`kepek/kep${i}.jpg`);
    kepek.push(`kepek/kep${i}.jpg`);
  }
  new JatekTer(kepek);
}