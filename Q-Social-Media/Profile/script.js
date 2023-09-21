//Connect To Server

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



AddPost = function() {
    window.location.href = '../Add-Post/Add-Post.html?oldloc=' + window.location;
}

EditProfile = function() {
    document.getElementById('user-preview-div').classList.add('invisible');
    document.getElementById('user-edit-div').classList.remove('invisible');
    
    document.getElementById('posts-or-liked-posts-picker').classList.add('invisible');
    document.getElementById('posts-showcase-div').classList.add('invisible');
}

ApplyChanges = function() {
    if(document.getElementById('update-displayname-i').value.length > 0) {
    try {
        const username = document.cookie
        .split("; ")
        .find((row) => row.startsWith("name="))
        ?.split("=")[1].toLowerCase();
        if(username != undefined) {
        let request = new XMLHttpRequest();
            request.open("GET", `http://127.0.0.1:48922/update-displayname?user=${username}?newdisplayname=${document.getElementById('update-displayname-i').value}`);
            request.send();
            request.onload = () => {
                window.location.reload();
            }

            request.onerror = () => {
                window.location.reload();
            }
        } else {
            window.location.reload();
        }
    } catch (e) {
        window.location.reload();
    }
} else {
    document.getElementById('user-preview-div').classList.remove('invisible');
    document.getElementById('user-edit-div').classList.add('invisible');

    document.getElementById('posts-or-liked-posts-picker').classList.remove('invisible');
    document.getElementById('posts-showcase-div').classList.remove('invisible');
}
}

ShowPosts = function() {
    document.getElementById('posts-or-liked-posts-picker-underline').classList.remove('posts-or-liked-posts-picker-underline-right');
}

ShowLikedPosts = function() {
    document.getElementById('posts-or-liked-posts-picker-underline').classList.add('posts-or-liked-posts-picker-underline-right');
}

GetPostFromId = function(posts, displayname, username) {
    let i = 0;
    for(i = 0; i <= posts.length-1; i++) {
        try {
            let request = new XMLHttpRequest();
            request.open("GET", `http://127.0.0.1:48922/get-post-from-id?id=${posts[i]}`);
            request.send();
            request.onload = () => {
                if(request.response != 'Out Of Bounds!') {
                document.getElementById('posts-showcase-div').innerHTML += `
                <div class="post">
                    <img class="post-pfp-img" src="../Home/Images/user_icon.jpg">
                    <p class="display-name-p">${document.getElementById('displayname-p').textContent}</p>
                    <p class="user-name-p">@${username}</p>
                    <img class="post-img" src="http://127.0.0.1:48922/uploads/${JSON.parse(request.response)[0]}.png">
                        <p class="post-caption">${decodeURIComponent(JSON.parse(request.response)[1].toString().trim())}</p>
                    </div>`
            }
        }

            request.onerror = () => {
            }
        } catch(e) {}
    }
}