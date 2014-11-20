
function getMarkerLL()
{
	
}

function onCompleteMoveLL (feature)
{
	if (feature)
	{
		var sproj = new OpenLayers.Projection("EPSG:900913"),
			tproj = new OpenLayers.Projection("EPSG:4326"),
			geometry = feature.geometry.clone();
		geometry.transform(sproj, tproj);
		parent.$('#input_'+config.targets.longitude).val(geometry.x);
		parent.$('#input_'+config.targets.latitude).val(geometry.y);
		parent.message('new coordinates transferred');
	}
}



function getMarkerXY()
{
	
}

function onCompleteMoveXY (feature)
{
	if (feature)
	{
		parent.$('#input_'+config.targets.x).val(feature.geometry.x);
		parent.$('#input_'+config.targets.y).val(feature.geometry.y);
		parent.message('new coordinates transferred');
	}
}
