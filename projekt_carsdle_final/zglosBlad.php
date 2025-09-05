<!DOCTYPE html>
<html lang="pl-PL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="script.js"></script>
    <title>carsDle - Zgłoś błąd</title>
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">cars<span class="text-danger">Dle</span>.pl</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="carsDle.html">Graj</a></li>
                    <li class="nav-item"><a class="nav-link" href="jakGrac.html">Jak grać?</a></li>
                    <li class="nav-item"><a class="nav-link" href="bazaSamochodow.html">Baza samochodów</a></li>
                    <li class="nav-item"><a class="nav-link" href="oAutorze.html">O autorze i stronie</a></li>
                    <li class="nav-item"><a class="nav-link active" href="zglosBlad.php">Zgłoś błąd</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5">
        <div class="text-center">
            <header class="fw-bold">cars<span class="text-danger">Dle</span>.pl</header>
        </div>
        <h2 class="text-center">Zgłoś błąd</h2>
        <p class="text-muted text-center">Jeśli zauważyłeś błąd w grze, opisz go jak najdokładniej. <br>Będę wdzięczny, jeśli dołączysz zrzut ekranu przedstawiający błąd - ułatwi mi to pracę.</p>
        <div class="bg-white p-4 rounded shadow-sm mx-auto" style="max-width: 600px;">
            <form action="submitError.php" method="POST" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="name" class="form-label">Imię i nazwisko</label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="np. Jan Kowalski" required>
                </div>
                <div class="mb-3">
                    <label for="mail" class="form-label">Adres mail</label>
                    <input type="email" class="form-control" id="mail" name="mail" placeholder="np. janKowalski@gmail.com" required>
                </div>
                <div class="mb-3">
                    <label for="errorDescription" class="form-label">Opis błędu</label>
                    <textarea class="form-control" id="errorDescription" name="errorDescription" rows="4" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="screenshot" class="form-label">Dodaj zrzut ekranu (opcjonalnie)</label>
                    <input type="file" class="form-control" id="screenshot" name="screenshot" accept="image/*">
                </div>
                <div class="d-flex justify-content-between">
                    <button type="reset" class="btn btn-secondary">Wyczyść formularz</button>
                    <button type="submit" class="btn btn-danger">Zgłoś błąd</button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>