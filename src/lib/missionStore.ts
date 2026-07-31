import { create } from 'zustand'
import { Report, mockReports } from '@/lib/mockData'

interface MissionState {
  reports: Report[]
  // Lifecycle actions
  validateReport:  (id: string) => void
  rejectReport:    (id: string, reason: string) => void
  assignReport:    (id: string, agentId: string, vehicleId: string) => void
  unassignReport:  (id: string) => void
  startMission:    (id: string) => void
  completeMission: (id: string) => void
  // Helpers
  getReport: (id: string) => Report | undefined
}

export const useMissionStore = create<MissionState>((set, get) => ({
  reports: mockReports,

  validateReport: (id) =>
    set(s => ({
      reports: s.reports.map(r =>
        r.id === id ? { ...r, status: 'Validé', updatedAt: new Date().toISOString() } : r
      ),
    })),

  rejectReport: (id, reason) =>
    set(s => ({
      reports: s.reports.map(r =>
        r.id === id ? { ...r, status: 'Rejeté', rejectReason: reason, updatedAt: new Date().toISOString() } : r
      ),
    })),

  assignReport: (id, agentId, vehicleId) =>
    set(s => ({
      reports: s.reports.map(r =>
        r.id === id
          ? { ...r, status: 'Assigné', agentId, vehicleId, updatedAt: new Date().toISOString() }
          : r
      ),
    })),

  unassignReport: (id) =>
    set(s => ({
      reports: s.reports.map(r =>
        r.id === id
          ? { ...r, status: 'Validé', agentId: undefined, vehicleId: undefined, updatedAt: new Date().toISOString() }
          : r
      ),
    })),

  startMission: (id) =>
    set(s => ({
      reports: s.reports.map(r =>
        r.id === id ? { ...r, status: 'En cours', updatedAt: new Date().toISOString() } : r
      ),
    })),

  completeMission: (id) =>
    set(s => ({
      reports: s.reports.map(r =>
        r.id === id ? { ...r, status: 'Complété', updatedAt: new Date().toISOString() } : r
      ),
    })),

  getReport: (id) => get().reports.find(r => r.id === id),
}))
