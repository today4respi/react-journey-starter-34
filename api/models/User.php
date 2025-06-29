
<?php
require_once '../config/Database.php';

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $email;
    public $password_hash;
    public $first_name;
    public $last_name;
    public $phone;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create user (signup)
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                 SET email = :email, 
                     password_hash = :password_hash, 
                     first_name = :first_name, 
                     last_name = :last_name, 
                     phone = :phone";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password_hash = password_hash($this->password_hash, PASSWORD_DEFAULT);
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));

        // Bind data
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password_hash', $this->password_hash);
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':phone', $this->phone);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Check if email exists
    public function emailExists() {
        $query = "SELECT id, email, password_hash, first_name, last_name, phone 
                 FROM " . $this->table . " 
                 WHERE email = :email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->password_hash = $row['password_hash'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->phone = $row['phone'];
            return true;
        }
        return false;
    }

    // Verify password
    public function verifyPassword($password) {
        return password_verify($password, $this->password_hash);
    }

    // Get user by ID
    public function getById() {
        $query = "SELECT id, email, first_name, last_name, phone, created_at 
                 FROM " . $this->table . " 
                 WHERE id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row;
        }
        return false;
    }

    // Update user profile
    public function updateProfile() {
        // Build query dynamically based on what needs to be updated
        $setParts = [];
        $params = [];
        
        if (isset($this->first_name)) {
            $setParts[] = "first_name = :first_name";
            $params[':first_name'] = $this->first_name;
        }
        
        if (isset($this->last_name)) {
            $setParts[] = "last_name = :last_name";
            $params[':last_name'] = $this->last_name;
        }
        
        if (isset($this->email)) {
            $setParts[] = "email = :email";
            $params[':email'] = $this->email;
        }
        
        if (isset($this->phone)) {
            $setParts[] = "phone = :phone";
            $params[':phone'] = $this->phone;
        }
        
        if (isset($this->password_hash) && !empty($this->password_hash)) {
            $setParts[] = "password_hash = :password_hash";
            $params[':password_hash'] = password_hash($this->password_hash, PASSWORD_DEFAULT);
        }
        
        // Always update the timestamp
        $setParts[] = "updated_at = CURRENT_TIMESTAMP";
        
        if (empty($setParts)) {
            return false;
        }
        
        $query = "UPDATE " . $this->table . " 
                 SET " . implode(", ", $setParts) . "
                 WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        // Bind all parameters
        foreach ($params as $key => $value) {
            $stmt->bindParam($key, $value);
        }
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }
}
?>
