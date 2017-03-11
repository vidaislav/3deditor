<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>HTML5 Game Map Builder</title>
<link rel="stylesheet" type="text/css" href="style/style.css" />
<link rel="stylesheet" type="text/css" href="style/jquery-ui.css" />
</head>

<script type="text/javascript" src="js/library/jquery.min.js"></script>
<script type="text/javascript" src="js/library/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/library/kinetic-v4.3.3.min.js"></script>

<script type="text/javascript" src="js/mine/2dmodel.js"></script>
<script type="text/javascript" src="js/mine/main.js"></script>
<script type="text/javascript" src="js/mine/event.js"></script>
<script type="text/javascript" src="js/mine/router.js"></script>

<script type="text/javascript" src="js/library/Three.js"></script>
<script type="text/javascript" src="js/mine/3dmodel.js"></script>

<body>
	<div id="top_area">
        <p id="mode_3d" class="unsel_mode"> 3D </p>
        <p id="mode_2d" class="sel_mode"> 2D </p>
    </div>
    
    <div id="area_2d">
        <div id="size_slider">
            <img src="img/zoom-out.png" id="slider_dec"/>
            <div id="slider_body"></div>
            <img src="img/zoom-in.png"  id="slider_inc"/>
        </div>
        
        <div id="router_mode">
        	<p id="c_route" class="sel">Create Route</p>
            <p id="c_hazard">Create Hazard</p>
        </div>
        
        <div id="canvas_area"></div>
        
        <div id="left_area">
            <div id="left_slider"></div>
            <h2>Construction</h2>
            
            <div class="category" id="floorArea">
                <h3>Floor</h3>
                <ul>
                    <li info='1'>
                        <img src="img/menu-sqplan.png" />
                        <p>Square</p>
                    </li>
                    <li info='2'>
                        <img src="img/menu-Lplan.png" />
                        <p>Lplane</p>
                    </li>
                    <li info='3'>
                        <img src="img/menu-addon-sq.png" />
                        <p>Addon Square</p>
                    </li>
                    <li info='4'>
                        <img src="img/menu-addon-round.png" />
                        <p>Addon Round</p>
                    </li>
                    <li info='5'>
                        <img src="img/menu-wall.png" />
                        <p>Addon Single Wall</p>
                    </li>
                </ul>
                <div class="clear_both"></div>
            </div>
            <div class="category" id="doorArea">
                <h3>Doors & Windows</h3>
                <ul>
                    <li info='6'>
                        <img src="img/window.png" />
                        <p>Window</p>
                    </li>
                    <li info='7'>
                        <img src="img/door.png" />
                        <p>Door</p>
                    </li>
                    <li info='8'>
                        <img src="img/doordouble.png" />
                        <p>Double Door</p>
                    </li>
                    <li info='9'>
                        <img src="img/door-sliding.png" />
                        <p>Sliding Door</p>
                    </li>
                    <li info='10'>
                        <img src="img/doordouble-sliding.png" />
                        <p>Double Sliding Door</p>
                    </li>
                    <li info='11'>
                        <img src="img/closet-doors.png"/>
                        <p>Closet Doors</p>
                    </li>
                </ul>
                <div class="clear_both"></div>
            </div>
            <div class="category" id="deviceArea">
                <h3>Devices</h3>
                <ul>
                    <li info='12'>
                        <img src="img/menu-lightStrip.png" />
                        <p>Light Strip</p>
                    </li>
                    <li info='13'>
                        <img src="img/menu-masterCtrler.png" />
                        <p>Master Controller</p>
                    </li>
                    <li info='14'>
                        <img src="img/menu-nodeCtrler.png" />
                        <p>Noce Controller</p>
                    </li>
                    <li info='15'>
                        <img src="img/menu-camera.png" />
                        <p>Camera</p>
                    </li>
                    <li info='16'>
                        <img src="img/menu-ceilingLight.png" />
                        <p>Celling Light</p>
                    </li>
                </ul>
                <div class="clear_both"></div>
            </div>
            <div class="category" id="deviceArea">
                <h3>Route</h3>
                <a href="#" id="new_route">Add new Route</a>
                <ul>
                    <li info='17'>
                        <img src="img/menu-nodeCtrler.png" />
                        <p>Point</p>
                    </li>
                    <li info='18'>
                        <img src="img/menu-line.png" />
                        <p>Line</p>
                    </li>
                </ul>
                <div class="clear_both"></div>
            </div>
        </div>
        
        <div id="right_area">
            <div id="right_slider"></div>
            <h3>Levels</h3>
            <a href="#" class="add_level">+</a>
            <ul id="level_list">
                <li>First Level</li>
            </ul>
        </div>
        <div id="move_controlT"><center><img src="img/icon-arrow-down.png" /></center></div>
   		<div id="move_controlB"><center><img src="img/icon-arrow-projectlist.png" /></center></div>
	</div>
    
    <div id="area_3d"></div>
</body>