if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container;
var camera, scene, renderer, controls;

var FizzyText = function() {
  this.time = 12;
  this["display entire week"] = false;
  this.weekday = "Monday";
};


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


function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();

	var VIEW_ANGLE = 35, 
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, 
		NEAR = 1, FAR = 5000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	camera.position.set(400, -1307, 2352)
	camera.up.set(-0.858, 1.62, 1.32)
	camera.rotation.set(0.5, 0.304, 0.424)
	scene.add(camera);

	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,1800);
	scene.add(light);

	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);

	/* floor */
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture("map-simple.svg")
	});

	var geometry = new THREE.PlaneGeometry(3074, 1782);
	var meshCanvas = new THREE.Mesh(geometry, material);
	scene.add(meshCanvas);


	displayEntireWeek();
	//exampleSphere();




	renderer = new THREE.WebGLRenderer({ antialias: true});
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor("#000", 1);

	container.appendChild(renderer.domElement);

	controls = new THREE.TrackballControls(camera, renderer.domElement);
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
		scene.add(sphere);

		//break;
	}
}


function animate() {
	requestAnimationFrame(animate);
	render();
}


function render() {
	//camera.position.x += 10;

	renderer.clear();
	renderer.render(scene, camera);
	controls.update();
	/*
	console.log(
		" " + camera.position.x +
		" " + camera.position.y +
		" " + camera.position.z
	);
	*/
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


