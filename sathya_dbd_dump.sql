-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sathya_dbd
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `company_id` varchar(30) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `address` varchar(300) DEFAULT NULL,
  `location_id` varchar(30) DEFAULT NULL,
  `spoc_name` varchar(100) DEFAULT NULL,
  `spoc_contact_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`company_id`),
  KEY `fk_location` (`location_id`),
  CONSTRAINT `fk_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES ('CO001','CSL Berigai','123, Main Street, Berigai,coimbatore ',NULL,'prasanth','94849048493');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completion_status`
--

DROP TABLE IF EXISTS `completion_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `completion_status` (
  `completion_id` int NOT NULL AUTO_INCREMENT,
  `rec_id` int DEFAULT NULL,
  `area_completed` float DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `value` float DEFAULT NULL,
  `billed_area` float DEFAULT NULL,
  `billed_value` float DEFAULT NULL,
  `balance_area` float DEFAULT NULL,
  `balance_value` float DEFAULT NULL,
  `work_status` varchar(50) DEFAULT NULL,
  `billing_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`completion_id`),
  KEY `rec_id` (`rec_id`),
  CONSTRAINT `completion_status_ibfk_1` FOREIGN KEY (`rec_id`) REFERENCES `po_reckoner` (`rec_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completion_status`
--

LOCK TABLES `completion_status` WRITE;
/*!40000 ALTER TABLE `completion_status` DISABLE KEYS */;
INSERT INTO `completion_status` VALUES (1,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,17,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,19,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `completion_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumables_master`
--

DROP TABLE IF EXISTS `consumables_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumables_master` (
  `consumable_id` int NOT NULL AUTO_INCREMENT,
  `consumable_name` varchar(50) NOT NULL,
  PRIMARY KEY (`consumable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumables_master`
--

LOCK TABLES `consumables_master` WRITE;
/*!40000 ALTER TABLE `consumables_master` DISABLE KEYS */;
INSERT INTO `consumables_master` VALUES (1,'Grinding Machine'),(2,'Paint mixing machine'),(3,'Paint Brush'),(4,'Spike Roller Paint'),(5,'Trowel');
/*!40000 ALTER TABLE `consumables_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `description_of_work`
--

DROP TABLE IF EXISTS `description_of_work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `description_of_work` (
  `item_id` varchar(30) NOT NULL,
  `item_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `description_of_work`
--

LOCK TABLES `description_of_work` WRITE;
/*!40000 ALTER TABLE `description_of_work` DISABLE KEYS */;
INSERT INTO `description_of_work` VALUES ('Item-1','Sticker for cooling water supply'),('Item-10','Sticker for Non Peso Tank'),('Item-11','Sticker for Holding Tank'),('Item-12','Structural Painting Work'),('Item-13','Nitrogen 2 coat redoxide + Canary Yellow'),('Item-14','Raw water 2 coat redoxide + sea green'),('Item-15','PSV quench 2 coat redoxide + black'),('Item-16','Vacuum White'),('Item-17','Plant Air 2 coat redoxide + sky blue'),('Item-18','Structural paint incl cleaner 2 coat paint'),('Item-19','Air line 1 coat blue'),('Item-2','Sticker for cooling water return'),('Item-20','Cooling water line 1 coat dark green'),('Item-21','Raw water line 1 coat sea green'),('Item-22','Structural line painting'),('Item-23','Primer coating with supply'),('Item-24','Cooling water line painting'),('Item-25','Chilled water line painting'),('Item-26','Chilled brine line painting'),('Item-27','Nitrogen line painting'),('Item-28','Process water line painting work'),('Item-29','PSV line painting'),('Item-3','Sticker for process water'),('Item-30','Eye wash shower line'),('Item-31','Raw water line'),('Item-32','Instrument air line'),('Item-33','Plant air line painting'),('Item-34','LP Steam line painting work'),('Item-35','MP Stam line painting'),('Item-36','HSD line painting work'),('Item-37','Cooling water band supply and pasting'),('Item-38','Chilled water band supply and pasting'),('Item-39','Chilled brine band supply and pasting'),('Item-4','Sticker for Eye wash'),('Item-40','Nitrogen bank supply and pasting'),('Item-41','Process water band supply and pasting'),('Item-42','PSV band supply and pasting'),('Item-43','Eye wash shower band supply and pasting'),('Item-44','Raw water band supply and pasting'),('Item-45','Instrument air band supply and pasting'),('Item-46','Plant air band supply and pasting'),('Item-47','LP Steam bank supply and pasting'),('Item-48','MP Steam band supply and pasting'),('Item-49','HSD Bank supply and pasting'),('Item-5','Sticker for High speed diesel'),('Item-50','1\" Line arrow supply and pasting'),('Item-51','1.5\" line arrow supply and pasting'),('Item-52','2\" line arrow supply and pasting'),('Item-53','3\" line arrow supply and pasting'),('Item-54','4\" line arrow supply and pasting'),('Item-55','6\" line arrow supply and pasting'),('Item-56','8\" line arrow supply and pasting'),('Item-57','10\" line arrow supply and pasting'),('Item-58','12\" line arrow supply and pasting'),('Item-59','1\" line font stickering work'),('Item-6','Sticker for Vaccum'),('Item-60','1.5\" line font stickering work'),('Item-61','2\" line font stickering work'),('Item-62','3\" line font stickering work'),('Item-63','4\" line font stickering work'),('Item-64','6\" line font stickering work'),('Item-65','8\" line font stickering work'),('Item-66','10\" line font stickering work'),('Item-67','12\" line font stickering work'),('Item-7','Sticker for scrubber'),('Item-8','Sticker for LEV Scrubber'),('Item-9','Sticker for Peso Tank');
/*!40000 ALTER TABLE `description_of_work` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_category`
--

DROP TABLE IF EXISTS `item_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_category` (
  `category_id` varchar(30) NOT NULL,
  `category_name` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_category`
--

LOCK TABLES `item_category` WRITE;
/*!40000 ALTER TABLE `item_category` DISABLE KEYS */;
INSERT INTO `item_category` VALUES ('CA101','Structural Painting'),('CA102','PipeLine'),('CA103','stickering'),('CA104','Cool Coating');
/*!40000 ALTER TABLE `item_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_subcategory`
--

DROP TABLE IF EXISTS `item_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_subcategory` (
  `subcategory_id` varchar(30) NOT NULL,
  `subcategory_name` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`subcategory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_subcategory`
--

LOCK TABLES `item_subcategory` WRITE;
/*!40000 ALTER TABLE `item_subcategory` DISABLE KEYS */;
INSERT INTO `item_subcategory` VALUES ('SC101','Primer'),('SC102','Top Coat'),('SC103','Pasting'),('SC104','Arrow'),('SC105','Font Sticker');
/*!40000 ALTER TABLE `item_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` varchar(30) NOT NULL,
  `location_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES ('LO001','Kanchipuram'),('LO002','Erode'),('LO003','Chennai'),('LO004','Chengalpattu'),('LO005','Dindigul'),('LO006','Coimbatore'),('LO007','Pollachi');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pipeline`
--

DROP TABLE IF EXISTS `pipeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `report_type_id` int NOT NULL,
  `primer` decimal(10,2) DEFAULT NULL,
  `primer_rate` decimal(10,2) DEFAULT NULL,
  `primer_value` decimal(10,2) DEFAULT NULL,
  `total_rate` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_report_type` (`report_id`,`report_type_id`),
  KEY `report_type_id` (`report_type_id`),
  CONSTRAINT `pipeline_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `report_master` (`report_id`) ON DELETE CASCADE,
  CONSTRAINT `pipeline_ibfk_2` FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pipeline`
--

LOCK TABLES `pipeline` WRITE;
/*!40000 ALTER TABLE `pipeline` DISABLE KEYS */;
INSERT INTO `pipeline` VALUES (1,1,1,NULL,NULL,NULL,NULL,NULL),(2,1,2,NULL,NULL,NULL,NULL,NULL),(3,1,3,NULL,NULL,NULL,NULL,NULL),(4,2,1,NULL,NULL,NULL,NULL,NULL),(5,2,2,NULL,NULL,NULL,NULL,NULL),(6,2,3,NULL,NULL,NULL,NULL,NULL),(7,3,1,NULL,NULL,NULL,NULL,NULL),(8,3,2,NULL,NULL,NULL,NULL,NULL),(9,3,3,NULL,NULL,NULL,NULL,NULL),(10,4,1,NULL,NULL,NULL,NULL,NULL),(11,4,2,NULL,NULL,NULL,NULL,NULL),(12,4,3,NULL,NULL,NULL,NULL,NULL),(13,5,1,NULL,NULL,NULL,NULL,NULL),(14,5,2,NULL,NULL,NULL,NULL,NULL),(15,5,3,NULL,NULL,NULL,NULL,NULL),(16,6,1,NULL,NULL,NULL,NULL,NULL),(17,6,2,NULL,NULL,NULL,NULL,NULL),(18,6,3,NULL,NULL,NULL,NULL,NULL),(19,7,1,NULL,NULL,NULL,NULL,NULL),(20,7,2,NULL,NULL,NULL,NULL,NULL),(21,7,3,NULL,NULL,NULL,NULL,NULL),(22,8,1,NULL,NULL,NULL,NULL,NULL),(23,8,2,NULL,NULL,NULL,NULL,NULL),(24,8,3,NULL,NULL,NULL,NULL,NULL),(25,9,1,NULL,NULL,NULL,NULL,NULL),(26,9,2,NULL,NULL,NULL,NULL,NULL),(27,9,3,NULL,NULL,NULL,NULL,NULL),(28,10,1,NULL,NULL,NULL,NULL,NULL),(29,10,2,NULL,NULL,NULL,NULL,NULL),(30,10,3,NULL,NULL,NULL,NULL,NULL),(31,11,1,NULL,NULL,NULL,NULL,NULL),(32,11,2,NULL,NULL,NULL,NULL,NULL),(33,11,3,NULL,NULL,NULL,NULL,NULL),(34,12,1,NULL,NULL,NULL,NULL,NULL),(35,12,2,NULL,NULL,NULL,NULL,NULL),(36,12,3,NULL,NULL,NULL,NULL,NULL),(37,13,1,NULL,NULL,NULL,NULL,NULL),(38,13,2,NULL,NULL,NULL,NULL,NULL),(39,13,3,NULL,NULL,NULL,NULL,NULL),(40,14,1,NULL,NULL,NULL,NULL,NULL),(41,14,2,NULL,NULL,NULL,NULL,NULL),(42,14,3,NULL,NULL,NULL,NULL,NULL),(43,15,1,NULL,NULL,NULL,NULL,NULL),(44,15,2,NULL,NULL,NULL,NULL,NULL),(45,15,3,NULL,NULL,NULL,NULL,NULL),(46,16,1,NULL,NULL,NULL,NULL,NULL),(47,16,2,NULL,NULL,NULL,NULL,NULL),(48,16,3,NULL,NULL,NULL,NULL,NULL),(49,17,1,NULL,NULL,NULL,NULL,NULL),(50,17,2,NULL,NULL,NULL,NULL,NULL),(51,17,3,NULL,NULL,NULL,NULL,NULL),(52,18,1,NULL,NULL,NULL,NULL,NULL),(53,18,2,NULL,NULL,NULL,NULL,NULL),(54,18,3,NULL,NULL,NULL,NULL,NULL),(55,19,1,NULL,NULL,NULL,NULL,NULL),(56,19,2,NULL,NULL,NULL,NULL,NULL),(57,19,3,NULL,NULL,NULL,NULL,NULL),(58,20,1,NULL,NULL,NULL,NULL,NULL),(59,20,2,NULL,NULL,NULL,NULL,NULL),(60,20,3,NULL,NULL,NULL,NULL,NULL),(61,21,1,NULL,NULL,NULL,NULL,NULL),(62,21,2,NULL,NULL,NULL,NULL,NULL),(63,21,3,NULL,NULL,NULL,NULL,NULL),(64,22,1,NULL,NULL,NULL,NULL,NULL),(65,22,2,NULL,NULL,NULL,NULL,NULL),(66,22,3,NULL,NULL,NULL,NULL,NULL),(67,23,1,NULL,NULL,NULL,NULL,NULL),(68,23,2,NULL,NULL,NULL,NULL,NULL),(69,23,3,NULL,NULL,NULL,NULL,NULL),(70,24,1,NULL,NULL,NULL,NULL,NULL),(71,24,2,NULL,NULL,NULL,NULL,NULL),(72,24,3,NULL,NULL,NULL,NULL,NULL),(73,25,1,NULL,NULL,NULL,NULL,NULL),(74,25,2,NULL,NULL,NULL,NULL,NULL),(75,25,3,NULL,NULL,NULL,NULL,NULL),(76,26,1,NULL,NULL,NULL,NULL,NULL),(77,26,2,NULL,NULL,NULL,NULL,NULL),(78,26,3,NULL,NULL,NULL,NULL,NULL),(79,27,1,NULL,NULL,NULL,NULL,NULL),(80,27,2,NULL,NULL,NULL,NULL,NULL),(81,27,3,NULL,NULL,NULL,NULL,NULL),(82,28,1,NULL,NULL,NULL,NULL,NULL),(83,28,2,NULL,NULL,NULL,NULL,NULL),(84,28,3,NULL,NULL,NULL,NULL,NULL),(85,29,1,NULL,NULL,NULL,NULL,NULL),(86,29,2,NULL,NULL,NULL,NULL,NULL),(87,29,3,NULL,NULL,NULL,NULL,NULL),(88,30,1,NULL,NULL,NULL,NULL,NULL),(89,30,2,NULL,NULL,NULL,NULL,NULL),(90,30,3,NULL,NULL,NULL,NULL,NULL),(91,31,1,NULL,NULL,NULL,NULL,NULL),(92,31,2,NULL,NULL,NULL,NULL,NULL),(93,31,3,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pipeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `po_reckoner`
--

DROP TABLE IF EXISTS `po_reckoner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `po_reckoner` (
  `rec_id` int NOT NULL AUTO_INCREMENT,
  `category_id` varchar(30) DEFAULT NULL,
  `subcategory_id` varchar(30) DEFAULT NULL,
  `po_quantity` int DEFAULT NULL,
  `uom` varchar(10) DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `value` float DEFAULT NULL,
  `site_id` varchar(30) DEFAULT NULL,
  `desc_id` varchar(10) DEFAULT NULL,
  `item_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `fk_category` (`category_id`),
  KEY `fk_subcategory` (`subcategory_id`),
  KEY `fk_po_reckoner_site` (`site_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `item_category` (`category_id`),
  CONSTRAINT `fk_po_reckoner_site` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `item_subcategory` (`subcategory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `po_reckoner`
--

LOCK TABLES `po_reckoner` WRITE;
/*!40000 ALTER TABLE `po_reckoner` DISABLE KEYS */;
INSERT INTO `po_reckoner` VALUES (2,'CA101','SC101',120,'Sqm',271.6,32592,'ST001','4','120'),(3,'CA101','SC101',1000,'Sqm',271.6,271600,'ST001','4','10'),(4,'CA102','SC101',465,'Sqm',441,205065,'ST001','5','130'),(5,'CA102','SC101',118,'Sqm',421.4,49725.2,'ST001','6','140'),(6,'CA102','SC101',50,'Sqm',421.4,21070,'ST001','7','150'),(7,'CA102','SC101',302,'Sqm',441,133182,'ST001','8','160'),(8,'CA102','SC101',157,'Sqm',421.4,66159.8,'ST001','9','170'),(9,'CA102','SC101',100,'Sqm',441,44100,'ST001','5','20'),(10,'CA103','SC103',60,'Nos',174.6,10476,'ST001','1','10'),(11,'CA103','SC103',60,'Nos',174.6,10476,'ST001','12','20'),(12,'CA103','SC103',60,'Nos',232.8,13968,'ST001','23','30'),(13,'CA103','SC103',50,'Nos',232.8,11640,'ST001','34','40'),(14,'CA103','SC103',30,'Nos',116.4,3492,'ST001','45','50'),(15,'CA103','SC103',90,'Nos',116.4,10476,'ST001','56','60'),(16,'CA103','SC103',160,'Nos',116.39,18621.2,'ST001','65','70'),(17,'CA103','SC103',35,'Nos',116.4,4074,'ST001','66','80'),(18,'CA103','SC103',735,'Nos',232.8,171108,'ST001','67','90'),(19,'CA103','SC103',300,'Nos',232.8,69840,'ST001','2','100'),(20,'CA103','SC103',525,'Nos',232.8,122220,'ST001','3','110');
/*!40000 ALTER TABLE `po_reckoner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_details`
--

DROP TABLE IF EXISTS `project_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_details` (
  `pd_id` varchar(30) NOT NULL,
  `company_id` varchar(30) DEFAULT NULL,
  `project_type_id` varchar(30) DEFAULT NULL,
  `project_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`pd_id`),
  KEY `fk_company_details` (`company_id`),
  KEY `fk_project_type` (`project_type_id`),
  CONSTRAINT `fk_company_details` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  CONSTRAINT `fk_project_type` FOREIGN KEY (`project_type_id`) REFERENCES `project_type` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_details`
--

LOCK TABLES `project_details` WRITE;
/*!40000 ALTER TABLE `project_details` DISABLE KEYS */;
INSERT INTO `project_details` VALUES ('PD001','CO001','PT001','CSL Berigai');
/*!40000 ALTER TABLE `project_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_type`
--

DROP TABLE IF EXISTS `project_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_type` (
  `type_id` varchar(30) NOT NULL,
  `type_description` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_type`
--

LOCK TABLES `project_type` WRITE;
/*!40000 ALTER TABLE `project_type` DISABLE KEYS */;
INSERT INTO `project_type` VALUES ('PT001','service'),('PT002','supply');
/*!40000 ALTER TABLE `project_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_master`
--

DROP TABLE IF EXISTS `report_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_master` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `site_id` varchar(30) NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `site_id` (`site_id`),
  CONSTRAINT `report_master_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_master`
--

LOCK TABLES `report_master` WRITE;
/*!40000 ALTER TABLE `report_master` DISABLE KEYS */;
INSERT INTO `report_master` VALUES (1,'2025-03-01','ST001'),(2,'2025-03-02','ST001'),(3,'2025-03-03','ST001'),(4,'2025-03-04','ST001'),(5,'2025-03-05','ST001'),(6,'2025-03-06','ST001'),(7,'2025-03-07','ST001'),(8,'2025-03-08','ST001'),(9,'2025-03-09','ST001'),(10,'2025-03-10','ST001'),(11,'2025-03-11','ST001'),(12,'2025-03-12','ST001'),(13,'2025-03-13','ST001'),(14,'2025-03-14','ST001'),(15,'2025-03-15','ST001'),(16,'2025-03-16','ST001'),(17,'2025-03-17','ST001'),(18,'2025-03-18','ST001'),(19,'2025-03-19','ST001'),(20,'2025-03-20','ST001'),(21,'2025-03-21','ST001'),(22,'2025-03-22','ST001'),(23,'2025-03-23','ST001'),(24,'2025-03-24','ST001'),(25,'2025-03-25','ST001'),(26,'2025-03-26','ST001'),(27,'2025-03-27','ST001'),(28,'2025-03-28','ST001'),(29,'2025-03-29','ST001'),(30,'2025-03-30','ST001'),(31,'2025-03-31','ST001');
/*!40000 ALTER TABLE `report_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_type`
--

DROP TABLE IF EXISTS `report_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_type`
--

LOCK TABLES `report_type` WRITE;
/*!40000 ALTER TABLE `report_type` DISABLE KEYS */;
INSERT INTO `report_type` VALUES (1,'SPR'),(2,'MDR'),(3,'MUR');
/*!40000 ALTER TABLE `report_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_details`
--

DROP TABLE IF EXISTS `site_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_details` (
  `site_id` varchar(30) NOT NULL,
  `site_name` varchar(100) DEFAULT NULL,
  `po_number` varchar(70) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `incharge_id` varchar(30) DEFAULT NULL,
  `workforce_id` varchar(30) DEFAULT NULL,
  `pd_id` varchar(30) NOT NULL,
  `location_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`site_id`),
  KEY `fk_incharge_type` (`incharge_id`),
  KEY `fk_workforce_type` (`workforce_id`),
  KEY `fk_pd_id` (`pd_id`),
  KEY `fk_site_details_location` (`location_id`),
  CONSTRAINT `fk_incharge_type` FOREIGN KEY (`incharge_id`) REFERENCES `site_incharge` (`incharge_id`),
  CONSTRAINT `fk_pd_id` FOREIGN KEY (`pd_id`) REFERENCES `project_details` (`pd_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_site_details_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`),
  CONSTRAINT `fk_workforce_type` FOREIGN KEY (`workforce_id`) REFERENCES `workforce_type` (`workforce_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_details`
--

LOCK TABLES `site_details` WRITE;
/*!40000 ALTER TABLE `site_details` DISABLE KEYS */;
INSERT INTO `site_details` VALUES ('ST001','CSL Berigai-block A','PO 6900002908','2025-03-01','2025-03-31','SI003',NULL,'PD001','LO006');
/*!40000 ALTER TABLE `site_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_incharge`
--

DROP TABLE IF EXISTS `site_incharge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_incharge` (
  `incharge_id` varchar(30) NOT NULL,
  `incharge_type` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`incharge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_incharge`
--

LOCK TABLES `site_incharge` WRITE;
/*!40000 ALTER TABLE `site_incharge` DISABLE KEYS */;
INSERT INTO `site_incharge` VALUES ('SI001','supervisor'),('SI002','site engineer'),('SI003','supervisor + site engineer');
/*!40000 ALTER TABLE `site_incharge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stickering`
--

DROP TABLE IF EXISTS `stickering`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stickering` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `report_type_id` int NOT NULL,
  `pasting` decimal(10,2) DEFAULT NULL,
  `pasting_rate` decimal(10,2) DEFAULT NULL,
  `pasting_value` decimal(10,2) DEFAULT NULL,
  `total_rate` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(10,2) DEFAULT NULL,
  `font_sticker` decimal(10,2) DEFAULT NULL,
  `font_sticker_rate` decimal(10,2) DEFAULT NULL,
  `font_sticker_value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_report_type` (`report_id`,`report_type_id`),
  KEY `report_type_id` (`report_type_id`),
  CONSTRAINT `stickering_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `report_master` (`report_id`) ON DELETE CASCADE,
  CONSTRAINT `stickering_ibfk_2` FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stickering`
--

LOCK TABLES `stickering` WRITE;
/*!40000 ALTER TABLE `stickering` DISABLE KEYS */;
INSERT INTO `stickering` VALUES (1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,1,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,2,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,3,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,4,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,4,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,4,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,5,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,5,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,5,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,6,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,6,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,6,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,7,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,7,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,7,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,8,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,8,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,8,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,9,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,9,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,9,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,10,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,10,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,10,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,11,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,11,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,11,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,12,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,12,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,12,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,13,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,13,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,13,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(40,14,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,14,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,14,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,15,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,15,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,15,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,16,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,16,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,16,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,17,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,17,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,17,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,18,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,18,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,18,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,19,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,19,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,19,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(58,20,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,20,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(60,20,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,21,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,21,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,21,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,22,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,22,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,22,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,23,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,23,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,23,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,24,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,24,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,24,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,25,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,25,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,25,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,26,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,26,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,26,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,27,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,27,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,27,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,28,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,28,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,28,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,29,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,29,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,29,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,30,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(89,30,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(90,30,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(91,31,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(92,31,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(93,31,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `stickering` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `structural_painting`
--

DROP TABLE IF EXISTS `structural_painting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `structural_painting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `report_type_id` int NOT NULL,
  `primer` decimal(10,2) DEFAULT NULL,
  `primer_rate` decimal(10,2) DEFAULT NULL,
  `primer_value` decimal(10,2) DEFAULT NULL,
  `total_rate` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(10,2) DEFAULT NULL,
  `top_coat` decimal(10,2) DEFAULT NULL,
  `top_coat_rate` decimal(10,2) DEFAULT NULL,
  `top_coat_value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_report_type` (`report_id`,`report_type_id`),
  KEY `report_type_id` (`report_type_id`),
  CONSTRAINT `structural_painting_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `report_master` (`report_id`) ON DELETE CASCADE,
  CONSTRAINT `structural_painting_ibfk_2` FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `structural_painting`
--

LOCK TABLES `structural_painting` WRITE;
/*!40000 ALTER TABLE `structural_painting` DISABLE KEYS */;
INSERT INTO `structural_painting` VALUES (1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,1,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,2,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,3,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,4,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,4,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,4,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,5,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,5,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,5,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,6,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,6,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,6,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,7,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,7,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,7,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,8,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,8,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,8,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,9,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,9,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,9,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,10,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,10,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,10,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,11,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,11,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,11,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,12,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,12,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,12,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,13,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,13,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,13,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(40,14,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,14,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,14,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,15,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,15,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,15,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,16,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,16,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,16,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,17,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,17,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,17,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,18,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,18,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,18,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,19,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,19,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,19,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(58,20,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,20,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(60,20,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,21,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,21,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,21,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,22,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,22,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,22,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,23,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,23,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,23,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,24,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,24,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,24,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,25,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,25,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,25,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,26,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,26,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,26,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,27,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,27,2,NULL,NULL,0.00,NULL,NULL,NULL,NULL,NULL),(81,27,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,28,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,28,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,28,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,29,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,29,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,29,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,30,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(89,30,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(90,30,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(91,31,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(92,31,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(93,31,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `structural_painting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_descriptions`
--

DROP TABLE IF EXISTS `work_descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_descriptions` (
  `desc_id` int NOT NULL AUTO_INCREMENT,
  `desc_name` varchar(100) NOT NULL,
  PRIMARY KEY (`desc_id`),
  UNIQUE KEY `desc_name` (`desc_name`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_descriptions`
--

LOCK TABLES `work_descriptions` WRITE;
/*!40000 ALTER TABLE `work_descriptions` DISABLE KEYS */;
INSERT INTO `work_descriptions` VALUES (47,'1.5\" line arrow supply and pasting'),(57,'1.5\" line font stickering work'),(46,'1\" line arrow supply and pasting'),(55,'1\" line font stickering work'),(53,'10\" line arrow supply and pasting'),(63,'10\" line font stickering work'),(54,'12\" line arrow supply and pasting'),(64,'12\" line font stickering work'),(48,'2\" line arrow supply and pasting'),(58,'2\" line font stickering work'),(49,'3\" line arrow supply and pasting'),(59,'3\" line font stickering work'),(50,'4\" line arrow supply and pasting'),(60,'4\" line font stickering work'),(51,'6\" line arrow supply and pasting'),(61,'6\" line font stickering work'),(52,'8\" line arrow supply and pasting'),(62,'8\" line font stickering work'),(11,'Air line 1 coat blue'),(33,'Chilled brine band supply and pasting'),(19,'Chilled brine line painting'),(32,'Chilled water band supply and pasting'),(18,'Chilled water line painting'),(31,'Cooling water band supply and pasting'),(13,'Cooling water line 1 coat dark green'),(17,'Cooling water line painting'),(38,'Eye wash shower band supply and pasting'),(24,'Eye wash shower line'),(44,'HSD band supply and pasting'),(30,'HSD line painting work'),(40,'Instrument air band supply and pasting'),(26,'Instrument air line'),(42,'LP Steam band supply and pasting'),(28,'LP Steam line painting work'),(43,'MP Steam band supply and pasting'),(29,'MP Steam line painting'),(5,'Nitrogen 2 coat redoxide + Canary Yellow'),(35,'Nitrogen band supply and pasting'),(20,'Nitrogen line painting'),(9,'Plant Air 2 coat redoxide + sky blue'),(41,'Plant air band supply and pasting'),(27,'Plant air line painting'),(16,'Primer coating with supply'),(36,'Process water band supply and pasting'),(21,'Process water line painting work'),(37,'PSV band supply and pasting'),(22,'PSV line painting'),(7,'PSV quench 2 coat redoxide + black'),(6,'Raw water 2 coat redoxide + sea green'),(39,'Raw water band supply and pasting'),(25,'Raw water line'),(14,'Raw water line 1 coat sea green'),(12,'Sticker for cooling water return'),(1,'Sticker for cooling water supply'),(34,'Sticker for Eye wash'),(45,'Sticker for High speed diesel'),(3,'Sticker for Holding Tank'),(66,'Sticker for LEV Scrubber'),(2,'Sticker for Non Peso Tank'),(67,'Sticker for Peso Tank'),(23,'Sticker for process water'),(65,'Sticker for scrubber'),(56,'Sticker for Vacuum'),(15,'Structural line painting'),(10,'Structural paint incl cleaner 2 coat paint'),(4,'Structural Painting Work'),(8,'Vacuum White');
/*!40000 ALTER TABLE `work_descriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workforce_type`
--

DROP TABLE IF EXISTS `workforce_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workforce_type` (
  `workforce_id` varchar(30) NOT NULL,
  `workforce_type` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`workforce_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workforce_type`
--

LOCK TABLES `workforce_type` WRITE;
/*!40000 ALTER TABLE `workforce_type` DISABLE KEYS */;
INSERT INTO `workforce_type` VALUES ('WF001','contract'),('WF002','labour'),('WF003','contract + labour');
/*!40000 ALTER TABLE `workforce_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-17 14:32:48
