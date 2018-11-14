navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

window.URL = window.URL || window.webkitURL;

let container, camera, scene, renderer, webcam;
let texture, uniforms, geometry, mesh, materials;
let videoImage, videoImageContext, videoTexture;

var CVD; //return of Canvas2DDisplay

JEEFACEFILTERAPI.init({
  canvasId: 'je',
  NNCpath: 'https://appstatic.jeeliz.com/faceFilter/', //root of NNC.json file

  //called when video stream is ready and lib initialized :
  callbackReady: function(errCode, spec) {
    if (errCode) throw (errCode);
    CVD = JEEFACEFILTERAPI.Canvas2DDisplay(spec);
    CVD.ctx.strokeStyle = 'yellow';
  }, //end callbackReady()

  //called at each render iteration (drawing loop) :
  callbackTrack: function(detectState) {
    if (detectState.detected > 0.6) {
      //draw a border around the face
      var faceCoo = CVD.getCoordinates(detectState);
      CVD.ctx.clearRect(0, 0, CVD.canvas.width, CVD.canvas.height);
      CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
      CVD.update_canvasTexture();
    }
    CVD.draw();
  } //end callbackTrack()
}); //end JEEFACEFILTERAPI.init call


if (navigator.getUserMedia) {
   //navigator.getUserMedia({ audio: false, video: { width: 1280, height: 1000 } },
   navigator.getUserMedia({ audio: false, video: true },
      function(stream) {
         webcam = document.querySelector('video');
         webcam.srcObject = stream;
         webcam.onloadedmetadata = function(e) {
           webcam.play();
         };
      },
      function(err) {
         console.log("The following error occurred: " + err.name);
      }
   );
} else {
   console.log("getUserMedia not supported");
}
function init() {
  webcam = document.getElementById('webcam');
  videoImage = document.getElementById('canvas');
  
	videoImageContext = videoImage.getContext( '2d' );
  videoImageContext.fillStyle = 'green';
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height );
  
  videoTexture = new THREE.Texture( videoImage );
  videoTexture.wrapS = THREE.MirroredRepeatWrapping;
  videoTexture.wrapT = THREE.MirroredRepeatWrapping;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1.5, 1, 3e3)
  camera.position.set(0, 0, 5);
  
  geometry = new THREE.PlaneBufferGeometry(50, 50);
  uniforms = {
    u_texture: { type: "t", value: videoTexture },
    time: { type: "f", value: performance.now() }
  };
  material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('blackhole').textContent
  } );
  material.extensions.derivatives = true;
  
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: !0 });
  renderer.setPixelRatio(2);
  
  container = document.getElementById('container-fluid');
  container.appendChild( renderer.domElement );
  
}

init();
animate();

function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
	if ( webcam.readyState === webcam.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( webcam, 0, 0, videoImage.width, videoImage.height );
		if (videoTexture) {
      videoTexture.needsUpdate = true;
      uniforms.time.value = performance.now() / 1e4
      // console.log(uniforms.time.value)
    }
	}
  renderer.render( scene, camera );
}

// Filter One Function
$('#camFiltOne').click(function(){
  $('#je').css("visibility","hidden");
  console.log("filt1")
  console.log(material.fragmentShader)
  material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('blackhole').textContent
  } );
  material.extensions.derivatives = true;
  scene.remove(mesh)
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

// Filter Two Function
$('#camFiltTwo').click(function(){
  $('#je').css("visibility","hidden");
  console.log("filt2")
  console.log(material.fragmentShader)
  material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('invert').textContent
  } );
  material.extensions.derivatives = true;
  scene.remove(mesh)
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

// Filter Three Function
$('#camFiltThree').click(function(){
  $('#je').css("visibility","hidden");
  console.log("filt3")
  console.log(material.fragmentShader)
  material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('colors').textContent
  } );
  material.extensions.derivatives = true;
  scene.remove(mesh)
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

// Switch to Snapchat function
$('#camFiltSnap').click(function(){
    // code here
    // this code should SWAP OUT or HIDE the THREE.js webcam
    // and SWAP IN the FEELIZ facetracking along with the
    // extra face tracking stuff
  $('#canvas').css("visibility","hidden");
  $('#je').css("visibility","visible");
  console.log("snapchat")
});