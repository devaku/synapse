import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import Spinner from '../../ui/spinner';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { readAllUsers } from '../../../lib/services/api/user';
import { createTeam, getTeams, editTeam } from '../../../lib/services/api/teams';
import type { Team, User } from '../../../lib/types/models';

type OptionType = { value: number; label: string; };

interface FormValues {
  name: string;
  description: string;
  selectTeamMembers: OptionType[];
}

// Extend Team type locally to include users
interface TeamWithUsers extends Team {
  users?: User[];
}

export default function TeamsCreateUpdateModal({
  modalTitle,
  teamId,
  handleModalDisplay,
}: {
  modalTitle: string;
  teamId?: number;
  handleModalDisplay: () => void;
}) {
  const { token } = useAuthContext();
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormValues>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [teamReference, setTeamReference] = useState<TeamWithUsers | null>(null);

  useEffect(() => {
    async function start() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await loadUsers();
        if (teamId) {
          // Use getTeams to find the team
          const teams = await getTeams(token);
          const teamObj = teams.find((t: TeamWithUsers) => t.id === teamId) as TeamWithUsers | undefined;
          if (teamObj) {
            setTeamReference(teamObj);
            setValue('name', teamObj.name);
            setValue('description', teamObj.description || '');
            if (teamObj.users?.length) {
              const members = teamObj.users.map((u) => ({ label: u.username, value: u.id }));
              setValue('selectTeamMembers', members);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    start();
  }, [setValue, teamId, token]);

  async function loadUsers() {
    if (!token) return;
    const usersData: User[] = await readAllUsers(token);
    const options = usersData.map((u) => ({ value: u.id, label: u.username }));
    setUserOptions(options);
  }

  function processSelectedUsers(options: OptionType[]) {
    return options?.map((el) => el.value) || [];
  }

  async function handleFormSubmit(data: FormValues) {
    if (!token) return;

    try {
      setIsLoading(true);
      const payload = {
        name: data.name,
        description: data.description,
        users: processSelectedUsers(data.selectTeamMembers),
      };

      if (teamId) {
        await editTeam(token, { id: teamId, name: payload.name, description: payload.description });
      } else {
        await createTeam(token, { name: payload.name, description: payload.description });
      }

      handleModalDisplay();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-2 ml-5 pb-2 pr-2 overflow-y-auto h-screen">
          <div className="pt-2"><p className="text-2xl">{modalTitle}</p></div>

          {teamId && (
            <div>
              <p className="font-bold">Team Info:</p>
              <p>Created By: {teamReference?.createdByUser?.username}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-2">
              <label>Group Name:</label>
              <input
                placeholder="Enter team name..."
                className="p-1 border border-gray-500 rounded-md"
                {...register('name', { required: true })}
              />
              {errors.name && <span className="text-red-500">Required</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label>Group Description:</label>
              <textarea
                placeholder="Enter a description..."
                className="p-1 border border-gray-500 rounded-md"
                rows={4}
                {...register('description', { required: true })}
              />
              {errors.description && <span className="text-red-500">Required</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label>Team Members:</label>
              <Controller
                control={control}
                name="selectTeamMembers"
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    isMulti
                    classNamePrefix="react-select"
                    options={userOptions}
                    onChange={(selected) => field.onChange(selected)}
                    placeholder="Choose users..."
                  />
                )}
              />
            </div>

            <input
              type="submit"
              value="SUBMIT"
              className="mt-3 py-2 w-full bg-[#153243] text-white rounded cursor-pointer"
            />
            <input
              type="button"
              value="BACK"
              onClick={() => handleModalDisplay()}
              className="mt-2 py-2 w-full bg-[#431815] text-white rounded cursor-pointer"
            />
          </form>
        </div>
      )}
    </>
  );
}