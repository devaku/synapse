import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../../lib/hooks/auth/useAuth';

export default function LoginCallback() {
	const { isAuthenticated, token } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/home');
		}
	}, [isAuthenticated]);

	return <></>;
}
