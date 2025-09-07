$(document).ready(function() {
  // Map miniatur (opcjonalne – brak wpisu = brak obrazka, bez 404)
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

  // 1) Pobierz listę i zbuduj siatkę kart (.col + .card)
  $.ajax({
    url: "all.php",
    method: "POST"
  })
  .done(function(data) {
    let samochody = [];
    try { samochody = JSON.parse(data); } catch (e) {
      console.warn("all.php: nie-JSON:", e, data);
      return;
    }

    if (!Array.isArray(samochody) || !samochody.length) {
      $("#listaSamochodow").html('<div class="text-center text-muted">Brak danych.</div>');
      return;
    }

    const html = samochody.map((s) => {
      const img = samochodyZdjecia[s.model];
      const imgHtml = img
        ? `<img src="${img}" class="card-img-top" alt="Zdjęcie ${s.model}" style="aspect-ratio:16/9;object-fit:cover;">`
        : '';
      return `
        <div class="col">
          <div class="card h-100 shadow-sm car-item" data-marka="${s.marka}" data-model="${s.model}">
            ${imgHtml}
            <div class="card-body">
              <div class="small text-muted">${s.marka}</div>
              <h6 class="card-title mb-0">${s.model}</h6>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#listaSamochodow").html(html);
  });

  // 2) Klik na kartę → pobierz szczegóły i pokaż modal (szeroki)
  $(document).on('click', '.car-item', function() {
    const marka = $(this).data('marka');
    const model = $(this).data('model');

    $.ajax({
      url: "selected.php",
      method: "POST",
      data: { marka, model }
    })
    .done(function(resp) {
      let car = {};
      try { car = JSON.parse(resp); } catch (e) {
        console.warn("selected.php: nie-JSON:", e, resp);
        return;
      }
      if (!car || car.error) {
        $('#carModalTitle').text('Błąd');
        $('#carModalBody').html('<div class="alert alert-danger">Nie można wczytać specyfikacji.</div>');
        new bootstrap.Modal('#carModal').show();
        return;
      }

      const img = samochodyZdjecia[car.model];
      const imgHtml = img ? `<img src="${img}" alt="Zdjęcie ${car.model}" class="img-fluid rounded shadow-sm">` : '';

      const table = `
        <div class="row g-3 align-items-start">
          <div class="col-md-5">${imgHtml}</div>
          <div class="col-md-7">
            <div class="table-responsive">
              <table class="table table-striped table-bordered align-middle mb-0">
                <thead class="table-dark">
                  <tr>
                    <th>Marka</th>
                    <th>Model</th>
                    <th>Rocznik</th>
                    <th>Napędy</th>
                    <th>Nadwozia</th>
                    <th>Skrzynie</th>
                    <th>Kraj</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${car.marka}</td>
                    <td class="fw-semibold">${car.model}</td>
                    <td class="text-center">${car.roczniki}</td>
                    <td class="text-center">${car.napedy}</td>
                    <td class="text-center">${car.nadwozia}</td>
                    <td class="text-center">${car.skrzynie}</td>
                    <td class="text-center">${car.kraj}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      $('#carModalTitle').text(`${car.marka} ${car.model}`);
      $('#carModalBody').html(table);
      new bootstrap.Modal('#carModal').show();
    })
    .fail(function(xhr){
      $('#carModalTitle').text('Błąd');
      $('#carModalBody').html('<div class="alert alert-danger">Wystąpił błąd po stronie serwera.</div>');
      new bootstrap.Modal('#carModal').show();
    });
  });
});
