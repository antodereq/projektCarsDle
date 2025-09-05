<?php
include("database.php");
class Samochod {
    public function __construct(
        public $id,
        public $marka,
        public $model,
        public $napedy,
        public $nadwozia,
        public $skrzynie,
        public $roczniki,
        public $kraj
    ) {}
}

if (isset($_POST['input'])) {
    $przechowywana = $_POST['input'];

    $query = "SELECT MIN(samochody.id) AS id,
              marki.marka, samochody.model, 
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
              WHERE samochody.model LIKE '{$przechowywana}%'
              GROUP BY marki.marka, samochody.model";

    $result = mysqli_query($connection, $query);

    $samochody = [];

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $samochody[] = new Samochod(
                $row['id'],
                $row['marka'],
                $row['model'],
                $row['napedy'],
                $row['nadwozia'],
                $row['skrzynie'],
                $row['roczniki'],
                $row['kraj']
            );
        }
        // Zwracanie danych w formacie JSON
        echo json_encode($samochody);
    } else {
        // Zwracanie pustej tablicy w przypadku braku wyników
        echo json_encode([]);
    }
}
?>
