mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: dimas_weeding
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `attendance` varchar(50) DEFAULT 'Hadir',
  `approved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (4,'Budi Santoso','Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah!','Hadir',1,'2026-05-26 07:01:04'),(5,'Siti Nurhaliza','Barakallah untuk Dimas & Laely. Semoga langgeng sampai jannah','Hadir',1,'2026-05-26 07:01:04'),(6,'Ahmad Rizki','Selamat ya kang Dimas! Semoga berkah selalu','Hadir',1,'2026-05-26 07:01:04'),(7,'Dewi Lestari','Wahhh akhirnya nikah juga! Happy wedding','Hadir',1,'2026-05-26 07:01:04'),(8,'Rudi Hermawan','Mohon maaf kalau belum bisa hadir, tapi doa terbaik selalu untuk kalian berdua','Tidak Hadir',1,'2026-05-26 07:01:04');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(500) NOT NULL,
  `caption` varchar(255) DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES (1,'/dummy/album1.png','Foto Pre-Wedding 1','2026-05-26 07:01:04'),(2,'/dummy/album2.png','Foto Pre-Wedding 2','2026-05-26 07:01:04'),(3,'/dummy/album3.png','Foto Pre-Wedding 3','2026-05-26 07:01:04'),(4,'/dummy/album4.png','Foto Pre-Wedding 4','2026-05-26 07:01:04'),(5,'/dummy/album5.png','Foto Pre-Wedding 5','2026-05-26 07:01:04'),(6,'/dummy/album6.png','Foto Pre-Wedding 6','2026-05-26 07:01:04'),(7,'/dummy/album7.png','Foto Pre-Wedding 7','2026-05-26 07:01:04'),(8,'/dummy/album8.png','Foto Pre-Wedding 8','2026-05-26 07:01:04'),(9,'/dummy/album9.png','Foto Pre-Wedding 9','2026-05-26 07:01:04'),(10,'/dummy/album10.png','Foto Pre-Wedding 10','2026-05-26 07:01:04');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wedding_settings`
--

DROP TABLE IF EXISTS `wedding_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wedding_settings` (
  `id` int NOT NULL DEFAULT '1',
  `groom_name` varchar(255) NOT NULL DEFAULT '',
  `groom_father` varchar(255) NOT NULL DEFAULT '',
  `groom_mother` varchar(255) NOT NULL DEFAULT '',
  `groom_nickname` varchar(255) NOT NULL DEFAULT '',
  `bride_name` varchar(255) NOT NULL DEFAULT '',
  `bride_father` varchar(255) NOT NULL DEFAULT '',
  `bride_mother` varchar(255) NOT NULL DEFAULT '',
  `bride_nickname` varchar(255) NOT NULL DEFAULT '',
  `reception_date` varchar(50) NOT NULL DEFAULT '',
  `reception_time` varchar(100) NOT NULL DEFAULT '',
  `reception_location` text,
  `reception_address` text,
  `reception_map_url` text,
  `reception_gmaps_embed` text,
  `hero_greeting` text,
  `hero_subtitle` text,
  `hero_date` varchar(100) DEFAULT '',
  `hero_footer` text,
  `love_story` json DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `music_url` varchar(500) DEFAULT '',
  `music_enabled` tinyint(1) DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `theme` varchar(100) DEFAULT 'base',
  `cover_image` varchar(500) DEFAULT '',
  `groom_image` varchar(500) DEFAULT '',
  `bride_image` varchar(500) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wedding_settings`
--

LOCK TABLES `wedding_settings` WRITE;
/*!40000 ALTER TABLE `wedding_settings` DISABLE KEYS */;
INSERT INTO `wedding_settings` VALUES (1,'Dimas Prayuga Abdulrohman Putra','Zuli Abdulrohman','Sri Rahayu','Dimas','Laely Nur Faizah','Subiyadi','Marfuah','Laely','2026-06-08','10:00 - 16:00 WIB','Perum Sidorahayu Blok A No 1','Dusun Niwen, Kelurahan Sidorahayu, Kecamatan Wagir, Kabupaten Malang','https://maps.google.com/?q=Perum+Sidorahayu+Blok+A+No+1+Dusun+Niwen+Sidorahayu+Wagir+Malang','','Assalamu\'alaikum Warahmatullahi Wabarakatuh','Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami:','8 Juni 2026','Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.','[{\"date\": \"2019\", \"title\": \"Pertemuan Pertama\", \"description\": \"Berawal dari sebuah acara pengajian di daerah Wagir, kami pertama kali bertemu. Tanpa sengaja duduk berdekatan dan mulai berbincang.\"}, {\"date\": \"2020\", \"title\": \"Mulai Dekat\", \"description\": \"Pandemi membuat kami semakin sering berkomunikasi melalui telepon dan video call. Setiap hari menjadi lebih berwarna dengan kehadiran satu sama lain.\"}, {\"date\": \"2022\", \"title\": \"Lamaran\", \"description\": \"Dengan restu kedua orang tua, kami resmi bertunangan. Sebuah ikatan suci yang menguatkan cinta kami.\"}, {\"date\": \"8 Juni 2026\", \"title\": \"Pernikahan\", \"description\": \"Hari yang paling dinantikan. Dengan mengucap bismillah, kami akan melangkah ke jenjang pernikahan yang penuh berkah.\"}]','{\"gold\": \"#C9A96E\", \"text\": \"#3D2B1F\", \"accent\": \"#F5E6D3\", \"primary\": \"#8B5E3C\", \"secondary\": \"#D4A574\", \"background\": \"#FFF8F0\"}','https://youtu.be/X-EK60rmcQs?si=fjRqHSx1mVCggkaR',1,'2026-05-26 07:07:32','beautiful-floral','/dummy/kita.png','/dummy/groom.png','/dummy/bride.png');
/*!40000 ALTER TABLE `wedding_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 16:09:45
