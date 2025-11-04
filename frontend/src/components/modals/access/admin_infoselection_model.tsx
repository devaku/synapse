import React, { useState } from 'react';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { addUserToRepo, deleteRepoCollaboratorRequest } from '../../../lib/services/api/github';

export default function AdminInfoSelectionModal({
  isOpen,
  request,
  onClose,
  onActionComplete,
}: {
  isOpen: boolean;
  request: any | null;
  onClose: () => void;
  onActionComplete?: () => Promise<void> | void;
}) {
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  async function handleApprove() {
    if (!token) return setError('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      await addUserToRepo(
        token,
        request.repoId,
        request.githubUsername,
        request.permission || 'pull'
      );

      // delete request after adding
      await deleteRepoCollaboratorRequest(token, request.id);

      if (onActionComplete) await onActionComplete();
      onClose();
    } catch (err: any) {
      console.error('Approve error', err);
      setError(err?.message || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeny() {
    if (!token) return setError('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      await deleteRepoCollaboratorRequest(token, request.id);
      if (onActionComplete) await onActionComplete();
      onClose();
    } catch (err: any) {
      console.error('Deny error', err);
      setError(err?.message || 'Failed to deny request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 w-fit">
        <p className="text-2xl">Repository Access Request</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="mb-2">Request Details:</div>
          <div className="text-sm">
            <ul className="gap-1 flex flex-col">
              <li>
                <strong>ID:</strong> {request.id}
              </li>
              <li>
                <strong>User ID:</strong> {request.userId}
              </li>
              <li>
                <strong>Requester:</strong> {request.requesterName ?? ''}
              </li>
              <li>
                <strong>Repository ID:</strong> {request.repoId}
              </li>
              <li>
                <strong>Permission:</strong> {request.permission}
              </li>
              <li>
                <strong>GitHub Username:</strong> {request.githubUsername}
              </li>
              <li>
                <strong>Created At:</strong> {request.createdAt}
              </li>
            </ul>
          </div>
        </div>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleApprove}
            className={`w-full cursor-pointer text-center p-2 rounded text-ttg-black bg-green-500 hover:bg-green-700`}
            disabled={loading}
          >
            {loading ? 'Working...' : 'Accept'}
          </button>

          <button
            type="button"
            onClick={handleDeny}
            className={`w-full cursor-pointer text-center p-2 rounded text-ttg-white bg-ttg-brown/70 hover:bg-ttg-brown`}
            disabled={loading}
          >
            Deny
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className='w-full cursor-pointer text-center p-2 rounded text-ttg-black bg-ttg-gray-300 hover:bg-ttg-gray-400'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
