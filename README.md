# 🌸 Japanify.io 🌸
React JS web app to discover new Japanese artists through your Spotify listening patterns
<img src="https://github.com/tambatd/Japanify/blob/master/Japanify_Image.PNG"/>
## Setup 🧮
Japanify relies on spotify to retreave data and reccommend music:

Before using, please create a spotify developer account, and app here 
https://developer.spotify.com/dashboard/

Make sure to add http://localhost:3000/ to the list of redirect URIs
This will allow you to run the app locally 


After, copy the client key —*not secret*— to line 26 in App.js
```javascript
const clientId = "String_of_numbers";
```

## Installation 💽
Once this repository is cloned, simply use 

```bash
npm install
```
You can find specific dependencies in package.json.

## Usage ⚙️
when in the local directory of the package.json file:
```bash
npm start
```
The server should run on http://localhost:3000/

## Contributing 🛠️
Feel free to request to pull to add new features and such

## License
[MIT](https://choosealicense.com/licenses/mit/)


