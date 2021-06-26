function toggleSignup() {
    document.getElementById("login-toggle").style.backgroundColor = "#fff";
    document.getElementById("login-toggle").style.color = "#222";
    document.getElementById("signup-toggle").style.backgroundColor = "#1EAE98";
    document.getElementById("signup-toggle").style.color = "#fff";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
  }
  
  function toggleLogin() {
    document.getElementById("login-toggle").style.backgroundColor = "#1EAE98";
    document.getElementById("login-toggle").style.color = "#fff";
    document.getElementById("signup-toggle").style.backgroundColor = "#fff";
    document.getElementById("signup-toggle").style.color = "#222";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  }
  
  function quotes_gen() {
    var set = setInterval(() => {
      document.querySelector(".quotesgen").click();
    }, 2000);
  }
  
  var modal = document.getElementById("mymodal");
  var btn = document.getElementById("quotes_gen");
  console.log(document.getElementsByClassName("close"));
  btn.addEventListener("click", function () {
    var quotes = [
      "Eat a healthy diet",
      "Consume less salt and sugar",
      "Reduce intake of harmful fats",
      "Avoid harmful use of alcohol",
      "Be active",
      "Avoid harmful use of alcohol",
      "Don’t smoke",
      "Be active",
      "Check your blood pressure regularly",
      "Cover your mouth when coughing or sneezing",
      "Talk to someone you trust if you're feeling down",
    ];
  
    var random_number = Math.floor(Math.random() * 5);
    document.getElementById("quote").innerHTML = quotes[random_number];
    modal.style.display = "block";
    setTimeout(function () {
      modal.style.display = "none";
    }, 1000);
  });
  

$(async () => {
  if (localStorage.getItem('user') != null) {
    const token = localStorage.getItem('user');

    const resp = await axios.post(BACKEND_URI + 'auth/status', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (resp.status === 200) {
      window.location = './profile.html';
    }
  }

  $('#frm-login').on('submit', async function(e) {
    e.preventDefault();
    
    const user = $('#login-user').val();
    const password = $('#login-pass').val();

    const resp = await axios.post(BACKEND_URI + 'auth/login', {
      user,
      password
    });

    if (resp.status === 200) {
      localStorage.setItem('user', resp.data.user.token);
      window.location = './profile.html';
    }
  });

  $('#frm-signup').on('submit', async function(e) {
    e.preventDefault();
    
    const email = $('#signup-email').val();
    const name = $('#signup-name').val();
    const password = $('#signup-pass').val();
    const doctor = !$('#signup-nodoctor').is(":checked");

    const params = new URLSearchParams({
      email,
      name,
      password,
      doctor
    });
    
    window.location = './infoSection.html?' + params.toString();
  });
});