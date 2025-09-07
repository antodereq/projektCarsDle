<?php
// ----------------------------------------------
// carsDle.pl — Zgłoś błąd (wszystkie pola wymagane + upload)
// ----------------------------------------------
$sent = false;
$errors = [];

// Wartości do re-populacji formularza
$full_name = '';
$email     = '';
$subject   = '';
$message   = '';

// Ustawienia uploadu
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10 MB
$allowed_ext  = ['png','jpg','jpeg','webp','gif','pdf','txt','log','zip','7z','rar'];
$allowed_mime = [
  'image/png','image/jpeg','image/webp','image/gif',
  'application/pdf','text/plain','application/zip',
  'application/x-7z-compressed','application/x-rar-compressed'
];

$uploaded_info = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Pobranie i wstępne sanityzowanie
  $full_name = trim($_POST['full_name'] ?? '');
  $email     = trim($_POST['email'] ?? '');
  $subject   = trim($_POST['subject'] ?? '');
  $message   = trim($_POST['message'] ?? '');

  // --- Walidacja pól wymaganych ---
  if ($full_name === '')                 $errors[] = "Podaj imię i nazwisko.";
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Podaj poprawny adres e-mail.";
  if ($subject === '')                   $errors[] = "Podaj temat.";
  if ($message === '')                   $errors[] = "Opisz błąd / sugestię.";

  // --- Walidacja pliku (wymagany) ---
  if (!isset($_FILES['attachment']) || $_FILES['attachment']['error'] === UPLOAD_ERR_NO_FILE) {
    $errors[] = "Dołącz plik (zrzut ekranu, log itp.).";
  } else {
    $file = $_FILES['attachment'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
      $errors[] = "Nie udało się wgrać pliku (kod błędu: {$file['error']}).";
    } else {
      if ($file['size'] > MAX_FILE_SIZE) {
        $errors[] = "Plik jest zbyt duży. Maksymalny rozmiar to 10 MB.";
      }

      // Sprawdzenie rozszerzenia i MIME
      $origName = $file['name'];
      $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
      if (!in_array($ext, $allowed_ext, true)) {
        $errors[] = "Niedozwolone rozszerzenie pliku (.$ext). Dozwolone: " . implode(', ', $allowed_ext) . ".";
      }

      // MIME z Fileinfo (jeśli dostępne)
      $mime = null;
      if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
          $mime = finfo_file($finfo, $file['tmp_name']);
          finfo_close($finfo);
        }
      }
      if ($mime && !in_array($mime, $allowed_mime, true)) {
        // Niektóre archiwa mogą mieć MIME różne w zależności od serwera — nie blokujemy twardo,
        // ale jeśli jest ewidentnie PHP/skrypt, blokuj.
        if (preg_match('/php|x\-php|octet-stream/i', (string)$mime)) {
          $errors[] = "Niedozwolony typ pliku.";
        }
      }

      // Zapis pliku (jeśli brak błędów)
      if (!$errors) {
        $uploadsDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads';
        if (!is_dir($uploadsDir)) {
          @mkdir($uploadsDir, 0755, true);
        }
        if (!is_writable($uploadsDir)) {
          $errors[] = "Katalog uploads/ nie jest zapisywalny.";
        } else {
          // Bezpieczna nazwa + unikalnik
          $safeBase = preg_replace('/[^a-zA-Z0-9\-\._]/', '_', basename($origName));
          $unique   = date('Ymd_His') . '_' . bin2hex(random_bytes(4));
          $target   = $uploadsDir . DIRECTORY_SEPARATOR . $unique . '_' . $safeBase;

          if (!move_uploaded_file($file['tmp_name'], $target)) {
            $errors[] = "Nie udało się zapisać pliku na serwerze.";
          } else {
            $uploaded_info = [
              'original' => $origName,
              'saved'    => $target
            ];
          }
        }
      }
    }
  }

  // --- Jeśli brak błędów: tu dodaj swoją wysyłkę maila / zapis do bazy ---
  if (!$errors) {
    // Przykład: zbuduj krótki log zgłoszenia (do später lub maila)
    // $log = sprintf("[%s] %s <%s>\nTemat: %s\nTreść:\n%s\nPlik: %s\n---\n",
    //   date('Y-m-d H:i:s'), $full_name, $email, $subject, $message, $uploaded_info['saved'] ?? 'brak');

    // TODO: Wyślij e-mail / zapisz do DB.
    $sent = true;

    // Wyczyść formularz po sukcesie
    $full_name = $email = $subject = $message = '';
  }
}
?>
<!DOCTYPE html>
<html lang="pl-PL">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>carsDle - Zgłoś błąd</title>
  <link rel="icon" href="img/favicon.png" type="image/svg+xml">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light">
  <!-- NAV (spójny) -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">cars<span class="text-danger">Dle</span>.pl</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Przełącz nawigację">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto gap-1">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Graj</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="carsDle.html">Standard Mode</a></li>
              <li><a class="dropdown-item" href="endlessMode.html">Endless Mode</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="jakGrac.html">Jak grać?</a></li>
          <li class="nav-item"><a class="nav-link" href="bazaSamochodow.html">Baza samochodów</a></li>
          <li class="nav-item"><a class="nav-link" href="oAutorze.html">O autorze i stronie</a></li>
          <li class="nav-item"><a class="nav-link active" aria-current="page" href="zglosBlad.php">Zgłoś błąd</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container my-4">
    <header class="text-center mb-3">
      <h1 class="site-title display-6 fw-bold">cars<span class="text-danger">Dle</span>.pl</h1>
      <p class="text-muted mb-0">Masz sugestię lub znalazłeś błąd? Wypełnij formularz i dołącz plik.</p>
    </header>

    <?php if ($errors): ?>
      <div class="alert alert-danger mx-auto" style="max-width: 900px;" role="alert">
        <strong>Uff…</strong> popraw poniższe pola:
        <ul class="mb-0">
          <?php foreach ($errors as $e): ?>
            <li><?= htmlspecialchars($e) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php elseif ($sent): ?>
      <div class="alert alert-success mx-auto" style="max-width: 900px;" role="alert">
        ✅ Dziękujemy za zgłoszenie! Otrzymaliśmy je poprawnie.
        <?php if ($uploaded_info): ?>
          <div class="small text-muted mt-1">
            Załącznik: <?= htmlspecialchars($uploaded_info['original']) ?> — zapisano.
          </div>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <section class="mx-auto" style="max-width: 900px;">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <form method="post" action="zglosBlad.php" enctype="multipart/form-data" novalidate>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="full_name" class="form-label">Imię i nazwisko *</label>
                <input type="text" class="form-control" id="full_name" name="full_name"
                       value="<?= htmlspecialchars($full_name) ?>" required>
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">E-mail *</label>
                <input type="email" class="form-control" id="email" name="email"
                       value="<?= htmlspecialchars($email) ?>" required>
              </div>

              <div class="col-12">
                <label for="subject" class="form-label">Temat *</label>
                <input type="text" class="form-control" id="subject" name="subject"
                       value="<?= htmlspecialchars($subject) ?>" required>
              </div>

              <div class="col-12">
                <label for="message" class="form-label">Opis błędu / sugestii *</label>
                <textarea class="form-control" id="message" name="message" rows="6" required><?= htmlspecialchars($message) ?></textarea>
              </div>

              <div class="col-12">
                <label for="attachment" class="form-label">Załącz plik (max 10 MB)</label>
                <input type="file" class="form-control" id="attachment" name="attachment" 
                       accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.log,.zip,.7z,.rar">
                <div class="form-text">Dozwolone: PNG, JPG, WEBP, GIF, PDF, TXT/LOG, ZIP/7Z/RAR.</div>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <a href="carsDle.html" class="btn btn-outline-secondary">Wróć</a>
              <button type="submit" class="btn btn-primary">Wyślij zgłoszenie</button>
            </div>
          </form>
        </div>
      </div>
      <p class="text-muted small mt-2 mb-0">Pola oznaczone * są wymagane.</p>
    </section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
