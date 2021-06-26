var BACKEND_URI = `https://svaasthy.herokuapp.com/`;

const getUserStatus = async () => {
	const token = localStorage.getItem('user');
	if (token == null || token === '')
		return null;

	const resp = await axios.post(BACKEND_URI + 'auth/status', null, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (resp.status === 200) {
		window.user = resp.data.user;
		return window.user;
	}
};