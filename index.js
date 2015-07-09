var container, stats;

var camera, controls, scene, renderer;

SunLight = new THREE.DirectionalLight( 0xffeecc );

var vars = {
	showDots: true,
	limitConnections: false,
	lightY: 2,	
	lightFOV: 45,
	particleCount: 500
}

init();
render();

function animate() {

	requestAnimationFrame(animate);
	controls.update();

}

function initGUI() {

	var gui = new dat.GUI();

	gui.add( vars, "showDots" ).onChange( function( value ) { pointCloud.visible = value; } );
	gui.add( vars, "limitConnections" );
	gui.add( vars, "lightY", 0.1, 30 );	
	gui.add( vars, "lightFOV", 0, 180, 1 );
	gui.add( vars, "particleCount", 0, 100, 1 ).onChange( function( value ) {

		particleCount = parseInt( value );
		particles.drawcalls[ 0 ].count = particleCount;

	});

}

function init() {

	initGUI();

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.set(10, 10, 10);
	//camera.position.set(27481, 50, 53944);

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
	controls.minPolarAngle = 10 * Math.PI / 180;
	controls.maxPolarAngle = 80 * Math.PI / 180;
	//controls.target = new THREE.Vector3(27482, 0, 53939);
	controls.target = new THREE.Vector3(10, 0, 10);

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

	// world

	var geometry = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshLambertMaterial( { color:0xaaffaa, shading: THREE.FlatShading } );

	var ground = new THREE.Mesh( geometry, material );
	ground.position.set(10, 0, 10);
	ground.rotation.x = - Math.PI / 2;
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add( ground );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

	for ( var i = 0; i < 50; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.scale.x = Math.random() * 0.5;
		mesh.scale.y = Math.random() * 0.5;
		mesh.scale.z = Math.random() * 0.5;
		mesh.position.x = Math.random() * 4 + 10;
		mesh.position.y = mesh.scale.y / 2;
		mesh.position.z = Math.random() * 2 + 10;
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = false;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );

	}


	// lights

	
	//SunLight.position.set( 27470, 30, 53984 );
	SunLight.position.set( 14, vars.lightY, 14 );
	SunLight.target.position.set( 0, -30, 53984 );
	SunLight.shadowCameraVisible = true;
	SunLight.castShadow = true;
	SunLight.shadowDarkness = 0.5;
	SunLight.shadowCameraNear = 0.01;
	SunLight.shadowCameraFar = 50;
	SunLight.shadowCameraLeft = -20;
	SunLight.shadowCameraRight = 20;
	SunLight.shadowCameraTop = 20;
	SunLight.shadowCameraBottom = -20;
	SunLight.shadowBias = +0.000001;
	SunLight.shadowMapWidth = 1024;
    SunLight.shadowMapHeight = 1024;
	scene.add( SunLight );


	light = new THREE.AmbientLight( 0xaaaaaa );
	scene.add( light );


	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.BasicShadowMap;

	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	animate();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function render() {

	SunLight.position.set( 14, vars.lightY, 14 );
	SunLight.shadowCameraFov = vars.lightFOV;
	SunLight.updateMatrix();

	renderer.render( scene, camera );
	stats.update();

}