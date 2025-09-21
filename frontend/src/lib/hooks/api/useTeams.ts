import { useState, useEffect } from 'react';
import { getTeams, createTeam, deleteTeam } from '../../services/api/teamsAPI';

export interface Team {
  id: number;
  name: string;
  description?: string;
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams on load
  useEffect(() => {
    refreshTeams();
  }, []);

  async function refreshTeams() {
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching teams');
    } finally {
      setLoading(false);
    }
  }

  async function addTeam(newTeam: { name: string }) {
    setLoading(true);
    try {
      const created = await createTeam(newTeam);
      if (created) {
        setTeams((prev) => [...prev, created]);
      }
    } catch (err: any) {
      setError(err.message || 'Error creating team');
    } finally {
      setLoading(false);
    }
  }

  async function removeTeam(id: number | string) {
    setLoading(true);
    try {
      const success = await deleteTeam(id);
      if (success !== undefined) { // deleteTeam returns JSON or undefined
        setTeams((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting team');
    } finally {
      setLoading(false);
    }
  }

  return { teams, loading, error, refreshTeams, addTeam, removeTeam };
}
