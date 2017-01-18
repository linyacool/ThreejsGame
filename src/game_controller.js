
// game initialization, load images, models, etc...
game.oneTimeInit = function(){

	game.container = document.createElement( 'div' );
	document.body.appendChild( game.container );

	// create renderer
 	game.three.renderer = new THREE.WebGLRenderer({antialias: true });
    game.three.renderer.setSize(window.innerWidth, window.innerHeight);
    game.three.renderer.shadowMapEnabled = true;
	game.container.appendChild( game.three.renderer.domElement );

	// create stats
	game.stats = new Stats();
	game.stats.domElement.style.position = 'absolute';
	game.stats.domElement.style.top = '0px';
	game.container.appendChild( game.stats.domElement );

	// create camera
    game.three.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 140000 );


	document.addEventListener('keyup', function(event) { game.input.Key.onKeyup(event); }, false);
	document.addEventListener('keydown', function(event) { game.input.Key.onKeydown(event); }, false);

	window.addEventListener( 'resize', onWindowResize, false );

	document.addEventListener( 'mousedown', game.input.onDocumentMouseDown, false );

	setInterval(game.engine.time.update, 1000);
};

game.newGame = function()
{
	$("#time").text(0);
	game.engine.time.start = Date.now();

	game.scene = [];
	// create scene
    game.three.scene = new THREE.Scene();
    //game.three.scene.fog = new THREE.FogExp2( 0x4747FF, 0.00015 );

	// put camera to right position
    game.three.camera.position.set( -9000, game.config.game_plane_height/2, 800 );
	game.three.camera.lookAt( new THREE.Vector3( game.config.game_plane_width/2-500, game.config.game_plane_height/2, -1000) );
	game.three.camera.rotation.x = 90 * Math.PI / 180;
    // create some objects
 	for (var i = 0; i < 1000; i++)
	{
		// add new ball object to array
		// init with random values
		game.scene.push(new game.models.Cube(
			rand(game.config.barrier_size/2, game.config.game_plane_width)-game.config.barrier_size/2, // x
			rand(game.config.barrier_size/2, game.config.game_plane_height)-game.config.barrier_size/2, // y
			game.config.barrier_size/2, // z
			rand(-10, 10), // dx
			rand(-10, 10), // dy
			rand(-10, 10), // dz
			game.config.barrier_size
		));

		// add them to scene
		game.three.scene.add( game.scene[i].getInstance() );
	}


    var im1 = THREE.ImageUtils.loadTexture("src/skybox/px.jpg" );
    var im2 = THREE.ImageUtils.loadTexture("src/skybox/nx.jpg" );
    var im3 = THREE.ImageUtils.loadTexture("src/skybox/py.jpg" );
    var im4 = THREE.ImageUtils.loadTexture("src/skybox/ny.jpg" );
    var im5 = THREE.ImageUtils.loadTexture("src/skybox/pz.jpg" );
    var im6 = THREE.ImageUtils.loadTexture("src/skybox/nz.jpg" );
    var materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( { map: im1,ambient: 0xFFFFF,side:THREE.BackSide}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: im2,ambient: 0xFFFFF,side:THREE.BackSide}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: im3,ambient: 0xFFFFF,side:THREE.BackSide}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: im4 ,ambient: 0xFFFFF,side:THREE.BackSide}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: im5,ambient: 0xFFFFF,side:THREE.BackSide}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: im6 ,ambient: 0xFFFFF,side:THREE.BackSide}));
    var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
   // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyboxGeom = new THREE.CubeGeometry( 130000, 110000,110000);
    var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
    skybox.position.set(game.config.game_plane_width/2,game.config.game_plane_height/2, 0 );
    skybox.rotation.x += 0.5 * Math.PI;
    //skyboxMaterial.needsUpdate = true;
    game.three.scene.add( skybox );

/*
    game.three.scene.background = new THREE.CubeTextureLoader()
        .setPath( 'textures/cube/pisa/' )
        .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );
*/

    var focus = new THREE.Mesh(
        new THREE.CubeGeometry( 200, 200, 200),
        new THREE.MeshNormalMaterial()
    );
	focus.position.set(-8050, game.config.barrier_size/2 + game.config.game_plane_height/2+5000, -5550);
    game.three.scene.add(focus);

	game.vehicle = new game.models.Vehicle(
		-5000, // x
		game.config.barrier_size/2 + game.config.game_plane_height/2, // y
		50 //game.config.barrier_size/2 // z
	);
	game.three.scene.add( game.vehicle.getInstance() );
/*
    var controls1 = new THREE.OrbitControls( game.three.camera, game.three.renderer.domElement );
    controls1.addEventListener( 'change', game.rendering );
    controls1.minDistance = 20;
    controls1.maxDistance = 500;
    controls1.maxPolarAngle = Math.PI / 2;
    controls1.enablePan = false;
    controls1.target.copy( game.vehicle.position );
    controls1.update();
*/
/*
	var controls = new THREE.FirstPersonControls( game.three.camera );
	controls.movementSpeed = 1000;
	controls.lookSpeed = 0.125;
	//controls.lookVertical = true;
	//controls.constrainVertical = true;
	controls.verticalMin = 1.1;
	controls.verticalMax = 2.2;
*/

    //var controls1 = new THREE.OrbitControls( game.three.camera);
    //controls1.addEventListener( 'change', updateControls() );


    // plane
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( game.config.game_plane_width, game.config.game_plane_height), new THREE.MeshLambertMaterial({
        color: 0xDCD800
    }));
    plane.overdraw = true;
    plane.position.set(game.config.game_plane_width/2, game.config.game_plane_height/2, 0);
    plane.receiveShadow=true;

    var plane1 = new THREE.Mesh( new THREE.PlaneGeometry(3000, 1200), new THREE.MeshLambertMaterial({
        color: 0xDCD800
    }));
    plane1.overdraw = true;
    plane1.position.set(-5000,game.config.barrier_size/2 + game.config.game_plane_height/2 , 0);
    plane1.receiveShadow=true;

    var ambiColor = "#d2d2d2";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    game.three.scene.add(ambientLight);


    var pointColor = "white";
    var directionalLight = new THREE.DirectionalLight(pointColor);
    //directionalLight.position.set(game.config.game_plane_width, game.config.game_plane_height, 300);
    directionalLight.position.set(0, 6000, 3000);
    directionalLight.castShadow = true;
    directionalLight.shadowCameraNear = 4000;
    directionalLight.shadowCameraFar = 10000;
    directionalLight.shadowCameraLeft = -5000;
    directionalLight.shadowCameraRight = 5000;
    directionalLight.shadowCameraTop = 5000;
    directionalLight.shadowCameraBottom = -5000;
    directionalLight.target=focus;
    //directionalLight.target = game.scene[0].instance;
    directionalLight.distance = 0;
    directionalLight.intensity = 1;
    //directionalLight.shadowCameraVisible=true;
    directionalLight.shadowMapHeight = 6000;
    directionalLight.shadowMapWidth = 6000;
    //console.log(directionalLight.rotation);
    game.three.scene.add(directionalLight);

/*
    var pointColor = 0x006241;
    var spotLight = new THREE.SpotLight(pointColor);
    spotLight.position.set(1000, 1000, 1000);
	//spotLight.position.set(game.vehicle.position.x+50, game.vehicle.position.y+50, game.vehicle.position.z+50);
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 2;
    spotLight.shadowCameraFar = 1000;
    spotLight.shadowCameraFov = 30;
	spotLight.shadowCameraVisible = true;

    spotLight.target = game.vehicle.instance;

    spotLight.distance = 0;
    spotLight.angle = 0.4;


    game.three.scene.add(spotLight);
*/
    game.three.scene.add(plane);
    game.three.scene.add(plane1);
    //game state, start the game paused or running
	game.state = "run";
};

 // run the game, when DOM is ready
 window.onload = function(){

 	// init game
 	game.oneTimeInit();
	game.newGame(); 

	// start rendering loop
	game.rendering();
	// start simulation
	setInterval(function(){game.simulation()}, 1000/30);
};