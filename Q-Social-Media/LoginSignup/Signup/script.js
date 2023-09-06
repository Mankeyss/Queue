try {
    let request = new XMLHttpRequest();
    request.open("GET", `http://127.0.0.1:48922/status`);
    request.send();
    request.onload = () => {
        document.getElementById('could-not-get-posts-div').classList.add('invisible');
        document.getElementById('loader').classList.add('loader--hidden');
    };

    request.onerror = () => {
        document.getElementById('loader').classList.add('loader--hidden');
    };
} catch (e) {
    document.getElementById('loader').classList.add('loader--hidden');
}

async function CreateAccount() {

    /*let response = await fetch(`http://127.0.0.1:5020/signup?name=${document.getElementById('username-input').value};?password=${document.getElementById('password-input').value}`);
    console.log(response);*/

    if(document.getElementById('username-input').value.length > 0 && document.getElementById('password-input').value.length >= 4) {

        let request = new XMLHttpRequest();
        request.open("GET", `http://127.0.0.1:48922/signup?name=${document.getElementById('username-input').value};?password=${document.getElementById('password-input').value}`);
        request.send();
        request.onload = () => {
            console.log(request.response);
            //if(request.response)
            if(request.response === 'OK') {
                document.cookie = `name=${encodeURIComponent(document.getElementById('username-input').value)}; SameSite=None; Secure; path=/`;
                window.location = '../../Home/Home.html';
            } else if(request.response === 'USERNAME IN USE!') {
                document.getElementById('error-msg').classList.add('show-error-msg');
            document.getElementById('error-msg').textContent = "Username Is Already In Use!";
            }
        };

        request.onerror = () => {
            
        };
    } else if(document.getElementById('username-input').value.length <= 0) {
        document.getElementById('error-msg').classList.add('show-error-msg');
        document.getElementById('error-msg').textContent = "Username Field Can't Be Empty!";
    } else if(document.getElementById('password-input').value.length <= 0) {
        document.getElementById('error-msg').classList.add('show-error-msg');
        document.getElementById('error-msg').textContent = "Password Field Can't Be Empty!";
    } else if(document.getElementById('password-input').value.length < 4) {
        document.getElementById('error-msg').classList.add('show-error-msg');
        document.getElementById('error-msg').textContent = "Password Needs To Be At Least 4 Characters!";
    }
};