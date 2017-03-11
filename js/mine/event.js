
var initEvent		= function()
{
	var main		= this;
	
	this.drawObj	= null;
	this.moveObj	= null;
	this.routerObj	= null;
	
	this.init		= function(drawObj)
	{
		this.drawObj	= drawObj;
		this.eventFloor();
		this.eventLeft();
		this.initShowMore();
		this.sliderEvent();
		this.eventRoute();
	};
	
	this.eventRoute	= function()
	{
		$("#new_route").click(function()
		{
			$("#router_mode").toggle();
			
			if(main.routerObj)
				return;

			main.routerObj = new cRouter();
			main.routerObj.init(main.drawObj.stage);
			main.routerObj.addInitRoutes(); 
		});
		
		$("#c_route").click(function()
		{
			main.routerObj.resetAll();
			main.routerObj.routerMode = 1;
			main.routerObj.addInitRoutes();
			
			$("#c_route").attr("class","sel");
			$("#c_hazard").attr("class","");
		});
		
		$("#c_hazard").click(function()
		{
			main.routerObj.resetAll();
			main.routerObj.initHarzard();
			main.routerObj.routerMode = 2;
			
			$("#c_route").attr("class","");
			$("#c_hazard").attr("class","sel");
		});
		
		$("#canvas_area").mouseup(function(){ main.routerObj.drawRoute = 0; });
	}
	
	this.eventFloor	= function()
	{
		$(".lvl_area").droppable({
			drop : function(event, ui)
			{
				var currPos		= ui.position;
				var parePos		= $("#canvas_area").position();
				var mTop		= $("#left_area").css('margin-top').replace("px","") * 1;
				var canvTop		= currPos.top - parePos.top + mTop;
				var canvLeft	= currPos.left - parePos.left;
						
				switch(main.moveObj.attr("info"))
				{
					case '1':
						main.drawObj.newSquareFloor(canvLeft,canvTop,canvLeft + 350,canvTop + 150);
					break;
					case '2':
						main.drawObj.newLPlaneFloor(canvLeft,canvTop,canvLeft + 350,canvTop + 150);
					break;
					case '5':
						main.drawObj.layer = new Kinetic.Layer({name: "floor"});
						main.drawObj.stage.add(main.drawObj.layer);
						main.drawObj.newWall(canvLeft,canvTop,canvLeft + 50,canvTop,canvLeft + 50, canvTop - main.drawObj.lineWidth,canvLeft,canvTop - main.drawObj.lineWidth);
					break;
					case '12':
						main.drawObj.addObject(canvLeft,canvTop,"img/menu-lightStrip.png",40,40,'device',null,12);
					break;
					case '13':
						main.drawObj.addObject(canvLeft,canvTop,"img/menu-masterCtrler.png",40,40,'device',null,13);
					break;
					case '14':
						main.drawObj.addObject(canvLeft,canvTop,"img/menu-nodeCtrler.png",40,40,'device',null,14);
					break;
					case '15':
						main.drawObj.addObject(canvLeft,canvTop,"img/menu-camera.png",40,40,'device',null,15);
					break;
					case '16':
						main.drawObj.addObject(canvLeft,canvTop,"img/menu-ceilingLight.png",40,40,'device',null,16);
					break;
					case '17':
						main.drawObj.addObject(canvLeft,canvTop,"img/menu-nodeCtrler.png",40,40,'route',null,17);
					break;
					case '18':
						main.drawObj.addRoute(canvLeft,canvTop);
					break;
				}
			}
		});
		
		$(".category").find("li").draggable({
			helper	: "clone",
			start	: function(){main.moveObj = $(this);},
			stop	: function(ui,event)
			{
				var left	= ui.originalEvent.clientX - $("#canvas_area").position().left;
				var top		= ui.originalEvent.clientY - $("#canvas_area").position().top;
				var obj		= main.drawObj.stage.getIntersections([left,top]);
				var objType	= $(this).attr("info");
				var layerIn	= 0;

				if(obj.length > 0)
				{
					obj[0].setStroke("#FF0000");
					obj[0].getLayer().draw();

					if((objType == 3) || (objType == 4))
						main.drawObj.layer = obj[0].getLayer();
					else
					{
						layerIn = obj[0].getLayer().attrs.index;
						
						for(var i = 0; i < obj[0].getStage().get(".itemLayer").length; i ++)
						{
							if(obj[0].getStage().get(".itemLayer")[i].attrs.index == layerIn)
							{
								main.drawObj.layer = obj[0].getStage().get(".itemLayer")[i];
								break;
							}
						}
					}
					
					switch (objType)
					{
						case "3" :
							main.drawObj.addonSquare(obj[0],{x : left, y : top},obj[0].attrs.points[0],obj[0].attrs.points[1]);
						break;
						
						case "4" :
							main.drawObj.addonRound(obj[0],{x : left, y : top},obj[0].attrs.points[0],obj[0].attrs.points[1]);
						break;
						
						case "6" :
							main.drawObj.addObject(left,top,"img/window.png",40,40,'door_window',obj[0].attrs.points[0],obj[0].attrs.points[1],obj[0],6);
						break;
						
						case "7" :
							main.drawObj.addObject(left,top,"img/door.png",40,40,'door_window',obj[0].attrs.points[0],obj[0].attrs.points[1],obj[0],7);
						break;
						
						case "8" :
							main.drawObj.addObject(left,top,"img/doordouble.png",40,40,'door_window',obj[0].attrs.points[0],obj[0].attrs.points[1],obj[0],8);
						break;
						
						case "9" :
							main.drawObj.addObject(left,top,"img/door-sliding.png",40,40,'door_window',obj[0].attrs.points[0],obj[0].attrs.points[1],obj[0],9);
						break;
						
						case "10" :
							main.drawObj.addObject(left,top,"img/doordouble-sliding.png",40,40,'door_window',obj[0].attrs.points[0],obj[0].attrs.points[1],obj[0],10);
						break;
						
						case "11" :
							main.drawObj.addObject(left,top,"img/closet-doors.png",40,40,'door_window',obj[0].attrs.points[0],obj[0].attrs.points[1],obj[0],11);
						break;
					}
				}
			},
			drag	: function(event,ui)
			{
				
			}
		});
	};
	
	this.eventLeft	= function()
	{
		var TimerT = 0;
		var TimerB = 0;
		
		$("#move_controlT").mouseover(function()
		{
			TimerT = setInterval(function()
					{
						var mTop = $("#left_area").css("margin-top").replace("px","") * 1 + 10;
						$("#left_area").css("margin-top",mTop + "px");
						main.initShowMore();
					},50);
		});
		
		$("#move_controlB").mouseover(function()
		{
			TimerB = setInterval(function()
					{
						var mTop = $("#left_area").css("margin-top").replace("px","") * 1 - 10;
						$("#left_area").css("margin-top",mTop + "px");
						main.initShowMore();
					},50);
		});
		
		$("#move_controlT").mouseout(function(){clearInterval(TimerT);});
		$("#move_controlB").mouseout(function(){clearInterval(TimerB);});
	};
	
	this.initShowMore	= function()
	{
		var tHeight	= $(window).height() - 40;
		var lHeight = $("#left_area").height();
		var mTop	= $("#left_area").css("margin-top").replace("px","") * 1;
		var tTop	= $(window).height() - 29;

		if(lHeight + mTop > tHeight)
		{
			$("#move_controlB").css("top",tTop + "px");
			$("#move_controlB").css("display","block");
		}
		else
		{
			$("#move_controlB").trigger("mouseout");
			$("#move_controlB").css("display","none");
		}
		
		if(mTop < 0)
			$("#move_controlT").css("display","block");
		else
		{
			$("#move_controlT").trigger("mouseout");
			$("#move_controlT").css("display","none");
		}
	};
	
	this.sliderEvent	= function()
	{
		$("#left_slider").click(function()
		{
			if($("#left_area").css("left").replace("px","") == 0)
				$("#left_area,#move_controlT,#move_controlB").animate({left:-245});
			else
				$("#left_area,#move_controlT,#move_controlB").animate({left:0});
		});
		
		$("#right_slider").click(function()
		{
			if($("#right_area").css("right").replace("px","") == 0)
				$("#right_area").animate({right:-245});
			else
				$("#right_area").animate({right:0});
		});
	}
}