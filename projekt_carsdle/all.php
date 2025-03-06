<?php
    include("database.php");
    
    $query2 = "SELECT MIN(samochody.id) AS id,
    marki.marka, samochody.model, 
    GROUP_CONCAT(DISTINCT napedy.naped) AS dostepne_napedy,
    GROUP_CONCAT(DISTINCT nadwozia.nadwozie) AS dostepne_nadwozia, 
    GROUP_CONCAT(DISTINCT skrzynie.skrzynia) AS dostepne_skrzynie,
    CONCAT(MIN(samochody.rocznik), ' - ', MAX(samochody.rocznik)) AS lata_produkcji,
    kraje.kraj
    FROM samochody 
    JOIN marki ON samochody.marka_id = marki.id
    JOIN napedy ON samochody.naped_id = napedy.id
    JOIN nadwozia ON samochody.nadwozie_id = nadwozia.id
    JOIN skrzynie ON samochody.skrzynia_id = skrzynie.id
    JOIN kraje ON samochody.kraj_id = kraje.id
    GROUP BY marki.marka, samochody.model
    ORDER BY samochody.id";

    $result2 = mysqli_query($connection, $query2); 

    $samochody = array();

    if (mysqli_num_rows($result2) > 0) { 
        while ($row = mysqli_fetch_assoc($result2)) {
            $samochody[] = $row;
        }
    }

    echo json_encode($samochody);
?>