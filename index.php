<?php
require dirname(dirname(__DIR__)) . '/inc/php/session.php';
foreach ($_GET as $k=>$v){ $$k = preg_replace('/\W/', '', $v); }

//load the configuration for this object
if (!$config = $_SESSION[$_GET['project']]['objects'][$_GET['object']]['config']['default']['mapwizard'])
{
	exit('proper configuration for this object is missing!');
}

?>
<!DOCTYPE html>
<html>
<title>Map Wizard</title>
<script src="js/OpenLayers.js"></script>
<script src="js/helper.js"></script>
<script src="js/functions.js"></script>
<link rel="stylesheet" href="theme/default/style.css" type="text/css">
<style>
.smallmap {
	width: 99%;
	height: 500px;
	border: 1px solid #ccc;
}

</style>

</head>

<body>
	

<div id="header">

</div>
<div id="map" class="smallmap"></div>

<script type="text/javascript">
	
	var map, layer, ppath = '../../../projects/<?php echo $_GET['project']?>/';
	
	// eg {"lon":{"type":"osm","targets":{"latitude":"lat","longitude":"lon"},"default_to":{"lat":48,"lon":7.5,"zoom":16}}}
	var object_config = <?php echo json_encode($config)?>,
		parent_field = parent.targetFieldId.substr(6),
		config = object_config[parent_field];
	if (!config)
	{
		alert('no configuration for the field-name "'+parent_field+'" detected');
	}
	else
	{
		init(config.type, config, true)
	}
	
</script>
</body>
</html>
