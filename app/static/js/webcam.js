navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

window.URL = window.URL || window.webkitURL;

let container, camera, scene, renderer, webcam;
let texture, uniforms, geometry, mesh, materials;
let videoImage, videoImageContext, videoTexture;

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

//*********************************************************************************************

var CVD; //return of Canvas2DDisplay
var flag;


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
      console.log("found face");

      if(flag=="think" && detectState.detected > 0.6)
    {
      var faceCoo = CVD.getCoordinates(detectState);
        console.log("face is at",faceCoo.x,faceCoo.y);
        var think = new Image();
        think.Ing = this;
        think.src = document.getElementById("thinkfilter").src;
            think.onerror = function(error) {console.log("Image failed!",error);};
            think.onload=function()
            {
                   console.log("drawing image at ",faceCoo.x,faceCoo.y);
                CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                CVD.ctx.drawImage(think,faceCoo.x,faceCoo.y,faceCoo.w,faceCoo.h);
            }
            CVD.update_canvasTexture();  
    }

     else if (flag=="doggy" && detectState.detected > 0.6) 
     {
        console.log("found face");
        // tuple which contains the coordinates on the canvas of the face detected
        var faceCoo = CVD.getCoordinates(detectState);
        console.log("face is at",faceCoo.x,faceCoo.y);
        // intialize all the image objects
         var img=new Image();
         img.Ing = this;
         img.src = document.getElementById("nose").src;
         var img2=new Image();
         img2.Ing = this;
         img2.src = document.getElementById("rear").src;
         var img3=new Image();
         img3.Ing = this;
         img3.src = document.getElementById("lear").src;
         var img4=new Image();
         img4.Ing = this;
         img4.src = document.getElementById("tongue").src;
            img.onerror = function(error) {console.log("Image failed!",error);};

            /*
                repetitive function for each piece of the doggy filter
                waits for the image to load then draws the piece onto the canvas where the face was detected
                uses simple math to locate general areas where each piece should be placed
            */
            img.onload=function()
            {
                   console.log("drawing nose at ",faceCoo.x,faceCoo.y);
                CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                // CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
                // function reduces the size of the nose image (last two args), places noses dead center of rectangle of the face detection
                CVD.ctx.drawImage(img,faceCoo.x+(((faceCoo.w)/2)/2),faceCoo.y-faceCoo.h/4,(faceCoo.w)/2,faceCoo.h);
              
            }
          
             img2.onload=function()
            {
                   console.log("drawing rear at ",faceCoo.x,faceCoo.y);
                //CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                //CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
                CVD.ctx.drawImage(img2,faceCoo.x,faceCoo.y+(3*faceCoo.h/4),(faceCoo.w)/3,(faceCoo.h)/2);
            }

               img3.onload=function()
            {
                   console.log("drawing lear at ",faceCoo.x,faceCoo.y);
                //CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                 //CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
                CVD.ctx.drawImage(img3,faceCoo.x+(3*faceCoo.w/4),faceCoo.y+(3*faceCoo.h/4),(faceCoo.w)/3,(faceCoo.h)/2);
            }

               img4.onload=function()
            {
                
                if(detectState.expressions[0]>0.5)
                {
                  console.log("mouth open");
                  CVD.ctx.drawImage(img4,faceCoo.x+(((faceCoo.w)/2)/2),faceCoo.y-1.05*faceCoo.h,(faceCoo.w)/2,faceCoo.h);
                }
            }
            CVD.update_canvasTexture();
      }


      else if (flag=="crown" && detectState.detected > 0.6) 
      {
        console.log("found face");
        // tuple which contains the coordinates on the canvas of the face detected
        var faceCoo = CVD.getCoordinates(detectState);
        console.log("face is at",faceCoo.x,faceCoo.y);
        // intialize all the image objects
        var crown = new Image();
        crown.Ing = this;
        crown.src = document.getElementById("rose").src;

            crown.onload=function()
            {
                   console.log("drawing nose at ",faceCoo.x,faceCoo.y);
                CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                 CVD.ctx.drawImage(crown,faceCoo.x,(faceCoo.y+(faceCoo.h/3)),faceCoo.w,faceCoo.h);   
            }
        }

         else if (flag=="shades" && detectState.detected > 0.6) 
      {
        console.log("found face");
        // tuple which contains the coordinates on the canvas of the face detected
        var faceCoo = CVD.getCoordinates(detectState);
        console.log("face is at",faceCoo.x,faceCoo.y);
        // intialize all the image objects
        var shades = new Image();
        shades.Ing = this;
        shades.src = document.getElementById("shades").src;

            shades.onload=function()
            {
                CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                 CVD.ctx.drawImage(shades,faceCoo.x,(faceCoo.y+faceCoo.h)/2,faceCoo.w,faceCoo.h/2);
              
            }
        }

    else
    {
         var text = new Image();
        text.Ing = this;
        text.src = document.getElementById("text").src
          text.onload=function()
            {
                
                CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height); 
                 //CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
                CVD.ctx.drawImage(text,((CVD.canvas.width)-((CVD.canvas.width)/2))/2,CVD.canvas.height/2,CVD.canvas.width/2,CVD.canvas.height/2);
             
            }
           
    }
    
    CVD.draw();
  } //end callbackTrack()
}); //end JEEFACEFILTERAPI.init call


//**************************************************************************************

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
  // console.log("filt1")
  // console.log(material.fragmentShader)
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
  // console.log("filt2")
  // console.log(material.fragmentShader)
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
  // console.log("filt3")
  // console.log(material.fragmentShader)
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
  flag="think";
  // console.log("snapchat")
});

$('#camFiltShades').click(function(){
    // code here
    // this code should SWAP OUT or HIDE the THREE.js webcam
    // and SWAP IN the FEELIZ facetracking along with the
    // extra face tracking stuff
  $('#canvas').css("visibility","hidden");
  $('#je').css("visibility","visible");
  flag="shades";
  // console.log("snapchat")
});


$('#camFiltDog').click(function(){
    // code here
    // this code should SWAP OUT or HIDE the THREE.js webcam
    // and SWAP IN the FEELIZ facetracking along with the
    // extra face tracking stuff
  $('#canvas').css("visibility","hidden");
  $('#je').css("visibility","visible");
  // console.log("snapchat")
  flag="doggy";
});


$('#camFiltCrown').click(function(){
    // code here
    // this code should SWAP OUT or HIDE the THREE.js webcam
    // and SWAP IN the FEELIZ facetracking along with the
    // extra face tracking stuff
  $('#canvas').css("visibility","hidden");
  $('#je').css("visibility","visible");
  // console.log("snapchat")
  flag="crown";
});