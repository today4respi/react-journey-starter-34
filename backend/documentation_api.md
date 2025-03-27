
# Documentation API DARIAPP

Cette documentation décrit toutes les API disponibles dans l'application DARIAPP.

## API Utilisateurs

### 1. Récupérer tous les utilisateurs
- **URL**: `/api/users`
- **Méthode**: `GET`
- **Description**: Récupère la liste de tous les utilisateurs
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/users
  - Réponse: Liste de tous les utilisateurs

### 2. Récupérer un utilisateur spécifique
- **URL**: `/api/users/:id`
- **Méthode**: `GET`
- **Description**: Récupère les informations d'un utilisateur spécifique
- **Paramètres**:
  - id: identifiant de l'utilisateur
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/users/1
  - Réponse: Informations de l'utilisateur avec l'id 1

### 3. Inscription d'un utilisateur
- **URL**: `/api/users/register`
- **Méthode**: `POST`
- **Description**: Crée un nouvel utilisateur
- **Corps de la requête**:
  ```json
  {
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "role": "user"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/users/register
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus
  - Réponse: Confirmation de création de l'utilisateur

### 4. Connexion d'un utilisateur
- **URL**: `/api/users/login`
- **Méthode**: `POST`
- **Description**: Authentifie un utilisateur
- **Corps de la requête**:
  ```json
  {
    "email": "jean.dupont@example.com",
    "password": "motdepasse123"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/users/login
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus
  - Réponse: Informations de l'utilisateur connecté

### 5. Déconnexion d'un utilisateur
- **URL**: `/api/users/logout`
- **Méthode**: `POST`
- **Description**: Déconnecte l'utilisateur actuellement connecté
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/users/logout
  - Réponse: Confirmation de déconnexion

### 6. Récupérer l'utilisateur connecté
- **URL**: `/api/users/me`
- **Méthode**: `GET`
- **Description**: Récupère les informations de l'utilisateur actuellement connecté
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/users/me
  - Réponse: Informations de l'utilisateur connecté

### 7. Modifier un utilisateur
- **URL**: `/api/users/:id`
- **Méthode**: `PUT`
- **Description**: Modifie les informations d'un utilisateur
- **Paramètres**:
  - id: identifiant de l'utilisateur
- **Corps de la requête** (tous les champs sont optionnels):
  ```json
  {
    "nom": "Nouveau Nom",
    "prenom": "Nouveau Prénom",
    "email": "nouvel.email@example.com",
    "password": "nouveaumotdepasse",
    "role": "admin"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: PUT
  - URL: http://localhost:3000/api/users/1
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus (ou une partie des champs à modifier)
  - Réponse: Confirmation de mise à jour

### 8. Supprimer un utilisateur
- **URL**: `/api/users/:id`
- **Méthode**: `DELETE`
- **Description**: Supprime un utilisateur
- **Paramètres**:
  - id: identifiant de l'utilisateur
- **Exemple avec Postman**:
  - Méthode: DELETE
  - URL: http://localhost:3000/api/users/1
  - Réponse: Confirmation de suppression
