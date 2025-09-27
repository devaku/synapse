import { useState, useEffect } from 'react';
import HeaderContainer from '../components/container/header_container';
import { useSocketContext } from '../lib/contexts/SocketContext';
import SvgComponent from '../components/ui/svg_component';

export default function HomePage() {
	const [svgName, setSvgName] = useState<string>('');
	const { socket } = useSocketContext();
	useEffect(() => {
		if (socket) {
			function debug(arg1: number) {
				console.log('DATA RECEIVED: ', arg1);
				switch (arg1) {
					case 1:
						console.log('SETTING SVG TO ACCESS');
						setSvgName('ACCESS');
						break;
					case 2:
						setSvgName('CHARTS');
						break;
					case 3:
						setSvgName('EMAIL');
						break;
					default:
						console.log('SETTING NOTHING');
						setSvgName('');
				}
			}

			socket.on('DEBUG:PING', debug);

			return () => {
				socket.off('DEBUG:PING', debug);
			};
		}
	}, [socket]);

	return (
		<HeaderContainer pageTitle="Home">
			<SvgComponent
				iconName={svgName}
				className="w-10 h-10"
			></SvgComponent>
			This is the dashboard.
		</HeaderContainer>
	);
}
