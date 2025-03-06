CREATE DATABASE carsDle;
USE carsDle;


CREATE TABLE IF NOT EXISTS `marki` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `marka` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `kraje` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `kraj` varchar(100) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `nadwozia` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `nadwozie` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `skrzynie` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `skrzynia` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `napedy` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `naped` varchar(4) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `samochody` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `marka_id` int NOT NULL,
    `model` varchar(100) NOT NULL,
    `naped_id` int NOT NULL,
    `nadwozie_id` int NOT NULL,
    `skrzynia_id` int NOT NULL,
    `kraj_id` int NOT NULL,
    `rocznik` int NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT FOREIGN KEY (`marka_id`) REFERENCES `marki`(`id`),
    CONSTRAINT FOREIGN KEY (`naped_id`) REFERENCES `napedy`(`id`),
    CONSTRAINT FOREIGN KEY (`nadwozie_id`) REFERENCES `nadwozia`(`id`),
    CONSTRAINT FOREIGN KEY (`skrzynia_id`) REFERENCES `skrzynie`(`id`),
    CONSTRAINT FOREIGN KEY (`kraj_id`) REFERENCES `kraje`(`id`)
);

INSERT INTO marki (marka) VALUES 
('Lamborghini'),
('Ferrari'),
('Pagani'),
('Porsche'),
('BMW'),
('Audi'),
('Mercedes'),
('Koenigsegg'),
('Bugatti'),
('Nissan'),
('Toyota'),
('Mazda'),
('Honda'),
('Subaru'),
('Mitsubishi'),
('Dodge'),
('Ford'),
('McLaren');

INSERT INTO kraje (kraj) VALUES 
('Wlochy'),
('Niemcy'),
('Szwecja'),
('Francja'),
('Japonia'),
('Ameryka'),
('W.Brytania');

INSERT INTO nadwozia (nadwozie) VALUES 
('Sedan'),
('Coupe'),
('Hatchback'),
('Suv'), 
('Kombi'),
('Roadster'),
('Cabrio'),
('Targa');

INSERT INTO skrzynie (skrzynia) VALUES 
('Manualna'),
('Automatyczna'),
('Sekwencyjna');

INSERT INTO napedy (naped) VALUES 
('RWD'),
('AWD'),
('FWD');


INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(1, 'Aventador', 2, 2, 2, 1, 2011),
(1, 'Aventador', 2, 6, 2, 1, 2022),

(1, 'Huracan', 2, 2, 2, 1, 2014),
(1, 'Huracan', 1, 6, 2, 1, 2023),

(1, 'Gallardo', 2, 2, 2, 1, 2003),
(1, 'Gallardo', 1, 6, 1, 1, 2013),

(1, 'Murcielago', 2, 2, 1, 1, 2001),
(1, 'Murcielago', 2, 6, 2, 1, 2010),

(1, 'Diablo', 2, 2, 1, 1, 2002),
(1, 'Diablo', 2, 6, 1, 1, 1999),

(1, 'Countach', 1, 2, 1, 1, 1974),
(1, 'Countach', 1, 2, 1, 1, 1990),

(1, 'Revuelto', 2, 2, 2, 1, 2023),
(1, 'Revuelto', 2, 2, 2, 1, 2025),

(1, 'Urus', 2, 4, 2, 1, 2018),
(1, 'Urus', 2, 4, 2, 1, 2025);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(2, 'F40', 1, 2, 1, 1, 1987),
(2, 'F40', 1, 2, 1, 1, 1992),

(2, 'F50', 1, 2, 1, 1, 1992),
(2, 'F50', 1, 6, 1, 1, 1997),

(2, 'LaFerrari', 1, 2, 2, 1, 2013),
(2, 'LaFerrari', 1, 6, 2, 1, 2018),

(2, '812', 1, 2, 2, 1, 2017),
(2, '812', 1, 6, 2, 1, 2025),

(2, 'SF90', 2, 2, 2, 1, 2019),
(2, 'SF90', 2, 6, 2, 1, 2019),

(2, 'Enzo', 1, 2, 2, 1, 2002),
(2, 'Enzo', 1, 2, 2, 1, 2004);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(3, 'Zonda', 1, 2, 1, 1, 1999),
(3, 'Zonda', 1, 6, 2, 1, 2013),

(3, 'Huayra', 1, 2, 2, 1, 2011),
(3, 'Huayra', 1, 6, 2, 1, 2022),

(3, 'Utopia', 1, 2, 1, 1, 2023),
(3, 'Utopia', 1, 2, 2, 1, 2025);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(4, 'Carrera GT', 1, 2, 1, 2, 2004),
(4, 'Carrera GT', 1, 2, 1, 2, 2007),

(4, '918 Spyder', 2, 8, 2, 2, 2015),

(4, '911 GT3 RS', 1, 2, 2, 2, 2006),
(4, '911 GT3 RS', 1, 2, 1, 2, 2025);


INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(5, 'M3 E30', 1, 2, 1, 2, 1986),
(5, 'M3 E30', 1, 7, 1, 2, 1991),
(5, 'M3 E36', 1, 2, 1, 2, 1992),
(5, 'M3 E36', 1, 1, 1, 2, 1999),
(5, 'M3 E36', 1, 7, 2, 2, 1999),
(5, 'M3 E46', 1, 2, 1, 2, 2000),
(5, 'M3 E46', 1, 7, 2, 2, 2006),
(5, 'M3 E90/E92/E93', 1, 1, 1, 2, 2007),
(5, 'M3 E90/E92/E93', 1, 2, 2, 2, 2007),
(5, 'M3 E90/E92/E93', 1, 7, 2, 2, 2013),
(5, 'M3 F80', 1, 1, 1, 2, 2014),
(5, 'M3 F80', 1, 1, 2, 2, 2020),
(5, 'M3 G80', 1, 1, 1, 2, 2020),
(5, 'M3 G80', 2, 1, 2, 2, 2025),

(5, 'M4 F82', 1, 2, 1, 2, 2014),
(5, 'M4 F82', 1, 2, 2, 2, 2020),
(5, 'M4 G82', 1, 2, 1, 2, 2020),
(5, 'M4 G82', 2, 2, 2, 2, 2025),

(5, 'M5 E28', 1, 2, 1, 2, 1985),
(5, 'M5 E28', 1, 2, 2, 2, 1988),
(5, 'M5 E34', 1, 2, 1, 2, 1988),
(5, 'M5 E34', 1, 2, 2, 2, 1995),
(5, 'M5 E39', 1, 2, 1, 2, 1998),
(5, 'M5 E39', 1, 2, 2, 2, 2003),
(5, 'M5 E60', 1, 2, 1, 2, 2005),
(5, 'M5 E60', 1, 2, 2, 2, 2010),
(5, 'M5 F10', 1, 2, 1, 2, 2011),
(5, 'M5 F10', 1, 2, 2, 2, 2016),
(5, 'M5 F90', 1, 2, 1, 2, 2017),
(5, 'M5 F90', 1, 2, 2, 2, 2020),
(5, 'M5 G90', 1, 2, 1, 2, 2020),
(5, 'M5 G90', 1, 2, 2, 2, 2025);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(7, 'AMG ONE', 2, 2, 2, 2, 2022),

(7, 'AMG GT Black Series', 1, 2, 2, 2, 2020),
(7, 'AMG GT Black Series', 1, 2, 2, 2, 2021);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(6, 'R8', 1, 2, 2, 2, 2006),
(6, 'R8', 2, 6, 2, 2, 2024);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(10, 'GT-R', 2, 2, 2, 5, 2007),
(10, 'GT-R', 2, 2, 2, 5, 2025),

(10, 'Skyline R34', 2, 2, 1, 5, 1998),
(10, 'Skyline R34', 2, 2, 2, 5, 2002);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(11, 'Supra MK4', 1, 2, 1, 5, 1992),
(11, 'Supra MK4', 1, 8, 2, 5, 2002),

(11, 'Supra MK5', 1, 2, 1, 5, 2019),
(11, 'Supra MK5', 1, 2, 2, 5, 2025);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(12, 'RX-7', 1, 2, 1, 5, 1978),
(12, 'RX-7', 1, 2, 2, 5, 2002),

(12, 'MX-5', 1, 6, 1, 5, 1989),
(12, 'MX-5', 1, 6, 2, 5, 2025);


INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(9, 'EB110', 2, 2, 1, 4, 1991),
(9, 'EB110', 2, 2, 1, 4, 1995),

(9, 'Veyron', 2, 2, 2, 4, 2005),
(9, 'Veyron', 2, 6, 2, 4, 2015),

(9, 'Chiron', 2, 2, 2, 4, 2016),
(9, 'Chiron', 2, 2, 2, 4, 2024),

(9, 'Tourbillon', 2, 2, 2, 4, 2025),

(9, 'Bolide', 2, 2, 2, 4, 2024);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(8,'Jesko', 2, 2, 2, 3, 2020),
(8,'Jesko', 2, 6, 2, 3, 2025),

(8, 'One:1', 2, 2, 2, 3, 2014),
(8, 'One:1', 2, 6, 2, 3, 2016),

(8, 'Agera', 2, 2, 2, 3, 2011),
(8, 'Agera', 2, 6, 2, 3, 2018);

INSERT INTO `samochody` (`marka_id`, `model`, `naped_id`, `nadwozie_id`, `skrzynia_id`, `kraj_id`, `rocznik`) VALUES 
(18, 'F1', 1, 2, 1, 7, 1992),
(18, 'F1', 1, 2, 1, 7, 1998),

(18, 'Senna', 1, 2, 2, 7, 2018),
(18, 'Senna', 1, 2, 2, 7, 2022),

(18, '720S', 1, 2, 2, 7, 2017),
(18, '720S', 1, 2, 2, 7, 2023),

(18, 'P1', 1, 2, 2, 7, 2013),
(18, 'P1', 1, 2, 2, 7, 2015);






CREATE VIEW wszystkie_samochody AS
SELECT MIN(samochody.id) AS id,
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
    ORDER BY samochody.id;
    
SELECT * FROM wszystkie_samochody;


CREATE VIEW samochody_marki AS 
SELECT 
    marki.marka,
    COUNT(samochody.id) AS liczba_samochodow
FROM samochody
JOIN marki ON samochody.marka_id = marki.id
GROUP BY marki.marka
ORDER BY marki.marka;


CREATE VIEW samochody_kraje AS
SELECT 
    kraje.kraj,
    COUNT(samochody.id) AS liczba_samochodow
FROM samochody
JOIN kraje ON samochody.kraj_id = kraje.id
GROUP BY kraje.kraj
ORDER BY kraje.kraj;