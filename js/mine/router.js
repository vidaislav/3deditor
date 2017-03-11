
var cRouter			= function()
{
	var main		= this;
	
	main.stage		= null;
	main.prevPos	= null;
	main.nextPosArr	= null;
	main.rLayer		= null;
	main.cPosArr	= null;
	main.drawRoute	= 0;
	main.routerMode	= 1;	// 1 : Create Route, 2 : Create Hazard
	
	main.init	= function(stage)
	{
		main.stage	= stage;
	}
	
	// add init routes
	main.addInitRoutes	= function()
	{
		var startX	= 100, startY = 250;
		var route	= null;
		
		main.cPosArr	= new Array();

		if(main.rLayer)
			return;

		main.rLayer		= new Kinetic.Layer({name: "routeLayer"});
		main.nextPosArr = new Array();
		main.stage.add(main.rLayer);

		for(var i = 0; i < 23; i ++)
			main.cPosArr.push({"x" : startX + i * 25, "y" : startY});
		
		for(var i = 0; i < 18; i ++)
		{
			if( i == 7) continue;
			main.cPosArr.push({"x" : startX + 10 * 25, "y" : startY - 7  * 25 + i * 25});
		}
		
		for(var i = 0; i < 3; i ++)
			main.cPosArr.push({"x" : startX + 11 * 25 + i * 25, "y" : startY + 5  * 25});
		
		for(var i = 0; i < 14; i ++)
		{
			if( i == 3) continue;
			main.cPosArr.push({"x" : startX + 20 * 25, "y" : startY - 3  * 25 + i * 25});
		}
		
		for(var i = 0; i < main.cPosArr.length; i++)
		{
			route = new Kinetic.Circle(
			{
				id			: i,
				radius		: 6,
				strokeWidth	: 1,
				x			: main.cPosArr[i].x,
				y			: main.cPosArr[i].y,
				name		: "point",
				fill		: "white",
				stroke		: "black",
				class		: "ready",	// ready : ready for select, preview : preview mode, select : selected mode
				draggable	: false
			});
			
			route.on('mouseover', function()
			{
				if(!main.drawRoute) return;
				
				if(main.routerMode == 2)
				{
					if(this.attrs.class == "select")
					{
						main.clearSelect(this);
						return;
					}
					else
					{
						this.attrs.class= "select";
						this.attrs.fill = "red";
						this.getLayer().draw();
						
						main.showHarzLine(this,main.prevPos);
						main.prevPos = this;
					}
				}
				else
				{
					main.removePreview();
					
					if(this.attrs.class == "select")
					{
						main.clearSelect(this);
						return;
					}
					
					if(main.isAvailDraw(this))
						main.draw_arrow(this, main.prevPos,"real");
						
					this.attrs.fill = "green";
					this.getLayer().draw();
						
					main.showAvailArrow(this);
					main.prevPos = this;
					main.prevPos.attrs.class = "select";	// change current point to select mode
				}
			});
			
			route.on('mousedown', function()
			{
				main.drawRoute	= 1;
				main.prevPos	= this;

				if(main.routerMode == 2)
				{
					if(this.attrs.class == "select")
					{
						main.clearSelect(this);
						return;
					}
					else
					{
						this.attrs.class= "select";
						this.attrs.fill = "red";
						this.getLayer().draw();
					}
				}
				else
				{
					if(this.attrs.class == "select")
					{
						main.clearSelect(this);
						return;
					}
					
					main.showAvailArrow(this);
					
					this.attrs.class= "select";
					this.attrs.fill = "green";
					
					this.getLayer().draw();
				}
			});
			
			main.rLayer.add(route);
		}

		startX = startX - 12;
		startY = startY - 12;

		var outLine = new Kinetic.Line(
		{
			points		: [startX, startY, startX + 25 * 10, startY, startX + 25 * 10, startY - 25 * 7, startX + 25 * 11, startY - 25 * 7,
						   startX + 25 * 11, startY, startX + 25 * 20, startY, startX + 25 * 20, startY - 25 * 3, startX + 25 * 21, startY - 25 * 3,
						   startX + 25 * 21, startY, startX + 25 * 23, startY, startX + 25 * 23, startY + 25 * 1, startX + 25 * 21, startY + 25 * 1,
						   startX + 25 * 21, startY + 25 * 11, startX + 25 * 20, startY + 25 * 11,startX + 25 * 20, startY + 25 * 1,
						   startX + 25 * 11, startY + 25 * 1 , startX + 25 * 11, startY + 25 * 5, startX + 25 * 14, startY + 25 * 5,
						   startX + 25 * 14, startY + 25 * 6 , startX + 25 * 11, startY + 25 * 6, startX + 25 * 11, startY + 25 * 11,
						   startX + 25 * 10, startY + 25 * 11, startX + 25 * 10, startY + 25 * 1, startX, startY + 25, startX, startY],
			strokeWidth	: 1,
			stroke		: "black",
			lineCap		: 'round',
        	lineJoin	: 'round'
		});
		
		main.rLayer.add(outLine);
		main.rLayer.draw();
	}
	
	main.initHarzard	= function()
	{
		main.addInitRoutes();

		for( var i = 1; i < main.cPosArr.length; i ++)
		{
			if(i == 23) continue;
			if(i == 40) continue;
			if(i == 43) continue;
			
			var dot_line = new Kinetic.Line(
			{
				points		: [main.cPosArr[i - 1].x, main.cPosArr[i - 1].y, main.cPosArr[i].x, main.cPosArr[i].y],
				strokeWidth	: 1,
				stroke		: "black",
				dashArray	: [2,2]
			});
			
			main.rLayer.add(dot_line);
		}
		
		main.rLayer.draw();
	}
	
	// draw arrow between point to point, mode : preview -> preview mode, mode : draw -> draw mode
	main.draw_arrow	= function(currPos,prevPos,mode)
	{
		var sx		= prevPos.attrs.x;
		var sy		= prevPos.attrs.y;
		var ex		= currPos.attrs.x;
		var ey		= currPos.attrs.y;
		var di		= 1;
		var color	= "#599c3b";
		var dash	= [];
		
		if(mode == "preview")
		{
			color	= "#267f00";
			dash	= [1,1];
		}

		if(currPos.attrs.y == prevPos.attrs.y)
		{
			if(currPos.attrs.x < prevPos.attrs.x) di = -1;
		
			sx = sx + di * 5;
			ex = ex - di * 5;
			
			var arrow	= new Kinetic.Line(
			{
				id			: currPos.attrs.id,
				name		: mode,		// arrow mode : preview ? or real
				points		: [sx,sy,ex,ey,ex - di * 5, ey - 3, ex,ey, ex - di * 5, ey + 3],
				strokeWidth	: 1,
				stroke		: color,
				dashArray	: dash
			});
			
			main.rLayer.add(arrow);
			main.rLayer.draw();
		}
		else if(currPos.attrs.x == prevPos.attrs.x)
		{
			if(currPos.attrs.y < prevPos.attrs.y) di = -1;
		
			sy = sy + di * 5;
			ey = ey - di * 5;
			
			var arrow	= new Kinetic.Line(
			{
				id			: currPos.attrs.id,
				name		: mode,		// arrow mode : preview ? or real
				points		: [sx, sy ,ex, ey, ex - 3, ey - di * 5, ex,ey, ex + 3, ey - di * 5],
				strokeWidth	: 1,
				stroke		: color,
				dashArray	: dash
			});
			
			main.rLayer.add(arrow);
			main.rLayer.draw();
		}
	}
	
	// remove all previewd arrow
	main.removePreview	= function()
	{
		for (var i = 0; i < main.rLayer.get(".preview").length; i ++)
		{
			main.rLayer.remove(main.rLayer.get(".preview")[i]);
		}
		
		for (var i = 0; i < main.rLayer.get(".point").length; i ++)
		{
			if(main.rLayer.get(".point")[i].attrs.class == "preview")
			{
				main.rLayer.get(".point")[i].attrs.class	= "ready";
				main.rLayer.get(".point")[i].attrs.fill		= "white";
			}
		}

		main.rLayer.draw();
	}
	
	main.showHarzLine	= function(currPos,prevPos)
	{
		var line	= new Kinetic.Line(
		{
			id			: currPos.attrs.id,
			name		: "real",		// arrow mode : preview ? or real
			points		: [currPos.attrs.x,currPos.attrs.y,prevPos.attrs.x,prevPos.attrs.y],
			strokeWidth	: 1,
			stroke		: "red"
		});
		
		main.rLayer.add(line);
		main.rLayer.draw();
	}
	
	// show all possible next arrows
	main.showAvailArrow	= function(pos)
	{
		var posArr = main.rLayer.get(".point");
		main.nextPosArr = [];

		for(var i = 0; i < posArr.length; i ++)
		{
			if(Math.abs(posArr[i].attrs.x - pos.attrs.x) + Math.abs(posArr[i].attrs.y - pos.attrs.y) == 25)
			{
				if(posArr[i].attrs.class == "select")
					continue;

				main.nextPosArr.push(posArr[i]);
				main.draw_arrow(posArr[i],pos,"preview");

				posArr[i].attrs.fill	= "#4dff00";
				posArr[i].attrs.class	= "preview";
			}
		}
		
		main.rLayer.draw();
	}
	
	// return selected
	main.clearSelect	= function(pos)
	{
		pos.attrs.class	= "ready";
		pos.attrs.fill	= "white";

		for(var i = 0; i < main.rLayer.get(".real").length; i ++)
		{
			if(main.rLayer.get(".real")[i].attrs.id == pos.attrs.id)
				main.rLayer.remove(main.rLayer.get(".real")[i]);
		}
		
		main.rLayer.draw();
	}
	
	// check avail draw or not
	main.isAvailDraw	= function(pos)
	{
		for(var i = 0; i < main.nextPosArr.length; i ++)
		{
			if(main.nextPosArr[i].attrs.id == pos.attrs.id)
				return 1;
		}
		
		return 0;
	}
	
	main.resetAll		= function()
	{
		main.rLayer.removeChildren();
		main.rLayer.draw();
		main.stage.remove(main.rLayer);
		main.rLayer = null;
	}
}