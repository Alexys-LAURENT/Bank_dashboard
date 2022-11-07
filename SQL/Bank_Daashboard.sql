drop database if EXISTS bank_dashboard;

CREATE DATABASE bank_dashboard;

use bank_dashboard;

CREATE Table
    users(
        IdU INT(3) AUTO_INCREMENT NOT NULL,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password VARCHAR(150) NOT NULL,
        lastname VARCHAR(100),
        constraint PK_USERS PRIMARY KEY (IdU)
    );

CREATE Table
    compte(
        IdC INT(3) AUTO_INCREMENT NOT NULL,
        Solde FLOAT(10,2) NOT NULL,
        NumC INT(11),
        NomCompte VARCHAR(100),
        IdU INT(3) NOT NULL,
        constraint PK_COMPTE PRIMARY KEY (IdC),
        constraint FK_COMPTE FOREIGN KEY (IdU) REFERENCES users(IdU)
    );

create table
    transactions(
        IdT INT(11) AUTO_INCREMENT NOT NULL,
        Categorie VARCHAR(50) NOT NULL,
        Montant FLOAT(10,2) NOT NULL,
        IdC INT(3) NOT NULL,
        TypeOf ENUM('Depense', 'Rentree', 'Init') NOT NULL,
        Image VARCHAR(200),
        DateT DATE NOT NULL,
        Nom VARCHAR(100) NOT NULL,
        constraint PK_TRANSACTIONS PRIMARY KEY (IdT),
        constraint FK_TRANSACTIONS FOREIGN KEY (IdC) REFERENCES compte(IdC)
    );
