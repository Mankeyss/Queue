const express = require('express');
const fs = require('fs');
const app = express();
const port = 48922;
const cors = require('cors');
const axios = require('axios');

app.use(cors());

app.get('/signup', (req, res) => {
    //res.send(req.originalUrl);
    //res.sendFile("Users.json");
    if(req.originalUrl.toString().includes('?name=') && req.originalUrl.toString().includes('?password=')) {
      var name = req.originalUrl.toString().split('/signup?').splice(1, 1).join(";").split(';?password=')[0].slice(5);
      var password = req.originalUrl.toString().split('/signup?').splice(1, 1).join(";").split(';?password=')[1];
      
      id = 0;
      id = fs.readFileSync("./Users.json").toString().split("").filter(x => x == "{").length;
      const user = {
          "id": id,
          "displayName": name,
          "userName": name.toLowerCase(),
          "password": password,
          "posts" : [],
          "likedPosts": [],
      };
      var array = JSON.stringify(fs.readFileSync('./Users.json').toString()).split("\\");

      var userNameUsed = false;
      for(i = 0; i < array.length; i++) {
        if(array[i] == `"${name}` && array[i-2] == '"userName') {
          userNameUsed = true;
        }
      }

      if(!userNameUsed) {
        AddToDataUsers(user);
        res.send('OK');
        res.status(200);
      } else {
        res.send('USERNAME IN USE!');
        res.status(502);
      }
      res.end();
    }
});

app.get('/login', (req, res) => {
  if(req.originalUrl.toString().includes('?username=') && req.originalUrl.toString().includes('?password=')) {
    var name = req.originalUrl.toString().split('/login?').splice(1, 1).join(";").split(';?password=')[0].slice(9);
    var password = req.originalUrl.toString().split('/login?').splice(1, 1).join(";").split(';?password=')[1];
    
    var data = fs.readFileSync("./Users.json").toString();
    var jsonData = JSON.parse(data);
    for(i = 0; i < jsonData.length; i++) {
      if(jsonData[i]["userName"].toString() == name.toLowerCase()) {
        if(jsonData[i]["password"].toString() == password) {
          res.send('Valid Information');
          res.end();
          return;
        }
      }
    }
  }

  
  res.send('Invalid Information');
});

app.get('/addpost', (req, res) => {
  if(req.originalUrl.includes('?caption=') && req.originalUrl.includes('?imgurl=')) {
    var caption = req.originalUrl.split('?caption=').join(';').split('?imgurl=')[0].split(';')[1];
    var imgurl = req.originalUrl.split('?imgurl=')[1].split(';?user=')[0];
    var user = req.originalUrl.split('?user=')[1];
    GetImage(imgurl, caption, user);

    //Set Users Property "Posts" to have the new post!
    var postData = fs.readFileSync("./Posts.json").toString();
    var data = fs.readFileSync("./Users.json").toString();
    var jsonData = JSON.parse(data);

    try {
    if(postData.length >= 0) {
      id = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'})).length;
    } else {
      id = 0;
    }
  } catch (e) {
    id = 0;
  }

    for(i = 0; i < jsonData.length; i++) {
      if(jsonData[i]["userName"] == user.toLowerCase()) {
        jsonData[i]["posts"] += "," + id;
      }
    }

    fs.writeFileSync('./Users.json', JSON.stringify(jsonData));
  }

  res.send('Recieved Information!');
});

async function GetImage(url, caption, user) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = './Images/'

    var id = 0;
    try {
      if(fs.readFileSync('./Posts.json', {encoding: 'utf8'}).toString().length >= 0) {
        id = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'})).length;
      }
    } catch(e) {
      id = 0;
    }

    const information = {
      "id": id,
      "caption": caption,
      "imgurl": url,
      "user": user,
      "likes": 0,
  };

    fs.writeFile(filePath+"0.png", response.data, (err) => {
      if (err) throw err;
      if(fs.readFileSync("./Posts.json", {encoding: 'utf8'}).length > 0) {
        const jsonString = JSON.stringify(information);fs.writeFileSync('./Posts.json', "[" + fs.readFileSync('./Posts.json').toString().slice(1, -1) + "," + jsonString + "]");
      } else {
        const jsonString = JSON.stringify(information);fs.writeFileSync('./Posts.json', "[" + jsonString + "]");
      }
      console.log('Image downloaded successfully!');
    });
  } catch(e) {}
}

app.get('/home-get-posts', (req, res) => {
  if(req.originalUrl.includes('?used=')) {
    let used = req.originalUrl.split('?used=')[1].split(',');
    used.map(x => x==='' ? used = []: 0);
    
    try {
      if(JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'})).length <= used.length) {
        res.send('No Posts!');
        return;
      } else {
      if(fs.readFileSync("./Posts.json").toString().length > 0) {
        var amountOfIds = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'})).length;
        var id = Math.floor(Math.random()*amountOfIds);
        while(used.map(x => Number(x)).includes(id)) {
          id = Math.floor(Math.random()*amountOfIds);
        }
        var caption = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'}))[id]["caption"];
        var imgurl = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'}))[id]["imgurl"];
        var user = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'}))[id]["user"].toLowerCase();
        var likes = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'}))[id]["likes"];

        try {
          var data = fs.readFileSync("./Users.json").toString();
          var jsonData = JSON.parse(data);
          var displayname = 'Display Name';
          for(i = 0; i < jsonData.length; i++) {
            if(jsonData[i]["userName"] == user) {
              displayname = jsonData[i]["displayName"];
            }
          }

          res.send([id, caption, imgurl, user, displayname, likes]);
        } catch (e) {
          res.send([id, caption, imgurl, user, likes]);
        }
        
      } else {
        res.send('No Posts!');
      }
    }
    } catch (e) {
      res.send("Could't Find Any Available Posts!");
    }
  } else {
    res.send("Couldn't Find ?used= Parameter!");
  }
});

app.get('/get-profile', (req, res) => {
  if(req.originalUrl.includes('?username=')) {
    var username = req.originalUrl.split('?username=')[1];
    var data = fs.readFileSync("./Users.json").toString();
    var jsonData = JSON.parse(data);

    for(i = 0; i < jsonData.length; i++) {
      
      if(jsonData[i]["userName"] == username) {
        res.send(jsonData[i]["displayName"]);
        res.end();
        return;
      }
    }
  }
  res.send('No Username!')
});

app.get('/update-displayname', (req, res) => {
  if(req.originalUrl.includes('?user=') && req.originalUrl.includes('?newdisplayname=')) {
    var username = req.originalUrl.split("?user=")[1].split("?newdisplayname=")[0];
    var newDisplayName = req.originalUrl.split("?newdisplayname=")[1];

    var data = fs.readFileSync("./Users.json").toString();
    var jsonData = JSON.parse(data);

    for(i = 0; i < jsonData.length; i++) {
      if(jsonData[i]["userName"] == username) {
        jsonData[i]["displayName"] = newDisplayName;
      }
    }

    fs.writeFileSync('./Users.json', JSON.stringify(jsonData));
  }
  res.send('OK');
});

app.get('/get-posts-from-user', (req, res) => {
  if(req.originalUrl.includes('?user=')) {
    try {
    let user = req.originalUrl.split('?user=')[1].toLowerCase();

  var data = fs.readFileSync("./Users.json").toString();
  var jsonData = JSON.parse(data);

  for(i = 0; i < jsonData.length; i++) {
    if(jsonData[i]["userName"] == user) {
      res.send(jsonData[i]["posts"]);
      res.end();
    }
  }
} catch (e) {
  res.send('No User With That Name Found!')
}
  } else {
    res.send('No User!');
    res.end();
  }
});

app.get('/get-post-from-id', (req, res) => {
  try {
  if(req.originalUrl.includes('?id=')) {
    var id = req.originalUrl.split('?id=')[1];

    var data = fs.readFileSync("./Posts.json").toString();
    var jsonData = JSON.parse(data);

    for(i = 0; i < jsonData.length; i++) {
      if(jsonData[i]["id"] == id) {
        res.send([[jsonData[i]["caption"]], [jsonData[i]["imgurl"]]]);
        res.end();
        return;
      }
    }

    res.send('Out Of Bounds!');
  } else {
    res.send('No Id!')
  }
} catch(e) {
  res.send('Error!');
}
});

app.get('/like-post', (req, res) => {
  if(req.originalUrl.includes('?id=') && req.originalUrl.includes('?user=')) {
    var id = req.originalUrl.split('?id=')[1].split('?user=')[0];
    var user = req.originalUrl.split('?user=')[1];
    var data = fs.readFileSync("./Posts.json").toString();
    var jsonData = JSON.parse(data);
    var userData = fs.readFileSync("./Users.json").toString();
    var jsonUserData = JSON.parse(userData);
    if(jsonData[id] != null) {
      jsonData[id]["likes"] = Number(jsonData[id]["likes"]) + 1;
      fs.writeFileSync('./Posts.json', JSON.stringify(jsonData));
      for(i = 0; i < userData.length; i++) {
        if(jsonUserData[i]["userName"].toLowerCase() == user.toLowerCase()) {
          jsonUserData[i]["likedPosts"].push(id);
          fs.writeFileSync('./Users.json', JSON.stringify(jsonUserData));
          break;
        }
      }
      res.send('Successfully Liked!')
    } else {
      res.send('Id Out Of Bounds!');
    }
  } else {
    res.send('No Id Provided!');
  }
});

app.get('/dislike-post', (req, res) => {
  if(req.originalUrl.includes('?id=') && req.originalUrl.includes('?user=')) {
    var id = req.originalUrl.split('?id=')[1].split('?user=')[0];
    var user = req.originalUrl.split('?user=')[1];
    var data = fs.readFileSync("./Posts.json").toString();
    var jsonData = JSON.parse(data);
    var userData = fs.readFileSync("./Users.json").toString();
    var jsonUserData = JSON.parse(userData);
    if(jsonData[id] != null) {
      jsonData[id]["likes"] = Number(jsonData[id]["likes"]) - 1;
      fs.writeFileSync('./Posts.json', JSON.stringify(jsonData));

      try {
        for(i = 0; i < jsonUserData.length; i++) {
          if(jsonUserData[i]["userName"] == user.toLowerCase()) {
            var index = null;
            for(j = 0; j < jsonUserData[i]["likedPosts"].length; j++) {
              jsonUserData[i]["likedPosts"][j] == id ? index = j : 0; 
            }
            if(index != null) {
              jsonUserData[i]["likedPosts"].splice(index, 1);
              fs.writeFileSync('./Users.json', JSON.stringify(jsonUserData));
              res.send('Successfully Disliked!');
            } else {
              res.send('Error Disliking!');
            }
          } else {
            res.send('Wrong User!');
          }
        }
    } catch(e) {
      res.send("Haven't Even Liked This Post!");
    }


    } else {
      res.send('Id Out Of Bounds!');
    }
  } else {
    res.send('No Id Provided!');
  }
});

app.get('/liked-posts', (req, res) => {
  if(req.originalUrl.includes('?user=')) {
    var user = req.originalUrl.split('?user=')[1];
    var data = fs.readFileSync("./Users.json").toString();
    var jsonData = JSON.parse(data);
    for(i = 0; i < jsonData.length; i++) {
      if(jsonData[i]["userName"] == user) {
        res.send(jsonData[i]["likedPosts"]);
        break;
      }
    }
  } else {
    res.send('No User Specified!')
  }

});

app.get('/status', (req, res) => {
  res.send('Available!')
});


app.listen(port, () => {
    console.log(`Started Listening To Port ${port}`);
    console.log(`http://127.0.0.1:${port}`);
});

//Write To File

AddToDataUsers = function(user) {
  if(fs.readFileSync("./Users.json").toString().length > 0) {
    const jsonString = JSON.stringify(user);fs.writeFileSync('./Users.json', "[" + fs.readFileSync('./Users.json').toString().slice(1, -1) + "," + jsonString + "]");
  } else {
    const jsonString = JSON.stringify(user);fs.writeFileSync('./Users.json', "[" + fs.readFileSync('./Users.json').toString().slice(1, -1) + jsonString + "]");
  }
}