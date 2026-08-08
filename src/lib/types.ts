// types/signalements.ts

export type Categorie = 
  | 'Ménager'
  | 'Plastique'
  | 'Organique'
  | 'Construction'
  | 'Électronique'
  | 'Dangereux'

export type NiveauAccumulation = 
  | 'faible'
  | 'moyen'
  | 'élevé'
  | 'critique';

export type Priorite = 
  | 'basse'
  | 'moyenne'
  | 'haute'
  | 'critique';

export type Statut = 
  | 'nouveau'
  | 'en_cours'
  | 'resolu'
  | 'ferme'
  | 'rejete';


// Pour la création (sans les champs auto-générés)
export type CreateSignalement = Omit<
  Signalement,
  'id' | 'date_creation' | 'date_modification' | 'statut'
> & {
  statut?: Statut;
};

// Pour la mise à jour (tous les champs optionnels)
export type UpdateSignalement = Partial<Omit<Signalement, 'id' | 'id_utilisateur' | 'date_creation'>>;

// Pour les filtres de recherche
export interface SignalementFilters {
  categorie?: Categorie;
  statut?: Statut;
  priorite?: Priorite;
  niveau_accumulation?: NiveauAccumulation;
  id_utilisateur?: string;
  assigne_a?: string;
  date_debut?: Date;
  date_fin?: Date;
  ville?: string;
  code_postal?: string;
  recherche?: string; // Recherche dans description
}
export interface User {
  id: string;
  email: string;
  nom_complet: string;
  phone?: string;
  role: "ADMIN" | "CITOYEN" | "AGENT";
  avatar: string;
  points: number;
  created_at: string;
  updated_at: string;
};

export interface Signalement {
  id: string;
  description: string;
  categorie: Categorie;
  niveau_accumulation: NiveauAccumulation;
  priorite: Priorite;
  statut: Statut;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  confiance_ia: number;
  objets_ia: [];
  pays: string;
  latitude: number | null;
  longitude: number | null;
  fichier_url: string | null;
  id_utilisateur: string;
  assigne_a: string | null;
  categorie_id: string | null;
  date_creation: Date;
  date_modification: Date;
  commentaire_interne: string | null;
  commentaire_public: string | null;
}

export interface Vehicule {
  id: string;

  immatriculation: string;
  type: string;
  capacite: string;

  niveau_carburant: number;

  statut:
    | "disponible"
    | "en_service"
    | "en_maintenance";

  id_agent?: string | null;

  statut_maintenance:
    | "a_jour"
    | "bientot_requise"
    | "en_cours";

  date_derniere_maintenance?: string | null;

  date_creation: string;
  date_modification: string;
}

export interface Agent {
  id: string;
  nom_complet: string;
  email: string;
  phone: string;

  matricule: string;

  statut:
    | "disponible"
    | "en_mission"
    | "hors_service"
    | "conge";

  disponibilite: boolean;

  zone_intervention?: string | null;

  date_embauche?: string | null;

  date_creation: string;
  date_modification: string;
}

// types/missions.ts
export type MissionStatut = 'planifiee' | 'en_cours' | 'terminee' | 'annulee' | 'en_retard';
export type MissionPriorite = 'basse' | 'normale' | 'haute' | 'critique';
export type MissionType = 'collecte' | 'inspection' | 'maintenance' | 'urgente';

export interface Mission {
  id: string;
  reference: string;
  signalement_id: string;
  agent_id: string;
  vehicule_id: string | null;
  date_creation: Date;
  date_debut: Date | null;
  date_fin_prevue: Date | null;
  date_fin_reelle: Date | null;
  date_derniere_mise_a_jour: Date;
  statut: MissionStatut;
  priorite: MissionPriorite;
  description: string | null;
  instructions_specifiques: string | null;
  type_mission: MissionType | null;
  resultat: string | null;
  commentaires_internes: string | null;
  commentaires_publics: string | null;
  note_agent: number | null;
  commentaire_evaluation: string | null;
  metadata: any;
  tags: string[];
  created_by: string | null;
  updated_by: string | null;
  created_at: Date;
  updated_at: Date;
  
  // Relations (pour les jointures)
  signalement?: Signalement;
  agent?: Agent;
  vehicule?: Vehicule;
  historique?: MissionHistorique[];
}

export interface MissionHistorique {
  id: string;
  mission_id: string;
  ancien_statut: MissionStatut | null;
  nouveau_statut: MissionStatut | null;
  commentaire: string | null;
  date_changement: Date;
  change_par: string | null;
}