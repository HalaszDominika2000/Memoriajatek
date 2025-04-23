
// Kartya osztály
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
      this.imgElem.src = this.allapot ? `kepek/${this.fajlnev}` : "kepek/hatter.jpg";
    }
  
    kattintasTrigger() {
      this.divElem.addEventListener("click", () => {
        const esemeny = new CustomEvent("fordit", { detail: this });
        window.dispatchEvent(esemeny);
      });
    }
  }
  
  // JatekTer osztály
  class JatekTer {
    constructor(kartyaLista) {
      this.kartyaLista = kartyaLista;
      this.kivalasztottKartyaLista = [];
      this.parokSzama = kartyaLista.length / 2; /* 20 pár */
      this.init();
    }
  
    init() {
      const jatekTerElem = document.getElementById("jatekTer");
      jatekTerElem.innerHTML = "";
      this.kever();
  
      this.kartyaObjLista = this.kartyaLista.map(kep => new Kartya(kep, false, jatekTerElem));
  
      window.addEventListener("fordit", (e) => this.kartyaKattintas(e.detail));
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
        /*Egyezés: eltűnés animációval*/
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
        /*Nem egyezik: visszafordítjuk*/ /* Kommentet visual studióban így is írhatunk //  */
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
  
  
  export function inditJatekot() {
    const Kepek = [];
  
    // 20 különböző kép, mindegyikből 2 db → 40 kártya
    for (let i = 1; i <= 20; i++) {
      Kepek.push(`${i}.jpg`);
      Kepek.push(`${i}.jpg`);
    }
  
    new JatekTer(Kepek);
  }