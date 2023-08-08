GoBack = function() {
    if(window.location.toString().includes('?oldloc=') && !document.getElementById('part1').classList.contains('invisible')) {
        AskToGoBack();
    } else if(document.getElementById('part1').classList.contains('invisible')) {
        document.getElementById('part1').classList.remove('invisible');
        document.getElementById('part2').classList.add('invisible');
    }
}

AskToGoBack = function() {
    document.getElementById('part1').classList.add('invisible');
    document.getElementById('go-back-div').classList.remove('invisible');
}

GoBackYes = function() {
    window.location = window.location.toString().split('?oldloc=')[1];
}

GoBackNo = function() {
    document.getElementById('part1').classList.remove('invisible');
    document.getElementById('go-back-div').classList.add('invisible');
}

UploadFile = function() {
    document.getElementById('upload-image').classList.remove('invisible');
    //console.log(URL.createObjectURL(document.getElementById('pick-file')));
    //document.getElementById('upload-image').src = ;
}

NextPart = function() {
    document.getElementById('part1').classList.add('invisible');
    document.getElementById('part2').classList.remove('invisible');
}

UpdateLetters = function() {
    document.getElementById('wordcount-p').textContent = document.getElementById('caption-i').value.toString().trim().length + '/50';
    if(document.getElementById('caption-i').value.toString().trim().length >= 5) {
        document.getElementById('post-b').classList.remove('post-b-disabled');
    } else {
        document.getElementById('post-b').classList.add('post-b-disabled');
    }
}

async function Post() {
    if(document.getElementById('caption-i').value.toString().trim().length >= 5) {
        //Post
        //Image
        //&
        //Caption
        //Caption: document.getElementById('caption-i').value.toString().trim()
        document.getElementById('post-b').classList.add('post-b-disabled');

        let request = new XMLHttpRequest();
        request.open("GET", `http://127.0.0.1:5020/addpost?caption=${document.getElementById('caption-i').value.toString().trim()};?imgurl=${document.getElementById('img-url-i').value}`);
        request.send();
        request.onload = () => {
            console.log(request.response);
        }
    }
}

RemoveImg = function() {
    window.location.reload();
}