async function CreateAccount() {

    /*let response = await fetch(`http://127.0.0.1:5020/signup?name=${document.getElementById('username-input').value};?password=${document.getElementById('password-input').value}`);
    console.log(response);*/

    let request = new XMLHttpRequest();
    request.open("GET", `http://127.0.0.1:5020/signup?name=${document.getElementById('username-input').value};?password=${document.getElementById('password-input').value}`);
    request.send();
    request.onload = () => {
        console.log(request.response);
        //if(request.response)
        if(request.response === 'OK') {
            window.location = '../../Home/Home.html';
        }
    };

    request.onerror = () => {
        
    };
};