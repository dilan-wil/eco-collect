export interface User {
  id: string;
  email: string;
  nom_complet: string;
  phone?: string;
  role: string;
  avatar: string;
  points: number;
  created_at: string;
  updated_at: string;
};