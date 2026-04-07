(function () {
  var path = window.location.pathname.replace(/\/$/, '');
  if (path !== '/thuisbatterijen') return;

  /* ── 1. STIJLEN ─────────────────────────────────────────────────────────── */
  var css = `
    #snrg-kh-btn {
      display: block; width: 100%; text-align: center;
      background: #ffb914; color: #111;
      font-family: inherit; font-size: 14px; font-weight: 700;
      padding: 10px 16px; border-radius: 20px; border: none;
      cursor: pointer; transition: background .15s;
      letter-spacing: normal;
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
      display: flex; align-items: center; gap: 0;
      padding: 10px 13px; border: 1px solid #e2dbd3; border-radius: 6px;
      background: #faf8f5; cursor: pointer; text-align: left; width: 100%;
      font-family: inherit; transition: border-color .12s, background .12s;
      letter-spacing: normal;
    }
    .kh-option:hover { border-color: #ffb914; background: #fffbf2; }
    .kh-kh-icon { display: none; }
    .kh-opt-title { display: block; font-size: 14px; font-weight: 600; color: #111; letter-spacing: normal; }
    .kh-opt-sub { display: block; font-size: 12px; color: #999; margin-top: 2px; letter-spacing: normal; }
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
  var trigger = '<button id="snrg-kh-btn" onclick="snrgKH.open()">Keuzehulp particulieren</button>';
  var overlay = '<div id="snrg-kh-overlay" onclick="snrgKH.bgClose(event)"><div id="snrg-kh-modal"><div class="kh-topbar"><div class="kh-topbar-dot"></div><div class="kh-topbar-label">Keuzehulp thuisbatterij</div><div class="kh-topbar-step" id="kh-stap-label">Stap 1 van 4</div><button class="kh-topbar-close" onclick="snrgKH.close()">✕</button></div><div class="kh-progress" id="kh-progress"></div><div class="kh-card" id="kh-content"></div></div></div>';

  function inject() {
    // Plaats knop onderaan de sidebar
    var sidebar = document.querySelector('.page-sidebar, #faceted-search-container');
    if (sidebar) {
      var sidebarWrap = document.createElement('div');
      sidebarWrap.style.cssText = 'margin-top: 1.5rem;';
      sidebarWrap.innerHTML = trigger;
      sidebar.appendChild(sidebarWrap);
    } else {
      // Fallback: boven de productgrid
      var target = document.querySelector('.page-content, .productGrid, main');
      if (target) {
        var wrap = document.createElement('div');
        wrap.innerHTML = trigger;
        target.parentNode.insertBefore(wrap, target);
      }
    }
    // Overlay altijd aan body toevoegen
    var overlayWrap = document.createElement('div');
    overlayWrap.innerHTML = overlay;
    document.body.appendChild(overlayWrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  /* ── 3. WIDGET LOGICA ───────────────────────────────────────────────────── */
  var PRODUCTS = {
    // ── PLUG & PLAY (echt stopcontact, geen installateur) ──────────────────
    hoymiles: {
      featured: true,
      naam: "Hoymiles Plug-In Battery MS-A2 · 2,24 kWh",
      prijs: "€ 998,–",
      desc: "Echte plug & play — gewoon in het stopcontact. Geen installateur nodig. Max. 1.000 W via app instelbaar. Inclusief P1-monitoring. Ideale instapper.",
      tags: ["2,24 kWh", "Stopcontact", "Geen installateur", "P1-monitoring"],
      stock: "Op voorraad",
      url: "https://solarnrg.shop/thuisbatterijen/hoymiles-plug-in-battery-ms-a2-2-24kwh-p1-monitoring/"
    },
    aeg_solarcube: {
      featured: true,
      naam: "AEG Solarcube · 4,8 kWh",
      prijs: "€ 1.750,–",
      desc: "Plug & play via stopcontact (800 W) of aparte groep (2.500 W). Uitbreidbaar tot 14,4 kWh. 10 jaar garantie, 6.000+ cycli. Geen installateur nodig.",
      tags: ["4,8 kWh", "Uitbreidbaar tot 14,4 kWh", "10 jr garantie", "Stopcontact"],
      stock: null,
      url: "https://solarnrg.shop/thuisbatterijen/aeg-solarcube-4-8-kwh-plug-in-battery/"
    },
    zendure: {
      featured: false,
      naam: "Zendure Solarflow 2400AC · plug & play",
      prijs: "€ 495,–",
      desc: "AC-gekoppeld plug & play systeem, 2.400 W vermogen. Combineer met de AB3000X uitbreidingsbatterij voor meer capaciteit. Geschikt voor dynamisch contract.",
      tags: ["2.400 W", "Plug & Play", "Stopcontact of vaste groep", "Dynamisch"],
      stock: null,
      url: "https://solarnrg.shop/thuisbatterijen/zendure-solarflow-2400ac/"
    },
    // ── VAST SYSTEEM (installateur nodig) ──────────────────────────────────
    sigenergy_1f: {
      featured: true,
      naam: "Sigenergy Totaalpakket · 1-fase",
      prijs: "v.a. € 3.932,–",
      desc: "Compleet vast systeem: omvormer + batterij + ingebouwde backup (0 ms). Configureerbaar van 6 tot 27 kWh. Installateur nodig. Daarna volledig automatisch.",
      tags: ["Vast systeem", "Backup inbegrepen", "6–27 kWh", "1-fase", "IP66"],
      stock: null,
      url: "https://solarnrg.shop/batterijen/totaalpakketten/sigenergy-batterij-totaalpakket-1-fase/"
    },
    sigenergy_3f: {
      featured: true,
      naam: "Sigenergy Totaalpakket · 3-fase",
      prijs: "v.a. € 4.602,–",
      desc: "Compleet 3-fase systeem met backup (0 ms). Hoog omvormer vermogen, ideaal voor grote huishoudens en dynamisch handelen. Configureerbaar van 6 tot 27 kWh.",
      tags: ["Vast systeem", "Backup inbegrepen", "3-fase", "Hoog vermogen", "IP66"],
      stock: null,
      url: "https://solarnrg.shop/batterijen/totaalpakketten/sigenergy-batterij-totaalpakket-3-fase/"
    },
    growatt: {
      featured: false,
      naam: "Growatt APX Totaalpakket · 5 kWh",
      prijs: "€ 2.299,–",
      desc: "Voordeligste complete vaste systeem. Inclusief omvormer, batterij en energiemeter. LFP, IP66, wand- of vloermontage. Installateur nodig.",
      tags: ["5 kWh", "Compleet pakket", "Voordeligst", "IP66"],
      stock: null,
      url: "https://solarnrg.shop/batterijen/totaalpakketten/growatt-apx-batterij-totaalpakket/"
    },
    huawei_luna: {
      featured: false,
      naam: "Huawei LUNA2000-5KW-C0 · 5 kWh",
      prijs: "€ 991,–",
      desc: "Losse 5 kWh batterijmodule van Huawei. Combineer met Huawei hybride omvormer. Uitbreidbaar, A-merk kwaliteit. Optioneel inclusief installatie (+€499).",
      tags: ["5 kWh", "Huawei A-merk", "Uitbreidbaar", "Optioneel installatie"],
      stock: "Op voorraad",
      url: "https://solarnrg.shop/batterijen/huawei-luna2000-5kw-c0/"
    },
    alphaess: {
      featured: false,
      naam: "AlphaESS Smile G3-BAT-9.3S · 9,3 kWh",
      prijs: "€ 2.100,–",
      desc: "Grote 9,3 kWh batterijunit voor vast systeem. IP65 — geschikt voor buiten. Combineer met AlphaESS omvormer. 8,4 kWh bruikbare capaciteit.",
      tags: ["9,3 kWh", "IP65", "Binnen of buiten", "Vast systeem"],
      stock: "Op voorraad",
      url: "https://solarnrg.shop/thuisbatterijen/alphaess-smile-g3-bat-9-3s-ip65/"
    },
    // ── SESSY (aparte groep, geen echte plug & play) ───────────────────────
    sessy_5kwh: {
      featured: false,
      naam: "Sessy Thuisbatterij · 5 kWh",
      prijs: "€ 2.820,–",
      desc: "Nederlands merk. Aansluiting via aparte 1- of 3-fase groep (geen gewoon stopcontact). 1.700 W vermogen. Uitstekend voor dynamisch contract via P1-koppeling.",
      tags: ["5 kWh", "Aparte groep", "Dynamisch contract", "Nederlands merk"],
      stock: null,
      url: "https://solarnrg.shop/thuisbatterijen/sessy-thuisbatterij-5-kwh-wit/"
    },
    sessy_10kwh: {
      featured: false,
      naam: "Sessy Thuisbatterij · 10 kWh",
      prijs: "€ 4.560,–",
      desc: "Grote capaciteit. Aansluiting via aparte 1- of 3-fase groep. 1.700 W vermogen. Dynamisch contract-klaar via P1-koppeling.",
      tags: ["10 kWh", "Aparte groep", "Dynamisch contract", "Nederlands merk"],
      stock: null,
      url: "https://solarnrg.shop/thuisbatterijen/sessy-thuisbatterij-10-kwh-wit/"
    }
  };

  var STEPS = [
    { id: "gebruik", vraag: "Wat is je voornaamste doel?", sub: null, opties: [
      { icon: "", label: "Zonne-energie opslaan", sub: "Overdag opgewekte stroom 's avonds gebruiken", waarde: "solar" },
      { icon: "", label: "Energiekosten verlagen", sub: "Goedkoop laden, duur verbruik vermijden", waarde: "saving" },
      { icon: "", label: "Backup bij stroomuitval", sub: "Kritieke apparaten blijven werken bij blackout", waarde: "backup" },
      { icon: "", label: "Dynamisch contract optimaliseren", sub: "Laden op lage uurtarieven, terugleveren bij hoge", waarde: "dynamic" }
    ]},
    { id: "installatie", vraag: "Hoe wil je installeren?", sub: "Plug & play = zelf in het stopcontact, geen elektricien. Vast systeem = meer capaciteit en vermogen, installateur nodig.", opties: [
      { icon: "", label: "Plug & play (zelf doen)", sub: "Direct in stopcontact of aparte groep, geen installateur", waarde: "pnp" },
      { icon: "", label: "Vast systeem (via installateur)", sub: "Meer capaciteit, hogere vermogens, professioneel geïnstalleerd", waarde: "vast" },
      { icon: "", label: "Weet ik nog niet", sub: "Toon de beste opties", waarde: "both" }
    ]},
    { id: "capaciteit", vraag: "Hoeveel zonnepanelen heb je?", sub: null, opties: [
      { icon: "", label: "0 – 6 panelen", sub: "Klein systeem", waarde: "klein" },
      { icon: "", label: "7 – 12 panelen", sub: "Gemiddeld huishouden", waarde: "middel" },
      { icon: "", label: "13 of meer panelen", sub: "Groot dak, hoog verbruik", waarde: "groot" },
      { icon: "", label: "Geen / weet ik niet", sub: "Ik oriënteer me", waarde: "geen" }
    ]},
    { id: "backup", vraag: "Backup bij stroomuitval — nodig?", sub: "Backup vereist een speciaal systeem. Sigenergy heeft dit ingebouwd.", opties: [
      { icon: "", label: "Ja, essentieel", sub: "Ik wil zekerheid bij een blackout", waarde: "ja" },
      { icon: "", label: "Handig, maar niet noodzakelijk", sub: null, waarde: "nice" },
      { icon: "", label: "Niet nodig", sub: "Ik wil gewoon slim energie opslaan", waarde: "nee" }
    ]}
  ];

  function getResult(a) {
    var gebruik = a[0], inst = a[1], cap = a[2], backup = a[3];

    // Backup altijd Sigenergy
    if (backup === "ja" || gebruik === "backup") {
      return { titel: "Batterij met backup-functie", uitleg: "Sigenergy heeft backup ingebouwd in het totaalpakket — geen losse module nodig. Kies 1-fase of 3-fase op basis van jouw aansluiting.", producten: ["sigenergy_1f", "sigenergy_3f"] };
    }

    // Dynamisch contract: hoog omvormer vermogen is key
    if (gebruik === "dynamic") {
      return { titel: "Optimaal voor dynamisch contract", uitleg: "Voor dynamisch handelen is omvormer vermogen het belangrijkst. Zendure en Hoymiles zijn plug & play instappers. Sigenergy levert het hoogste vermogen voor serieus handelen.", producten: cap === "groot" ? ["sigenergy_3f", "sigenergy_1f", "zendure"] : ["zendure", "hoymiles", "sigenergy_1f"] };
    }

    // Plug & play
    if (inst === "pnp") {
      if (cap === "groot") return { titel: "Plug & play — grote capaciteit", uitleg: "Let op: voor grote systemen is een vast systeem vaak efficiënter. Plug & play opties zijn beperkt in capaciteit.", producten: ["aeg_solarcube", "zendure", "sessy_10kwh"] };
      if (cap === "middel") return { titel: "Plug & play — populairste keuze", uitleg: null, producten: ["aeg_solarcube", "hoymiles", "sessy_5kwh"] };
      return { titel: "Plug & play starten", uitleg: null, producten: ["hoymiles", "aeg_solarcube", "zendure"] };
    }

    // Vast systeem
    if (inst === "vast") {
      if (cap === "groot") return { titel: "Vast systeem voor groot verbruik", uitleg: null, producten: ["sigenergy_3f", "alphaess", "sigenergy_1f"] };
      if (cap === "klein") return { titel: "Compact vast systeem", uitleg: null, producten: ["growatt", "huawei_luna", "sigenergy_1f"] };
      return { titel: "Vast systeem — middenklasse", uitleg: null, producten: ["sigenergy_1f", "growatt", "huawei_luna"] };
    }

    // Geen voorkeur
    if (cap === "groot") return { titel: "Aanbevolen voor groot systeem", uitleg: null, producten: ["sigenergy_3f", "aeg_solarcube", "alphaess"] };
    if (cap === "klein") return { titel: "Instapopties", uitleg: null, producten: ["hoymiles", "aeg_solarcube", "growatt"] };
    return { titel: "Populaire thuisbatterijen", uitleg: null, producten: ["aeg_solarcube", "sigenergy_1f", "hoymiles"] };
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
