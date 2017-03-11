var c3DStage		= function()
{
	var main			= this;
	
	this.json			= "";
	
	this.scene			= null;
	this.camera			= null;
	this.light			= null;
	this.renderer		= null;
	this.WebGLSupported	= 0;
	
	this.plane			= null;
	this.planeWidth		= 100;
	this.planeHeight	= 100;

	this.walls			= null;
	this.wallHeight		= 10;
	this.wallThickness	= 1;
	this.wallGroup		= null;

	this.startView		= 0;
	this.startX			= 0;
	
	this.init	= function()
	{
		main.WebGLSupported	= main.isWebGLSupported();
		main.renderer		= main.WebGLSupported ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		main.renderer.setSize( window.innerWidth, 600 );
		
		document.getElementById("area_3d").appendChild( main.renderer.domElement );
		
		main.scene			= new THREE.Scene();
		main.group			= new THREE.Object3D();
		
		main.scene.addChild(main.group);		
		main.moveEvent();
		main.initCamera();
		main.initLight();
		main.create3DPlane();
	}

	this.moveEvent		= function()
	{
		$("#area_3d").children("canvas").mousedown(function(event)
		{
			main.startView	= 1;
			main.startX		= event.clientX;
		});

		$("#area_3d").children("canvas").mouseup(function()
		{
			main.startView = 0;
		});

		$("#area_3d").children("canvas").mousemove(function(event)
		{
			if(!main.startView)
				return;

			var move_x = main.startX - event.clientX;
			var angle = 15 * (Math.PI / 180);

			if(move_x < 0)
				angle = angle * (-1);
			
			main.group.rotation.z =  angle + main.group.rotation.z;
			main.renderer.render( main.scene, main.camera );
		});
	}
	
	this.initCamera		= function()
	{
		main.camera			= new THREE.Camera(
												  35,                       // Field of view
												  window.innerWidth / 600,  // Aspect ratio
												  .1,                       // Near plane distance
												  10000                     // Far plane distance
											  );
		main.camera.position.set( 0,-80, 50 ); // 0, -80, 50
	}
	
	this.initLight		= function()
	{
		var ambientLight = new THREE.AmbientLight( 0xbbbbbb );
		
		main.light	= new THREE.PointLight( 0xffffff, .5 );
  		main.light.position.set( 10, 10, 10 );
		main.scene.addLight( main.light );
		main.scene.addLight( ambientLight );
	}
	
	this.create3DPlane	= function()
	{
		main.plane = new THREE.Mesh(new THREE.PlaneGeometry(main.planeWidth, main.planeHeight), new THREE.MeshBasicMaterial({
          color: 0x937046
        }));
		
        main.plane.overdraw = true;
        main.group.addChild(main.plane);
	}
	
	this.create3DWall	= function(x,y,width,angle,material1)
	{
		var materialClass = main.WebGLSupported ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;
		var mtl_other	= new materialClass( { color: 0x989177} );
		var mtl_front	= null;
		var mtl_back	= null;

		if(material1 == "")
		{
			mtl_front	= new materialClass( { color: 0xe8e1c7 } );
			mtl_back	= new materialClass( { color: 0xe8e1c7 } );
		}
		else
		{
			mtl_front	= new materialClass( { color: 0xe8e1c7, map: THREE.ImageUtils.loadTexture( material1 )  } );
			mtl_back	= new materialClass( { color: 0xe8e1c7, map: THREE.ImageUtils.loadTexture( material1 )  } );
		}

		var materials = [
			mtl_other,          // Left side
			mtl_other,          // Right side
			mtl_front,			// Top side	
			mtl_back,			// Bottom side
			mtl_other,          // Front side
			mtl_other           // Back side
		];
		
		var wall =  new THREE.Mesh( new THREE.CubeGeometry( width, main.wallThickness, main.wallHeight, 0, 0, 0, materials ), new THREE.MeshFaceMaterial() );

		wall.position.x = x - 20;
		wall.position.y = y;
		wall.position.z = main.wallHeight  / 2;
		wall.rotation.z = angle;

		wall.overdraw	= true;
		
		main.group.addChild( wall );
		
		if(material1 == "")
			main.renderer.render( main.scene, main.camera );
		else
		{
			var textureImg1 = new Image();

			textureImg1.onload = function()
			{
				main.renderer.render( main.scene, main.camera );
			};
			textureImg1.src = material1;
		}
	}
	
	this.resetWalls	= function()
	{
		for( var i = 0; i < main.scene.objects.length; i++)
		{
			main.scene.removeObject(main.scene.objects[i]);
		}
	}	
	
	this.isWebGLSupported	= function()
	{
		var cvs = document.createElement('canvas');
		var contextNames = ["webgl","experimental-webgl","moz-webgl","webkit-3d"];
		var ctx;
		
		if ( navigator.userAgent.indexOf("MSIE") >= 0 )
		{
			try
			{
				ctx = WebGLHelper.CreateGLContext(cvs, 'canvas');
			}
			catch(e) {}
		}
		else
		{
			for ( var i = 0; i < contextNames.length; i++ )
			{
				try
				{
					ctx = cvs.getContext(contextNames[i]);
					
					if ( ctx ) break;
				}
				catch(e){}
			}
		}
		
		if ( ctx ) return true;
		
		return false;
	}

}