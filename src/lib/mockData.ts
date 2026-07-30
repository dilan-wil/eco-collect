export interface Report {
  id: string;
  citizenId: string;
  address: string;
  lat: number;
  lng: number;
  wasteType: 'Ménager' | 'Plastique' | 'Organique' | 'Construction' | 'Électronique' | 'Dangereux';
  description: string;
  volume: 'Petit' | 'Moyen' | 'Grand';
  status: 'En attente' | 'Validé' | 'Assigné' | 'En cours' | 'Complété' | 'Rejeté';
  aiConfidence: number;
  aiObjects: string[];
  accumulationLevel: 'Faible' | 'Moyen' | 'Élevé';
  priority: 'Basse' | 'Normale' | 'Haute' | 'Critique';
  organizationId?: string;
  agentId?: string;
  missionId?: string;
  createdAt: string;
  updatedAt: string;
  district: string;
}

export const mockReports: Report[] = [
  {
    id: "REP-2023-001",
    citizenId: "CIT-001",
    address: "Place Bellecour, 69002 Lyon",
    lat: 45.7578,
    lng: 4.8320,
    wasteType: "Plastique",
    description: "Sacs poubelles abandonnés près de la statue",
    volume: "Moyen",
    status: "Validé",
    aiConfidence: 94,
    aiObjects: ["Sacs poubelles", "Bouteilles plastiques"],
    accumulationLevel: "Moyen",
    priority: "Normale",
    organizationId: "ORG-001",
    createdAt: "2023-10-25T08:30:00Z",
    updatedAt: "2023-10-25T09:15:00Z",
    district: "2ème Arrondissement"
  },
  {
    id: "REP-2023-002",
    citizenId: "CIT-002",
    address: "Parc de la Tête d'Or, 69006 Lyon",
    lat: 45.7788,
    lng: 4.8532,
    wasteType: "Ménager",
    description: "Déchets de pique-nique éparpillés",
    volume: "Petit",
    status: "Assigné",
    aiConfidence: 88,
    aiObjects: ["Emballages", "Gobelets"],
    accumulationLevel: "Faible",
    priority: "Normale",
    organizationId: "ORG-001",
    agentId: "AGT-001",
    createdAt: "2023-10-26T14:20:00Z",
    updatedAt: "2023-10-26T15:00:00Z",
    district: "6ème Arrondissement"
  },
  {
    id: "REP-2023-003",
    citizenId: "CIT-003",
    address: "Rue de la République, 69001 Lyon",
    lat: 45.7640,
    lng: 4.8357,
    wasteType: "Construction",
    description: "Gravats déposés sur le trottoir",
    volume: "Grand",
    status: "En attente",
    aiConfidence: 98,
    aiObjects: ["Gravats", "Morceaux de béton", "Bois"],
    accumulationLevel: "Élevé",
    priority: "Critique",
    createdAt: "2023-10-27T07:10:00Z",
    updatedAt: "2023-10-27T07:10:00Z",
    district: "1er Arrondissement"
  },
  {
    id: "REP-2023-004",
    citizenId: "CIT-001",
    address: "Gare Part-Dieu, 69003 Lyon",
    lat: 45.7606,
    lng: 4.8595,
    wasteType: "Électronique",
    description: "Vieux téléviseur et câbles abandonnés",
    volume: "Moyen",
    status: "Complété",
    aiConfidence: 96,
    aiObjects: ["Téléviseur", "Câbles", "Composants"],
    accumulationLevel: "Moyen",
    priority: "Haute",
    organizationId: "ORG-002",
    agentId: "AGT-002",
    createdAt: "2023-10-20T10:00:00Z",
    updatedAt: "2023-10-21T09:30:00Z",
    district: "3ème Arrondissement"
  },
  {
    id: "REP-2023-005",
    citizenId: "CIT-004",
    address: "Vieux Lyon, 69005 Lyon",
    lat: 45.7621,
    lng: 4.8276,
    wasteType: "Organique",
    description: "Restes alimentaires près d'un restaurant",
    volume: "Petit",
    status: "En cours",
    aiConfidence: 91,
    aiObjects: ["Restes alimentaires", "Carton gras"],
    accumulationLevel: "Faible",
    priority: "Normale",
    organizationId: "ORG-001",
    agentId: "AGT-003",
    createdAt: "2023-10-27T09:45:00Z",
    updatedAt: "2023-10-27T10:30:00Z",
    district: "5ème Arrondissement"
  }
];

export const mockAgents = [
  { id: "AGT-001", name: "Jean Dupont", email: "j.dupont@ecocollect.fr", phone: "06 12 34 56 78", status: "En mission", completedMissions: 142, currentMission: "REP-2023-002", organizationId: "ORG-001", rating: 4.8 },
  { id: "AGT-002", name: "Marie Martin", email: "m.martin@ecocollect.fr", phone: "06 98 76 54 32", status: "Disponible", completedMissions: 89, organizationId: "ORG-002", rating: 4.9 },
  { id: "AGT-003", name: "Luc Bernard", email: "l.bernard@ecocollect.fr", phone: "06 45 67 89 01", status: "En mission", completedMissions: 215, currentMission: "REP-2023-005", organizationId: "ORG-001", rating: 4.7 },
  { id: "AGT-004", name: "Sophie Dubois", email: "s.dubois@ecocollect.fr", phone: "06 54 32 10 98", status: "Indisponible", completedMissions: 56, organizationId: "ORG-003", rating: 4.5 },
];

export const mockVehicles = [
  { id: "VEH-001", registration: "AB-123-CD", type: "Camion Benne", capacity: "12m3", fuelLevel: 75, status: "En service", currentAssignment: "AGT-001", maintenanceStatus: "À jour", lastMaintenance: "2023-09-15" },
  { id: "VEH-002", registration: "EF-456-GH", type: "Fourgonnette", capacity: "6m3", fuelLevel: 40, status: "En service", currentAssignment: "AGT-003", maintenanceStatus: "Bientôt requis", lastMaintenance: "2023-05-10" },
  { id: "VEH-003", registration: "IJ-789-KL", type: "Camion Grue", capacity: "15m3", fuelLevel: 90, status: "Disponible", maintenanceStatus: "À jour", lastMaintenance: "2023-10-01" },
  { id: "VEH-004", registration: "MN-012-OP", type: "Utilitaire Léger", capacity: "4m3", fuelLevel: 15, status: "En maintenance", maintenanceStatus: "En cours", lastMaintenance: "2023-10-27" },
];

export const mockStats = {
  totalReports: 12450,
  aiValidationRate: 87,
  successRate: 93,
  avgResponseTime: 48,
  activeAgents: 45,
  activeVehicles: 28,
  todayCompleted: 124,
  urgentReports: 12
};

export const chartData = {
  monthlyReports: [
    { month: "Jan", reports: 850 },
    { month: "Fév", reports: 920 },
    { month: "Mar", reports: 1100 },
    { month: "Avr", reports: 1050 },
    { month: "Mai", reports: 1200 },
    { month: "Juin", reports: 1350 },
    { month: "Juil", reports: 1480 },
    { month: "Aoû", reports: 1400 },
    { month: "Sep", reports: 1250 },
    { month: "Oct", reports: 1550 },
    { month: "Nov", reports: 0 },
    { month: "Déc", reports: 0 },
  ],
  wasteTypes: [
    { name: "Ménager", value: 35 },
    { name: "Plastique", value: 25 },
    { name: "Construction", value: 15 },
    { name: "Organique", value: 10 },
    { name: "Électronique", value: 10 },
    { name: "Dangereux", value: 5 },
  ],
  districts: [
    { name: "1er Arr.", count: 420 },
    { name: "2ème Arr.", count: 380 },
    { name: "3ème Arr.", count: 850 },
    { name: "7ème Arr.", count: 720 },
    { name: "8ème Arr.", count: 590 },
    { name: "9ème Arr.", count: 450 },
  ],
  completionRate: [
    { day: "Lun", rate: 92 },
    { day: "Mar", rate: 95 },
    { day: "Mer", rate: 89 },
    { day: "Jeu", rate: 94 },
    { day: "Ven", rate: 97 },
    { day: "Sam", rate: 85 },
    { day: "Dim", rate: 82 },
  ]
};