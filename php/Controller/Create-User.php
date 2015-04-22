<?php
    //Requires the header, config, and footer files.
    require_once (__DIR__ . "/../Model/Config.php");
    
    //Sets the username, and password variables.
    $username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
    
    //Sets the salt which is used for the password.
    $salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";
    
    //Sets the hashed password which scrambles the password.
    $hashedPassword = crypt($password, $salt);
    
    //Gets the username from the users table where the username is the same as the variable username.
    $query = $_SESSION["connection"]->query("SELECT username FROM users WHERE BINARY username = '$username'"); 
  
    //Makes a new user or does not allow if you are already registered.
    if($query) {
        if($query->num_rows == 0) {
           $query2 = $_SESSION["connection"]->query("INSERT INTO users SET "
            . "username = '$username',"
            . "password = '$hashedPassword',"
            . "salt = '$salt', "
            . "exp = 0, "
            . "exp1 = 0, "
            . "exp2 = 0, "
            . "exp3 = 0, "
            . "exp4 = 0");
           //Need this for Ajax on index.php
           echo "True";
           $_SESSION["name"] = $username;
       }
       else {
           echo "Username already exists";
       }
   }
    else {
        echo "<p>" . $_SESSION["connection"]->error . "</p>";
    }