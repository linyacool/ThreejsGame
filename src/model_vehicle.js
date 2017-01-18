game.models.Vehicle = function(x,y,z){
	this.v = [];
	this.v.x = 160;
	this.v.y = 80;
	
	this.max_v = [];
	this.max_v.x = 150;
	this.max_v.y = 150;

	this.a = [];
	this.a.x = 10;
	this.a.y = 1;

	this.instance = new THREE.Object3D();

    var seu = THREE.ImageUtils.loadTexture("src/doge.jpg");

	var a = new THREE.Mesh(
		new THREE.CubeGeometry( 200, 200, 200 ),
		new THREE.MeshPhongMaterial({map:seu,ambient: 0xFFFFF})
        //new THREE.MeshPhongMaterial()
	);
    var b = new THREE.Mesh(
       // new THREE.CubeGeometry( 100, 100, 100 ),
		new THREE.CylinderGeometry(50,50,150,50,50),
        new THREE.MeshPhongMaterial({ambient:0x3366FF})
    );
    a.position.z += 50;
    b.rotation.z += 0.5 * Math.PI;
    b.position.z = a.position.z + 100;
    a.castShadow = true;
    b.castShadow = true;
    a.receiveShadow = true;
    b.receiveShadow = true;
	this.instance.add(a);
    this.instance.add(b);

    var pointColor = 0x666FF;
    var spotLight = new THREE.SpotLight(pointColor);
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 2;
    spotLight.shadowCameraFar = 5000;
    spotLight.shadowCameraFov = 30;
    spotLight.distance = 5000;
    spotLight.angle = 0.6;
    spotLight.position.z = a.position.z + 200;
    var temp = new THREE.Object3D();
    temp.position.x = 600000;
    temp.position.y = game.config.barrier_size/2 + game.config.game_plane_height/2;
    temp.position.z = 0;
    spotLight.target = temp;
    //game.three.scene.add(temp);
    //spotLight.shadowCameraVisible = true;
    this.instance.add(spotLight);
	this.instance.castShadow = true;
	this.instance.receiveShadow = true;
	this.instance.position.set(x,y,z);
};

game.models.Vehicle.prototype.getInstance = function(){
	return this.instance;
};