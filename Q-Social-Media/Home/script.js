AddPost = function() {
    window.location.href = '../Add-Post/Add-Post.html?oldloc=' + window.location;
}

GoToProfile = function(profile) {
    window.location.href = `../Profile/Profile.html?user=${profile.slice(1)}`;
}

OpenAccountOptions = function() {
    document.getElementById('top-menu-bar-pfp-img-clicked-div').classList.remove('invisible');
    document.getElementById('top-menu-bar-pfp-img-clicked-div-cover').classList.remove('invisible');
}

CloseAccountOptions = function() {
    document.getElementById('top-menu-bar-pfp-img-clicked-div').classList.add('invisible');
    document.getElementById('top-menu-bar-pfp-img-clicked-div-cover').classList.add('invisible');
}

LogOut = function() {
    document.cookie = 'name=; SameSite=None; Secure; path=/';
    window.location.href = '../LoginSignup/Signup/Signup.html';
}

GoToGithub = function() {
    window.open('https://github.com/Mankeyss', '_blank');
}

const user = document.cookie
        .split("; ")
        .find((row) => row.startsWith("name="))
        ?.split("=")[1];



ClickHeartIcon = function(button) {
    if(!button.classList.contains('heart-icon-clicked')) {
        button.classList.add('heart-icon-clicked');
        document.getElementById(`like-${button.id}`).textContent = Number(document.getElementById(`like-${button.id}`).textContent) + 1;
        try {
            let request = new XMLHttpRequest();
            request.open("GET", `http://127.0.0.1:48922/like-post?id=${button.id}?user=${user}`);
            request.send();
            request.onload = () => {
                if(request.response == 'Successfully Liked!') {
                }
            }
            request.onerror = () => {}
        }
        catch (e) {}

    } else {
        button.classList.remove('heart-icon-clicked');
        document.getElementById(`like-${button.id}`).textContent = Number(document.getElementById(`like-${button.id}`).textContent) - 1;
        try {
            let request = new XMLHttpRequest();
            request.open("GET", `http://127.0.0.1:48922/dislike-post?id=${button.id}?user=${user}`);
            request.send();
            request.onload = () => {
                if(request.response == 'Successfully Disliked!') {
                }
            }
            request.onerror = () => {}
        }
        catch (e) {}
    }
   
}

ClickCommentIcon = function(button) {
    if(!document.getElementById(`post-${button.id.slice(19)}`).classList.contains('comment-expand')) {
        button.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="comment-icon" id="action-post-button-${button.id.slice(19)}" onClick="ClickCommentIcon(this)" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" height="24px" width="24px" version="1.1" viewBox="0 0 460.775 460.775" xml:space="preserve">
        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
        </svg>`

        document.getElementById(`post-${button.id.slice(19)}`).classList.add('comment-expand');
    } else {
        button.outerHTML = `<svg aria-label="" id="action-post-button-${button.id.slice(19)}" onClick="ClickCommentIcon(this)" class="comment-icon" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><title></title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>`

        document.getElementById(`post-${button.id.slice(19)}`).classList.remove('comment-expand');
    }
}