<?php
    //Requires the config file.
    require_once (__DIR__ . "/../Model/Config.php");
    
    //Sets the function authenticateUser that will not allow anyone into certain parts of the blog unless logged in.
    function authenticateUser() {
        if(!isset($_SESSION["authenticated"])) {
            return false;
        }
        else {
            if($_SESSION["authenticated"] != true) {
                return false;
            }
            else {
                return true;
            }
        }
    }