<?php
require_once(__DIR__ . "/../Model/Config.php");

$connection = new mysqli($host, $username, $password, $database);

$title = filter_input(INPUT_POST, "title", FILTER_SANITIZE_STRING);
$post = filter_input(INPUT_POST, "post", FILTER_SANITIZE_STRING);

$query = $_SESSION["connection"]->query("INSERT INTO posts SET title = '$title', post = '$post'");
//tells when the post is submited to say that it is
 if($query) {
    echo"<p>Successfully inserted post: $title</p>";
} else{
    echo "<p>" . $_SESSION["connection"]->error .  "</p>";
}

$connection->close();
    
 