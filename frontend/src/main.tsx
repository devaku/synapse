import './assets/css/main.css';
import { StrictMode } from 'react';

import { RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';
import { router } from './routes';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);

// import ScratchPage from './scratch/scratch';

// createRoot(document.getElementById('root')!).render(
// 	<>
// 		<StrictMode>
// 			<ScratchPage></ScratchPage>
// 		</StrictMode>
// 	</>
// );
