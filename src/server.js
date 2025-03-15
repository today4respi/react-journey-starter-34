
const express = require('express');
const cors = require('cors');
const { generateApiDocs } = require('./scripts/generateApiDocs');
const { API_CONFIG } = require('./config/apiConfig');

// Create Express app
const app = express();
const port = API_CONFIG.port || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static documentation files
app.use('/docs', express.static('./docs'));

// Generate API documentation on server start
generateApiDocs();

/**
 * ======= AUTH ROUTES =======
 */

/**
 * Route: POST /api/users/login
 * Description: Authentifie un utilisateur existant
 * 
 * Cette route permet à un utilisateur de se connecter en fournissant
 * son email et son mot de passe. En cas de succès, un token JWT est
 * retourné pour les futures requêtes authentifiées.
 * 
 * @body {String} email - L'adresse email de l'utilisateur
 * @body {String} password - Le mot de passe de l'utilisateur
 * @returns {Object} Objet contenant un status, un token et les données de l'utilisateur
 */
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // Logique de vérification des identifiants (simplifiée pour la démonstration)
  if (email && password) {
    res.json({
      status: 200,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjE2NjE2MDE2LCJleHAiOjE2MTY3MDI0MTZ9.example-token',
      user: {
        id: 1,
        name: 'John Doe',
        email: email,
        role: 'user',
        createdAt: '2023-06-15T10:30:00Z'
      }
    });
  } else {
    res.status(401).json({
      status: 401,
      message: 'Email ou mot de passe invalide'
    });
  }
});

/**
 * Route: POST /api/users/register
 * Description: Enregistre un nouvel utilisateur
 * 
 * Cette route permet à un nouvel utilisateur de créer un compte.
 * Les données requises incluent le nom, l'email et le mot de passe.
 * Un token JWT est retourné pour permettre une connexion immédiate.
 * 
 * @body {String} name - Le nom complet de l'utilisateur
 * @body {String} email - L'adresse email de l'utilisateur (unique)
 * @body {String} password - Le mot de passe de l'utilisateur
 * @returns {Object} Objet contenant un status, un token et les données du nouvel utilisateur
 */
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Vérification minimale
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Veuillez fournir un nom, un email et un mot de passe'
    });
  }
  
  // Logique de création de compte (simplifiée pour la démonstration)
  res.status(201).json({
    status: 201,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjE2NjE2MDE2LCJleHAiOjE2MTY3MDI0MTZ9.example-register-token',
    user: {
      id: 3,
      name: name || 'New User',
      email: email || 'newuser@example.com',
      role: 'user',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * ======= USERS ROUTES =======
 */

/**
 * Route: GET /api/users
 * Description: Récupère la liste de tous les utilisateurs
 * 
 * Cette route permet d'obtenir un tableau contenant tous les utilisateurs
 * enregistrés dans la base de données de JenCity avec leurs informations
 * de base comme le nom, l'email et le rôle.
 * 
 * @returns {Object} Objet contenant un status et un tableau d'utilisateurs
 */
app.get('/api/users', (req, res) => {
  // Logique pour récupérer les utilisateurs de la base de données
  res.json({
    status: 200,
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin'
      }
    ]
  });
});

/**
 * Route: GET /api/users/:id
 * Description: Récupère les détails d'un utilisateur spécifique
 * 
 * Cette route permet d'obtenir les informations détaillées d'un utilisateur
 * en fonction de son identifiant unique. Les informations retournées incluent
 * les données personnelles et la date de création du compte.
 * 
 * @param {Number} id - L'identifiant unique de l'utilisateur
 * @returns {Object} Objet contenant un status et les données détaillées de l'utilisateur
 */
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  // Logique pour récupérer un utilisateur spécifique de la base de données
  res.json({
    status: 200,
    data: {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: '2023-06-15T10:30:00Z'
    }
  });
});

/**
 * Route: POST /api/users
 * Description: Crée un nouvel utilisateur
 * 
 * Cette route permet de créer un nouvel utilisateur dans la base de données
 * de JenCity. Les données requises incluent le nom, l'email et le mot de passe.
 * Un rôle par défaut 'user' est attribué aux nouveaux utilisateurs.
 * 
 * @body {String} name - Le nom complet de l'utilisateur
 * @body {String} email - L'adresse email de l'utilisateur (unique)
 * @body {String} password - Le mot de passe de l'utilisateur
 * @returns {Object} Objet contenant un status et les données du nouvel utilisateur créé
 */
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  // Logique pour créer un nouvel utilisateur dans la base de données
  res.status(201).json({
    status: 201,
    data: {
      id: 3,
      name: name || 'New User',
      email: email || 'newuser@example.com',
      role: 'user',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * Route: PUT /api/users/:id
 * Description: Mise à jour des informations d'un utilisateur existant
 * 
 * Cette route permet de modifier les informations d'un utilisateur existant
 * dans la base de données. Les champs modifiables incluent le nom et l'email.
 * 
 * @param {Number} id - L'identifiant unique de l'utilisateur
 * @body {String} [name] - Le nouveau nom de l'utilisateur (optionnel)
 * @body {String} [email] - La nouvelle adresse email de l'utilisateur (optionnel)
 * @returns {Object} Objet contenant un status et les données mises à jour de l'utilisateur
 */
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  // Logique pour mettre à jour un utilisateur dans la base de données
  res.json({
    status: 200,
    data: {
      id: userId,
      name: name || 'Updated Name',
      email: email || 'updated@example.com',
      role: 'user',
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * Route: DELETE /api/users/:id
 * Description: Supprime un utilisateur
 * 
 * Cette route permet de supprimer définitivement un utilisateur de la base de
 * données de JenCity en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique de l'utilisateur
 * @returns {Object} Objet contenant un status et un message de confirmation
 */
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  // Logique pour supprimer un utilisateur de la base de données
  res.status(204).json({
    status: 204,
    message: 'User deleted successfully'
  });
});

/**
 * ======= PLACES ROUTES =======
 */

/**
 * Route: GET /api/places
 * Description: Récupère la liste de tous les lieux
 * 
 * Cette route permet d'obtenir un tableau contenant tous les lieux
 * touristiques disponibles dans JenCity, incluant leur nom, type,
 * emplacement géographique et une brève description.
 * 
 * @returns {Object} Objet contenant un status et un tableau de lieux
 */
app.get('/api/places', (req, res) => {
  // Logique pour récupérer les lieux de la base de données
  res.json({
    status: 200,
    data: [
      {
        id: 1,
        name: 'Bulla Regia',
        type: 'historical',
        location: {
          latitude: 36.5594,
          longitude: 8.7553
        },
        description: 'Ancient Roman city with unique underground villas'
      },
      {
        id: 2,
        name: 'Ain Draham',
        type: 'natural',
        location: {
          latitude: 36.7828,
          longitude: 8.6875
        },
        description: 'Mountain town known for its forests and cool climate'
      }
    ]
  });
});

/**
 * Route: GET /api/places/:id
 * Description: Récupère les détails d'un lieu spécifique
 * 
 * Cette route permet d'obtenir des informations détaillées sur un lieu
 * touristique spécifique, incluant les images, horaires d'ouverture,
 * tarifs d'entrée et autres informations pratiques.
 * 
 * @param {Number} id - L'identifiant unique du lieu
 * @returns {Object} Objet contenant un status et les données détaillées du lieu
 */
app.get('/api/places/:id', (req, res) => {
  const placeId = parseInt(req.params.id);
  // Logique pour récupérer un lieu spécifique de la base de données
  res.json({
    status: 200,
    data: {
      id: placeId,
      name: 'Bulla Regia',
      type: 'historical',
      location: {
        latitude: 36.5594,
        longitude: 8.7553
      },
      description: 'Ancient Roman city with unique underground villas',
      images: [
        'https://example.com/bulla-regia-1.jpg',
        'https://example.com/bulla-regia-2.jpg'
      ],
      openingHours: {
        monday: '9:00 - 17:00',
        tuesday: '9:00 - 17:00',
        wednesday: '9:00 - 17:00',
        thursday: '9:00 - 17:00',
        friday: '9:00 - 17:00',
        saturday: '9:00 - 17:00',
        sunday: '9:00 - 17:00'
      },
      entranceFee: {
        adult: 10,
        child: 5,
        student: 7,
        senior: 7
      }
    }
  });
});

/**
 * Route: POST /api/places
 * Description: Crée un nouveau lieu
 * 
 * Cette route permet d'ajouter un nouveau lieu touristique dans la base de
 * données de JenCity. Les informations requises incluent le nom, le type,
 * l'emplacement géographique et une description.
 * 
 * @body {String} name - Le nom du lieu
 * @body {String} type - Le type de lieu (historical, natural, cultural, etc.)
 * @body {Object} location - Les coordonnées géographiques du lieu
 * @body {Number} location.latitude - La latitude
 * @body {Number} location.longitude - La longitude
 * @body {String} description - Une description du lieu
 * @returns {Object} Objet contenant un status et les données du nouveau lieu créé
 */
app.post('/api/places', (req, res) => {
  const { name, type, location, description } = req.body;
  // Logique pour créer un nouveau lieu dans la base de données
  res.status(201).json({
    status: 201,
    data: {
      id: 3,
      name: name || 'New Place',
      type: type || 'cultural',
      location: location || {
        latitude: 36.5,
        longitude: 8.8
      },
      description: description || 'A new cultural attraction',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * Route: PUT /api/places/:id
 * Description: Met à jour un lieu existant
 * 
 * Cette route permet de modifier les informations d'un lieu touristique existant
 * dans la base de données. Les champs modifiables incluent le nom, le type et la description.
 * 
 * @param {Number} id - L'identifiant unique du lieu
 * @body {String} [name] - Le nouveau nom du lieu (optionnel)
 * @body {String} [type] - Le nouveau type du lieu (optionnel)
 * @body {String} [description] - La nouvelle description du lieu (optionnel)
 * @returns {Object} Objet contenant un status et les données mises à jour du lieu
 */
app.put('/api/places/:id', (req, res) => {
  const placeId = parseInt(req.params.id);
  const { name, type, description } = req.body;
  
  res.json({
    status: 200,
    data: {
      id: placeId,
      name: name || 'Updated Place',
      type: type || 'historical',
      location: {
        latitude: 36.5594,
        longitude: 8.7553
      },
      description: description || 'Updated description for this attraction',
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * Route: DELETE /api/places/:id
 * Description: Supprime un lieu
 * 
 * Cette route permet de supprimer définitivement un lieu touristique de la base de
 * données de JenCity en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique du lieu
 * @returns {Object} Objet contenant un status et un message de confirmation
 */
app.delete('/api/places/:id', (req, res) => {
  const placeId = parseInt(req.params.id);
  
  res.status(204).json({
    status: 204,
    message: 'Place deleted successfully'
  });
});

/**
 * ======= EVENTS ROUTES =======
 */

/**
 * Route: GET /api/events
 * Description: Récupère la liste de tous les événements
 * 
 * Cette route permet d'obtenir un tableau contenant tous les événements
 * programmés dans JenCity, incluant leur titre, description, dates
 * de début et fin, ainsi que leur emplacement.
 * 
 * @returns {Object} Objet contenant un status et un tableau d'événements
 */
app.get('/api/events', (req, res) => {
  // Logique pour récupérer les événements de la base de données
  res.json({
    status: 200,
    data: [
      {
        id: 1,
        title: 'Cultural Festival',
        description: 'Annual cultural festival in Jendouba',
        startDate: '2023-09-15T18:00:00Z',
        endDate: '2023-09-17T22:00:00Z',
        location: 'Jendouba City Center'
      },
      {
        id: 2,
        title: 'Hiking Trip',
        description: 'Guided hiking trip in Ain Draham mountains',
        startDate: '2023-10-05T09:00:00Z',
        endDate: '2023-10-05T16:00:00Z',
        location: 'Ain Draham'
      }
    ]
  });
});

/**
 * Route: GET /api/events/:id
 * Description: Récupère les détails d'un événement spécifique
 * 
 * Cette route permet d'obtenir des informations détaillées sur un événement
 * spécifique, incluant l'organisateur, le prix des billets, la capacité et les images.
 * 
 * @param {Number} id - L'identifiant unique de l'événement
 * @returns {Object} Objet contenant un status et les données détaillées de l'événement
 */
app.get('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  
  res.json({
    status: 200,
    data: {
      id: eventId,
      title: 'Cultural Festival',
      description: 'Annual cultural festival in Jendouba with local artists and traditional food',
      startDate: '2023-09-15T18:00:00Z',
      endDate: '2023-09-17T22:00:00Z',
      location: 'Jendouba City Center',
      organizer: 'Jendouba Cultural Association',
      ticketPrice: 10,
      capacity: 500,
      images: [
        'https://example.com/festival1.jpg',
        'https://example.com/festival2.jpg'
      ]
    }
  });
});

/**
 * Route: POST /api/events
 * Description: Crée un nouvel événement
 * 
 * Cette route permet d'ajouter un nouvel événement dans la base de données de JenCity.
 * Les informations requises incluent le titre, la description, les dates et l'emplacement.
 * 
 * @body {String} title - Le titre de l'événement
 * @body {String} description - La description de l'événement
 * @body {String} startDate - La date et heure de début (format ISO)
 * @body {String} endDate - La date et heure de fin (format ISO)
 * @body {String} location - L'emplacement de l'événement
 * @returns {Object} Objet contenant un status et les données du nouvel événement créé
 */
app.post('/api/events', (req, res) => {
  const { title, description, startDate, endDate, location } = req.body;
  
  res.status(201).json({
    status: 201,
    data: {
      id: 3,
      title: title || 'New Event',
      description: description || 'Description of the new event',
      startDate: startDate || '2023-11-10T19:00:00Z',
      endDate: endDate || '2023-11-10T23:00:00Z',
      location: location || 'Bulla Regia Site',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * Route: PUT /api/events/:id
 * Description: Met à jour un événement existant
 * 
 * Cette route permet de modifier les informations d'un événement existant dans
 * la base de données. Les champs modifiables incluent le titre, la description et l'emplacement.
 * 
 * @param {Number} id - L'identifiant unique de l'événement
 * @body {String} [title] - Le nouveau titre de l'événement (optionnel)
 * @body {String} [description] - La nouvelle description de l'événement (optionnel)
 * @body {String} [location] - Le nouvel emplacement de l'événement (optionnel)
 * @returns {Object} Objet contenant un status et les données mises à jour de l'événement
 */
app.put('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, description, location } = req.body;
  
  res.json({
    status: 200,
    data: {
      id: eventId,
      title: title || 'Updated Event Title',
      description: description || 'Updated event description',
      startDate: '2023-09-15T18:00:00Z',
      endDate: '2023-09-17T22:00:00Z',
      location: location || 'New location',
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * Route: DELETE /api/events/:id
 * Description: Supprime un événement
 * 
 * Cette route permet de supprimer définitivement un événement de la base de
 * données de JenCity en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique de l'événement
 * @returns {Object} Objet contenant un status et un message de confirmation
 */
app.delete('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  
  res.status(204).json({
    status: 204,
    message: 'Event deleted successfully'
  });
});

/**
 * ======= MESSAGES ROUTES =======
 */

/**
 * Route: GET /api/messages
 * Description: Récupère la liste de tous les messages
 * 
 * Cette route permet d'obtenir un tableau contenant tous les messages
 * échangés entre les utilisateurs de JenCity, incluant l'expéditeur,
 * le destinataire, le contenu et l'état de lecture.
 * 
 * @returns {Object} Objet contenant un status et un tableau de messages
 */
app.get('/api/messages', (req, res) => {
  res.json({
    status: 200,
    data: [
      {
        id: 1,
        senderId: 1,
        receiverId: 2,
        content: 'Bonjour, j\'ai une question sur Bulla Regia.',
        createdAt: '2023-08-15T14:30:00Z',
        read: true
      },
      {
        id: 2,
        senderId: 2,
        receiverId: 1,
        content: 'Bien sûr, comment puis-je vous aider?',
        createdAt: '2023-08-15T14:35:00Z',
        read: false
      }
    ]
  });
});

/**
 * Route: GET /api/messages/:id
 * Description: Récupère un message spécifique
 * 
 * Cette route permet d'obtenir les détails d'un message spécifique
 * en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique du message
 * @returns {Object} Objet contenant un status et les données du message
 */
app.get('/api/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  
  res.json({
    status: 200,
    data: {
      id: messageId,
      senderId: 1,
      receiverId: 2,
      content: 'Bonjour, j\'ai une question sur Bulla Regia.',
      createdAt: '2023-08-15T14:30:00Z',
      read: true
    }
  });
});

/**
 * Route: POST /api/messages
 * Description: Envoie un nouveau message
 * 
 * Cette route permet d'envoyer un nouveau message à un utilisateur dans
 * la plateforme JenCity. Les données requises incluent l'expéditeur,
 * le destinataire et le contenu du message.
 * 
 * @body {Number} senderId - L'identifiant de l'expéditeur
 * @body {Number} receiverId - L'identifiant du destinataire
 * @body {String} content - Le contenu du message
 * @returns {Object} Objet contenant un status et les données du message envoyé
 */
app.post('/api/messages', (req, res) => {
  const { senderId, receiverId, content } = req.body;
  
  res.status(201).json({
    status: 201,
    data: {
      id: 3,
      senderId: senderId || 1,
      receiverId: receiverId || 2,
      content: content || 'Je voudrais plus d\'informations sur l\'événement du 15 septembre.',
      createdAt: new Date().toISOString(),
      read: false
    }
  });
});

/**
 * Route: PUT /api/messages/:id
 * Description: Met à jour l'état de lecture d'un message
 * 
 * Cette route permet de modifier l'état de lecture d'un message existant,
 * par exemple pour marquer un message comme lu.
 * 
 * @param {Number} id - L'identifiant unique du message
 * @body {Boolean} read - Le nouvel état de lecture du message
 * @returns {Object} Objet contenant un status et les données mises à jour du message
 */
app.put('/api/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const { read } = req.body;
  
  res.json({
    status: 200,
    data: {
      id: messageId,
      senderId: 2,
      receiverId: 1,
      content: 'Bien sûr, comment puis-je vous aider?',
      createdAt: '2023-08-15T14:35:00Z',
      read: read !== undefined ? read : true,
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * Route: DELETE /api/messages/:id
 * Description: Supprime un message
 * 
 * Cette route permet de supprimer définitivement un message de la base de
 * données de JenCity en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique du message
 * @returns {Object} Objet contenant un status et un message de confirmation
 */
app.delete('/api/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  
  res.status(204).json({
    status: 204,
    message: 'Message deleted successfully'
  });
});

/**
 * ======= REVIEWS ROUTES =======
 */

/**
 * Route: GET /api/reviews
 * Description: Récupère la liste de tous les avis
 * 
 * Cette route permet d'obtenir un tableau contenant tous les avis
 * laissés par les utilisateurs sur les lieux touristiques de JenCity,
 * incluant l'utilisateur, le lieu, la note et le commentaire.
 * 
 * @returns {Object} Objet contenant un status et un tableau d'avis
 */
app.get('/api/reviews', (req, res) => {
  res.json({
    status: 200,
    data: [
      {
        id: 1,
        userId: 1,
        placeId: 1,
        rating: 5,
        comment: 'Un site historique fascinant, je recommande vivement!',
        createdAt: '2023-07-20T10:15:00Z'
      },
      {
        id: 2,
        userId: 2,
        placeId: 2,
        rating: 4,
        comment: 'Très beau paysage, mais un peu difficile d\'accès.',
        createdAt: '2023-08-05T16:30:00Z'
      }
    ]
  });
});

/**
 * Route: GET /api/reviews/:id
 * Description: Récupère un avis spécifique
 * 
 * Cette route permet d'obtenir les détails d'un avis spécifique
 * en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique de l'avis
 * @returns {Object} Objet contenant un status et les données de l'avis
 */
app.get('/api/reviews/:id', (req, res) => {
  const reviewId = parseInt(req.params.id);
  
  res.json({
    status: 200,
    data: {
      id: reviewId,
      userId: 1,
      placeId: 1,
      rating: 5,
      comment: 'Un site historique fascinant, je recommande vivement!',
      createdAt: '2023-07-20T10:15:00Z'
    }
  });
});

/**
 * Route: POST /api/reviews
 * Description: Ajoute un nouvel avis
 * 
 * Cette route permet d'ajouter un nouvel avis sur un lieu touristique dans
 * la base de données de JenCity. Les données requises incluent l'utilisateur,
 * le lieu, la note et le commentaire.
 * 
 * @body {Number} userId - L'identifiant de l'utilisateur
 * @body {Number} placeId - L'identifiant du lieu
 * @body {Number} rating - La note (de 1 à 5)
 * @body {String} comment - Le commentaire
 * @returns {Object} Objet contenant un status et les données du nouvel avis créé
 */
app.post('/api/reviews', (req, res) => {
  const { userId, placeId, rating, comment } = req.body;
  
  res.status(201).json({
    status: 201,
    data: {
      id: 3,
      userId: userId || 3,
      placeId: placeId || 1,
      rating: rating || 4,
      comment: comment || 'Très intéressant, bonne visite guidée.',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * Route: PUT /api/reviews/:id
 * Description: Met à jour un avis existant
 * 
 * Cette route permet de modifier un avis existant dans la base de données.
 * Les champs modifiables incluent la note et le commentaire.
 * 
 * @param {Number} id - L'identifiant unique de l'avis
 * @body {Number} [rating] - La nouvelle note (optionnel)
 * @body {String} [comment] - Le nouveau commentaire (optionnel)
 * @returns {Object} Objet contenant un status et les données mises à jour de l'avis
 */
app.put('/api/reviews/:id', (req, res) => {
  const reviewId = parseInt(req.params.id);
  const { rating, comment } = req.body;
  
  res.json({
    status: 200,
    data: {
      id: reviewId,
      userId: 2,
      placeId: 2,
      rating: rating || 5,
      comment: comment || 'J\'ai changé d\'avis, c\'était vraiment excellent!',
      createdAt: '2023-08-05T16:30:00Z',
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * Route: DELETE /api/reviews/:id
 * Description: Supprime un avis
 * 
 * Cette route permet de supprimer définitivement un avis de la base de
 * données de JenCity en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique de l'avis
 * @returns {Object} Objet contenant un status et un message de confirmation
 */
app.delete('/api/reviews/:id', (req, res) => {
  const reviewId = parseInt(req.params.id);
  
  res.status(204).json({
    status: 204,
    message: 'Review deleted successfully'
  });
});

/**
 * ======= RESERVATIONS ROUTES =======
 */

/**
 * Route: GET /api/reservations
 * Description: Récupère la liste de toutes les réservations
 * 
 * Cette route permet d'obtenir un tableau contenant toutes les réservations
 * faites par les utilisateurs pour des événements ou des visites de lieux,
 * incluant l'utilisateur, l'événement/lieu, le nombre de billets et le statut.
 * 
 * @returns {Object} Objet contenant un status et un tableau de réservations
 */
app.get('/api/reservations', (req, res) => {
  res.json({
    status: 200,
    data: [
      {
        id: 1,
        userId: 1,
        eventId: 1,
        numberOfTickets: 2,
        totalPrice: 20,
        status: 'confirmed',
        createdAt: '2023-08-10T11:20:00Z'
      },
      {
        id: 2,
        userId: 2,
        placeId: 1,
        visitDate: '2023-09-20T10:00:00Z',
        numberOfPersons: 3,
        totalPrice: 30,
        status: 'pending',
        createdAt: '2023-08-15T09:45:00Z'
      }
    ]
  });
});

/**
 * Route: GET /api/reservations/:id
 * Description: Récupère une réservation spécifique
 * 
 * Cette route permet d'obtenir les détails d'une réservation spécifique
 * en fonction de son identifiant unique, incluant les détails de paiement.
 * 
 * @param {Number} id - L'identifiant unique de la réservation
 * @returns {Object} Objet contenant un status et les données de la réservation
 */
app.get('/api/reservations/:id', (req, res) => {
  const reservationId = parseInt(req.params.id);
  
  res.json({
    status: 200,
    data: {
      id: reservationId,
      userId: 1,
      eventId: 1,
      numberOfTickets: 2,
      totalPrice: 20,
      status: 'confirmed',
      createdAt: '2023-08-10T11:20:00Z',
      paymentMethod: 'credit card',
      paymentId: 'pay_1234567'
    }
  });
});

/**
 * Route: POST /api/reservations
 * Description: Crée une nouvelle réservation
 * 
 * Cette route permet de créer une nouvelle réservation pour un événement ou
 * une visite de lieu dans la base de données de JenCity. Les données requises
 * dépendent du type de réservation (événement ou visite de lieu).
 * 
 * @body {Number} userId - L'identifiant de l'utilisateur
 * @body {Number} [eventId] - L'identifiant de l'événement (si réservation d'événement)
 * @body {Number} [placeId] - L'identifiant du lieu (si réservation de visite)
 * @body {Number} [numberOfTickets] - Le nombre de billets (pour événement)
 * @body {Number} [numberOfPersons] - Le nombre de personnes (pour visite)
 * @body {String} [visitDate] - La date et heure de visite (pour visite, format ISO)
 * @body {String} paymentMethod - La méthode de paiement
 * @returns {Object} Objet contenant un status et les données de la nouvelle réservation créée
 */
app.post('/api/reservations', (req, res) => {
  const { userId, eventId, placeId, numberOfTickets, numberOfPersons, visitDate, paymentMethod } = req.body;
  
  res.status(201).json({
    status: 201,
    data: {
      id: 3,
      userId: userId || 3,
      eventId: eventId || 2,
      numberOfTickets: numberOfTickets || 1,
      totalPrice: 10,
      status: 'pending',
      paymentMethod: paymentMethod || 'paypal',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * Route: PUT /api/reservations/:id
 * Description: Met à jour une réservation existante
 * 
 * Cette route permet de modifier le statut ou d'autres détails d'une
 * réservation existante dans la base de données.
 * 
 * @param {Number} id - L'identifiant unique de la réservation
 * @body {String} [status] - Le nouveau statut (optionnel)
 * @body {String} [paymentId] - L'identifiant de paiement (optionnel)
 * @returns {Object} Objet contenant un status et les données mises à jour de la réservation
 */
app.put('/api/reservations/:id', (req, res) => {
  const reservationId = parseInt(req.params.id);
  const { status, paymentId } = req.body;
  
  res.json({
    status: 200,
    data: {
      id: reservationId,
      userId: 2,
      placeId: 1,
      visitDate: '2023-09-20T10:00:00Z',
      numberOfPersons: 3,
      totalPrice: 30,
      status: status || 'confirmed',
      paymentId: paymentId || 'pay_9876543',
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * Route: DELETE /api/reservations/:id
 * Description: Annule et supprime une réservation
 * 
 * Cette route permet d'annuler et de supprimer définitivement une réservation
 * de la base de données de JenCity en fonction de son identifiant unique.
 * 
 * @param {Number} id - L'identifiant unique de la réservation
 * @returns {Object} Objet contenant un status et un message de confirmation
 */
app.delete('/api/reservations/:id', (req, res) => {
  const reservationId = parseInt(req.params.id);
  
  res.status(204).json({
    status: 204,
    message: 'Reservation cancelled and deleted successfully'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`JenCity API Server running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/docs/api-documentation.html`);
});
