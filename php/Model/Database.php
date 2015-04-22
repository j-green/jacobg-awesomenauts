<?php
class Database {
    //Sets the variables for either private or public.
    private $connection;
    private $host;
    private $username;
    private $password;
    private $database;
    public $error;
    //Sets the function construct which can be used anywhere in the pages.
    public function __construct($host, $username, $password, $database) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
        $this->connection = new mysqli($host, $username, $password);
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }
        $exists = $this->connection->select_db($database);
        if (!$exists) {
            $query = $this->connection->query("CREATE DATABASE $database");
            if ($query) {
                echo "<p>Successfully created a database: " . $database . "</p>";
            }
        } else {
            echo "<p>Database already exists.</p>";
        }
    }
    //Open the connection.
    public function openConnection() {
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }
    }
    //Closes the connection.
    public function closeConnection() {
        if (isset($this->connection)) {
            $this->connection->close();
        }
    }
    //Sets  the query funtion that has the parameter string.
    public function query($string) {
        $this->openConnection();
        $query = $this->connection->query($string);
        
        if(!$query) {
            $this->error = $this->connection->error;
        }
        $this->closeConnection();
        return $query;
    }
}
