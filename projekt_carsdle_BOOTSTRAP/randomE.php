<?php
$connection = mysqli_connect("localhost", "root", "", "carsdle");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}
$minIdQuery = "SELECT MIN(id) AS min_id
            FROM (
            SELECT MIN(samochody.id) AS id
            FROM samochody
            JOIN marki ON samochody.marka_id = marki.id
            GROUP BY marki.marka, samochody.model
            ) AS unique_cars";
$resultMinId = mysqli_query($connection, $minIdQuery);
$rowMinId = mysqli_fetch_assoc($resultMinId);
$minId = $rowMinId['min_id'];

// Pobranie maksymalnego ID
$maxIdQuery = "SELECT MAX(id) AS max_id FROM samochody";
$resultMaxId = mysqli_query($connection, $maxIdQuery);
$rowMaxId = mysqli_fetch_assoc($resultMaxId);
$maxId = $rowMaxId['max_id'];

$idQuery = "SELECT MIN(samochody.id) AS id
        FROM samochody
        JOIN marki ON samochody.marka_id = marki.id
        JOIN napedy ON samochody.naped_id = napedy.id
        JOIN nadwozia ON samochody.nadwozie_id = nadwozia.id
        JOIN skrzynie ON samochody.skrzynia_id = skrzynie.id
        JOIN kraje ON samochody.kraj_id = kraje.id
        GROUP BY marki.marka, samochody.model
        ORDER BY id";
$resultId = mysqli_query($connection, $idQuery);

$availableIds = [];
while ($rowId = mysqli_fetch_assoc($resultId)) {
    $availableIds[] = $rowId['id'];
}

$usedIds = [];

if (!empty($availableIds)) {
    do {
        $losoweId = $availableIds[array_rand($availableIds)];
    } while (in_array($losoweId, $usedIds)); 

    $usedIds[] = $losoweId;

    $losowySamochodQuery = "SELECT marki.marka, samochody.model, 
                GROUP_CONCAT(DISTINCT napedy.naped) AS napedy,
                GROUP_CONCAT(DISTINCT nadwozia.nadwozie) AS nadwozia,
                GROUP_CONCAT(DISTINCT skrzynie.skrzynia) AS skrzynie,
                CONCAT(MIN(samochody.rocznik), ' - ', MAX(samochody.rocznik)) AS roczniki,
                kraje.kraj
                FROM samochody
                JOIN marki ON samochody.marka_id = marki.id
                JOIN napedy ON samochody.naped_id = napedy.id
                JOIN nadwozia ON samochody.nadwozie_id = nadwozia.id
                JOIN skrzynie ON samochody.skrzynia_id = skrzynie.id
                JOIN kraje ON samochody.kraj_id = kraje.id
                WHERE samochody.id IN (
                    SELECT id FROM samochody
                    WHERE marka_id = (SELECT marka_id FROM samochody WHERE id = '{$losoweId}')
                    AND model = (SELECT model FROM samochody WHERE id = '{$losoweId}')
                )
                GROUP BY marki.marka, samochody.model, kraje.kraj";

    $resultLosowySamochod = mysqli_query($connection, $losowySamochodQuery);
    $rowLosowySamochod = mysqli_fetch_assoc($resultLosowySamochod);

    

    // Przekazanie danych w formacie JSON
    echo json_encode($rowLosowySamochod);
} else {
    echo json_encode(["error" => "random.php linia 75 coś się zjebało"]);
}
?>
