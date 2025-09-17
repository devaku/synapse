import axios from 'axios';

export async function axiosFetch() {
	try {
		let response = await axios({
			method: 'post',
			url: '/user/12345',
			data: {
				firstName: 'Fred',
				lastName: 'Flintstone',
			},
		});
	} catch (e) {}
}
