
export interface Checkpoint {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  visited: boolean;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface Route {
  id: number;
  name: string;
  description: string;
  distance: string;
  time: string;
  completed: string;
  route: RoutePoint[];
  checkpoints: Checkpoint[];
}

// Define the routes data
export const routesData: Route[] = [
  {
    id: 1,
    name: "Secteur A",
    description: "Entrée principale",
    distance: "0.8 km",
    time: "10 min",
    completed: "1/3",
    route: [
      { latitude: 48.8566, longitude: 2.3522 },
      { latitude: 48.8576, longitude: 2.3532 },
      { latitude: 48.8586, longitude: 2.3542 },
    ],
    checkpoints: [
      { 
        id: 1,
        latitude: 48.8566, 
        longitude: 2.3522, 
        title: 'Point de départ',
        description: 'Entrée principale',
        visited: true
      },
      { 
        id: 2,
        latitude: 48.8576, 
        longitude: 2.3532, 
        title: 'Point intermédiaire',
        description: 'Escalier de secours',
        visited: false
      },
      { 
        id: 3,
        latitude: 48.8586, 
        longitude: 2.3542, 
        title: 'Point d\'arrivée',
        description: 'Sortie de secours',
        visited: false
      },
    ]
  },
  {
    id: 2,
    name: "Secteur B",
    description: "Parking souterrain",
    distance: "1.2 km",
    time: "15 min",
    completed: "2/3",
    route: [
      { latitude: 48.8566, longitude: 2.3522 },
      { latitude: 48.8576, longitude: 2.3532 },
      { latitude: 48.8586, longitude: 2.3542 },
      { latitude: 48.8596, longitude: 2.3552 },
      { latitude: 48.8606, longitude: 2.3562 },
    ],
    checkpoints: [
      { 
        id: 1,
        latitude: 48.8566, 
        longitude: 2.3522, 
        title: 'Point de départ',
        description: 'Entrée principale',
        visited: true
      },
      { 
        id: 2,
        latitude: 48.8586, 
        longitude: 2.3542, 
        title: 'Point de contrôle',
        description: 'Porte de service',
        visited: true
      },
      { 
        id: 3,
        latitude: 48.8606, 
        longitude: 2.3562, 
        title: 'Point d\'arrivée',
        description: 'Sortie de secours',
        visited: false
      },
    ]
  },
  {
    id: 3,
    name: "Secteur C",
    description: "Zone administrative",
    distance: "1.5 km",
    time: "20 min",
    completed: "0/4",
    route: [
      { latitude: 48.8596, longitude: 2.3502 },
      { latitude: 48.8606, longitude: 2.3512 },
      { latitude: 48.8616, longitude: 2.3522 },
      { latitude: 48.8626, longitude: 2.3532 },
      { latitude: 48.8636, longitude: 2.3542 },
    ],
    checkpoints: [
      { 
        id: 1,
        latitude: 48.8596, 
        longitude: 2.3502, 
        title: 'Entrée',
        description: 'Accueil',
        visited: false
      },
      { 
        id: 2,
        latitude: 48.8606, 
        longitude: 2.3512, 
        title: 'Bureau principal',
        description: 'Salle des archives',
        visited: false
      },
      { 
        id: 3,
        latitude: 48.8616, 
        longitude: 2.3522, 
        title: 'Salle de conférence',
        description: 'Matériel audiovisuel',
        visited: false
      },
      { 
        id: 4,
        latitude: 48.8636, 
        longitude: 2.3542, 
        title: 'Sortie',
        description: 'Issue de secours',
        visited: false
      },
    ]
  }
];
