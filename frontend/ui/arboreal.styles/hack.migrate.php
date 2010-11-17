<?php

//	hack.migrate.php
//	Evadne Wu at Iridia, 2010

//	Expected arguments:

//	file		the file that is going to be transformed.
//			migrate will fail if the file lives outside the directory it lives in.

//	root		the variable to replace ##IRIDIA_MIGRATE_DOCUMENT_ROOT## in the file.
//			migrate will fail if this is unspecified.

//	This is strictly a CSS preprocessor.  Any other MIME types are not supported.

	if(empty($_GET["file"])) exit;
	$inFileURL = $_GET["file"];
	
	if(empty($_GET["root"])) exit;
	$inDocumentRoot = $_GET["root"];

	$fileToProcess = file_get_contents($inFileURL);
	
	
	header('Content-type: text/css');
	
	echo str_replace(array(
	
		"##IRIDIA_MIGRATE_DOCUMENT_ROOT##",
		"border-image: url(../arboreal.images/"
	
	), array(
	
		$inDocumentRoot,
		"border-image: url(" . $inDocumentRoot . "/ui/arboreal.images/"
	
	), $fileToProcess);
	
?>