$(document).ready(function(){
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
    var czyJuzZagrano = $('#sessionData').data('czy-juz-zagrano');
    function ustawCzyMoznaZagrac() {
        $.ajax({
            url: "checkGameStatus.php",
            method: "POST",
            success: function(response) {
                var data = JSON.parse(response);
                var czyMoznaZagrac = data.czyMoznaZagrac;
                var remainingTime = data.remainingTime;

                if (czyMoznaZagrac === false) {
                    // Funkcja losująca samochód
                    function losujSamochod() {
                        $.ajax({
                            url: "random.php", 
                            method: "POST", 
                            success: function(data){
                                try {
                                    var losowySamochod = JSON.parse(data); // Przekształcenie odpowiedzi JSON w obiekt JS
                                    if(losowySamochod.error){
                                        $("#wylosowany").html(losowySamochod.error).css("display", "block");
                                    } else {
                                        $("#wylosowany").data("car", JSON.stringify(losowySamochod)); 
                                        console.log("Wylosowany samochód:", losowySamochod); 
                                    }
                                } catch (e) {
                                    console.error("Błąd parsowania JSON, linijka 13-22:", e);
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error("Błąd podczas losowania samochodu:", status, error);
                            }
                        });
                    }
                    losujSamochod();  // Automatyczne losowanie samochodu po wejściu na stronę

                    
                    //Wyświetlanie wszystkich samochodów z bazy po kliknięciu w inputa #pole_szukania
                    $("#pole_szukania").on('click', function () {
                        $.ajax({
                            url: "all.php",
                            method: "POST",
                            success: function (data) {
                                // Parsowanie danych JSON zwróconych z PHP
                                var samochody = JSON.parse(data);

                                if (samochody.length > 0) {
                                    
                                    var sugestieHtml = "";

                                    samochody.forEach(function (samochod) {
                                        var zdjecie = samochodyZdjecia[samochod.model];
                                        sugestieHtml += `
                                                <div class="suggestion" data-suggestion="${samochod.marka} ${samochod.model}">
                                                    <table>
                                                        <tr>
                                                            <td><img src="${zdjecie}" alt=" zdjęcie ${samochod.model}" style="width: 150px; height: auto;"></td>
                                                            <td>${samochod.marka} ${samochod.model}</td>
                                                        </tr>
                                                        
                                                    </table>
                                                </div>;`
                                    });

                                    $("#sugestie").html(sugestieHtml).css("display", "block");
                                } else {
                                    $("#sugestie").css("display", "none");
                                }
                            }
                        });
                    });

                    // Pojawianie się sugestii podczas wpisywania w pole wyszukiwania - WYSZUKIWARKA 
                    $("#pole_szukania").keyup(function () {
                        var przechowywana = $(this).val();
                        if (przechowywana != "") {
                            $.ajax({
                                url: "search.php",
                                method: "POST",
                                data: { input: przechowywana },
                                success: function (data) {
                                    // Parsowanie danych JSON zwróconych z PHP
                                    var samochody = JSON.parse(data);
                    
                                    if (samochody.length > 0) {
                                        // Tworzenie zawartości HTML dla sugestii
                                        var sugestieHtml = "";
                                        samochody.forEach(function (samochod) {
                                            var zdjecie = samochodyZdjecia[samochod.model]
                                            sugestieHtml += `
                                                    <div class="suggestion" data-suggestion="${samochod.marka} ${samochod.model}">
                                                        <table>
                                                            <tr>
                                                                <td><img src="${zdjecie}" alt=" zdjęcie ${samochod.model}" style="width: 150px; height: auto;"></td>
                                                                <td>${samochod.marka} ${samochod.model}</td>
                                                            </tr>
                                                            
                                                        </table>
                                                    </div>`;
                                        });
                    
                                        $("#sugestie").html(sugestieHtml).css("display", "block");
                                    } else {
                                        $("#sugestie").html("<p>Brak wyników dla podanego zapytania.</p>").css("display", "block");
                                    }
                                },
                                error: function () {
                                    $("#sugestie").html("<p>Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie później.</p>").css("display", "block");
                                },
                            });
                        } else {
                            $("#sugestie").html("").css("display", "none");
                        }
                    });
                    
                    // Ukrywanie wszystkich samochodów po kliknięciu czegoś poza inputem #pole_wyszukiwania
                    $(document).click(function (event) {
                        if (!$(event.target).closest('#pole_szukania, #sugestie').length) {
                            $("#sugestie").css("display", "none");
                        }
                    });

                    // Dodanie wybranej sugestii do inputa po kliknięciu
                    $(document).on('click', '.suggestion', function () {
                        var fullSuggestion = $(this).data('suggestion'); 
                        var suggestionParts = fullSuggestion.split(' '); 
                        var model = suggestionParts.slice(1).join(' '); 
                        console.log("Wybrany model:", model);  
                        $("#pole_szukania").val(model); 
                        var wybrany = model; 
                        $("#pole_szukania").val("");
                        $("#sugestie").html("").css("display", "none"); 
                        $.ajax({
                            url: "selected.php",
                            method: "POST",
                            data: { model: wybrany },
                            success: function(response) {
                                console.log("Odpowiedź z selected.php:", response);  
                                // Sprawdzanie czy odpowiedź jest poprawna przed parsowaniem
                                var wybranySamochod = JSON.parse(response);  // Parsowanie odpowiedzi JSON
                                var wylosowanySamochod = JSON.parse($("#wylosowany").data("car")); // Pobranie danych wylosowanego samochodu
                                var historiaWyszukiwania = [];
                                if(wybranySamochod.error){
                                    $("#tabelka").html(wybranySamochod.error).css("display", "block");
                                } else {
                                    var zdjecie = samochodyZdjecia[wybranySamochod.model]
                                    
                                    
                                    
                                    
                                    
                                    
                                    //model
                                    // tutaj wylosowanySamochod.model oraz wylosowanySamochod.marka mają wartości, wszystko działa
                                    if(wylosowanySamochod.model == wybranySamochod.model){
                                        
                                        
                                        
                                        
                                        setInterval(function() {
                                            $.ajax({
                                                url: "checkGameStatus.php",
                                                method: "POST",
                                                success: function(response) {
                                                    var data = JSON.parse(response);
                                                    var remainingTime = data.remainingTime;
                                                    $("#win").html(`
                                                        <div class="win-content">
                                                            <img src="${zdjecie}" alt="Zdjęcie samochodu" class="win-image">
                                                            <div class="kontener">
                                                                <div class="win-text">Brawo! Wygrywasz! Wylosowanym samochodem był ${wylosowanySamochod.marka} ${wylosowanySamochod.model}</div> 
                                                                <div class="countdown">Kolejna gra za: ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s</div>
                                                            </div>
                                                        </div>
                                                    `).css("display", "block");
                                                }
                                            });
                                        }, 1000); // Odświeżanie co 1000 ms (1 sekunda)
                                    
                                        
                                        $.ajax({
                                            url: 'checkGameStatus.php',  
                                            method: 'POST',
                                            data: { 
                                                czyJuzZagrano: true,
                                                sciezkaDoZdjecia: samochodyZdjecia[wybranySamochod.model], 
                                                wybranyModel: wylosowanySamochod.model,
                                                wybranaMarka: wylosowanySamochod.marka
                                            },
                                            success: function(response) {
                                                console.log("Sesja została zaktualizowana.");
                                                console.log("Odpowiedź z PHP:", response);
                                            },
                                            error: function(xhr, status, error) {
                                                console.error("Błąd AJAX:", error);
                                                console.error("Status:", status);
                                                console.error("Odpowiedź serwera:", xhr.responseText);
                                            }
                                        });
                                        
                                        
                                        
                                        
                                    } else {
                                        var hi = []
                                        // Budowanie tabeli dynamicznie
                                        var tabela = `
                                        <table>
                                            <tr>
                                                <td><div class="marka">${wybranySamochod.marka}</div></td>
                                                <td><div class="model">${wybranySamochod.model}</div></td>
                                                <td><div class="rocznik">${hi}</div></td>
                                                <td><div class="naped">${wybranySamochod.napedy}</div></td>
                                                <td><div class="nadwozie">${wybranySamochod.nadwozia}</div></td>
                                                <td><div class="skrzynia">${wybranySamochod.skrzynie}</div></td>
                                                <td><div class="kraj">${wybranySamochod.kraj}</div></td>
                                            </tr>
                                        </table>`;
                                
                                        // Wstawienie tabeli do div'a z unikalnym id
                                        var tabelaId = 'tabela-' + new Date().getTime();    // zwraca liczbę milisekund, które upłynęły od 1 stycznia 1970 roku,  np 1634567890123            
                                        var tabelaHtml = '<div id="' + tabelaId + '">' + tabela + '</div>'; // <div id="tabela-1634567890123">...</div>
                                
                                        //funkcja historii wyszukiwania
                                        function ZapiszDoHistorii(){
                                            historiaWyszukiwania.push(tabelaHtml);
                                            $("#historia").prepend(tabelaHtml);
                                        }
                                        ZapiszDoHistorii();
                                
                                        //INSTRUKCJE WARUNKOWE - KOLORY DIV W TABELI
                                
                                        //marka
                                        if(wylosowanySamochod.marka === wybranySamochod.marka){
                                            $("#" + tabelaId + " .marka").css("background-color", "olivedrab");
                                        } else {
                                            $("#" + tabelaId + " .marka").css("background-color", "darkred");
                                        }

                                        switch(wybranySamochod.marka){
                                            case "Lamborghini":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/lamborghiniLogo2.png" alt="Lamborghini Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Porsche":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/porscheLogo2.png" alt="Porsche Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Nissan":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/nissanLogo3.png" alt="Nissan Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Toyota":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/toyotaLogo6.png" alt="Toyota Logo" width="150" height="150" padding-top="50">`).css("display", "block");
                                                break;
                                            case "Ferrari":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/ferrariLogo.png" alt="Ferrari Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "BMW":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/bmwLogo.png" alt="BMW Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Pagani":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/paganiLogo.png" alt="Pagani Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "McLaren":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/mclarenLogo.png" alt="McLaren Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Bugatti":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/bugattiLogo.png" alt="Bugatti Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Koenigsegg":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/koenigseggLogo.png" alt="Koenigsegg Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Mazda":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/mazdaLogo.png" alt="Mazda Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Mercedes":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/mercedesLogo.png" alt="Mercedes Logo" width="150" height="150">`).css("display", "block");
                                                break;
                                            case "Audi":
                                                $("#" + tabelaId + " .marka").html(`<img src="img/audiLogo.png" alt="Audi Logo" width="150" height="150">`).css("display", "block");
                                        }   
                                        
                                        // Roczniki
                                        var [rokPoczatkowyWylosowany, rokKoncowyWylosowany] = wylosowanySamochod.roczniki.split(" - ");
                                        var [rokPoczatkowyWybrany, rokKoncowyWybrany] = wybranySamochod.roczniki.split(" - ");

                                        var rocznikWybrany;
                                        if (rokPoczatkowyWybrany === rokKoncowyWybrany) {
                                            rocznikWybrany = rokPoczatkowyWybrany;
                                        } else {
                                            rocznikWybrany = wybranySamochod.roczniki;
                                        }

                                        // Strzałki dla roczników
                                        var strzalkaPoczatek, strzalkaKoniec;

                                        if (rokPoczatkowyWybrany > rokPoczatkowyWylosowany) {
                                            strzalkaPoczatek = "↓";
                                        } else if (rokPoczatkowyWybrany < rokPoczatkowyWylosowany) {
                                            strzalkaPoczatek = "↑";
                                        } else {
                                            strzalkaPoczatek = "✓";
                                        }

                                        if (rokKoncowyWybrany > rokKoncowyWylosowany) {
                                            strzalkaKoniec = "↓";
                                        } else if (rokKoncowyWybrany < rokKoncowyWylosowany) {
                                            strzalkaKoniec = "↑";
                                        } else {
                                            strzalkaKoniec = "✓";
                                        }

                                        var rocznikiZeStrzalkami = `${strzalkaPoczatek}${rokPoczatkowyWybrany} - ${rokKoncowyWybrany}${strzalkaKoniec}`;

                                        // Kolorowanie tła w zależności od zgodności roczników
                                        if (rokPoczatkowyWylosowany == rokPoczatkowyWybrany && rokKoncowyWylosowany == rokKoncowyWybrany) {
                                            $("#" + tabelaId + " .rocznik").css("background-color", "olivedrab");
                                        } else if (rokPoczatkowyWylosowany == rokPoczatkowyWybrany || rokKoncowyWylosowany == rokKoncowyWybrany) {
                                            $("#" + tabelaId + " .rocznik").css("background-color", "goldenrod");
                                        } else {
                                            $("#" + tabelaId + " .rocznik").css("background-color", "darkred");
                                        }

                                        $("#" + tabelaId + " .rocznik").html(rocznikiZeStrzalkami);

                                        //napedy
                                        function podzielNapedy(napedy) {
                                            let pierwszy, drugi;
                                            napedy = napedy.replace(/\s+/g, '');
                                            if (napedy.includes(",")) {
                                                const podzielone = napedy.split(",");
                                                pierwszy = podzielone[0];
                                                drugi = podzielone[1];
                                            } else {
                                                pierwszy = napedy;
                                                drugi = null;
                                            }
                                            return { pierwszy, drugi };
                                        }
                                        
                                        const { pierwszy: pierwszyNapedWylosowany, drugi: drugiNapedWylosowany } = podzielNapedy(wylosowanySamochod.napedy);
                                        const { pierwszy: pierwszyNapedWybrany, drugi: drugiNapedWybrany } = podzielNapedy(wybranySamochod.napedy);
                                        
                                        if (
                                            (pierwszyNapedWylosowany === pierwszyNapedWybrany && drugiNapedWylosowany === drugiNapedWybrany)
                                        ) {
                                            $("#" + tabelaId + " .naped").css("background-color", "olivedrab");
                                        } else if (
                                            pierwszyNapedWylosowany === pierwszyNapedWybrany ||
                                            pierwszyNapedWylosowany === drugiNapedWybrany ||
                                            drugiNapedWylosowany === pierwszyNapedWybrany
                                        ) {
                                            $("#" + tabelaId + " .naped").css("background-color", "goldenrod");
                                        } else if(pierwszyNapedWylosowany != pierwszyNapedWybrany && drugiNapedWylosowany != pierwszyNapedWybrany) {
                                            $("#" + tabelaId + " .naped").css("background-color", "darkred");
                                        }
                                
                                        //nadwozia
                                        function podzielNadwozia(nadwozia) {
                                            let pierwsze, drugie, trzecie;
                                            nadwozia = nadwozia.replace(/\s+/g, '');
                                            if (nadwozia.includes(",")) {
                                                const podzielone = nadwozia.split(",");
                                                pierwsze = podzielone[0];
                                                drugie = podzielone[1] || null;
                                                trzecie = podzielone[2] || null;
                                            } else {
                                                pierwsze = nadwozia;
                                                drugie = null;
                                                trzecie = null;
                                            }
                                            return { pierwsze, drugie, trzecie };
                                        }
                                        
                                        const { pierwsze: pierwszeNadwozieWylosowane, drugie: drugieNadwozieWylosowane, trzecie: trzecieNadwozieWylosowane } = podzielNadwozia(wylosowanySamochod.nadwozia);
                                        const { pierwsze: pierwszeNadwozieWybrane, drugie: drugieNadwozieWybrane, trzecie: trzecieNadwozieWybrane } = podzielNadwozia(wybranySamochod.nadwozia);
                                        
                                        if (
                                            (pierwszeNadwozieWylosowane === pierwszeNadwozieWybrane && drugieNadwozieWylosowane === drugieNadwozieWybrane && trzecieNadwozieWylosowane === trzecieNadwozieWybrane) ||
                                            (drugieNadwozieWylosowane === null && drugieNadwozieWybrane === null && pierwszeNadwozieWylosowane === pierwszeNadwozieWybrane && trzecieNadwozieWylosowane === null && trzecieNadwozieWybrane === null)
                                        ) {
                                            $("#" + tabelaId + " .nadwozie").css("background-color", "olivedrab");
                                        } else if (
                                            (pierwszeNadwozieWylosowane && (pierwszeNadwozieWylosowane === pierwszeNadwozieWybrane || pierwszeNadwozieWylosowane === drugieNadwozieWybrane || pierwszeNadwozieWylosowane === trzecieNadwozieWybrane)) ||
                                            (drugieNadwozieWylosowane && (drugieNadwozieWylosowane === pierwszeNadwozieWybrane || drugieNadwozieWylosowane === drugieNadwozieWybrane || drugieNadwozieWylosowane === trzecieNadwozieWybrane)) ||
                                            (trzecieNadwozieWylosowane && (trzecieNadwozieWylosowane === pierwszeNadwozieWybrane || trzecieNadwozieWylosowane === drugieNadwozieWybrane || trzecieNadwozieWylosowane === trzecieNadwozieWybrane))
                                        ) {
                                            $("#" + tabelaId + " .nadwozie").css("background-color", "goldenrod");
                                        } else {
                                            console.log("NADWOZIA nie zgadzają się, kolor tła: darkred");
                                            $("#" + tabelaId + " .nadwozie").css("background-color", "darkred");
                                        }
                                        
                                        //skrzynie
                                        function podzielSkrzynie(skrzynie) {
                                            let pierwsza, druga;
                                            skrzynie = skrzynie.replace(/\s+/g, '');
                                            if (skrzynie.includes(",")) {
                                                const podzielone = skrzynie.split(",");
                                                pierwsza = podzielone[0];
                                                druga = podzielone[1];
                                            } else {
                                                pierwsza = skrzynie;
                                                druga = null;
                                            }
                                            return { pierwsza, druga };
                                        }
                                        
                                        const { pierwsza: pierwszaSkrzyniaWylosowana, druga: drugaSkrzyniaWylosowana } = podzielSkrzynie(wylosowanySamochod.skrzynie);
                                        const { pierwsza: pierwszaSkrzyniaWybrana, druga: drugaSkrzyniaWybrana } = podzielSkrzynie(wybranySamochod.skrzynie);
                                        
                                        if (
                                            (pierwszaSkrzyniaWylosowana === pierwszaSkrzyniaWybrana && drugaSkrzyniaWylosowana === drugaSkrzyniaWybrana) ||
                                            (pierwszaSkrzyniaWylosowana === drugaSkrzyniaWybrana && drugaSkrzyniaWylosowana === pierwszaSkrzyniaWybrana)
                                        ) {
                                            console.log("SKRZYNIE zgadzają się, kolor tła: olivedrab");
                                            $("#" + tabelaId + " .skrzynia").css("background-color", "olivedrab");
                                        } else if (
                                            pierwszaSkrzyniaWylosowana === pierwszaSkrzyniaWybrana ||
                                            pierwszaSkrzyniaWylosowana === drugaSkrzyniaWybrana ||
                                            drugaSkrzyniaWylosowana === pierwszaSkrzyniaWybrana ||
                                            drugaSkrzyniaWylosowana === drugaSkrzyniaWybrana
                                        ) {
                                            console.log("SKRZYNIE częściowo zgadzają się, kolor tła: goldenrod");
                                            $("#" + tabelaId + " .skrzynia").css("background-color", "goldenrod");
                                        } else {
                                            console.log("SKRZYNIE nie zgadzają się, kolor tła: darkred");
                                            $("#" + tabelaId + " .skrzynia").css("background-color", "darkred");
                                        }
                                        

                                        //kraj
                                        if(wylosowanySamochod.kraj == wybranySamochod.kraj){
                                            $("#" + tabelaId + " .kraj").css("background-color", "olivedrab");
                                        } else {
                                            $("#" + tabelaId + " .kraj").css("background-color", "darkred");
                                        }

                                        switch(wybranySamochod.kraj){
                                            case "Wlochy":
                                                $("#" + tabelaId + " .kraj").html(`<img src="img/italy.png" alt="Italy Flag" width="150" height="150">`).css("display", "block");
                                                break;
                                                case "Niemcy":
                                                    $("#" + tabelaId + " .kraj").html(`<img src="img/germany2.png" alt="Germany Flag" width="150" height="150">`).css("display", "block");
                                                    break;
                                                case "Japonia":
                                                    $("#" + tabelaId + " .kraj").html(`<img src="img/japan2.png" alt="Japan Flag" width="150" height="150">`).css("display", "block");
                                                    break;
                                                case "Szwecja":
                                                    $("#" + tabelaId + " .kraj").html(`<img src="img/sweden.png" alt="Sweden Flag" width="150" height="150">`).css("display", "block");
                                                    break;
                                                case "Francja":
                                                    $("#" + tabelaId + " .kraj").html(`<img src="img/france.png" alt="France Flag" width="150" height="150">`).css("display", "block");
                                                    break;
                                                case "W.Brytania":
                                                    $("#" + tabelaId + " .kraj").html(`<img src="img/uk.png" alt="UK Flag" width="150" height="150">`).css("display", "block");
                                                    break;
                                                    
                                        }

                                    }
                                }
                            }
                        });
                    });
                } else {
                    // Wyświetl czas pozostały do kolejnej gry - odliczanie do 24:00
                    console.log("Nie możesz zagrać. Gra została już rozpoczęta.");
                    console.log("Pozostały czas do północy: " + remainingTime.hours + "h " + remainingTime.minutes + "m " + remainingTime.seconds + "s");
                    
                    
                    setInterval(function() {
                        console.log("Wysyłanie zapytania do checkGameStatus.php...");
                        $.ajax({
                            url: "checkGameStatus.php",
                            method: "POST",
                            success: function(response) {
                                console.log("Odpowiedź z checkGameStatus.php:", response);
                                var data = JSON.parse(response);
                                console.log("Dane z odpowiedzi:", data);
                    
                                var zdjecie = data.sciezkaDoZdjecia;
                                var remainingTime = data.remainingTime;
                                var model = data.wybranyModel;
                                var marka = data.wybranaMarka;
                    
                                $("#win").html(`
                                    <div class="win-content">
                                        <img src="${zdjecie}" alt="Zdjęcie samochodu" class="win-image">
                                        <div class="kontener">
                                            <div class="win-text">Brawo! Wylosowanym samochodem był ${marka} ${model}</div>
                                            <div class="countdown">Kolejna gra za: ${remainingTime.hours} h ${remainingTime.minutes} m ${remainingTime.seconds} s</div>
                                        </div>
                                    </div>
                                `).css("display", "block");
                    
                                console.log("Wyświetlono wynik!");
                            },
                            error: function(xhr, status, error) {
                                console.error("Błąd zapytania do checkGameStatus.php:", error);
                            }
                        });
                    }, 1000);
                    
                    
                    
                    
                    
                }
            }
        });
    }
    ustawCzyMoznaZagrac()
    
});