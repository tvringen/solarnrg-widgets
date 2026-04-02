(function () {
  if (!window.location.pathname.startsWith('/thuisbatterijen')) return;

  /* ── 1. STIJLEN ─────────────────────────────────────────────────────────── */
  var css = `
    #snrg-kh-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #ffb914; color: #fff;
      font-family: inherit; font-size: 14px; font-weight: 700;
      padding: 10px 20px; border-radius: 20px; border: none;
      cursor: pointer; margin: 0 0 1.5rem; transition: background .15s;
    }
    #snrg-kh-btn:hover { background: #e0a210; }

    #snrg-kh-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,.45); z-index: 9999;
      align-items: center; justify-content: center; padding: 1rem;
    }
    #snrg-kh-overlay.open { display: flex; }

    #snrg-kh-modal {
      background: #fff; border-radius: 10px;
      width: 100%; max-width: 580px; max-height: 90vh;
      overflow-y: auto; box-shadow: 0 8px 40px rgba(0,0,0,.2);
    }

    .kh-topbar {
      background: #111; border-radius: 10px 10px 0 0;
      padding: 10px 16px; display: flex; align-items: center; gap: 10px;
      position: sticky; top: 0; z-index: 1;
    }
    .kh-topbar-dot { width: 8px; height: 8px; border-radius: 50%; background: #ffb914; flex-shrink: 0; }
    .kh-topbar-label { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #fff; }
    .kh-topbar-step { margin-left: auto; font-size: 11px; color: rgba(255,255,255,.4); }
    .kh-topbar-close {
      background: none; border: none; color: rgba(255,255,255,.5);
      font-size: 18px; cursor: pointer; padding: 0; line-height: 1;
      margin-left: 8px;
    }
    .kh-topbar-close:hover { color: #fff; }

    .kh-progress { height: 3px; background: #ddd5cc; display: flex; gap: 2px; }
    .kh-bar { flex: 1; background: #ddd5cc; transition: background .2s; }
    .kh-bar.done { background: #ffb914; }

    .kh-card { padding: 16px 18px 14px; }

    .kh-question { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 3px; line-height: 1.35; }
    .kh-sub { font-size: 12px; color: #888; margin-bottom: 10px; line-height: 1.5; }

    .kh-options { display: grid; gap: 6px; }
    .kh-option {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 13px; border: 1px solid #e2dbd3; border-radius: 6px;
      background: #faf8f5; cursor: pointer; text-align: left; width: 100%;
      font-family: inherit; transition: border-color .12s, background .12s;
    }
    .kh-option:hover { border-color: #ffb914; background: #fffbf2; }
    .kh-kh-icon { font-size: 16px; flex-shrink: 0; }
    .kh-opt-title { display: block; font-size: 13px; font-weight: 600; color: #111; }
    .kh-opt-sub { display: block; font-size: 11px; color: #999; margin-top: 1px; }
    .kh-back { margin-top: 10px; font-size: 11px; color: #bbb; background: none; border: none; cursor: pointer; font-family: inherit; }
    .kh-back:hover { color: #555; }

    .kh-result-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #ffb914; margin-bottom: 3px; }
    .kh-result-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 5px; }
    .kh-result-uitleg { font-size: 12px; color: #777; line-height: 1.5; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #ede8e2; }

    .kh-products { display: grid; gap: 8px; }
    .kh-product { border: 1px solid #e2dbd3; border-radius: 6px; padding: 11px 13px; background: #faf8f5; display: grid; gap: 6px; }
    .kh-product.featured { border-color: #ffb914; background: #fff; }
    .kh-featured-badge { display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 2px 8px; border-radius: 3px; background: #ffb914; color: #fff; margin-bottom: 1px; }
    .kh-product-row1 { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .kh-product-name { font-size: 12px; font-weight: 700; color: #111; line-height: 1.35; }
    .kh-product-price { font-size: 14px; font-weight: 800; color: #111; white-space: nowrap; flex-shrink: 0; }
    .kh-product-desc { font-size: 11px; color: #777; line-height: 1.5; }
    .kh-product-bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
    .kh-tags { display: flex; flex-wrap: wrap; gap: 4px; }
    .kh-tag { font-size: 10px; padding: 2px 7px; border-radius: 3px; border: 1px solid #e2dbd3; color: #888; background: #f5f1ec; white-space: nowrap; }
    .kh-tag.green { border-color: #a8d5a2; color: #276022; background: #eef7ec; }
    .kh-cta { display: inline-flex; align-items: center; gap: 4px; background: #ffb914; color: #fff; font-size: 11px; font-weight: 700; padding: 7px 13px; border-radius: 20px; text-decoration: none; white-space: nowrap; transition: background .12s; }
    .kh-cta:hover { background: #e0a210; }
    .kh-footer { margin-top: 10px; display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #ede8e2; }
    .kh-footer a { font-size: 11px; color: #ffb914; text-decoration: none; font-weight: 600; }
    .kh-footer a:hover { text-decoration: underline; }
    .kh-reset { font-size: 11px; color: #bbb; background: none; border: none; cursor: pointer; font-family: inherit; }
    .kh-reset:hover { color: #777; }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── 2. HTML INJECTEREN ─────────────────────────────────────────────────── */
  var trigger = '<button id="snrg-kh-btn" onclick="snrgKH.open()">⚡ Keuzehulp particulieren</button>';
  var overlay = '<div id="snrg-kh-overlay" onclick="snrgKH.bgClose(event)"><div id="snrg-kh-modal"><div class="kh-topbar"><div class="kh-topbar-dot"></div><div class="kh-topbar-label">Keuzehulp thuisbatterij</div><div class="kh-topbar-step" id="kh-stap-label">Stap 1 van 4</div><button class="kh-topbar-close" onclick="snrgKH.close()">✕</button></div><div class="kh-progress" id="kh-progress"></div><div class="kh-card" id="kh-content"></div></div></div>';

  function inject() {
    var target = document.querySelector('.page-content, [data-content-region="category"], .productGrid, main');
    if (!target) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = trigger + overlay;
    target.parentNode.insertBefore(wrap, target);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  /* ── 3. WIDGET LOGICA ───────────────────────────────────────────────────── */
  var PRODUCTS = {
    plugplay_klein: { featured: true, naam: "Hoymiles Plug-In Battery MS-A2 · 2,24 kWh", prijs: "€ 998,–", desc: "Kleinste plug & play optie — gewoon in het stopcontact. Geen installateur, geen omvormer nodig. Inclusief P1-monitoring via app. Ideaal als eerste stap of voor dynamisch contract.", tags: ["2,24 kWh", "Plug & Play", "Geen installateur", "P1-monitoring"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/hoymiles-plug-in-battery-ms-a2-2-24kwh-p1-monitoring/" },
    plugplay_mid: { featured: false, naam: "Marstek Venus-E V2.0 · 5,12 kWh", prijs: "€ 1.250,–", desc: "Bestseller. Plug & play via stopcontact of aparte groep (2.500 W). Incl. P1-meter.", tags: ["5,12 kWh", "2.500 W", "LiFePO₄"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/marstek-venus-e-5-12-kwh-v2-plug-and-play-thuisbatterij-met-p1meter/" },
    plugplay_groot: { featured: false, naam: "Marstek Venus-E 10,24 kWh 2.0", prijs: "€ 2.738,–", desc: "Dubbele capaciteit. Plug & play, inclusief P1-meter, geschikt voor dynamisch laden.", tags: ["10,24 kWh", "Plug & Play", "Dynamisch laden"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/marstek-venus-e-10-24-kwh-2-0-plug-and-play-thuisbatterij-met-p1-meter/" },
    aeg_plugplay: { featured: true, naam: "AEG Solarcube · 4,8 kWh", prijs: "€ 1.750,–", desc: "Uitbreidbaar tot 14,4 kWh. 10 jaar garantie, 6.000+ cycli.", tags: ["4,8 kWh", "Uitbreidbaar", "10 jr garantie"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/aeg-solarcube-4-8-kwh-plug-in-battery/" },
    marstek_v3: { featured: false, naam: "Marstek Venus-E V3.0 · 5,12 kWh", prijs: "€ 1.150,–", desc: "Nieuwste generatie. 2.500 W laadvermogen. Ideaal voor dynamisch contract.", tags: ["5,12 kWh", "V3.0", "2.500 W"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/marstek-venus-e-5-12kwh-v3-0/" },
    sessy_5kwh: { featured: false, naam: "Sessy Thuisbatterij · 5 kWh", prijs: "€ 2.820,–", desc: "Nederlands merk. Plug & play via 3-fase groep. Uitstekend voor dynamisch contract.", tags: ["5 kWh", "Dynamisch contract", "Nederlands"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/sessy-thuisbatterij-5-kwh-wit/" },
    sessy_10kwh: { featured: false, naam: "Sessy Thuisbatterij · 10 kWh", prijs: "€ 4.560,–", desc: "Grote capaciteit, plug & play, dynamisch contract-klaar.", tags: ["10 kWh", "Dynamisch contract", "LiFePO₄"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/sessy-thuisbatterij-10-kwh-wit/" },
    growatt_totaal: { featured: false, naam: "Growatt APX Totaalpakket · 5 kWh", prijs: "€ 2.299,–", desc: "Voordeligste complete vaste systeem. LFP, IP66, wandmontage. Incl. omvormer en meter.", tags: ["5 kWh", "Compleet pakket", "IP66"], stock: null, url: "https://solarnrg.shop/batterijen/totaalpakketten/growatt-apx-batterij-totaalpakket/" },
    sigenergy_totaal_1f: { featured: true, naam: "Sigenergy Totaalpakket · 1-fase", prijs: "v.a. € 3.932,–", desc: "Compleet vast systeem met omvormer, batterij én ingebouwde backup (0 ms omschakeling). Kies zelf het vermogen (3–6 kW) en de capaciteit (6–27 kWh). Installateur nodig, maar daarna volledig automatisch.", tags: ["Vast systeem", "Backup inbegrepen", "6–27 kWh keuze", "1-fase"], stock: null, url: "https://solarnrg.shop/batterijen/totaalpakketten/sigenergy-batterij-totaalpakket-1-fase/" },
    sigenergy_totaal_3f: { featured: true, naam: "Sigenergy Totaalpakket · 3-fase", prijs: "v.a. € 4.602,–", desc: "Zelfde als 1-fase maar voor 3-fase aansluiting — meer vermogen, geschikt voor grotere huishoudens en actief dynamisch handelen. Inclusief backup en configureerbare capaciteit.", tags: ["Vast systeem", "Backup inbegrepen", "3-fase", "Hoog vermogen"], stock: null, url: "https://solarnrg.shop/batterijen/totaalpakketten/sigenergy-batterij-totaalpakket-3-fase/" },
    sigenergy_bat8: { featured: false, naam: "Sigenergy SigenStor Battery · 8 kWh", prijs: "€ 2.340,–", desc: "Modulair uitbreidbaar. Combineer met Sigenergy controller voor volledig systeem.", tags: ["8 kWh", "Modulair", "LiFePO₄"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/sigenergy-sigenstor-battery-8-0-with-led-opvolger-is-10-0/" },
    marstek_15kwh: { featured: false, naam: "Marstek Venus-E 15,36 kWh 2.0", prijs: "€ 4.029,–", desc: "Maximale Marstek plug & play capaciteit voor grote systemen.", tags: ["15,36 kWh", "Plug & Play", "Dynamisch laden"], stock: null, url: "https://solarnrg.shop/plug-and-play/marstek-venus-e-15-36-kwh-2-0-plug-and-play-thuisbatterij-met-p1-meter/" },
    sigenergy_10kwh: { featured: false, naam: "Sigenergy SigenStor Battery · 10 kWh", prijs: "€ 3.276,–", desc: "Nieuwste 10 kWh module. Modulair stapelbaar.", tags: ["10 kWh", "Modulair", "LiFePO₄"], stock: null, url: "https://solarnrg.shop/thuisbatterijen/sigenergy-sigenstor-battery-10-0-with-led/" }
  };

  var STEPS = [
    { id: "gebruik", vraag: "Wat is je voornaamste doel?", sub: null, opties: [
      { icon: "☀️", label: "Zonne-energie opslaan", sub: "Overdag opgewekte stroom 's avonds gebruiken", waarde: "solar" },
      { icon: "⚡", label: "Energiekosten verlagen", sub: "Goedkoop laden, duur verbruik vermijden", waarde: "saving" },
      { icon: "🔌", label: "Backup bij stroomuitval", sub: "Kritieke apparaten blijven werken", waarde: "backup" },
      { icon: "📈", label: "Dynamisch contract", sub: "Laden op lage uurtarieven, terugleveren bij hoge", waarde: "dynamic" }
    ]},
    { id: "installatie", vraag: "Hoe wil je installeren?", sub: "Plug & play = zelf insteken. Vast systeem = elektricien nodig, meer capaciteit.", opties: [
      { icon: "🔧", label: "Plug & play (zelf doen)", sub: "Via stopcontact of vaste groep", waarde: "pnp" },
      { icon: "👷", label: "Vast systeem (installateur)", sub: "Meer capaciteit en mogelijkheden", waarde: "vast" },
      { icon: "❓", label: "Weet ik nog niet", sub: "Toon de beste opties", waarde: "both" }
    ]},
    { id: "capaciteit", vraag: "Hoeveel zonnepanelen heb je?", sub: null, opties: [
      { icon: "🏠", label: "0 – 6 panelen", sub: "Klein systeem", waarde: "klein" },
      { icon: "🏡", label: "7 – 12 panelen", sub: "Gemiddeld huishouden", waarde: "middel" },
      { icon: "🏘️", label: "13 of meer panelen", sub: "Groot dak, hoog verbruik", waarde: "groot" },
      { icon: "❓", label: "Geen / weet ik niet", sub: "Oriënterende koper", waarde: "geen" }
    ]},
    { id: "backup", vraag: "Backup bij stroomuitval — nodig?", sub: "Vereist een speciale module. Niet elke batterij heeft dit standaard.", opties: [
      { icon: "🔋", label: "Ja, essentieel", sub: "Ik wil zekerheid bij een blackout", waarde: "ja" },
      { icon: "💡", label: "Handig, maar niet noodzakelijk", sub: null, waarde: "nice" },
      { icon: "⚡", label: "Niet nodig", sub: "Ik wil gewoon slim energie opslaan", waarde: "nee" }
    ]}
  ];

  function getResult(a) {
    var gebruik = a[0], inst = a[1], cap = a[2], backup = a[3];
    if (backup === "ja" || gebruik === "backup") return { titel: "Batterij met backup-functie", uitleg: "Sigenergy heeft backup ingebouwd in het totaalpakket — geen losse module nodig. Kies 1-fase of 3-fase afhankelijk van je aansluiting.", producten: ["sigenergy_totaal_1f", "sigenergy_totaal_3f"] };
    if (gebruik === "dynamic") return { titel: "Optimaal voor dynamisch contract", uitleg: "Hoymiles is de plug & play instapper — snel geïnstalleerd, geen elektricien. Sigenergy is het complete vaste systeem met veel meer vermogen en capaciteit voor serieus handelen op uurtarieven. Kies op basis van je budget en situatie.", producten: cap === "groot" ? ["sigenergy_totaal_3f", "sigenergy_totaal_1f", "plugplay_klein"] : ["plugplay_klein", "sigenergy_totaal_1f", "sigenergy_totaal_3f"] };
    if (inst === "pnp") {
      if (cap === "groot") return { titel: "Plug & play voor groot systeem", uitleg: null, producten: ["aeg_plugplay", "marstek_15kwh", "plugplay_groot"] };
      if (cap === "middel") return { titel: "Plug & play — populairste keuze", uitleg: null, producten: ["aeg_plugplay", "plugplay_mid", "marstek_v3"] };
      return { titel: "Plug & play starten", uitleg: null, producten: ["aeg_plugplay", "plugplay_mid", "plugplay_klein"] };
    }
    if (inst === "vast") {
      if (cap === "groot") return { titel: "Vast systeem voor groot verbruik", uitleg: null, producten: ["sigenergy_totaal_3f", "sigenergy_10kwh", "sessy_10kwh"] };
      if (cap === "klein") return { titel: "Compact vast systeem", uitleg: null, producten: ["growatt_totaal", "sigenergy_totaal_1f", "sessy_5kwh"] };
      return { titel: "Vast systeem — middenklasse", uitleg: null, producten: ["sigenergy_totaal_1f", "growatt_totaal", "sessy_5kwh"] };
    }
    if (cap === "groot") return { titel: "Hoge capaciteit aanbevolen", uitleg: null, producten: ["marstek_15kwh", "sigenergy_totaal_3f", "sessy_10kwh"] };
    if (cap === "klein") return { titel: "Instapopties", uitleg: null, producten: ["plugplay_mid", "plugplay_klein", "growatt_totaal"] };
    return { titel: "Populaire thuisbatterijen", uitleg: null, producten: ["plugplay_mid", "sigenergy_totaal_1f", "sessy_5kwh"] };
  }

  var antwoorden = [], stap = 0;

  function rp() {
    document.getElementById('kh-progress').innerHTML = STEPS.map(function(_, i) { return '<div class="kh-bar' + (i < stap ? ' done' : '') + '"></div>'; }).join('');
    document.getElementById('kh-stap-label').textContent = stap < STEPS.length ? ('Stap ' + (stap + 1) + ' van ' + STEPS.length) : 'Jouw advies';
  }

  function rs() {
    var s = STEPS[stap];
    document.getElementById('kh-content').innerHTML =
      '<div class="kh-question">' + s.vraag + '</div>' +
      (s.sub ? '<div class="kh-sub">' + s.sub + '</div>' : '<div style="height:8px"></div>') +
      '<div class="kh-options">' +
      s.opties.map(function(o, i) {
        return '<button class="kh-option" onclick="snrgKH.kies(' + i + ')">' +
          '<span class="kh-kh-icon">' + o.icon + '</span>' +
          '<span><span class="kh-opt-title">' + o.label + '</span>' +
          (o.sub ? '<span class="kh-opt-sub">' + o.sub + '</span>' : '') +
          '</span></button>';
      }).join('') + '</div>' +
      (stap > 0 ? '<button class="kh-back" onclick="snrgKH.terug()">← Vorige vraag</button>' : '');
  }

  function rr() {
    var r = getResult(antwoorden);
    var html = r.producten.map(function(id) {
      var p = PRODUCTS[id]; if (!p) return '';
      return '<div class="kh-product' + (p.featured ? ' featured' : '') + '">' +
        (p.featured ? '<span class="kh-featured-badge">Aanbevolen</span>' : '') +
        '<div class="kh-product-row1"><div class="kh-product-name">' + p.naam + '</div><div class="kh-product-price">' + p.prijs + '</div></div>' +
        '<div class="kh-product-desc">' + p.desc + '</div>' +
        '<div class="kh-product-bottom"><div class="kh-tags">' +
        p.tags.map(function(t) { return '<span class="kh-tag">' + t + '</span>'; }).join('') +
        (p.stock ? '<span class="kh-tag green">✓ ' + p.stock + '</span>' : '') +
        '</div><a class="kh-cta" href="' + p.url + '" target="_blank">Bekijk →</a></div></div>';
    }).join('');
    document.getElementById('kh-content').innerHTML =
      '<div class="kh-result-label">Jouw aanbeveling</div>' +
      '<div class="kh-result-title">' + r.titel + '</div>' +
      (r.uitleg ? '<div class="kh-result-uitleg">' + r.uitleg + '</div>' : '') +
      '<div class="kh-products">' + html + '</div>' +
      '<div class="kh-footer"><a href="https://solarnrg.shop/thuisbatterijen/" target="_blank">Alle thuisbatterijen →</a>' +
      '<button class="kh-reset" onclick="snrgKH.reset()">↺ Opnieuw</button></div>';
  }

  window.snrgKH = {
    open: function() { document.getElementById('snrg-kh-overlay').classList.add('open'); },
    close: function() { document.getElementById('snrg-kh-overlay').classList.remove('open'); },
    bgClose: function(e) { if (e.target.id === 'snrg-kh-overlay') this.close(); },
    kies: function(idx) {
      antwoorden[stap] = STEPS[stap].opties[idx].waarde;
      stap++; rp();
      stap < STEPS.length ? rs() : rr();
    },
    terug: function() {
      if (stap > 0) { stap--; antwoorden.pop(); rp(); rs(); }
    },
    reset: function() { stap = 0; antwoorden = []; rp(); rs(); }
  };

  // Init na inject
  setTimeout(function() { rp(); rs(); }, 100);
})();
