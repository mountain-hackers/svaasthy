const $button = document.querySelector('#sidebar-toggle');
const $wrapper = document.querySelector('#wrapper');

$button.addEventListener('click', (e) => {
    e.preventDefault();
    $wrapper.classList.toggle('toggled');
});

$(async () => {
    if (localStorage.getItem('user') == null) {
        window.location = '.';
    }

    const downloadCard = () => {
        domtoimage.toPng(document.getElementById('card-front'))
        .then(function (dataUrl) {
            download(dataUrl, 'card.png');
        });
    };

    $('#downloadbtn').on('click', downloadCard);

    $('#logout-button').on('click', () => {
        localStorage.removeItem('user');
        window.location = '.';
    });

    $('#profilephoto').on('change', () => {
        if ($('#profilephoto').val() !== '') {
            $('#profilephoto-del-btn').css({ display: 'block' });
        }
    });

    $('#circle-frame').on('click', async function(e) {
        $('#profilephoto').click();
    });

    $('#profilephoto-del-btn').on('click', async function(e) {
        $('#profilephoto').val(null);
        $(this).css({ display: 'none' });
    })

    $('#profilephoto-btn').on('click', async function(e) {
        const val = $('#profilephoto').val();
        if (val == null || val == '') {
            return alert('Select a photo!');
        }

        const file = document.querySelector('#profilephoto').files[0];

        const toDataURI = f => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(f);
        });

        const uri = await toDataURI(file);
        
        try {
            const resp = await axios.put(BACKEND_URI + 'auth/modify', {
                photo: uri
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            localStorage.setItem('user', resp.data.token);
            window.location.reload();
        } catch(e) {
            console.log(e);
            return 'Failed to update!';
        }
    });

    try {
        try {
            const user = await getUserStatus();
        } catch(e) {
            localStorage.removeItem('user');
            window.location = '.';
            return;
        }

        {
            const selectors = {
                '.v-username': 'username',
                '#v-username': 'username',
                '.userId': 'userId',
                '#userId': 'userId',
                '.name': 'NAME',
                '#name': 'NAME',
                '.age': 'AGE',
                '#age': 'AGE',
                '.dob': 'DOB',
                '#dob': 'DOB',
                '.bloodGroup': 'blood',
                '#bloodGroup': 'blood',
                '.address': 'address',
                '#address': 'address',
                '.contact': 'contact',
                '#contact': 'contact',
                '.ethnicity': 'ethnicity',
                '#ethnicity': 'ethnicity',
                '.guardian': 'guardian',
                '#guardian': 'guardian',
                '.medicalRecords': 'medicalRecords',
                '#medicalRecords': 'medicalRecords',
                '.allergies': 'allergies',
                '#allergies': 'allergies',
                '.disabilities': 'disabilities',
                '#disabilities': 'disabilities',
                '.injuries': 'injuries',
                '#injuries': 'injuries',
                '.disorders': 'disorders',
                '#disorders': 'disorders',
                '.diseases': 'diseases',
                '#diseases': 'diseases',
            };
            
            Object.keys(selectors).map(k => {
                const v = selectors[k];
                if (v === "NAME") {
                    $(k).text(`${user.info.first} ${user.info.middle ? user.info.middle + ' ' : ''}${user.info.last}`);
                } else if (v === 'AGE') {
                    const years = Math.floor(Math.abs(new Date(Date.now()) - new Date(user.info.dob)) / (1000 * 60 * 60 * 24 * 365));
                    $(k).text(`${years} year${years !== 1 ? 's' : ''}`);
                } else if (v === 'DOB') {
                    function tjoin(t, a) {
                        function format(m) {
                            let f = new Intl.DateTimeFormat('en', m);
                            return f.format(t);
                        }
                        return a.map(format);
                    }
                    let a = [{ month: 'long' }, { day: 'numeric' }, { year: 'numeric' }];
                    const d = tjoin(new Date(user.info.dob), a);
                    $(k).text(`${d[0]} ${d[1]}, ${d[2]}`);
                } else if (
                    v === 'username'
                    || v === 'userId'
                ) {
                    const val = user[v];
                    $(k).text(val);
                } else {
                    const val = user.info[v];
                    if (typeof val !== 'string' && typeof val?.length === 'number')
                        $(k).text(val.join(', '));
                    else
                        $(k).text(val);
                }
            });

            if (user.info.photo) {
                $('.dpimage').prop('src', user.info.photo);
                $('#circle-frame').css({
                    backgroundImage: `url(${user.info.photo})`
                });
                $('.upload-photo').css({ opacity: 0 });
            }

            QRCode.toDataURL(JSON.stringify({
                userId: user.userId,
                username: user.username,
                email: user.email,
                first: user.info.first,
                middle: user.info.middle,
                last: user.info.last,
                last: user.info.last,
                dob: user.info.dob,
                blood: user.info.blood,
            }), (e, u) => {
                $('.qrcode').prop('src', u);
            });
        }
    } catch(e) {
        console.log(e);
    }
});