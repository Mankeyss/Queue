AddPost = function() {
    window.location.href = '../Add-Post/Add-Post.html?oldloc=' + window.location;
}

GoToProfile = function(profile) {
    window.location.href = `../Profile/Profile.html?${profile}`;
}

//Request Posts
try {
    let request = new XMLHttpRequest();
    request.open("GET", `http://127.0.0.1:5020/home-get-posts`);
    request.send();
    request.onload = () => {
        console.log(request.response);
    }
    request.onerror = () => {
        document.getElementById('could-not-get-posts-div').classList.remove('invisible');
    }
} catch (e) {
    document.getElementById('could-not-get-posts-div').classList.remove('invisible');
}
