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
	scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );


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

var ambient = new THREE.AmbientLight( 0xFFFFFF );
scene.add(ambient);

	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);

	/* floor */
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture("map-simple.svg"),
fog: false
	});

	var geometry = new THREE.PlaneGeometry(3074, 1782);
	var meshCanvas = new THREE.Mesh(geometry, material);
	scene.add(meshCanvas);










///////////////////////////////////



				geometry = new THREE.Geometry();

				sprite = THREE.ImageUtils.loadTexture( "ball.png" );

				for ( i = 0; i < 5000; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = 2000 * Math.random() - 1000;
					vertex.y = 2000 * Math.random() - 1000;
					vertex.z = 2000 * Math.random() - 1000;

					geometry.vertices.push( vertex );

					colors[ i ] = new THREE.Color( 0xffffff );
					colors[ i ].setHSV( ( vertex.x + 1000 ) / 2000, 1, 1 );

				}

				geometry.colors = colors;

				material = new THREE.ParticleBasicMaterial( { size: 185, map: sprite, vertexColors: true, transparent: true } );
				material.color.setHSV( 1.0, 0.2, 0.8 );

				particles = new THREE.ParticleSystem( geometry, material );
				particles.sortParticles = true;

				scene.add( particles );









//////////////////////////////
				var material2 = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite() ), 
fog: false,
blending: THREE.AdditiveBlending } );


var sphereMaterial = new THREE.MeshLambertMaterial(
	{color: 0xFF0000, 
	//transparent: true,
	blending: THREE.AdditiveBlending
});


				for ( var i = 0; i < 1000; i++ ) {

					particle = new THREE.Particle( material2 );
//var sphere = new THREE.Mesh(new THREE.SphereGeometry( 300, 8, 8), sphereMaterial);
					initParticle( particle, i * 10 );

					scene.add( particle );
				}


	var particleTexture = THREE.ImageUtils.loadTexture( 'spark.png' );

	particleGroup = new THREE.Object3D();
	particleAttributes = { startSize: [], startPosition: [], randomness: [] };
	
	var totalParticles = 200;
	var radiusRange = 50;
	for( var i = 0; i < totalParticles; i++ ) 
	{
	    var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, fog: true, useScreenCoordinates: false, color: 0xffffff } );
		
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
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
	particleGroup.position.y = 50;
//	scene.add(particleGroup );

/*
sphere.position.x = 0;
sphere.position.y = 0;
sphere.position.z = 0;
*/
//scene.add(sphere)


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




	renderer = new THREE.WebGLRenderer({ antialias: false,  clearAlpha: 1 });
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	//renderer.setClearColor("#fff", 1);

	container.appendChild(renderer.domElement);

	controls = new THREE.TrackballControls(camera, renderer.domElement);
}



			function generateSprite() {

				var canvas = document.createElement( 'canvas' );
				canvas.width = 16;
				canvas.height = 16;

				var context = canvas.getContext( '2d' );
				var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
				gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
				gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
				gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
				gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

				context.fillStyle = gradient;
				context.fillRect( 0, 0, canvas.width, canvas.height );

				return canvas;

			}

			function initParticle( particle, delay ) {

				var particle = this instanceof THREE.Particle ? this : particle;
				var delay = delay !== undefined ? delay : 0;

				particle.position.x = 0;
				particle.position.y = 0;
				particle.position.z = 0;
				particle.scale.x = particle.scale.y = Math.random() * 30 + 1;

				new TWEEN.Tween( particle )
					.delay( delay )
					.to( {}, 10000 )
					.onComplete( initParticle )
					.start();

				new TWEEN.Tween( particle.position )
					.delay( delay )
					.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
					.start();

				new TWEEN.Tween( particle.scale )
					.delay( delay )
					.to( { x: 0, y: 0 }, 10000 )
					.start();

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

	//renderer.clear();
/*
	var time = Date.now() * 0.00005;

				
				h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
				material.color.setHSV( h, 0.8, 1.0 );

TWEEN.update();


				for ( i = 0; i < scene.children.length; i ++ ) {

					var object = scene.children[ i ];

					if ( object instanceof THREE.ParticleSystem ) {

						object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

					}

				}
*/
	


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


