$(document).ready(function () {
  // Mapowanie model -> ścieżka do zdjęcia
  const samochodyZdjecia = {
    "Aventador": "modele/aventador.jpg",
    "Huracan": "modele/huracan.jpg",
    "Countach": "modele/countach.jpg",
    "Diablo": "modele/diablo.jpg",
    "911 GT3 RS": "modele/911gt3rs.jpg",
    "918 Spyder": "modele/918spyder.jpg",
    "Carrera GT": "modele/carreragt.jpg",
    "Supra MK4": "modele/supramk4.jpg",
    "Supra MK5": "modele/supramk5.jpg",
    "GT-R": "modele/gtr.jpg",
    "Skyline R34": "modele/skyline.jpg",
    "919 Hybrid Evo": "modele/919hybridevo.jpg",
    "Gallardo": "modele/gallardo.jpg",
    "Murcielago": "modele/murcielago.jpg",
    "Revuelto": "modele/revuelto.jpg",
    "Urus": "modele/urus.jpg",
    "F40": "modele/f40.jpg",
    "F50": "modele/f50.jpg",
    "LaFerrari": "modele/laferrari.jpg",
    "812": "modele/812.jpg",
    "SF90": "modele/sf90.jpg",
    "Enzo": "modele/enzo.jpg",
    "Zonda": "modele/zonda.jpg",
    "Huayra": "modele/huayra.jpg",
    "Utopia": "modele/utopia.jpg",
    "M3 E30": "modele/m3e30.jpg",
    "M3 E36": "modele/m3e36.jpg",
    "M3 E46": "modele/m3e46.jpg",
    "M3 E90/E92/E93": "modele/m3e92.jpg",
    "M3 F80": "modele/m3f80.jpg",
    "M3 G80": "modele/m3g80.jpg",
    "M4 F82": "modele/m4f82.jpg",
    "M4 G82": "modele/m4g82.jpg",
    "M5 E28": "modele/m5e28.jpg",
    "M5 E34": "modele/m5e34.jpg",
    "M5 E39": "modele/m5e39.jpg",
    "M5 E60": "modele/m5e60.jpg",
    "M5 F10": "modele/m5f10.jpg",
    "M5 F90": "modele/m5f90.jpg",
    "AMG ONE": "modele/amgone.jpg",
    "AMG GT Black Series": "modele/amggtblackseries.jpg",
    "R8": "modele/r8.jpg",
    "RX-7": "modele/rx7.jpg",
    "MX-5": "modele/mx5.jpg",
    "EB110": "modele/eb110.jpg",
    "Veyron": "modele/veyron.jpg",
    "Chiron": "modele/chiron.jpg",
    "Tourbillon": "modele/tourbillon.jpg",
    "Bolide": "modele/bolide.jpg",
    "Jesko": "modele/jesko.jpg",
    "One:1": "modele/one1.jpg",
    "Agera": "modele/agera.jpg",
    "F1": "modele/f1.jpg",
    "Senna": "modele/senna.jpg",
    "720S": "modele/720s.jpg",
    "P1": "modele/p1.jpg"
  };

  // Flagi/stany overlay
  let winInterval = null;
  let overlayDismissed = false;
  let gameLocked = false; // <= BLOKADA gry po trafieniu lub jeśli już grano dziś

  // === HELPERY BLOKADY ===
  const lockGame = () => {
    gameLocked = true;
    $("#pole_szukania")
      .prop("disabled", true)
      .attr("placeholder", "Zagrałeś dziś — wróć jutro 🙂");
    hideSuggestions();
  };
  const unlockGame = () => {
    gameLocked = false;
    $("#pole_szukania")
      .prop("disabled", false)
      .attr("placeholder", "Wyszukaj samochód...");
  };

  // === UTILSY UI ===
  const showSuggestions = (items) => {
    if (!items || !items.length) {
      $("#sugestie").addClass("d-none").empty();
      return;
    }
    const html = items.map(s => {
      const zdjecie = samochodyZdjecia[s.model] || "";
      const imgHtml = zdjecie ? `<img class="car-thumb rounded" src="${zdjecie}" alt="Zdjęcie ${s.model}">` : "";
      return `
        <button type="button" class="list-group-item list-group-item-action d-flex align-items-center gap-3 suggestion"
                data-suggestion="${s.marka} ${s.model}">
          ${imgHtml}
          <span class="model-name">${s.marka} ${s.model}</span>
        </button>
      `;
    }).join("");
    $("#sugestie").html(html).removeClass("d-none");
  };

  const hideSuggestions = () => $("#sugestie").addClass("d-none").empty();

  const flagForCountry = (kraj) => {
    switch (kraj) {
      case "Wlochy":     return `img/italy.png`;
      case "Niemcy":     return `img/germany2.png`;
      case "Japonia":    return `img/japan2.png`;
      case "Szwecja":    return `img/sweden.png`;
      case "Francja":    return `img/france.png`;
      case "W.Brytania": return `img/uk.png`;
      default:           return ``;
    }
  };

  const logoForBrand = (marka) => {
    switch (marka) {
      case "Lamborghini": return `img/lamborghiniLogo2.png`;
      case "Porsche":     return `img/porscheLogo2.png`;
      case "Nissan":      return `img/nissanLogo3.png`;
      case "Toyota":      return `img/toyotaLogo6.png`;
      case "Ferrari":     return `img/ferrariLogo.png`;
      case "BMW":         return `img/bmwLogo.png`;
      case "Pagani":      return `img/paganiLogo.png`;
      case "McLaren":     return `img/mclarenLogo.png`;
      case "Bugatti":     return `img/bugattiLogo.png`;
      case "Koenigsegg":  return `img/koenigseggLogo.png`;
      case "Mazda":       return `img/mazdaLogo.png`;
      case "Mercedes":    return `img/mercedesLogo.png`;
      case "Audi":        return `img/audiLogo.png`;
      default:            return ``;
    }
  };

  const colorize = ($cell, state) => {
    $cell.removeClass('cell-ok cell-partial cell-bad');
    if (state === 'ok') $cell.addClass('cell-ok');
    else if (state === 'partial') $cell.addClass('cell-partial');
    else $cell.addClass('cell-bad');
  };

  // Aktualizuj licznik pod nagłówkiem
  const updateHeaderCountdown = (remainingTime) => {
    if (!remainingTime) return;
    const txt = `Kolejna gra za: ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`;
    $(".countdown").text(txt);
  };

  // === OVERLAY WYGRANEJ ===
  const renderWinOverlay = (imgSrc, marka, model, remainingTime) => {
    updateHeaderCountdown(remainingTime);
    if (overlayDismissed) return;

    const html = `
      <button class="win-close" id="winClose" aria-label="Zamknij overlay">&times;</button>
      <div class="win-card">
        ${imgSrc ? `<img src="${imgSrc}" alt="Zdjęcie samochodu" class="win-img">` : ""}
        <div class="win-body">
          <div class="win-title mb-1">
            Brawo! W${"y"}grywasz! Wylosowanym samochodem był <strong>${marka} ${model}</strong>.
          </div>
          <div class="countdown">Kolejna gra za: ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s</div>
        </div>
      </div>
    `;
    $("#win").html(html).addClass("show");
  };

  $(document).on('click', '#winClose', function () {
    overlayDismissed = true;
    $("#win").removeClass("show").empty();
    // gra pozostaje zablokowana do północy
  });

  // === RENDER: 1) wiersz w tabeli (desktop/tablet), 2) karta na mobile ===
  const stateToClass = (s) => s === 'ok' ? 'cell-ok' : (s === 'partial' ? 'cell-partial' : 'cell-bad');

  const renderGuess = (wybranySamochod, wylosowanySamochod, states) => {
    const brandLogo = logoForBrand(wybranySamochod.marka);
    const krajFlag  = flagForCountry(wybranySamochod.kraj);

    // --- TABELA ---
    const tr = $(`
      <tr>
        <td class="logo-cell">${brandLogo ? `<img src="${brandLogo}" alt="${wybranySamochod.marka}">` : wybranySamochod.marka}</td>
        <td class="fw-semibold">${wybranySamochod.model}</td>
        <td>${states.rocznikiZeStrzalkami}</td>
        <td>${wybranySamochod.napedy}</td>
        <td>${wybranySamochod.nadwozia}</td>
        <td>${wybranySamochod.skrzynie}</td>
        <td>${krajFlag ? `<img src="${krajFlag}" alt="${wybranySamochod.kraj}" style="width:36px;height:auto;">` : wybranySamochod.kraj}</td>
      </tr>
    `);
    colorize(tr.find('td').eq(0), states.brandState);
    colorize(tr.find('td').eq(2), states.roczState);
    colorize(tr.find('td').eq(3), states.napedState);
    colorize(tr.find('td').eq(4), states.nadState);
    colorize(tr.find('td').eq(5), states.skrzState);
    colorize(tr.find('td').eq(6), states.krajState);
    $('#historiaBody').prepend(tr);

    // --- KARTA (mobile) ---
    const chip = (label, value, cls) =>
      `<div class="chip ${cls}"><div class="small fw-semibold">${label}</div><div>${value}</div></div>`;

    const brandBadge = brandLogo
      ? `<div class="state-badge ${stateToClass(states.brandState)}"><img src="${brandLogo}" alt="${wybranySamochod.marka}"></div>`
      : `<div class="state-badge ${stateToClass(states.brandState)}" style="font-size:.8rem;">${wybranySamochod.marka}</div>`;

    const flagBadge = krajFlag
      ? `<div class="state-badge ${stateToClass(states.krajState)}"><img src="${krajFlag}" alt="${wybranySamochod.kraj}"></div>`
      : `<div class="state-badge ${stateToClass(states.krajState)}" style="font-size:.8rem;">${wybranySamochod.kraj}</div>`;

    const cardHtml = `
      <div class="history-card">
        <div class="brand-row">
          ${brandBadge}
          <div>
            <div class="fw-bold">${wybranySamochod.marka}</div>
            <div>${wybranySamochod.model}</div>
          </div>
          ${flagBadge}
        </div>
        <div class="chips">
          ${chip('Rocznik', states.rocznikiZeStrzalkami, stateToClass(states.roczState))}
          ${chip('Napędy', wybranySamochod.napedy,      stateToClass(states.napedState))}
          ${chip('Nadwozia', wybranySamochod.nadwozia,  stateToClass(states.nadState))}
          ${chip('Skrzynie', wybranySamochod.skrzynie,  stateToClass(states.skrzState))}
        </div>
      </div>
    `;
    $('#historiaCards').prepend(cardHtml);
  };

  // ————————————————— LOGIKA GRY —————————————————
  function startWinPolling(img, marka, model) {
    if (winInterval) return;
    winInterval = setInterval(function () {
      $.ajax({
        url: "checkGameStatus.php",
        method: "POST",
        dataType: "json"
      }).done(function (d2) {
        // aktualizuj licznik nawet gdy overlay zamknięty
        updateHeaderCountdown(d2 && d2.remainingTime ? d2.remainingTime : null);
        if (!overlayDismissed) {
          const pic = img || (d2 && d2.sciezkaDoZdjecia) || '';
          const m   = marka || (d2 && d2.wybranaMarka) || '';
          const mo  = model || (d2 && d2.wybranyModel) || '';
          renderWinOverlay(pic, m, mo, d2.remainingTime || {hours:0,minutes:0,seconds:0});
        }
        // (opcjonalnie) jeśli minęła północ i znowu można grać — przeładuj:
        if (d2 && d2.czyMoznaZagrac === false && gameLocked) {
          location.reload();
        }
      });
    }, 1000);
  }

  function ustawCzyMoznaZagrac() {
    $.ajax({
      url: "checkGameStatus.php",
      method: "POST",
      dataType: "json"
    }).done(function (data) {
      const czyMoznaZagrac = data && data.czyMoznaZagrac;

      if (czyMoznaZagrac === false) {
        // można grać
        unlockGame();

        function losujSamochod() {
          $.ajax({ url: "random.php", method: "POST", dataType: "json" })
            .done(function (losowySamochod) {
              if (losowySamochod && !losowySamochod.error) {
                $("#wylosowany").data("car", JSON.stringify(losowySamochod));
              } else {
                $("#wylosowany").text(losowySamochod.error || "Błąd").removeClass("d-none");
              }
            });
        }
        losujSamochod();

        // Wyszukiwarka – reaguje tylko gdy nie zablokowana
        $("#pole_szukania").on('click', function () {
          if (gameLocked) return;
          $.ajax({ url: "all.php", method: "POST", dataType: "json" })
            .done(function (samochody) {
              if (Array.isArray(samochody) && samochody.length) showSuggestions(samochody);
              else hideSuggestions();
            });
        });

        $("#pole_szukania").on('keyup', function () {
          if (gameLocked) return;
          var q = $(this).val().trim();
          if (!q) { hideSuggestions(); return; }

          $.ajax({ url: "search.php", method: "POST", data: { input: q }, dataType: "json" })
            .done(function (samochody) {
              if (Array.isArray(samochody) && samochody.length) showSuggestions(samochody);
              else $("#sugestie").html('<div class="list-group-item text-muted">Brak wyników…</div>').removeClass('d-none');
            })
            .fail(function () {
              $("#sugestie").html('<div class="list-group-item text-danger">Błąd wyszukiwania. Spróbuj później.</div>').removeClass('d-none');
            });
        });

        $(document).on('click', function (e) {
          if (!$(e.target).closest('#pole_szukania, #sugestie').length) hideSuggestions();
        });

        $(document).on('click', '.suggestion', function () {
          if (gameLocked) return;
          const fullSuggestion = $(this).data('suggestion');
          const model = String(fullSuggestion).split(' ').slice(1).join(' ');
          $("#pole_szukania").val("");
          hideSuggestions();

          $.ajax({
            url: "selected.php",
            method: "POST",
            data: { model },
            dataType: "json"
          }).done(function (wybranySamochod) {
            if (!wybranySamochod || wybranySamochod.error) return;

            const wylosowanySamochod = JSON.parse($("#wylosowany").data("car"));

            if (wylosowanySamochod.model === wybranySamochod.model) {
              const img = samochodyZdjecia[wybranySamochod.model] || '';

              // BLOKADA gry natychmiast po trafieniu
              lockGame();

              // Od tej chwili sekundowe odświeżanie licznika + overlay (jeśli nie zamknięty)
              startWinPolling(img, wylosowanySamochod.marka, wylosowanySamochod.model);

              // Zapisz stan po stronie serwera
              $.ajax({
                url: 'checkGameStatus.php',
                method: 'POST',
                data: {
                  czyJuzZagrano: true,
                  sciezkaDoZdjecia: samochodyZdjecia[wybranySamochod.model],
                  wybranyModel: wylosowanySamochod.model,
                  wybranaMarka: wylosowanySamochod.marka
                }
              });
            } else {
              // === Stany pól ===
              const [rokPStart, rokPEnd] = String(wylosowanySamochod.roczniki).split(" - ");
              const [rokWStart, rokWEnd] = String(wybranySamochod.roczniki).split(" - ");
              const arrowStart = (rokWStart > rokPStart) ? "↓" : (rokWStart < rokPStart) ? "↑" : "✓";
              const arrowEnd   = (rokWEnd   > rokPEnd)   ? "↓" : (rokWEnd   < rokPEnd)   ? "↑" : "✓";
              const rocznikiZeStrzalkami = `${arrowStart}${rokWStart} - ${rokWEnd}${arrowEnd}`;
              const roczState = (rokPStart==rokWStart && rokPEnd==rokWEnd) ? 'ok' : ((rokPStart==rokWStart || rokPEnd==rokWEnd) ? 'partial' : 'bad');

              const splitNap = (str) => { const s = String(str).replace(/\s+/g,''); const parts = s.split(','); return [parts[0]||null, parts[1]||null]; };
              const [pNapWyl1, pNapWyl2] = splitNap(wylosowanySamochod.napedy);
              const [pNapWybr1, pNapWybr2] = splitNap(wybranySamochod.napedy);
              const napedState = (()=>{
                if ((pNapWyl1 === pNapWybr1 && pNapWyl2 === pNapWybr2) ||
                    (pNapWyl1 === pNapWybr2 && pNapWyl2 === pNapWybr1)) return 'ok';
                if ([pNapWybr1,pNapWybr2].some(x => x && (x===pNapWyl1 || x===pNapWyl2))) return 'partial';
                return 'bad';
              })();

              const splitNad = (str) => { const s = String(str).replace(/\s+/g,''); const parts = s.split(','); return [parts[0]||null, parts[1]||null, parts[2]||null]; };
              const [n1Wyl,n2Wyl,n3Wyl] = splitNad(wylosowanySamochod.nadwozia);
              const [n1Wyb,n2Wyb,n3Wyb] = splitNad(wybranySamochod.nadwozia);
              const nadState = (()=>{
                const equalAll = (n1Wyl===n1Wyb && n2Wyl===n2Wyb && n3Wyl===n3Wyl) ||
                                 (n2Wyl===null && n2Wyb===null && n1Wyl===n1Wyb && n3Wyl===null && n3Wyb===null);
                if (equalAll) return 'ok';
                const poolWyl = [n1Wyl,n2Wyl,n3Wyl].filter(Boolean);
                const poolWyb = [n1Wyb,n2Wyb,n3Wyb].filter(Boolean);
                if (poolWyb.some(x => poolWyl.includes(x))) return 'partial';
                return 'bad';
              })();

              const splitSkrz = (str) => { const s = String(str).replace(/\s+/g,''); const parts = s.split(','); return [parts[0]||null, parts[1]||null]; };
              const [s1Wyl,s2Wyl] = splitSkrz(wylosowanySamochod.skrzynie);
              const [s1Wyb,s2Wyb] = splitSkrz(wybranySamochod.skrzynie);
              const skrzState = (()=>{
                if ((s1Wyl===s1Wyb && s2Wyl===s2Wyb) || (s1Wyl===s2Wyb && s2Wyl===s1Wyb)) return 'ok';
                if ([s1Wyb,s2Wyb].some(x => x && (x===s1Wyl || x===s2Wyl))) return 'partial';
                return 'bad';
              })();

              const krajState = (wylosowanySamochod.kraj === wybranySamochod.kraj) ? 'ok' : 'bad';
              const brandState = (wylosowanySamochod.marka === wybranySamochod.marka) ? 'ok' : 'bad';

              renderGuess(
                wybranySamochod,
                wylosowanySamochod,
                { brandState, rocznikiZeStrzalkami, roczState, napedState, nadState, skrzState, krajState }
              );
            }
          });
        });
      } else {
        // JUŻ GRANO DZIŚ — od razu blokujemy i pokazujemy overlay/licznik
        lockGame();
        startWinPolling(null, null, null);
      }
    });
  }

  ustawCzyMoznaZagrac();
});
