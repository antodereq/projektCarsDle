<?php
include("database.php");

if (!empty($_POST['model'])) {
    $model = $_POST['model'];

    
    $query = "SELECT marki.marka, samochody.model, 
                GROUP_CONCAT(DISTINCT napedy.naped SEPARATOR ', ') AS napedy,
                GROUP_CONCAT(DISTINCT nadwozia.nadwozie SEPARATOR ', ') AS nadwozia,
                GROUP_CONCAT(DISTINCT skrzynie.skrzynia SEPARATOR ', ') AS skrzynie,
                CONCAT(MIN(samochody.rocznik), ' - ', MAX(samochody.rocznik)) AS roczniki, kraje.kraj
                FROM samochody
                JOIN marki ON samochody.marka_id = marki.id
                JOIN napedy ON samochody.naped_id = napedy.id
                JOIN nadwozia ON samochody.nadwozie_id = nadwozia.id
                JOIN skrzynie ON samochody.skrzynia_id = skrzynie.id
                JOIN kraje ON samochody.kraj_id = kraje.id
                WHERE samochody.model LIKE '{$model}'
                GROUP BY marki.marka, samochody.model, kraje.kraj";

    $wybranySamochodResult = mysqli_query($connection, $query);

    if (mysqli_num_rows($wybranySamochodResult) > 0) {
        $wybranySamochod = mysqli_fetch_assoc($wybranySamochodResult);
        echo json_encode($wybranySamochod);
    } else {
        $wybranySamochod = array('error' => "Nie znaleziono wyników dla modelu: " . $model);
        echo json_encode($wybranySamochod);
    }
}
?>
