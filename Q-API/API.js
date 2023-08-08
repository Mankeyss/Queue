const express = require('express');
const fs = require('fs');
const app = express();
const port = 5020;
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
          "displayName": name.toLowerCase(),
          "userName": name.toLowerCase(),
          "password": password
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
        console.log(jsonData[i]["userName"]);
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
    var imgurl = req.originalUrl.split('?imgurl=')[1];
    GetImage(imgurl, caption);
  }

  res.send('Recieved Information!');
});

async function GetImage(url, caption) {
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
  };

    fs.writeFile(filePath+information["id"]+".png", response.data, (err) => {
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
  try {
    if(fs.readFileSync("./Users.json").toString().length > 0) {
      var amountOfIds = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'})).length;
      var id = Math.floor(Math.random()*amountOfIds);
      var caption = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'}))[id]["caption"];
      var imgurl = JSON.parse(fs.readFileSync('./Posts.json', {encoding: 'utf8'}))[id]["imgurl"];
      try {
        fs.writeFile("./Images/0.png", imgurl, (err) => {
          if (err) throw err;
          console.log('Post Still Valid!');
          res.send([{id},{caption},{imgurl}]);
        });
      } catch(e) {}
    } else {
      res.send('No Posts!');
    }
  } catch (e) {
    res.send("Could't Find Any Available Posts!");
  }
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