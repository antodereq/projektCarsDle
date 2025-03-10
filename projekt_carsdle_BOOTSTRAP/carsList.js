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

    // po załadowaniu strony wyświetlają się wszystkie samochody (zdjęcie, marka, model)
        $.ajax({
            url: "all.php",
            method: "POST",
            success: function (data) {
                // Parsowanie danych JSON zwróconych z PHP
                var samochody = JSON.parse(data);

                if (samochody.length > 0) {
                    
                    var carFromList = "";
                    

                    samochody.forEach(function (samochod) {
                        var zdjecie = samochodyZdjecia[samochod.model];
                        carFromList += `
                                <div class="suggestion" data-suggestion="${samochod.marka} ${samochod.model}">
                                    <table>
                                        <tr>
                                            <td><img src="${zdjecie}" alt=" zdjęcie ${samochod.model}" style="width: 150px; height: auto;"></td>
                                            <td>${samochod.marka} ${samochod.model}</td>
                                        </tr>
                                        
                                    </table>
                                    
                                </div>;
                                <div id="tabelaDiv" style="display: none;"></div>`
                        
                    });

                    $("#listaSamochodow").html(carFromList).css("display", "block");
                } else {
                    $("#listaSamochodow").css("display", "none");
                }
            }
        });
    
        $(document).on('click', '.suggestion', function () {
            var fullSuggestion = $(this).data('suggestion');  // Pobieramy pełną sugestię
            var suggestionParts = fullSuggestion.split(' ');   // Dzielimy na części (marka + model)
        
            var marka = suggestionParts[0];                    // Pierwsza część to marka
            var model = suggestionParts.slice(1).join(' ');    // Reszta to model, dołączamy w razie potrzeby
        
            console.log("Wybrana marka:", marka);
            console.log("Wybrany model:", model);
        
            // Wysyłamy dane (marka i model) do selected.php
            $.ajax({
                url: "selected.php",  // Przekierowanie do selected.php
                method: "POST",  // Wysłanie danych metodą POST
                data: { marka: marka, model: model },  // Wysyłanie marki i modelu
                success: function(response) {
                    console.log("Odpowiedź z selected.php:", response);  // Sprawdzamy odpowiedź z serwera
        
                    // Sprawdzamy, czy odpowiedź zawiera błąd
                    var wybranySamochod = JSON.parse(response);  // Parsowanie odpowiedzi JSON
        
                    // Sprawdzamy, czy w odpowiedzi jest błąd
                    if(wybranySamochod.error) {
                        $("#tabelaDiv").html(wybranySamochod.error).css("display", "block");  // Wyświetlamy błąd
                    } else {
                        // Jeśli nie ma błędu, wyświetlamy szczegóły samochodu
                        var zdjecie = samochodyZdjecia[wybranySamochod.model];  // Pobieramy odpowiednie zdjęcie
                        var tabela = `
                            <table>
                                <tr>
                                    <td><img src="${zdjecie}" alt="Zdjęcie ${wybranySamochod.model}" style="width: 150px; height: auto;"></td>
                                    <td><div class="marka">${wybranySamochod.marka}</div></td>
                                    <td><div class="model">${wybranySamochod.model}</div></td>
                                    <td><div class="rocznik">${wybranySamochod.roczniki}</div></td>
                                    <td><div class="naped">${wybranySamochod.napedy}</div></td>
                                    <td><div class="nadwozie">${wybranySamochod.nadwozia}</div></td>
                                    <td><div class="skrzynia">${wybranySamochod.skrzynie}</div></td>
                                    <td><div class="kraj">${wybranySamochod.kraj}</div></td>
                                </tr>
                            </table>
                        `;
                        $("#tabelaDiv").html(tabela).css("display", "block");  // Wyświetlamy szczegóły w tabeli
                    }
                }
            });
            $(document).click(function (event) {
                // Sprawdzamy, czy kliknięcie miało miejsce poza divem .suggestion
                if (!$(event.target).closest('.suggestion').length) {
                    // Jeśli kliknięcie nie miało miejsca w obrębie .suggestion, ukrywamy tabelę
                    $(".suggestion .tabela").css("display", "none");
                }
            });
        });
        
        
});



