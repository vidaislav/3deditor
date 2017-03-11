<?php
	
	create_pattern();

	function create_pattern()
	{
		$width				= $_REQUEST['width'] * 10;						// wall width
		$height				= $_REQUEST['height'];							// wall height
		$data				= $_REQUEST['data'];							// parameter data
		$color				= rgb_to_arr($_REQUEST['color']);				// wall color
		$fImg				= imagecreate  ( $width, $height );	// front pattern image
		$fColor				= imagecolorallocate( $fImg,$color[0], $color[1], $color[2]);
		$itemArr			= explode(";",$data);
		$imgDIR				= "img/object/";
		$fFileName			= "img/pattern/f".time().$_REQUEST['index'].".png";

		if($_REQUEST['data'] == "")
		{
			echo ",".$_REQUEST['index'];
			return;
		}

		for($i = 0; $i < count($itemArr) - 1; $i++)
		{
			if($itemArr[$i] == "")
				continue;

			$para_arr	= explode(",",$itemArr[$i]);
			$img_src	= "";

			$top		= 20;
			$left		= $para_arr[1];

			switch($para_arr[0])
			{//image type
				case '6' :
					$img_src = "window.png";
				break;
				case '7' :
					$img_src = "door.png";
				break;
				case '8' :
					$img_src = "double_door.png";
				break;
				case '9' :
					$img_src = "sliding_door.png";
				break;
				case '10' :
					$img_src = "double_sliding.png";
				break;
				case '11' :
					$img_src = "closet_door.png";
				break;
			}

			$obj_img	= imagecreatefrompng($imgDIR.$img_src);
			list($width, $height, $type, $attr) = getimagesize($imgDIR.$img_src);

			imagecopymerge($fImg,$obj_img,$left,$top,0,0,$width,$height,100);
		}

		imagepng($fImg,$fFileName);

		echo $fFileName.",".$_REQUEST['index'];
	}

	function rgb_to_arr($hex)
	{
		$color_array[0] = hexdec(substr($hex,0,2));
		$color_array[1] = hexdec(substr($hex,2,2));
		$color_array[2] = hexdec(substr($hex,4,2));
		
		return $color_array;
	}
?>