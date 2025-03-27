
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: string;
}

export type EditableField = 'email' | 'nom' | 'prenom' | 'password';
