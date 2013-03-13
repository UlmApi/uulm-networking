if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container;
var camera, scene, renderer, controls;

var color, colors = [];
var db_name = "uulm-networking";

var startTS = 1363302007000;
var endTS = 1363906800000;
var int;

var FizzyText = function() {
  this.time = new Date(startTS).getHours();
  this.label = 'foo';
  this["display entire week"] = false;
  this.weekday = "0";
};

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();


var particleGroup, particleAttributes;
var groups = {};

var ctrls = {};
var week_arr = {
	 0 : 'Friday'
	, 1 : 'Saturday'
	, 2 : 'Sunday'
	, 3 : 'Monday' 
	, 4 : 'Tuesday'
	, 5 : 'Wednesday'
	, 6 : 'Thursday'
	, 7 : 'Friday'
};

$(function() {
	var text = new FizzyText();
	var gui = new dat.GUI({ autoPlace: false, width: 295});
	document.getElementById("gui").appendChild(gui.domElement);

	ctrls.label = gui.add(text, 'label', 'foo');
	ctrls.weekday = gui.add(text, 'weekday', week_arr);
	ctrls.time = gui.add(text, 'time', 0, 24);
	ctrls.display_week = gui.add(text, 'display entire week');

	ctrls.display_week.onChange(function(value) {
		if (value) {
			clearInterval(int);
			resetGroups();
			displayEntireWeek();
		} else {
			//currentTS = startTS;
			/* make sure ctrls are set to the right time */
			resetGroups();
			int = setInterval("nextSnapshot()", 1000);
		}
	});

	ctrls.weekday.onChange(function(value) {
		var startDay = new Date(startTS).getDate();

		var i = 0;
		for (var i in week_arr) {
			if (week_arr[i] == value) break;
			i++;
		}
		i--;

		var newD = new Date(currentTS);
		newD.setDate(startDay + i);
		currentTS = newD.getTime();
	});

	ctrls.time.onChange(function(value) {
		resetGroups()
		console.log("time: " + value)
		var newD = new Date(currentTS);
		newD.setHours(value - 1);
		currentTS = newD.getTime();
	});

	init();
	animate();
});


var allSprites = [];
var allPGroups = {}
function particle(apid, x, y, h, count) {
	var particleTexture = THREE.ImageUtils.loadTexture('spark.png');
	h *= 1;
	count = (count * 0.1) % 30;

	allPGroups[apid] = new THREE.Object3D();
	//var particleGroup = new THREE.Object3D();
	particleAttributes = {startSize: [], startPosition: [], randomness: []};
	
	var totalParticles = count;
	//var totalParticles = 200;
	var radiusRange = 2 * h;
	//console.log(totalParticles);
	for( var i = 0; i < totalParticles; i++ ) {
	    var spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, 
		useScreenCoordinates: false, color: 0xffffff});
		
		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set( h*32, h*32, 1.0 ); // imageWidth, imageHeight
		//sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
		sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		//sprite.position.set( x + Math.random() - 0.5, y + Math.random() - 0.5, Math.random() - 0.5 );

		//sprite.position.set( x + Math.random() - 0.5, y + Math.random() - 0.5, 50 );

		// for a solid sphere:
		// sprite.position.setLength( radiusRange * Math.random() );
		// for a spherical shell:
		sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));
		
		// sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() ); 
		sprite.material.color.setHSL( Math.random(), 0.9, 0.7 ); 
		
		// sprite.opacity = 0.80; // translucent particles
		sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
		
		//groups[apid].add(sprite);


		allPGroups[apid].add( sprite );
		//particleGroup.add( sprite );
		allSprites[apid].push(sprite)
		// add variable qualities to arrays, if they need to be accessed later
		particleAttributes.startPosition.push( sprite.position.clone() );
		particleAttributes.randomness.push( Math.random() );

		//scene.add(sprite)
	}
	/*
	particleGroup.position.x = x;
	particleGroup.position.y = y;
	scene.add(particleGroup)
	*/
	allPGroups[apid].position.x = x;
	allPGroups[apid].position.y = y;
	scene.add(allPGroups[apid])

	//groups[apid].position.x = x;
	//groups[apid].position.y = y;
	//scene.add(groups[apid]);
	//scene.add(particleGroup);
}


function pGroup(apid, x, y, h, count) {
	var particleTexture = THREE.ImageUtils.loadTexture('spark.png');
	h *= 1;
	count = (count * 0.1) % 30;

	//particleGroup = new THREE.Object3D();
	particleAttributes = {startSize: [], startPosition: [], randomness: []};
	
	var totalParticles = count;
	//var totalParticles = 200;
	var radiusRange = 2 * h;
	for( var i = 0; i < totalParticles; i++ ) {
	    var spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, 
		useScreenCoordinates: false, color: 0xffffff});
		
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set( h*32, h*32, 1.0 ); // imageWidth, imageHeight
		//sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
		//sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

		// for a solid sphere:
		// sprite.position.setLength( radiusRange * Math.random() );
		// for a spherical shell:
		sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));
		
		// sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() ); 
		sprite.material.color.setHSL( Math.random(), 0.9, 0.7 ); 
		
		// sprite.opacity = 0.80; // translucent particles
		sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
		
		groups[apid].add(sprite);
		//particleGroup.add( sprite );
		// add variable qualities to arrays, if they need to be accessed later
		particleAttributes.startPosition.push( sprite.position.clone() );
		particleAttributes.randomness.push( Math.random() );
	}

	//particleGroup.position.x = x;
	//particleGroup.position.y = y;
	groups[apid].position.x = x;
	groups[apid].position.y = y;
	scene.add(groups[apid]);
	//scene.add(particleGroup);
}
var currentlyDisplayedUUIDs = {};

function resetGroups() {
	for (var i in aps.rows) {
		var id = aps.rows[i].id;
		scene.remove(groups[id]);

		//console.log(id)
		for (var j in allSprites[id]) {
			//console.log(allSprites[id])
			//if (allSprites[id][j] != undefined)
				removeSpriteFromAP(id);
		}

		for (var i in allPGroups)
			scene.remove(allPGroups[i])

		groups[id] = new THREE.Object3D();
	}
			for (var i in aps.rows) {
				var ap = aps.rows[i];
				var apid = ap.id;
				var coords = ap.value;
				if (coords.length === 0) continue;
				var pos = coord2px(coords[0][0], coords[0][1]);

				allPGroups[apid] = new THREE.Object3D();
				allSprites[apid] = [];
				allPGroups[apid].position.x = pos.x;
				allPGroups[apid].position.y = pos.y;
				scene.add(allPGroups[apid])
			}
}


function init() {
	scene = new THREE.Scene();
//	scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );


	var VIEW_ANGLE = 35, 
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, 
		NEAR = 1, FAR = 5000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	camera.position.set(400, -1307, 2352)
	camera.up.set(-0.858, 1.62, 1.32)
	camera.rotation.set(0.5, 0.304, 0.424)
	scene.add(camera);


	renderer = new THREE.WebGLRenderer({ antialias: false,  clearAlpha: 1 });
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	//renderer.setClearColor("#fff", 1);

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.appendChild(renderer.domElement);

	controls = new THREE.TrackballControls(camera, renderer.domElement);

	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

	/*
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	*/


	/* floor */
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture("map-simple.svg"),
		fog: false
	});

	var geometry = new THREE.PlaneGeometry(3074, 1782);
	var meshCanvas = new THREE.Mesh(geometry, material);
	scene.add(meshCanvas);

	resetGroups();

	//displayEntireWeek();
	//exampleSphere();


	/* first build particleGroup for each ap and add that to the scene */
	for (var i in aps.rows) {
		var ap = aps.rows[i];
		var apid = ap.id;
		var coords = ap.value;
		if (coords.length === 0) continue;
		var pos = coord2px(coords[0][0], coords[0][1]);

		allPGroups[apid] = new THREE.Object3D();
		allSprites[apid] = [];
		allPGroups[apid].position.x = pos.x;
		allPGroups[apid].position.y = pos.y;
		scene.add(allPGroups[apid])
	}

	currentTS = startTS;

	//displaySnapshot(startTS, startTS + snapshotDiff)
	nextSnapshot();
	int = setInterval("nextSnapshot()", 1000);

	//setInterval("rm()", 1000);
}

var currentTS;
var snapshotDiff = 60*60*60;
function nextSnapshot() {
	displaySnapshot(currentTS, currentTS + snapshotDiff)
}


/* add sprite, incl. fading in effect */
var allSprites = {};
function addSprite(apid) {
	//var apid = log_entry.ap;
	//console.log(log_entry)
	//var pos = coord2px(coords[0][0], coords[0][1]);

	//particle(log_entry.ap, pos.x, pos.y, h, oneWeek[id]);
	//function particle(apid, x, y, h, count) {

	if (allPGroups[apid] == undefined) allPGroups[apid] = new THREE.Object3D();
	if (allSprites[apid] == undefined) allSprites[apid] = [];

	var particleTexture = THREE.ImageUtils.loadTexture('spark.png');
	particleAttributes = {startSize: [], startPosition: [], randomness: []};
	
	    var spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, 
		useScreenCoordinates: false, color: 0xffffff});
		
		var h = 2;

		//console.log(allSprites)

		var radiusRange = 2 * h;
		radiusRange = (allSprites[apid].length * 2) % 50;
		if (radiusRange === 0) radiusRange = 1;

		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set( h*32, h*32, 1.0 ); // imageWidth, imageHeight
		sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));
		sprite.material.color.setHSL( Math.random(), 0.9, 0.7 ); 
		sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles


	allPGroups[apid].add(sprite);
	allSprites[apid].push(sprite);
}


function moveSprite(log_entry, old_ap, new_ap) {

}


/* remove sprite, incl. fade out effect */
function removeSprite(log_entry) {
	var apid = log_entry.ap;
	var sprite = allSprites[apid].pop();

	allPGroups[apid].remove(sprite);
}


function removeSpriteFromAP(ap) {
	//console.log(ap)
	var sprite = allSprites[ap].pop();

	allPGroups[ap].remove(sprite);
}


/* remove a random sprite */
function rm() {
	var i = 50;

	while (--i > 0) {
		var sp = allSprites.pop();
		for (var a in allPGroups) {
			allPGroups[a].remove(sp)
		}
	}
}


function animate() {
	requestAnimationFrame(animate);
	render();		
	update();
}


function update() {
	/*
	var time = 4 * 1;
	//var time = 4 * clock.getElapsedTime();
	
	for ( var c = 0; c < particleGroup.children.length; c ++ ) 
	{
		var sprite = particleGroup.children[ c ];

		// particle wiggle
		// var wiggleScale = 2;
		// sprite.position.x += wiggleScale * (Math.random() - 0.5);
		// sprite.position.y += wiggleScale * (Math.random() - 0.5);
		// sprite.position.z += wiggleScale * (Math.random() - 0.5);
		
		// pulse away/towards center
		// individual rates of movement
		var a = particleAttributes.randomness[c] + 1;
		var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
		sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
		sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor;
		sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;	
	}

	// rotate the entire group
	// particleGroup.rotation.x = time * 0.5;
	particleGroup.rotation.y = time * 0.75;
	// particleGroup.rotation.z = time * 1.0;

	if ( keyboard.pressed("z") ) 
	{ 
		// do something cool
	}
	*/
	
	controls.update();
}


function render() {
	renderer.render(scene, camera);
}


function exampleSphere() {
	//var sphere = new THREE.Mesh(new THREE.SphereGeometry(60, 50, 50), material);
	//var sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 16, 16), shaderMaterial);
	//var sphere = new THREE.Mesh(new THREE.Sphere(30, 16, 16), shaderMaterial);
	var sphere = new THREE.Mesh(new THREE.SphereGeometry( 30, 30, 40), sphereMaterial);
	sphere.overdraw = true;
	var pos = coord2px(48.42484, 9.95309);
	sphere.position.x = pos.x;
	sphere.position.y = pos.y;
	sphere.scale.x +=1;
	sphere.scale.y +=1;
	sphere.scale.z +=1;
	sphere.position.y += 50;
	//scene.add(sphere);
}


function displaySnapshot(fstTS, sndTS) {
	//particle(id, pos.x, pos.y, h, oneWeek[id]);

	$("#gui input[type=text]").attr("value", new Date(fstTS));

	$.couch.db(db_name).view("visualization/time", {
		success: function(data) {
			//console.log(data);
			//console.log(data.rows.length);
			var rows = data.rows;

			var newDisplays = {};
			for (var i in rows) {
				//console.log(rows)
				var uuid = rows[i].value.uuid;
				var p = rows[i]
				var ap = rows[i].value.ap
				//var pos = coord2px(aps[ap][0][0], p.coords[0][1]);

				//particle(uuid, p.x, pos.y, h, 100);

				// does a particle for this uuid already exist?
				if (currentlyDisplayedUUIDs[uuid]) {

					// if so has it changed the access point?
					if (currentlyDisplayedUUIDs[uuid] != ap) {
						// different ap!
						// move ap to other group
					}
				} else {
					// if not show up animation and save as displayed
					addSprite(rows[i].value.ap);
					//addSprite(rows[i].value);
					newDisplays[uuid] = ap;
					//console.log("added " + uuid + ", " + ap);
				}
			}

			// what is the difference between the two objects?
			// remove the difference
			//console.log(newDisplays)
			//console.log(currentlyDisplayedUUIDs)
			for (var i in newDisplays) {
				for (var i in currentlyDisplayedUUIDs) {
					if (currentlyDisplayedUUIDs[i] === newDisplays[i]) {
						delete currentlyDisplayedUUIDs[i];
						break;
					}
				}
			}

			//console.log(currentlyDisplayedUUIDs)
			//console.log("-----------------")
			//console.log(newDisplays)
			//console.log(currentlyDisplayedUUIDs)

			// whats left now in the object is no longer displayed
			for (var i in currentlyDisplayedUUIDs) {
				//console.log(i)
				//console.log(currentlyDisplayedUUIDs);
				var ap = currentlyDisplayedUUIDs[i];
				removeSpriteFromAP(ap)
				//removeSprite(rows[i].value)
			}

			currentlyDisplayedUUIDs = newDisplays;
			currentTS += snapshotDiff
		},
		error: function(status) {
			console.log(status);
		},
		startkey: fstTS,
		endkey: sndTS,
		reduce: false
		/*
		descending: false,
		group: true,
		group_level: 1
		*/
	});
}


function displayEntireWeek() {
/*
	var sphereMaterial = new THREE.MeshLambertMaterial(
	{color: 0xFF0000, 
	//transparent: true,
	blending: THREE.AdditiveBlending});


	var shader = THREE.BasicShader;
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	//uniforms[ "tCube" ].value = textureCube;

	var parameters = {fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader,
	 transparent: true, 
	 uniforms: uniforms, 
	 blending: THREE.AdditiveBlending};
	 //blending: THREE.NormalBlending};

	//var material = new THREE.MeshLambertMaterial( parameters);
	var material = new THREE.ShaderMaterial( parameters);
	*/

	for (var i in aps.rows) {
		var id = aps.rows[i].id;
		var value = aps.rows[i].value;


		if (value.length == 0) continue;

		var h = oneWeek[id] * 0.0004;
		var pos = coord2px(value[0][0], value[0][1]);
		//pGroup(id, pos.x, pos.y, h, oneWeek[id]);

		particle(id, pos.x, pos.y, h, oneWeek[id]);

/*
		var a = oneWeek[id];
		while (--a >= 0)
			addSprite(id)
			*/

		/*
		//var sphere = new THREE.Mesh(new THREE.SphereGeometry(20*h, 20, 20), sphereMaterial);
		//var sphere = new THREE.Mesh(new THREE.SphereGeometry(20*h, 40, 40), material);
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(20*h, 16, 16), material);

	        sphere.overdraw = true;
		sphere.position.x = pos.x;
		sphere.position.y = pos.y;
		//scene.add(sphere);
		*/

		//if (i == 1) break;
		//if (i == 120) break;
		//break;
	}
}


function coord2px(lat, lon) {
	/*
		48.42677
	9.94224		 9.96477
		48.41809
	*/
	var bbLeft = 9.94224;
	var bbRight = 9.96477;
	var bbTop = 48.42677;
	var bbBottom = 48.41809;

	var bbHeight = bbTop - bbBottom;
	var bbWidth = bbRight - bbLeft;

	var imgWidth = 3074;
	var imgHeight = 1782;

	var shiftX = -1537;
	var shiftY = -891;

	var coordX = ((imgWidth / bbWidth) * (lon - bbLeft)) + shiftX;
	var coordY = ((imgHeight / bbHeight) * (bbTop - lat)) + shiftY;
	coordY *= -1;

	return {x: coordX, y: coordY};
}
