var c2DStage		= function()
{
	var main		= this;
	
	this.stage		= null;
	this.layer		= null;
	this.level		= 0;
	this.lineWidth	= 10;
	this.layerInd	= 0;
	
	// create new level
	this.newLevel	= function(width,height)
	{
		main.newDiv();
		
		main.stage	= new Kinetic.Stage({
			container	: "lvl_" + main.level,
			width		: width,
			height		: height,
			level		: main.level
		});
	};
	
	// create new div
	this.newDiv		= function()
	{
		var html	= "";
		
		main.level ++;
		html = "<div class='lvl_area' id='lvl_" + main.level + "'></div>";
		$("#canvas_area").append(html);
	}
	
	this.resizeCanvas	= function(scale)
	{
		var initObj		= new initEnv();
		var newWidth	= initObj.canvWidth * scale;
		var newHeight	= initObj.canvHeight * scale;

		$("#canvas_area").css("width",newWidth);
		$("#canvas_area").css("height",newHeight);
		
		$(".kineticjs-content").css("width",newWidth);
		$(".kineticjs-content").css("height",newHeight);

		main.stage.setSize(newWidth,newHeight);
		main.stage.setScale(scale);
		main.stage.draw();
		
		initObj.initCSS(newWidth,newHeight);
		
		delete initObj;
	}
	
	// create new square floor
	this.newSquareFloor	= function(x0,y0,x1,y1)
	{
		var pArr	= [];
		var oLayer	= null;
		
		oLayer		= new Kinetic.Layer({name: "itemLayer", index : main.layerInd});
		main.layer	= new Kinetic.Layer({name: "floor",		index : main.layerInd});
		
		main.stage.add(oLayer);
		main.stage.add(main.layer);
		
		pArr = [{x : x0, y : y0, d : 0},{x : x1, y : y0, d : 1},{x : x1, y : y1, d : 2},{x : x0, y : y1, d : 3}];
		main.newPolygon(pArr);
		
		main.layerInd ++;
	};
	
	//this.newLPalcneFloor
	this.newLPlaneFloor	= function(x0,y0,x1,y1)
	{
		var pArr 	= [];
		var oLayer	= null;
		var width	= Math.abs( x0 - x1 );
		var height	= Math.abs( y0 - y1 );
		
		oLayer		= new Kinetic.Layer({name: "itemLayer", index : main.layerInd});
		main.layer	= new Kinetic.Layer({name: "floor",		index : main.layerInd});
		
		main.stage.add(oLayer);
		main.stage.add(main.layer);
		
		pArr = [{x : x0, y : y0 ,d : 0},{x : x0 + width / 2, y : y0, d : 1},{x : x0 + width / 2, y : y0 + height / 2, d : 1},{x : x1, y : y0 + height / 2, d:1},{x : x1, y : y1, d : 2},{x : x0, y : y1, d : 3}];
		
		main.newPolygon(pArr);
		main.layerInd ++;
	}

	// create new rectangle
	this.newPolygon	= function(pArr)
	{
		var curr_pos	= null;
		var prev_pos	= null;
		var next_pos	= null;
		var pos1		= null;
		var pos2		= null;
		var direct		= 0;
//		var sArr		= main.simPosArr(pArr);

		for(var i = 0; i < pArr.length; i++)
		{
			curr_pos = pArr[i];
			prev_pos = pArr[(i + pArr.length - 1) % pArr.length];
			next_pos = pArr[(i + 1) % pArr.length];
			direct	 = pArr[i].d;

			pos1 = main.getOuterPos(curr_pos,prev_pos,next_pos,direct);

			curr_pos = pArr[(i + 1) % pArr.length];
			prev_pos = pArr[(i + pArr.length) % pArr.length];
			next_pos = pArr[(i + 2) % pArr.length];
			direct	 = pArr[(i + 1) % pArr.length].d;

			pos2 = main.getOuterPos(curr_pos,prev_pos,next_pos,direct);
			main.newWall(prev_pos.x, prev_pos.y, curr_pos.x, curr_pos.y, pos2.x, pos2.y, pos1.x, pos1.y,i,pArr[i].d);
		}

		main.addSubLine(pArr[0],pArr[1],pArr[2]);
	}
	
	// get outer x,y
	this.getOuterPos	= function(curr_pos,prev_pos,next_pos,direction)
	{
		var x		= 0,
			y		= 0;
		
		var angle1	= 0,
			angle2	= 0,
			angle3	= 0,
			angle4	= 0,
			dist	= 0;

		angle1 = Math.atan2(curr_pos.y - prev_pos.y, curr_pos.x - prev_pos.x);
		angle2 = Math.atan2(curr_pos.y - next_pos.y, curr_pos.x - next_pos.x);
		angle3 = (angle1 - angle2) * (180 / Math.PI);
		
		if(angle3 < 0)
			angle3 = 360 + angle3;
		
		if((271 > angle3) && (angle3 > 179))
			angle3 = angle3 * (-1);

		angle3 = (360 - angle3) / 2;
		angle4	= 180 - angle1 - angle3;
		
		dist	= main.lineWidth / Math.cos( (angle3 - 90) * Math.PI / 180 );

		switch(direction)
		{
			case 0:
				x	= curr_pos.x - Math.cos( angle4 * Math.PI / 180 ) * dist;
				y	= curr_pos.y - Math.sin( angle4 * Math.PI / 180 ) * dist;
			break;
			
			case 1:
				x	= curr_pos.x + Math.cos( angle4 * Math.PI / 180 ) * dist;
				y	= curr_pos.y - Math.sin( angle4 * Math.PI / 180 ) * dist;
			break;
			
			case 2:
				x	= curr_pos.x + Math.cos( angle4 * Math.PI / 180 ) * dist;
				y	= curr_pos.y + Math.sin( angle4 * Math.PI / 180 ) * dist;
			break;
			
			case 3:
				x	= curr_pos.x - Math.cos( angle4 * Math.PI / 180 ) * dist;
				y	= curr_pos.y + Math.sin( angle4 * Math.PI / 180 ) * dist;
			break;
		}
		
		return {x : x, y : y};
	}
	
	this.addRoute	= function(x,y)
	{
		var objLayer	= null;
		var objIndex	= main.layer.attrs.index;

		for(var i = 0; i < main.stage.get(".itemLayer").length; i ++)
		{
			if(main.stage.get(".itemLayer")[i].attrs.index == objIndex)
			{
				main.layer = main.stage.get(".itemLayer")[i];
				break;
			}
		}
		
		var group = new Kinetic.Group(
		{
			x: 0,
			y: 0,
			name		: "routeGroup",
			isSelect	: false
		});
		
		var line = new Kinetic.Line(
		{
			x		: 0,
			y		: 0,
			points	: [x,y,x + 50,y],
			fill 	: "#999999",
			stroke	: "#999999",
			opacity	: 0.5,
			name	: "route",
			strokeWidth : 5,
			draggable:true
		});
		
		line.on('mouseover', function()
		{
			document.body.style.cursor = "move";
			this.setStroke("#76c6e5");
			this.getLayer().draw();
		});

		line.on('mouseout', function()
		{
			document.body.style.cursor = "auto";
			
			if(this.getParent().isSelect)
				return;

			this.setStroke("#999999");
			this.getLayer().draw();
		});
		
		line.on('click', function()
		{
			main.deselectAll();
			main.layer = this.getLayer();
			
			this.getParent().moveToTop();
			this.getParent().get(".left")[0].show();
			this.getParent().get(".right")[0].show();
			this.getParent().isSelect = true;
			this.getLayer().draw();
		});
		
		main.layer.add(group);
		group.add(line);
		
		main.addAnchor(group,	x,			y, "left",		"route");
		main.addAnchor(group,	x + 50,		y,	"right",	"route");
		
		main.layer.draw();
	}
	
	this.addObject	= function(x,y,src,width,height,objName,lpos,rpos,appendOBJ,objType)
	{
		var imageObj	= new Image();
		var angle		= 0;
		var offset		= [width / 2, height / 2];
		var objLayer	= null;
		var objIndex	= main.layer.attrs.index;
		
		for(var i = 0; i < main.stage.get(".itemLayer").length; i ++)
		{
			if(main.stage.get(".itemLayer")[i].attrs.index == objIndex)
			{
				main.layer = main.stage.get(".itemLayer")[i];
				break;
			}
		}
		
		if(objName == "door_window")
		{
			angle	= main.interAngle(lpos,rpos) / Math.PI * 180 * (-1);
			offset	= [width / 2, height / 2];
		}

		imageObj.onload = function()
		{
			var image = new Kinetic.Image(
			{
				x			: x + width / 2,
				y			: y + height / 2,
				image		: imageObj,
				draggable	: true,
				width		: width,
				name 		: objName,
				type		: objType,
				height		: height,
				offset		: offset,
				rotationDeg	: angle,
				src			: src,
			/*	objIndex	: appendOBJ.attrs.orderIn, */
				isClicked	: 0
			});
			
			/* set event */
			image.on('mouseover', function() {
				
				document.body.style.cursor = "move";
				
				this.setStroke("#00f");//76c6e5
				this.setStrokeWidth(1);
				this.getLayer().draw();
			});
			
			image.on('click', function() {
				// getAbsolutePosition
				var imgPos	= this.getAbsolutePosition();
				var imgSize	= this.getSize();

				main.showRotateObj(imgPos.x, imgPos.y,this);
				
				this.setStroke("#00f");//
				this.setStrokeWidth(1);
				this.attrs.isClicked = 1;
				this.getLayer().draw();
				
				document.body.style.cursor = "move";
			});
			
			image.on('mouseout', function() {
				
				document.body.style.cursor = "auto";
				
				if(this.attrs.isClicked)
					return;
					
				this.setStroke("");
				this.setStrokeWidth(0);
				this.getLayer().draw();
			});
			
			if(appendOBJ)
			{
				appendOBJ.getParent().add(image);
				appendOBJ.getLayer().draw();
			}
			else
			{
				main.layer.add(image);
				main.layer.draw();
			}
		}
		
		imageObj.src = src;
	};
	
	// create new roate object
	this.showRotateObj	= function(x,y,moveObj)
	{
		var group	= null;
		var cPoint	= null;
		var mPoint	= null;
		var lineObj	= null;
		var imgObj	= new Image();
		
		if(main.layer.get(".roateGroup").length == 0)
		{
			group = new Kinetic.Group(
			{
				x			: x,
				y			: y,
				name		: "roateGroup",
				isSelect	: false
			});
			
			main.layer.add(group);
			
			cPoint = new Kinetic.Circle(
			{
				x			: 0,
				y			: 0,
				radius		: 3,
				fill		: "blue",
				stroke		: "blue",
				strokeWidth	: 1,
				draggable	: false
			});
			
			imgObj.onload = function()
			{
				var image = new Kinetic.Image(
				{
					x			: - 60,
					y			: - 13,
					image		: imgObj,
					draggable	: true,
					name		: "roateImg",
					moveObj		: moveObj,
					isClicked	: 0
				});
				
				/* set event */
				
				image.on('mouseover', function()
				{
					document.body.style.cursor = "pointer";
				});
				
				image.on('mouseout', function()
				{
					document.body.style.cursor = "normal";
				});
				
				image.on('dragmove', function() {
					var rDeg = Math.atan2(this.getPosition().y + 12,this.getPosition().x + 12);
					
					this.attrs.moveObj.setRotation(rDeg);
					this.getParent().get(".rotateLine")[0].setPoints([0,0,this.getPosition().x + 12,this.getPosition().y + 12]);
					this.getLayer().draw();
				});
				
				group.add(image);
				main.layer.draw();
			}
			imgObj.src = "img/rotate-symbol.png";
			
			lineObj =  new Kinetic.Line(
			{
				points		: [0,0,-60,0],
				stroke		: "#333",
				strokeWidth	: 1,
				name		: "rotateLine",
				dashArray	: [2, 2],
			});
			
			group.add(cPoint);
			group.add(lineObj);
			
			main.layer.draw();
		}
		else
		{
			main.layer.get(".roateGroup")[0].setPosition(x,y);
			main.layer.get(".roateGroup")[0].get(".roateImg")[0].setPosition(-60,-13);
			main.layer.get(".roateGroup")[0].get(".roateImg")[0].attrs.moveObj = moveObj;
			main.layer.get(".roateGroup")[0].get(".rotateLine")[0].setPoints([0,0,-60,0]);
			main.layer.draw();
		}
	}
	
	// create new all
	this.newWall	= function(x0,y0,x1,y1,x2,y2,x3,y3,index,direct)
	{
		var group	= null;
		var line	= null;
		var wall	= null;
		
		group = new Kinetic.Group(
		{
			x: 0,
			y: 0,
			name		: "wallGroup",
			isSelect	: false
		});
		
		wall = new Kinetic.Polygon(
		{
			points	: [x0,y0,x1,y1,x2,y2,x3,y3],
			fill 	: "#999999",
			stroke	: "#000000",
			opacity	: 0.6,
			name	: "wall",
			orderIn	: index,
			direct	: direct,
			strokeWidth : 1
		});
		
		wall.on('mouseover', function()
		{
			document.body.style.cursor = "move";
			this.setFill("#76c6e5");
			this.getLayer().draw();
		});

		wall.on('mouseout', function()
		{
			document.body.style.cursor = "auto";
			
			if(this.getParent().isSelect)
				return;

			this.setFill("#999999");
			this.getLayer().draw();
		});
		
		wall.on('click', function()
		{
			var lpos,rpos = null;
			
			main.deselectAll();
			main.layer = this.getLayer();
			
			this.getParent().moveToTop();
			this.getParent().get(".left")[0].show();
			this.getParent().get(".right")[0].show();
			this.getParent().isSelect = true;
			this.getLayer().draw();

			lpos = {x : this.getParent().get(".left")[0].attrs.x, y : this.getParent().get(".left")[0].attrs.y};
			rpos = {x : this.getParent().get(".right")[0].attrs.x, y : this.getParent().get(".right")[0].attrs.y};
			
			main.showDimention(lpos,rpos);
		});
		
		main.layer.add(group);
		group.add(wall);
		
		if(x0 > x3)
			x0 = x0 - main.lineWidth / 2;
		else if(x0 < x3)
			x0 = x0 + main.lineWidth / 2;
		if(x1 > x2)
			x1 = x1 - main.lineWidth / 2;
		else if(x1 < x2)
			x1 = x1 + main.lineWidth / 2;
			
		if(y0 > y3)
			y0 = y0 - main.lineWidth / 2;
		else if(y0 < y3)
			y0 = y0 + main.lineWidth / 2;
		if(y1 > y2)
			y1 = y1 - main.lineWidth / 2;
		else if(y1 < x2)
			y1 = y1 + main.lineWidth / 2;
			
		main.addAnchor(group,	x0,		y0, "left",		"wall");
		main.addAnchor(group,	x1,		y1,	"right",	"wall");
		
		main.layer.draw();
	};
	
	this.anchorUpdate	= function(group, activeAnchor)
	{
		var mode		= 0;
		var curr_ind	= group.get(".wall")[0].attrs.orderIn;
		var obj_num  	= group.getLayer().get(".wall").length;
		var link_ind 	= (curr_ind - 1 + obj_num) % obj_num;
		var posArr		= main.layer.get(".wall");
		var pArr		= [];
		var pos1X		= 0;
		var pos1Y		= 0;
		var pos2X		= 0;
		var pos2Y		= 0;

		switch (activeAnchor.getName())
		{
			case "left":
				pos1X	= posArr[link_ind].attrs.points[0].x;
				pos1Y	= posArr[link_ind].attrs.points[0].y;

				pos2X	= posArr[curr_ind].attrs.points[1].x;
				pos2Y	= posArr[curr_ind].attrs.points[1].y;

				pArr	= [pos1X,pos1Y,activeAnchor.attrs.x,activeAnchor.attrs.y,pos2X,pos2Y];
			break;
			case "right":
				link_ind= (curr_ind + 1 + obj_num) % obj_num;
				
				pos1X	= posArr[curr_ind].attrs.points[0].x;
				pos1Y	= posArr[curr_ind].attrs.points[0].y;
				
				pos2X	= posArr[link_ind].attrs.points[1].x;
				pos2Y	= posArr[link_ind].attrs.points[1].y;

				pArr	= [pos1X,pos1Y,activeAnchor.attrs.x,activeAnchor.attrs.y,pos2X,pos2Y];
			break;
		}

		main.layer.get(".subline")[0].show();
		main.layer.get(".subline")[0].setPoints(pArr);
		main.layer.draw();
	}
	
	this.updatePolygon	= function(group, activeAnchor)
	{
		var obj_num  	= group.getLayer().get(".wall").length;
		var curr_ind	= group.get(".wall")[0].attrs.orderIn;
		var next_ind 	= (curr_ind + 1 + obj_num) % obj_num;
		var posArr		= main.layer.get(".wall");
		var resultArr	= [];
		var tmpPos		= null;
		
		for(var i = 0; i < obj_num; i++)
		{
			tmpPos			= posArr[i].attrs.points[0];
			resultArr[i] 	= { x : tmpPos.x,	y : tmpPos.y,	d : posArr[i].attrs.direct};
		}
		
		switch (activeAnchor.getName())
		{
			case "left"	:
				resultArr[curr_ind] = { x : activeAnchor.attrs.x, y : activeAnchor.attrs.y, d : resultArr[curr_ind].d};
			break;
			
			case "right":
				resultArr[next_ind] = { x : activeAnchor.attrs.x, y : activeAnchor.attrs.y, d : resultArr[next_ind].d};
			break;
		}

		main.layer.removeChildren();
		main.newPolygon(resultArr);
		main.layer.draw();
	}
	
	this.addAnchor		= function(group, x, y, name,obj_type)
	{
		var stage = group.getStage();
		var layer = group.getLayer();
		
		var anchor = new Kinetic.Circle({
		  x				: x,
		  y				: y,
		  stroke		: "#666",
		  fill			: "#ddd",
		  strokeWidth	: 2,
		  radius		: 10,
		  name			: name,
		  draggable 	: true,
		  visible		: false
		});
		
		anchor.on("dragmove", function()
		{
			main.anchorUpdate(group, this);
		});
		
		anchor.on("mousedown touchstart", function()
		{
			this.moveToTop();
		});
		
		anchor.on("dragend", function()
		{
			main.updatePolygon(group,this);
		});
		
		// add hover styling
		anchor.on("mouseover", function()
		{
			document.body.style.cursor = "pointer";
			this.setStrokeWidth(3);
			this.getLayer().draw();
		});
		
		anchor.on("mouseout", function() {
		  document.body.style.cursor = "default";
		  this.setStrokeWidth(2);
		  this.getLayer().draw();
		});
		
		group.add(anchor);
	}

	//create pattern from  items
	this.createPattern	= function(wallGroupObj)
	{
		var leftPOS		= wallGroupObj.get(".left")[0];
		var rightPOS	= wallGroupObj.get(".right")[0];
		var wallWidth	= Math.sqrt(Math.pow(leftPOS.attrs.x - rightPOS.attrs.x,2) + Math.pow(leftPOS.attrs.y - rightPOS.attrs.y,2));
		var resultStr	= "";

		for(var i = 0; i < wallGroupObj.get(".door_window").length; i ++)
		{
			var itemObj	= wallGroupObj.get(".door_window")[i];
			var left	= Math.sqrt(Math.pow(leftPOS.attrs.x - itemObj.attrs.x,2) + Math.pow(leftPOS.attrs.y - itemObj.attrs.y,2));
			var right	= Math.sqrt(Math.pow(rightPOS.attrs.x - itemObj.attrs.x,2) + Math.pow(rightPOS.attrs.y - itemObj.attrs.y,2));

			resultStr	+= itemObj.attrs.type + ",";//"type:" + 
			resultStr	+= left + ",";				//"left:" + 
			resultStr	+= right + ";";				//"right:" + 
		}

		return resultStr;
	}
	
	this.addSubLine		= function(p1,p2,p3)
	{
		var line = new Kinetic.Line({
			points		: [p1.x,	p1.y,	p2.x,	p2.y,	p3.x,	p3.y],
			stroke		: "#999",
			strokeWidth	: 2,
			name		: "subline",
			dashArray	: [10, 10],
			draggable 	: true,
			visible		: false
		});
		
		main.layer.add(line);
		main.layer.draw();
	}
	
	this.interAngle		= function(lpos,rpos)
	{
		var height	= lpos.y - rpos.y;
		var width	= rpos.x - lpos.x;
		var angle	= Math.atan2(height,width);
		
		return angle;
	}
	
	this.getLDirection	= function(lpos,rpos)
	{
		var direct	= -1;
		
		if((lpos.x < rpos.x) && (lpos.y >= rpos.y))
			direct = 0;
			
		if((lpos.x <= rpos.x) && (lpos.y < rpos.y))
			direct = 1;
			
		if((lpos.x > rpos.x) && (lpos.y <= rpos.y))
			direct = 2;
			
		if((lpos.x >= rpos.x) && (lpos.y > rpos.y))
			direct = 3;

		return direct;
	}
	
	this.addonSquare	= function(obj,pos,lpos,rpos)
	{
		var height	= rpos.y - lpos.y;
		var width	= rpos.x - lpos.x;
		var rwidth	= Math.sqrt(Math.pow(height,2) + Math.pow(width,2));
		var addonR	= 50;
		
		var min1Pos	= null;
		var max1Pos	= null;
		var min2Pos	= null;
		var max2Pos	= null;
		var angle	= main.interAngle(lpos,rpos) / Math.PI * 180;
		
		var obj_num  	= main.layer.get(".wall").length;
		var curr_ind	= obj.attrs.orderIn;
		var posArr		= main.layer.get(".wall");
		var tmpPos		= null;
		var resultArr	= [];
		var rInd		= 0;
		
		var d1,d2;
		var tangle = (angle + 360) % 360;
		var xoffset,yoffset;

		if(((tangle >= 315) && (tangle < 360)) || ((tangle < 45) && (tangle >= 0)))
		{
			d1 = 0; d2 = 1;
		}
		
		if((tangle >= 45) && (tangle < 135))
		{
			d1 = 3; d2 = 0;
		}
		
		if((tangle >= 135) && (tangle < 225))
		{
			d1 = 2; d2 = 3;
		}
		
		if((tangle >= 225) && (tangle < 315))
		{
			d1 = 1; d2 = 2;
		}
		
		min1Pos	= { x : lpos.x + width / 4, 		y : lpos.y + height / 4, 		d : d1 };
		max1Pos	= { x : lpos.x + width / 4 * 3,		y : lpos.y + height / 4 * 3,	d : d2 };

		xoffset	= Math.sin(angle) * addonR;
		yoffset	= Math.cos(angle) * addonR;
		
		if((((angle + 360) % 360) == 90) || (((angle + 360) % 360) == 270))
			yoffset = 0;
			
		if((((angle + 360) % 360) == 0) || (((angle + 360) % 360) == 180))
			xoffset = 0;
			
		min2Pos	= { x : min1Pos.x - xoffset, y : min1Pos.y - yoffset,	d : d1};
		max2Pos	= { x : max1Pos.x - xoffset, y : max1Pos.y - yoffset,	d : d2};

		for(var i = 0; i < obj_num; i++)
		{
			tmpPos				= posArr[i].attrs.points[0];
			resultArr[rInd] 	= { x : tmpPos.x,	y : tmpPos.y,	d : posArr[i].attrs.direct};
			
			if(curr_ind == i)
			{
				resultArr[rInd + 1] = min1Pos;
				resultArr[rInd + 2] = min2Pos;
				resultArr[rInd + 3] = max2Pos;
				resultArr[rInd + 4] = max1Pos;
				
				rInd = rInd + 4;
			}
			
			rInd = rInd + 1;
		}

		main.layer.removeChildren();
		main.newPolygon(resultArr);
		main.layer.draw();
	}
	
	this.addonRound	= function(obj,pos,lpos,rpos)
	{
		var height	= rpos.y - lpos.y;
		var width	= rpos.x - lpos.x;
		var rwidth	= Math.sqrt(Math.pow(height,2) + Math.pow(width,2));
		var addonR	= 50;
		
		var min1Pos	= null;
		var max1Pos	= null;
		var min2Pos	= null;
		var max2Pos	= null;
		var angle	= main.interAngle(lpos,rpos) / Math.PI * 180;
		
		var obj_num  	= main.layer.get(".wall").length;
		var curr_ind	= obj.attrs.orderIn;
		var posArr		= main.layer.get(".wall");
		var tmpPos		= null;
		var resultArr	= [];
		var rInd		= 0;
		
		var d1,d2;
		var tangle = (angle + 360) % 360;
		var xoffset,yoffset;
		var xpadding = 0,ypadding = 0;

		if(((tangle >= 315) && (tangle < 360)) || ((tangle < 45) && (tangle >= 0)))
		{
			d1 = 0; d2 = 1;
			xpadding = 10;
		}
		
		if((tangle >= 45) && (tangle < 135))
		{
			d1 = 3; d2 = 0;
			ypadding = -10;
		}
		
		if((tangle >= 135) && (tangle < 225))
		{
			d1 = 2; d2 = 3;
			xpadding = -10;
		}
		
		if((tangle >= 225) && (tangle < 315))
		{
			d1 = 1; d2 = 2;
			ypadding = 10;
		}
		
		min1Pos	= { x : lpos.x + width / 4, 		y : lpos.y + height / 4, 		d : d1 };
		max1Pos	= { x : lpos.x + width / 4 * 3,		y : lpos.y + height / 4 * 3,	d : d2 };

		xoffset	= Math.sin(angle) * addonR;
		yoffset	= Math.cos(angle) * addonR;
		
		if((((angle + 360) % 360) == 90) || (((angle + 360) % 360) == 270))
			yoffset = 0;
			
		if((((angle + 360) % 360) == 0) || (((angle + 360) % 360) == 180))
			xoffset = 0;
			
		min2Pos	= { x : min1Pos.x - xoffset + xpadding, y : min1Pos.y - yoffset + ypadding,	d : d1};
		max2Pos	= { x : max1Pos.x - xoffset - xpadding, y : max1Pos.y - yoffset - ypadding,	d : d2};

		for(var i = 0; i < obj_num; i++)
		{
			tmpPos				= posArr[i].attrs.points[0];
			resultArr[rInd] 	= { x : tmpPos.x,	y : tmpPos.y,	d : posArr[i].attrs.direct};
			
			if(curr_ind == i)
			{
				resultArr[rInd + 1] = min1Pos;
				resultArr[rInd + 2] = min2Pos;
				resultArr[rInd + 3] = max2Pos;
				resultArr[rInd + 4] = max1Pos;
				
				rInd = rInd + 4;
			}
			
			rInd = rInd + 1;
		}

		main.layer.removeChildren();
		main.newPolygon(resultArr);
		main.layer.draw();
	}
	
	// display all dimentions
	this.showDimention	= function(pos1,pos2)
	{
		var width = Math.sqrt(Math.pow(pos1.x - pos2.x,2) + Math.pow(pos1.y - pos2.y,2));
		var angle = main.interAngle(pos1,pos2) / Math.PI * 180;
		
		var m1Pos = {};
		var m2Pos = {};
		
		var a		= 0;
		var b		= 0;
		
		var x1		= 0;
		var x2		= 0;
		
		var y1		= 0;
		var y2		= 0;
		
		var offsetY	= 20 * Math.sin((90 - angle) * Math.PI / 180);
		var offsetX	= 20 * Math.cos((90 - angle) * Math.PI / 180);
		
		var rate	= width / 30;
		var diff	= 0;

		pos1 = {x : pos1.x - offsetX, y : pos1.y - offsetY};
		pos2 = {x : pos2.x - offsetX, y : pos2.y - offsetY};
		
		if(pos1.x == pos2.x)
		{
			m1Pos	= {x : pos1.x, y : Math.min(pos1.y,pos2.y) + Math.abs(pos1.y - pos2.y) / 2 + 15 };
			m2Pos	= {x : pos1.x, y : Math.min(pos1.y,pos2.y) + Math.abs(pos1.y - pos2.y) / 2 - 15 };
			
			y1		= Math.max(pos1.y,pos2.y);
			y2		= Math.min(pos1.y,pos2.y);
		}
		else
		{
			a		= (pos1.y - pos2.y) / (pos1.x - pos2.x);
			b		= pos1.y - (a * pos1.x);

			diff	= Math.abs(pos1.x - pos2.x) / 2 -  Math.abs(pos1.x - pos2.x) / (rate * 2);
			
			x1		= Math.min(pos1.x,pos2.x) + diff;
			x2		= Math.max(pos1.x,pos2.x) - diff;

			y1		= Math.min(pos1.x, pos2.x) * a + b
			y2		= Math.max(pos1.x, pos2.x) * a + b
			
			m1Pos = {x : x1, y : x1 * a + b };
			m2Pos = {x : x2, y : x2 * a + b };
		}

		var line1 = new Kinetic.Line({
			points		: [Math.min(pos1.x, pos2.x), y1, m1Pos.x, m1Pos.y],
			stroke		: "#00F",
			strokeWidth	: 1,
			name		: "dimention_line",
			draggable 	: false
		});

		var line2 = new Kinetic.Line({
			points		: [Math.max(pos1.x, pos2.x), y2, m2Pos.x, m2Pos.y],
			stroke		: "#00F",
			strokeWidth	: 1,
			name		: "dimention_line",
			draggable 	: false
		});

		var path1 = new Kinetic.Path({
			x			: pos1.x - main.lineWidth + 10,
			y			: pos1.y - main.lineWidth / 2 + 5,
			name		: "dimention_line",
			data		: "M10 0 L0 5 L10 10 Z",
			fill		: "#00f",
			rotationDeg	: angle * (-1),
			offset		: [10,5]
        });
		
		var path2 = new Kinetic.Path({
			x			: pos2.x - main.lineWidth + 10,
			y			: pos2.y - main.lineWidth / 2 + 5,
			name		: "dimention_line",
			data		: "M0 0 L0 10 L10 5 Z",
			fill		: "#00f",
			rotationDeg	: angle * (-1),
			offset		: [10,5]
        });
		
		var label = new Kinetic.Text({
			x			: Math.min(pos1.x,pos2.x) + Math.abs((pos1.x - pos2.x) / 2) - 12,
			y			: Math.min(pos1.y,pos2.y) + Math.abs((pos1.y - pos2.y) / 2) - 12,
			text		: Math.round(width / 10) + "m",
			fontSize	: 11,
			fontFamily	: "Calibri",
			textFill	: "green",
			cornerRadius: 5,
			stroke		: '#555',
          	strokeWidth	: 1,
			padding		: 3
        });


		main.layer.add(line1);
		main.layer.add(line2);
		main.layer.add(path1);
		main.layer.add(path2);
		main.layer.add(label);

		main.layer.draw();
	}
	
	// deselect all
	this.deselectAll	= function()
	{
		var groups = main.stage.get(".wallGroup");
		
		for(var i = 0; i < groups.length; i ++)
		{
			if(groups[i].isSelect)
			{
				groups[i].isSelect = false;
				groups[i].get(".wall")[0].setFill("#999999");
				groups[i].get(".left")[0].hide();
				groups[i].get(".right")[0].hide();
			}
		}
	}
}