// import secrets for pavlok API
require('dotenv').config();
const tokenFile = require('./pavlok_token.json');

var pavlok = require('pavlok-beta-api-login');
var express = require('express');
var open = require('open');

console.log("process.env.CLIENT_ID: " + process.env.CLIENT_ID);

// console.log(process.env)

console.log("Setting up remote...");

var app = express();

// Setup URLs
app.use(express.static(__dirname + '/public'));

// Setup Pavlok component
// example https://github.com/Behavioral-Technology-Group/Pavlok-Node-Samples/blob/master/Pavlok_RAM_Buzz/index.js#L33
// if (process.env.NODE_ENV === 'development') {
  pavlok.init(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET, {
      "verbose": "true",
      "message": "zappytime!",
      "save": true,
      "tokenFile": "pavlok_token.json",
      // "port": 3010
    }
  );
// } else {
//   pavlok.init(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET, {
//       "verbose": "true",
//       "message": "zappytime!",
//       "app": app,
//       "save": true,
//       "callbackUrl": "http://www.myserver.com/pavlok/result",
//       "successUrl": "/success", //Where to redirect when the token has been saved to session
//       "errorUrl": "/error" //Where to redirect when the token couldn't be gotten/saved
//     }
//   );
// }


// if (!tokenFile.token) {

pavlok.login(function(result, code){
	if(result){
		console.log("pavlok-node login function worked; response auth token saved to ./pavlok_token");
    console.dir(code);
	} else {
		console.log("Unable to sign-in to Pavlok!");
	}
});

app.get("/", function(req, result){
	result.redirect("main.html");
});

app.get("/zap", function(req, result){
	pavlok.zap({
		"request": req
	});
	console.log("Zapped!");
	result.redirect("main.html");
});

app.get("/vibrate", function(req, result){
	pavlok.vibrate({
		"request": req
	});
	console.log("Vibrated!");
	result.redirect("main.html");
});

app.get("/beep", function(req, result){
	pavlok.beep({
		"request": req
	});
	console.log("Beeped!");
	result.redirect("main.html");
});

app.get("/pattern", function(req, result){
	pavlok.pattern({
		"request": req,
		"pattern": [ "beep", "vibrate", "zap" ],
		"count": 2
	});
	console.log("Pattern'd!");
	result.redirect("main.html");
});

app.get("/pattern2", function(req, result){
	pavlok.pattern({
		"request": req,
		"pattern": [ "beep", "beep", "zap" ],
		"count": 4
	});
	console.log("Pattern'd!");
	result.redirect("main.html");
});


function randoInt( nber, variance=0.25 ) {
  let randotude = Math.floor(nber * variance);  // max we might add or remove

  // random pick int from nber interval centered at 0, add variance, let sign of result
  // determine if we increase or decrease nbur, combine, return adjusted nbur
  randotude = Math.sign( (Math.random() * nber - nber/2) + randotude) * randotude;
  return nber + randotude;
}

function randoList( arr, variance=0.25 ) {
  if (arr.length < 1) {arr = ["zap", "zap"]};

  for (let i=0; i<=Math.ceil(Math.random() * arr.length * (1 + variance)); i++){
    var valueToUse = arr[Math.floor(Math.random() * arr.length)]
    var r = Math.random();
    if ( r > 0.90 ) {
      return Array(Math.floor(Math.random() * arr.length)).fill("vibrate"); // lucky rare fun outcome
    } else if ( r > 0.5) {
      arr.splice( Math.floor(Math.random() * arr.length), 0, valueToUse) //duplicate element randomly
    } else if (0.5 >= r > 0.25) {
      arr.splice( Math.floor(Math.random() * arr.length), 1); // remove 1 randomly
    } else {
      arr.splice( Math.floor(Math.random() * arr.length), 0, "vibrate") // be nice sometimes
    }
  }
  return arr;
}

// provide decimal range 0-1 ot activate variability
function zapTimer(cycles, freq, rand, patternOpts) {
  let i = 1;
  if (patternOpts === 'DEFAULT') {
    patternOpts = {
      "pattern": [ "zap", "zap", "zap", "zap", "zap" ],
      "intensity": 255,
      // "intensity": 25,
      "message": "zapTimer DEFAULT"
    };
  }

  if (typeof rand === 'number') {
    patternOpts.pattern = randoList(patternOpts.pattern, rand);
    patternOpts.intensity = randoInt(patternOpts.intensity, rand);
    if (patternOpts.intensity >= 255) patternOpts.intensity = 255;
    cycles = randoInt(cycles, rand);
    freq = randoInt(freq, rand);
  }

  console.log("zapTimer:");
  console.dir(patternOpts);

  pavlok.pattern({
		"pattern": [ "vibrate", "beep", "beep" ]
	});

  console.log("  Zap " + i + "!");
  pavlok.pattern(patternOpts);
  i++;

  let timer = setTimeout(function tick() {
    if (i > cycles - 1) {
      clearTimeout(timer);
      console.log("zapTimer finished");
      return
    };
    console.log("  Zap " + i + "!");
    pavlok.pattern(patternOpts);
    i++;
    timer = setTimeout(tick, randoInt(freq, rand) * 1000);
  }, freq * 1000);
}

function pulseChain(pulses = 15, intensity = 128, rand, pulseType = 'zap') {
  if (typeof rand === 'number') {
    pulses = randoInt(pulses, rand);
    intensity = randoInt(intensity, rand);
    if (intensity >= 255) intensity = 255;
  }
  console.log("pulsechain: " + pulses + "pulses@" + intensity);
  let pattern = [];
  for (let c=0; c<pulses; c++){
    pattern.push(pulseType);
  }
  pavlok.pattern({
    "intensity": intensity,
    "pattern": pattern,
    "message": "feel the " + pulseType
  });
}

app.get("/pulse5", function(req, result){
  console.log("pulse5 - 5 min timer...");
  pavlok.pattern({
		"pattern": [ "beep", "beep", "beep" ]
	});
  zapTimer(5, 60, false, 'DEFAULT');
  result.redirect("main.html");
});

app.get("/pulse5-rando", function(req, result){
  console.log("pulse5 - 5 min timer...75% randomized");
  pavlok.pattern({
		"pattern": [ "beep", "beep", "beep" ]
	});
  zapTimer(5, 60, 0.75, 'DEFAULT');
  result.redirect("main.html");
});

app.get("/pulsechain-15-med", function(req, result){
  pulseChain(15);
  result.redirect("main.html");
});

app.get("/pulsechain-30-med", function(req, result){
  pulseChain(30);
  result.redirect("main.html");
});

app.get("/pulsechain-60-hard", function(req, result){
  pulseChain(60, 255);
  result.redirect("main.html");
});

app.get("/pulse20", function(req, result){
  console.log("pulse20 - 1 sneaky light pulse every 3 min, for 20 min");
  zapTimer(10, 120, false, {
    "pattern": [ "zap" ],
    "intensity": 64 });
  result.redirect("main.html");
});

app.get("/pulse20-rando", function(req, result){
  console.log("pulse20 rando- 1 sneaky light pulse every 3 min, for 20 min");
  zapTimer(10, 120, 0.5, {
    "pattern": [ "zap" ],
    "intensity": 64 });
  result.redirect("main.html");
});

///////////////////////////////////////////////////////////////////////////////////

app.get("/pulsechain-pain", function(req, result){
  pavlok.pattern({
		"pattern": [ "beep", "beep", "beep", "beep", "beep", "beep" ]
	});
  pulseChain(180, 255, 0.8);
  result.redirect("main.html");
});

///////////////////////////////////////////////////////////////////////////////////

app.get("/vibe5", function(req, result){
  console.log("vibe5 - 5 min timer...");
  pavlok.pattern({
		"pattern": [ "beep", "beep", "beep" ]
	});
  zapTimer(5, 60, false, ['vibrate']);
  result.redirect("main.html");
});

app.get("/vibe5-rando", function(req, result){
  console.log("vibe5 - 5 min timer...75% randomized");
  pavlok.pattern({
		"pattern": [ "beep", "beep", "beep" ]
	});
  zapTimer(5, 60, 0.75, ['vibrate', 'vibrate']);
  result.redirect("main.html");
});

app.get("/vibechain-15-med", function(req, result){
  pulseChain(15, 255, 0.5, 'vibrate');
  result.redirect("main.html");
});

app.get("/vibechain-30-med", function(req, result){
  pulseChain(30, 255, 0.5, 'vibrate');
  result.redirect("main.html");
});

app.get("/vibechain-60-hard", function(req, result){
  pulseChain(60, 255, 0.5, 'vibrate');
  result.redirect("main.html");
});

app.get("/vibe20", function(req, result){
  console.log("pulse20 - 1 sneaky light pulse every 3 min, for 20 min");
  zapTimer(10, 120, false, {
    "pattern": [ "vibe", "vibe", "vibe", "vibe" ],
    "intensity": 64 });
  result.redirect("main.html");
});

app.get("/vibe20-rando", function(req, result){
  console.log("pulse20 rando- 1 sneaky light pulse every 3 min, for 20 min");
  zapTimer(10, 120, 0.5, {
    "pattern": [ "vibe", "vibe", "vibe", "vibe" ],
    "intensity": 64 });
  result.redirect("main.html");
});

///////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT, function () {
  let baseUrl = process.env.NOW_URL ? process.env.NOW_URL : 'localhost'
	console.log(`Visit http://${baseUrl}:${process.env.PORT}`);
});
