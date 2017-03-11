
jQuery(document).ready(function(){
								
	var initObj		= new initEnv();
	var drawObj		= new c2DStage();
	var eventObj	= new initEvent();
	
	initObj.init(drawObj);
	eventObj.init(drawObj);
});

var initEnv			= function()
{
	var main		= this;
	
	this.drawObj	= null;	// 2d object
	this.sliderVal	= 20;
	this.canvHeight	= 600;
	this.canvWidth	= 800;
	this.env3D		= null;
	this.ptrnArr	= null;
	
	this.init		= function(drawObj)
	{
		this.drawObj	= drawObj;
		
		this.initCSS(this.canvWidth,this.canvHeight);
		this.initSlider();
		this.initLevel();
		this.initMode();
	};

	this.initCSS	= function(canvWidth,canvHeight)
	{
		var left		= ($(window).width() - canvWidth) / 2;
		var top 		= ($(window).height() - canvHeight) / 2;
		var sTop	 	= $(window).height() * 0.45;
		
		$("#canvas_area").css('left',left);
		$("#canvas_area").css('top',top);
		
		$("#left_slider").css('top', sTop + "px");
		
	};
	
	this.initMode	= function()
	{
		$("#mode_2d").click(function()
		{
			$("#area_2d").css("display","block");
			$("#area_3d").css("display","none");
			
			$("#mode_3d").attr("class","unsel_mode");
			$("#mode_2d").attr("class","sel_mode");

			main.hide3D();
		});
		
		$("#mode_3d").click(function()
		{
			$("#area_2d").css("display","none");
			$("#area_3d").css("display","block");

			$("#mode_3d").attr("class","sel_mode");
			$("#mode_2d").attr("class","unsel_mode");

			main.show3D();
		});
	}
	
	this.show3D		= function()
	{
		main.genPattern();
	}

	this.hide3D		= function()
	{
		var name = "";

		for (var i = 0; i < main.ptrnArr.length; i ++)
		{
			name += main.ptrnArr[i] + ",";
		}

		$.ajax(
		{
			type: "POST",
			url: "clearImage.php", 
			data: ({name : name}),
			cache: false,
			success: function(html)
			{
				
			}
		});
	}

	this.genPattern	= function()
	{
		var ajax_count = 0;

		main.ptrnArr = new Array();

		if(main.drawObj.layer.get(".left").length == 0)
		{
			for(var i = 0; i < main.drawObj.stage.get(".floor").length; i ++)
			{
				if(main.drawObj.stage.get(".floor")[i].attrs.index == main.drawObj.layer.attrs.index)
				{
					main.drawObj.layer = main.drawObj.stage.get(".floor")[i];
					break;
				}
			}
		}

		for(var i = 0; i < main.drawObj.layer.get(".left").length; i ++)
		{
			var objLen	= main.drawObj.layer.get(".left").length;
			var posObj	= main.drawObj.layer.get(".left")[i];
			var rPosObj	= main.drawObj.layer.get(".left")[(i + 1) % objLen];
			var angle	= main.drawObj.interAngle({x : posObj.attrs.x, y : posObj.attrs.y},{x : rPosObj.attrs.x, y : rPosObj.attrs.y});
			var width	= Math.sqrt(Math.pow(rPosObj.attrs.x - posObj.attrs.x,2) + Math.pow(rPosObj.attrs.y - posObj.attrs.y,2)) / 10;
			var x		= (main.drawObj.layer.get(".left")[0].attrs.x - (posObj.attrs.x + rPosObj.attrs.x) / 2) / 10 * (-1);
			var y		= (main.drawObj.layer.get(".left")[0].attrs.y - (posObj.attrs.y + rPosObj.attrs.y) / 2) / 10;
			var data	= main.drawObj.createPattern(posObj.getParent());

			$.ajax(
			{
				type: "POST",
				url: "pattern.php", 
				data: ({width:width, height:100,data:data,color:"e8e1c7", index : i }),
				cache: false,
				success: function(html)
				{
					var info_arr	= html.split(",");
					var info_ind	= info_arr[1];

					main.ptrnArr[info_ind]		= info_arr[0];
					ajax_count ++;

					if(ajax_count == main.drawObj.layer.get(".left").length)
						main.gen3Dwalls();
				}
			});
		}
	}

	this.gen3Dwalls	= function()
	{
		if(main.env3D)
			delete main.env3D;
			
		$("#area_3d").html("");
		
		main.env3D = new c3DStage();
		main.env3D.init();
		main.env3D.create3DPlane();
		
		for(var i = 0; i < main.drawObj.layer.get(".left").length; i ++)
		{
			var objLen	= main.drawObj.layer.get(".left").length;
			var posObj	= main.drawObj.layer.get(".left")[i];
			var rPosObj	= main.drawObj.layer.get(".left")[(i + 1) % objLen];
			var angle	= main.drawObj.interAngle({x : posObj.attrs.x, y : posObj.attrs.y},{x : rPosObj.attrs.x, y : rPosObj.attrs.y});
			var width	= Math.sqrt(Math.pow(rPosObj.attrs.x - posObj.attrs.x,2) + Math.pow(rPosObj.attrs.y - posObj.attrs.y,2)) / 10;
			var x		= (main.drawObj.layer.get(".left")[0].attrs.x - (posObj.attrs.x + rPosObj.attrs.x) / 2) / 10 * (-1);
			var y		= (main.drawObj.layer.get(".left")[0].attrs.y - (posObj.attrs.y + rPosObj.attrs.y) / 2) / 10;
			var data	= main.drawObj.createPattern(posObj.getParent());

			// main.env3D.create3DWall(x,y,width,angle,main.ptrnArr[i]);
		}
	}
	
	this.initLevel	= function()
	{
		var width	= $("#canvas_area").width(),
			height	= $("#canvas_area").height();

		this.drawObj.newLevel(width,height);
	};
	
	this.initSlider	= function()
	{
		main.sliderVal = 20;
		
		var slider = $("#slider_body").slider({
			min		: 1,
			max		: 100,
			value	: main.sliderVal,
			change	: function(event, ui)
			{
				var rate = ui.value / 20;
				
				main.sliderVal = ui.value;
				main.drawObj.resizeCanvas(rate);
			}
		});
		
		$("#slider_inc").click(function()
		{
			var new_val = main.sliderVal * 1 + 1;
			
			slider.slider("value",new_val);
		});
		
		$("#slider_dec").click(function()
		{
			var new_val = main.sliderVal * 1 - 1;
			
			slider.slider("value",new_val);
		});
	};
}