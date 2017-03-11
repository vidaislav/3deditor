function anchor_update(group, activeAnchor)
{
	var mode = 0;
	
	switch (activeAnchor.getName())
	{
		case "left":
			mode = 1;
		break;
		case "right":
			mode = 2;
		break;
	}
	
	group.get(".wall");
}

function addAnchor(group, x, y, name,obj_type)
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
		anchor_update(group, this);
		layer.draw();
	});
	
	anchor.on("mousedown touchstart", function()
	{
		this.moveToTop();
	});
	
	anchor.on("dragend", function()
	{
		layer.draw();
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