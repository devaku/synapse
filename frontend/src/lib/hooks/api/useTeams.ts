import { useState, useEffect } from 'react';
import { getTeams, createTeam } from '../../services/api/teamsAPI';

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
      console.log('Raw API response:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTeams(data);
      } else if (data && Array.isArray(data.teams)) {
        // Handle case where API returns { teams: [...] }
        setTeams(data.teams);
      } else if (data && Array.isArray(data.data)) {
        // Handle case where API returns { data: [...] }
        setTeams(data.data);
      } else {
        console.warn('API returned non-array data:', data);
        setTeams([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching teams');
      setTeams([]); // Ensure teams is always an array
    } finally {
      setLoading(false);
    }
  }

  async function addTeam(newTeam: { name: string; description?: string }) {
    try {
      const created = await createTeam(newTeam);
      
      if (created) {
        // Add the new team to the existing list
        setTeams((prev) => {
          const updated = [...prev, created];
          return updated;
        });
      }
      
      return created;
    } catch (err: any) {
      setError(err.message || 'Error creating team');
      throw err; // Re-throw so the component can handle it
    }
  }

  // async function removeTeam(id: number | string) {
  //   setLoading(true);
  //   try {
  //     const success = await deleteTeam(id);
  //     if (success !== undefined) { // deleteTeam returns JSON or undefined
  //       setTeams((prev) => prev.filter((t) => t.id !== id));
  //     }
  //   } catch (err: any) {
  //     setError(err.message || 'Error deleting team');
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return { teams, loading, error, refreshTeams, addTeam };
}
