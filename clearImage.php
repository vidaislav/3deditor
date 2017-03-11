<?php
	$file_name = explode(",",$_REQUEST['name']);

	for($i = 0; $i < count($file_name); $i ++)
	{
		if($file_name[$i] != "")
			unlink($file_name[$i]);
	}
?>