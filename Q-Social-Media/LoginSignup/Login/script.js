try {
    let request = new XMLHttpRequest();
        request.open("GET", `http://127.0.0.1:48922/status`);
        request.send();
        request.onload = () => {
            document.getElementById('loader').classList.add('loader--hidden');
        }

        request.onerror = () => {
            document.getElementById('could-not-get-posts-div').classList.remove('invisible');
        document.getElementById('loader').classList.add('loader--hidden');
        }
} catch (e) {
    document.getElementById('could-not-get-posts-div').classList.remove('invisible');
    document.getElementById('loader').classList.add('loader--hidden');
}

async function Login() {

    /*let response = await fetch(`http://127.0.0.1:5020/signup?name=${document.getElementById('username-input').value};?password=${document.getElementById('password-input').value}`);
    console.log(response);*/

    if(document.getElementById('username-i').value.length > 0 && document.getElementById('password-i').value.length > 0) {
        let request = new XMLHttpRequest();
        request.open("GET", `http://127.0.0.1:48922/login?username=${document.getElementById('username-i').value};?password=${document.getElementById('password-i').value}`);
        request.send();
        request.onload = () => {
            console.log(request.response);
            if(request.response === 'Valid Information') {
                document.cookie = `name=${encodeURIComponent(document.getElementById('username-i').value)}; SameSite=None; Secure; path=/`;
                window.location.href = '../../Home/home.html'
            } else if(request.response == 'Invalid Information') {
                document.getElementById('error-msg').classList.add('show-error-msg');
                document.getElementById('error-msg').textContent = "The Username Or The Password Is Wrong!";
            }
        }

        request.onerror = () => {
            document.getElementById('error-msg').classList.add('show-error-msg');
            document.getElementById('error-msg').textContent = "Password Field Can't Be Empty!";
        }
    } else if(document.getElementById('username-i').value.length <= 0) {
        document.getElementById('error-msg').classList.add('show-error-msg');
        document.getElementById('error-msg').textContent = "Username Field Can't Be Empty!";
    } else if(document.getElementById('password-i').value.length <= 0) {
        document.getElementById('error-msg').classList.add('show-error-msg');
        document.getElementById('error-msg').textContent = "Password Field Can't Be Empty!";
    }
};