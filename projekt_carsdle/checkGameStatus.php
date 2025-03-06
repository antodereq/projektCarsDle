<?php
    session_start();

    // Ustawiamy początkową wartość zmiennych sesji, jeśli nie zostały jeszcze ustawione
    if (!isset($_SESSION['czyJuzZagrano'])) {
        $_SESSION['czyJuzZagrano'] = false;
    }
    if (!isset($_SESSION['sciezkaDoZdjecia'])) {
        $_SESSION['sciezkaDoZdjecia'] = 'hi';
    }
    if (!isset($_SESSION['wybranyModel'])) {
        $_SESSION['wybranyModel'] = '';
    }
    if (!isset($_SESSION['wybranaMarka'])) {
        $_SESSION['wybranaMarka'] = '';
    }

    // Obliczanie czasu pozostałego do północy
    $currentDate = new DateTime();
    $midnight = new DateTime('tomorrow midnight');
    $interval = $currentDate->diff($midnight);

    // Formatujemy wynik na godziny, minuty i sekundy
    $remainingTime = [
        'hours' => $interval->h,
        'minutes' => $interval->i,
        'seconds' => $interval->s
    ];

    // Sprawdzamy, czy trzeba zresetować sesję (np. o 24:00)
    $currentDateStr = $currentDate->format('Y-m-d');
    if (!isset($_SESSION['session_start_date']) || $_SESSION['session_start_date'] !== $currentDateStr) {
        session_unset();
        session_destroy();
        session_start();
        $_SESSION['session_start_date'] = $currentDateStr;
        $_SESSION['sciezkaDoZdjecia'] = '';
        $_SESSION['wybranyModel'] = '';
        $_SESSION['wybranaMarka'] = '';
    }

    // Obsługa zmiany wartości zmiennych sesyjnych
    if (isset($_POST['czyJuzZagrano'])) {
        $_SESSION['czyJuzZagrano'] = $_POST['czyJuzZagrano'] === 'true';
    }
    if (isset($_POST['sciezkaDoZdjecia'])) {
        $_SESSION['sciezkaDoZdjecia'] = $_POST['sciezkaDoZdjecia'];
    }
    if (isset($_POST['wybranyModel'])) {
        $_SESSION['wybranyModel'] = $_POST['wybranyModel'];
    }
    if (isset($_POST['wybranaMarka'])) {
        $_SESSION['wybranaMarka'] = $_POST['wybranaMarka'];
    }

    // Zwracamy wszystkie istotne dane jako JSON
    echo json_encode([
        'czyMoznaZagrac' => $_SESSION['czyJuzZagrano'],
        'remainingTime' => $remainingTime,
        'sciezkaDoZdjecia' => $_SESSION['sciezkaDoZdjecia'],
        'wybranyModel' => $_SESSION['wybranyModel'],
        'wybranaMarka' => $_SESSION['wybranaMarka']
    ]);
?>
