-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 14 juil. 2022 à 18:02
-- Version du serveur : 5.7.36
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tutorialdb`
--
CREATE DATABASE IF NOT EXISTS `tutorialdb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `tutorialdb`;

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produce` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `stock` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `produce`, `description`, `price`, `stock`, `url`, `createdAt`, `updatedAt`) VALUES
(9, 'Ballon Gilbert', 'Ballon de rugby taille 5.', '15', '10', 'rugby-2522306_1920.jpg', '2022-07-14 16:30:48', '2022-07-14 17:55:06'),
(10, 'Crampon Adidas', 'Crampon visée Adidas.', '70', '5', 'categorie-adidas-rugby-hp.jpg', '2022-07-14 17:46:30', '2022-07-14 17:49:45'),
(11, 'Tee', 'Support de ballon Forza noir. ', '10', '20', 'forza_moulded_rubber_kicking_tee.jpg', '2022-07-14 17:53:00', '2022-07-14 17:54:37'),
(12, 'Maillot All Black', 'Maillot Adidas All Black 2021-2022.', '90', '0', 'maillot-rugby-all-blacks-adidas-4.jpg', '2022-07-14 17:59:19', '2022-07-14 18:00:49');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `phone`, `admin`, `createdAt`, `updatedAt`) VALUES
(6, 'admin@admin.fr', '$2b$10$VizyEWORCXxzQHJVpv6Qoe3ZNwSyuFr3TlR20tZrBv6TY33jWTqUS', 'admin', 'admin', 'admin', 1, '2022-06-02 14:35:01', '2022-07-12 14:43:47'),
(11, 'test@test.fr', '$2b$10$iOJGPiD6Q5.Bu1tgqoL3SuVvgIwH6gllZ8AbNzeyvYHdNFHQggu.u', 'test', 'test', '01 02 03 04 05', 0, '2022-06-13 21:12:34', '2022-07-12 10:31:06');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
