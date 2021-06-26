$(() => {
	const params = new URLSearchParams(new URL(window.location).search);

	$('[name="username"]').val(params.get('name'));
	$('[name="email"]').val(params.get('email'));
	$('[name="password"]').val(params.get('password'));

	{
		const username = params.get('name');
		const email = params.get('email');
		const password = params.get('password');
		const doctor = params.get('doctor') == 'true';
		
		$('#submit').on('click', async function(e) {
			e.preventDefault();

			let values = {
				username,
				email,
				password
			};

			const props = {
				firstName: 'first',
				middleName: 'middle',
				lastName: 'last',
				email: 'email',
				password: 'password',
				DOB: 'dob',
				gender: 'gender',
				Ethnicity: 'ethnicity',
				guardian: 'guardian',
				phone: 'contact',
				address: 'address',
				blood: 'blood',
				medical: 'medicalRecords',
				allergies: 'allergies',
				COVID: null,
				COVIDREPORT: null,
				COVIDVAC: null,
				'phone-e': null
			}

			let covidStat = ''

			for (const prop in props) {
				const el = $(`[name="${prop}"]`);
				if (el.val() != null || el.val() != '') {
					if (prop == 'COVID') {
						covidStat = 'COVID: ' + el.val();
					} else if (prop == 'COVIDREPORT') {
						covidStat += ', ' + 'Cured: ' + el.val();
					} else if (prop == 'COVIDVAC') {
						covidStat += ', ' + 'Vaccinated: ' + el.val();
					} else if (prop == 'phone-e') {
						if (!values.contact)
							values.contact = el.val();
						else
							values.contact += ', ' + el.val();
					} else {
						values[props[prop]] = el.val();
					}
				}
			}

			if (!values.medicalRecords)
				values.medicalRecords = covidStat;
			else
				values.medicalRecords += ', ' + covidStat;
			
			values.medicalRecords = values.medicalRecords?.split(',');
			values.allergies = values.allergies?.split(',');

			values.doctor = doctor;

			let resp;

			try {
				resp = await axios.post(BACKEND_URI + 'auth/signup', values);
				console.log(resp);
			} catch(e) {
				console.log(e.response);
				alert('Failed to register! ' + e.response.data.msg);
				return;
			}

			const { user } = resp.data;

			try {
				resp = await axios.post(BACKEND_URI + 'auth/login', {
					user: user.username,
					password: values.password
				});
			} catch(e) {
				console.log(e.response);
				alert('Failed to register! ' + e.response.data.msg);
				return;
			}

			if (resp.status === 200) {
				localStorage.setItem('user', resp.data.user.token);
				window.location = './profile.html';
			}
		});
	}
});