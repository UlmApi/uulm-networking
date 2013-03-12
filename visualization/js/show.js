if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container;
var camera, scene, renderer, controls;

var color, colors = [];

var FizzyText = function() {
  this.time = 12;
  this["display entire week"] = false;
  this.weekday = "Monday";
};

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var startTS = 1363302000000;
var endTS = 1363906800000;

$(function() {
	var text = new FizzyText();
	var gui = new dat.GUI({ autoPlace: false, width: 295 });
	document.getElementById("gui").appendChild(gui.domElement);

	gui.add(text, 'weekday', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] );
	gui.add(text, 'time', 0, 24);
	gui.add(text, 'display entire week');

	init();
	animate();
});

function pGroup(x, y, h, count) {
	var particleTexture = THREE.ImageUtils.loadTexture( 'spark.png' );
	h *= 1;
	count = (count * 0.1) % 30;


	particleGroup = new THREE.Object3D();
	particleAttributes = { startSize: [], startPosition: [], randomness: [] };
	
	var totalParticles = count;
	//var totalParticles = 200;
	var radiusRange = 2 * h;
	for( var i = 0; i < totalParticles; i++ ) 
	{
	    var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, useScreenCoordinates: false, color: 0xffffff } );
		
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set( h*32, h*32, 1.0 ); // imageWidth, imageHeight
		//sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
		//sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

		// for a cube:
		// sprite.position.multiplyScalar( radiusRange );
		// for a solid sphere:
		// sprite.position.setLength( radiusRange * Math.random() );
		// for a spherical shell:
		sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );
		
		// sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() ); 
		sprite.material.color.setHSL( Math.random(), 0.9, 0.7 ); 
		
		// sprite.opacity = 0.80; // translucent particles
		sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
		
		particleGroup.add( sprite );
		// add variable qualities to arrays, if they need to be accessed later
		particleAttributes.startPosition.push( sprite.position.clone() );
		particleAttributes.randomness.push( Math.random() );
	}
	particleGroup.position.x = x;
	particleGroup.position.y = y;
	scene.add( particleGroup );
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


var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);


	/* floor */
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture("map-simple.svg"),
fog: false
	});

	var geometry = new THREE.PlaneGeometry(3074, 1782);
	var meshCanvas = new THREE.Mesh(geometry, material);
	scene.add(meshCanvas);



/*
	$.couch.db(db_name).view("couchapp/aps", {
		success: function(data) {
			console.log(data);
			$("#aps_left").text(data.rows[0].value);
		},
		error: function(status) {
			console.log(status);
		},
		reduce: true,
		descending: false,
		group: true,
		group_level: 1
	});
	*/

	displayEntireWeek();
	//exampleSphere();

}



var particleGroup, particleAttributes;


function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
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
	
	controls.update();
	
}

function render() 
{
	renderer.render( scene, camera );
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


function displayEntireWeek() {
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

	for (var i in aps.rows) {
		var id = aps.rows[i].id;
		var value = aps.rows[i].value;


		if (value.length == 0) continue;

		var h = oneWeek[id] * 0.0004;

		//var sphere = new THREE.Mesh(new THREE.SphereGeometry(20*h, 20, 20), sphereMaterial);
		//var sphere = new THREE.Mesh(new THREE.SphereGeometry(20*h, 40, 40), material);
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(20*h, 16, 16), material);

	        sphere.overdraw = true;
		var pos = coord2px(value[0][0], value[0][1]);
		sphere.position.x = pos.x;
		sphere.position.y = pos.y;
		//scene.add(sphere);
		pGroup(pos.x, pos.y, h, oneWeek[id]);

		//if (i == 1) break;
		//if (i == 120) break;
		//break;
	}
}

/*
function render() {
	renderer.render(scene, camera);
	controls.update();
	
	console.log(
		" " + camera.position.x +
		" " + camera.position.y +
		" " + camera.position.z
	);

}
*/
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

