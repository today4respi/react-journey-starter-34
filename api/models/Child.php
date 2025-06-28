
<?php
class Child {
    private $conn;
    private $table = 'children';

    public $id;
    public $user_id;
    public $name;
    public $age;
    public $objective;
    public $message;
    public $photo_url;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get children by user ID
    public function getByUserId() {
        $query = "SELECT id, user_id, name, age, objective, message, photo_url, created_at, updated_at 
                 FROM " . $this->table . " 
                 WHERE user_id = :user_id 
                 ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Create child
    public function create() {
        // Generate unique ID for MySQL
        $this->id = uniqid('child_', true);
        
        $query = "INSERT INTO " . $this->table . " 
                 SET id = :id,
                     user_id = :user_id,
                     name = :name,
                     age = :age,
                     objective = :objective,
                     message = :message,
                     photo_url = :photo_url";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->objective = htmlspecialchars(strip_tags($this->objective));
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->photo_url = htmlspecialchars(strip_tags($this->photo_url));

        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':age', $this->age);
        $stmt->bindParam(':objective', $this->objective);
        $stmt->bindParam(':message', $this->message);
        $stmt->bindParam(':photo_url', $this->photo_url);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Update child
    public function update() {
        $query = "UPDATE " . $this->table . " 
                 SET name = :name,
                     age = :age,
                     objective = :objective,
                     message = :message,
                     photo_url = :photo_url,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->objective = htmlspecialchars(strip_tags($this->objective));
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->photo_url = htmlspecialchars(strip_tags($this->photo_url));

        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':age', $this->age);
        $stmt->bindParam(':objective', $this->objective);
        $stmt->bindParam(':message', $this->message);
        $stmt->bindParam(':photo_url', $this->photo_url);

        return $stmt->execute();
    }

    // Delete child
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);

        return $stmt->execute();
    }
}
?>
