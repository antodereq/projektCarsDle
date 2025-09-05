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
  let winInterval = null;           // odpytywanie checkGameStatus co 1 s
  let overlayDismissed = false;     // użytkownik zamknął overlay (nie pokazuj ponownie)

  // === UTILSY UI ===
  const showSuggestions = (items) => {
    if (!items || !items.length) {
      $("#sugestie").addClass("d-none").empty();
      return;
    }
    const html = items.map(s => {
      const zdjecie = samochodyZdjecia[s.model] || "";
      return `
        <button type="button" class="list-group-item list-group-item-action d-flex align-items-center gap-3 suggestion"
                data-suggestion="${s.marka} ${s.model}">
          <img class="car-thumb rounded" src="${zdjecie}" alt="Zdjęcie ${s.model}">
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

  // Aktualizuj licznik pod nagłówkiem (zawsze, niezależnie od overlay)
  const updateHeaderCountdown = (remainingTime) => {
    if (!remainingTime) return;
    const txt = `Kolejna gra za: ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`;
    $(".countdown").text(txt);
  };

  // === OVERLAY WYGRANEJ ===
  const renderWinOverlay = (imgSrc, marka, model, remainingTime) => {
    // Jeśli użytkownik zamknął overlay, nie pokazuj go ponownie — jedynie aktualizuj licznik pod nagłówkiem
    updateHeaderCountdown(remainingTime);
    if (overlayDismissed) return;

    const html = `
      <button class="win-close" id="winClose" aria-label="Zamknij overlay">&times;</button>
      <div class="win-card">
        <img src="${imgSrc}" alt="Zdjęcie samochodu" class="win-img">
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

  // Zamknięcie overlayu (nie pokazuj go ponownie aż do odświeżenia)
  $(document).on('click', '#winClose', function () {
    overlayDismissed = true;
    $("#win").removeClass("show").empty();
    // zapobiegawczo zostawiamy interval – będzie aktualizował licznik pod nagłówkiem
  });

  // === RENDER: 1) wiersz w tabeli (desktop/tablet), 2) karta na mobile ===
  const renderGuess = (wybranySamochod, wylosowanySamochod, states) => {
    // TABELA
    const brandLogo = logoForBrand(wybranySamochod.marka);
    const krajFlag  = flagForCountry(wybranySamochod.kraj);
    const tr = $(`
      <tr>
        <td class="logo-cell text-center">${brandLogo ? `<img src="${brandLogo}" alt="${wybranySamochod.marka}">` : wybranySamochod.marka}</td>
        <td class="fw-semibold">${wybranySamochod.model}</td>
        <td class="text-center">${states.rocznikiZeStrzalkami}</td>
        <td class="text-center">${wybranySamochod.napedy}</td>
        <td class="text-center">${wybranySamochod.nadwozia}</td>
        <td class="text-center">${wybranySamochod.skrzynie}</td>
        <td class="text-center">${krajFlag ? `<img src="${krajFlag}" alt="${wybranySamochod.kraj}" style="width:36px;height:auto;">` : wybranySamochod.kraj}</td>
      </tr>
    `);
    // Kolory
    colorize(tr.find('td').eq(0), (wylosowanySamochod.marka === wybranySamochod.marka) ? 'ok' : 'bad');
    colorize(tr.find('td').eq(2), states.roczState);
    colorize(tr.find('td').eq(3), states.napedState);
    colorize(tr.find('td').eq(4), states.nadState);
    colorize(tr.find('td').eq(5), states.skrzState);
    colorize(tr.find('td').eq(6), states.krajState);

    $('#historiaBody').prepend(tr);

    // KARTA (mobile)
    const chip = (label, value, cls) => `<div class="chip ${cls}"><div class="small fw-semibold">${label}</div><div>${value}</div></div>`;
    const cardHtml = `
      <div class="history-card">
        <div class="brand-row">
          ${brandLogo ? `<img src="${brandLogo}" alt="${wybranySamochod.marka}">` : ''}
          <div>
            <div class="fw-bold">${wybranySamochod.marka}</div>
            <div>${wybranySamochod.model}</div>
          </div>
          <div class="ms-auto">
            ${krajFlag ? `<img src="${krajFlag}" alt="${wybranySamochod.kraj}" style="width:28px;height:auto;">` : ''}
          </div>
        </div>
        <div class="chips">
          ${chip('Rocznik', states.rocznikiZeStrzalkami, ` ${stateToClass(states.roczState)}`)}
          ${chip('Napędy', wybranySamochod.napedy,      ` ${stateToClass(states.napedState)}`)}
          ${chip('Nadwozia', wybranySamochod.nadwozia,  ` ${stateToClass(states.nadState)}`)}
          ${chip('Skrzynie', wybranySamochod.skrzynie,  ` ${stateToClass(states.skrzState)}`)}
        </div>
      </div>
    `;
    $('#historiaCards').prepend(cardHtml);
  };

  const stateToClass = (s) => s === 'ok' ? 'cell-ok' : (s === 'partial' ? 'cell-partial' : 'cell-bad');

  // === LOGIKA GRY ===
  function ustawCzyMoznaZagrac() {
    $.ajax({
      url: "checkGameStatus.php",
      method: "POST",
      success: function (response) {
        var data = JSON.parse(response);
        var czyMoznaZagrac = data.czyMoznaZagrac;

        if (czyMoznaZagrac === false) {
          // 1) Losowanie auta
          function losujSamochod() {
            $.ajax({
              url: "random.php",
              method: "POST",
              success: function (data) {
                try {
                  var losowySamochod = JSON.parse(data);
                  if (losowySamochod.error) {
                    $("#wylosowany").text(losowySamochod.error).removeClass("d-none");
                  } else {
                    $("#wylosowany").data("car", JSON.stringify(losowySamochod));
                  }
                } catch (e) {
                  console.error("Błąd parsowania JSON (random.php):", e);
                }
              },
              error: function (xhr, status, error) {
                console.error("Błąd podczas losowania samochodu:", status, error);
              }
            });
          }
          losujSamochod();

          // 2) Pokaz wszystkie samochody po kliknięciu input
          $("#pole_szukania").on('click', function () {
            $.ajax({
              url: "all.php",
              method: "POST",
              success: function (data) {
                var samochody = [];
                try { samochody = JSON.parse(data); } catch { }
                if (samochody.length > 0) showSuggestions(samochody);
                else hideSuggestions();
              }
            });
          });

          // 3) Podpowiedzi w trakcie pisania
          $("#pole_szukania").on('keyup', function () {
            var q = $(this).val().trim();
            if (!q) { hideSuggestions(); return; }

            $.ajax({
              url: "search.php",
              method: "POST",
              data: { input: q },
              success: function (data) {
                var samochody = [];
                try { samochody = JSON.parse(data); } catch { }
                if (samochody.length > 0) showSuggestions(samochody);
                else $("#sugestie").html('<div class="list-group-item text-muted">Brak wyników…</div>').removeClass('d-none');
              },
              error: function () {
                $("#sugestie").html('<div class="list-group-item text-danger">Błąd wyszukiwania. Spróbuj później.</div>').removeClass('d-none');
              }
            });
          });

          // 4) Chowanie sugestii poza kliknięciem
          $(document).on('click', function (e) {
            if (!$(e.target).closest('#pole_szukania, #sugestie').length) hideSuggestions();
          });

          // 5) Klik w sugestię
          $(document).on('click', '.suggestion', function () {
            const fullSuggestion = $(this).data('suggestion');   // "Marka Model"
            const model = String(fullSuggestion).split(' ').slice(1).join(' ');
            $("#pole_szukania").val(""); // czyścimy input
            hideSuggestions();

            // Pobierz wybrany samochód
            $.ajax({
              url: "selected.php",
              method: "POST",
              data: { model },
              success: function (response) {
                let wybranySamochod = {};
                try { wybranySamochod = JSON.parse(response); } catch { }
                if (wybranySamochod.error) {
                  console.warn(wybranySamochod.error);
                  return;
                }
                const wylosowanySamochod = JSON.parse($("#wylosowany").data("car"));

                // Trafiony model => overlay + odliczanie
                if (wylosowanySamochod.model === wybranySamochod.model) {
                  const img = samochodyZdjecia[wybranySamochod.model] || '';
                  // start stałego odpytywania o countdown (jeśli jeszcze nie działa)
                  if (!winInterval) {
                    winInterval = setInterval(function () {
                      $.ajax({
                        url: "checkGameStatus.php",
                        method: "POST",
                        success: function (resp2) {
                          try {
                            const d2 = JSON.parse(resp2);
                            renderWinOverlay(img, wylosowanySamochod.marka, wylosowanySamochod.model, d2.remainingTime);
                          } catch { }
                        }
                      });
                    }, 1000);
                  }
                  // Ustaw sesję
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
                  // Nietrafione – oblicz stany pól
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
                    const equalAll = (n1Wyl===n1Wyb && n2Wyl===n2Wyb && n3Wyl===n3Wyb) ||
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

                  renderGuess(
                    wybranySamochod,
                    wylosowanySamochod,
                    { rocznikiZeStrzalkami, roczState, napedState, nadState, skrzState, krajState }
                  );
                }
              }
            });
          });
        } else {
          // Tryb: już zagrano — uruchom licznik i overlay (z możliwością zamknięcia)
          if (!winInterval) {
            winInterval = setInterval(function () {
              $.ajax({
                url: "checkGameStatus.php",
                method: "POST",
                success: function (resp) {
                  try {
                    const d = JSON.parse(resp);
                    const img = d.sciezkaDoZdjecia || '';
                    renderWinOverlay(img, d.wybranaMarka, d.wybranyModel, d.remainingTime);
                  } catch { }
                }
              });
            }, 1000);
          }
        }
      }
    });
  }
  ustawCzyMoznaZagrac();
});
