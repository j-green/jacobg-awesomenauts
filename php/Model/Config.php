<?php
    require_once (__DIR__ . "/Database.php");
    //Starts the session.
    session_start();
    session_regenerate_id(true); //One way to prevent hackers from using hackers to hijack the session.
    
    //Sets the path variable.
    $path = "/JacobG-Awesomenauts/php/";
    
    //Sets the host, username, password, and database variable.
    $host = "localhost";
    $username = "root";
    $password = "root";
    $database = "awesomenauts_db";
    
    //Checks if a database is made.
    if(!isset($_SESSION["connection"])) {
        $connection = new Database($host, $username, $password, $database);
        $_SESSION["connection"] = $connection;
    }