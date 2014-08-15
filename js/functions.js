

function Lon2Merc(lon) {
	return 20037508.34 * lon / 180;
}
function Lat2Merc(lat) {
	var PI = 3.14159265358979323846;
	lat = Math.log(Math.tan( (90 + lat) * PI / 360)) / (PI / 180);
	return 20037508.34 * lat / 180;
}

var Conv = ({
	r_major:6378137.0,//Equatorial Radius, WGS84
	r_minor:6356752.314245179,//defined as constant
	f:298.257223563,//1/f=(a-b)/a , a=r_major, b=r_minor
	
	deg2rad:function(d)
	{
		var r=d*(Math.PI/180.0);
		return r;
	},
	
	rad2deg:function(r)
	{
		var d=r/(Math.PI/180.0);
		return d;
	},
	
	ll2m:function(lon,lat) //lat lon to mercator
	{
		//lat, lon in rad
		var x=this.r_major * this.deg2rad(lon);
 
		if (lat > 89.5) lat = 89.5;
		if (lat < -89.5) lat = -89.5;
 
 
		var temp = this.r_minor / this.r_major;
		var es = 1.0 - (temp * temp);
		var eccent = Math.sqrt(es);
 
		var phi = this.deg2rad(lat);
 
		var sinphi = Math.sin(phi);
 
		var con = eccent * sinphi;
		var com = .5 * eccent;
		var con2 = Math.pow((1.0-con)/(1.0+con), com);
		var ts = Math.tan(.5 * (Math.PI*0.5 - phi))/con2;
		var y = 0 - this.r_major * Math.log(ts);
		var ret={'x':x,'y':y};
		return ret;
	},
	
	m2ll:function(x,y) //mercator to lat lon
	{
		var lon=this.rad2deg((x/this.r_major));
 
		var temp = this.r_minor / this.r_major;
		var e = Math.sqrt(1.0 - (temp * temp));
		var lat=this.rad2deg(this.pj_phi2( Math.exp( 0-(y/this.r_major)), e));
 
		var ret={'lon':lon,'lat':lat};
		return ret;
	},
	
	pj_phi2:function(ts, e) 
	{
		var N_ITER=15;
		var HALFPI=Math.PI/2;
 
 
		var TOL=0.0000000001;
		var eccnth, Phi, con, dphi;
		var i;
		var eccnth = .5 * e;
		Phi = HALFPI - 2. * Math.atan (ts);
		i = N_ITER;
		do 
		{
			con = e * Math.sin (Phi);
			dphi = HALFPI - 2. * Math.atan (ts * Math.pow((1. - con) / (1. + con), eccnth)) - Phi;
			Phi += dphi;
 
		} 
		while ( Math.abs(dphi)>TOL && --i);
		return Phi;
	}
});// Conf END

/**
 * 
 * 
 * type osm/pic
 * conf the configuration-object
 * wizard_mode wors as a wizard or as template?
 * 
 */
function init (type, conf, wizard_mode)
{
	
	// convert between mercator and latlon
	
	
	// create a general vector-layer for the markers see http://www.openlayers.org/dev/examples/marker-shadow.html
	var layer = new OpenLayers.Layer.Vector(
		'Marker',
		{
			styleMap: new OpenLayers.StyleMap({
				// Set the external graphic and background graphic images.
				externalGraphic: "img/marker-gold.png",
				backgroundGraphic: "img/marker_shadow.png",

				// Makes sure the background graphic is placed correctly relative to the external graphic.
				backgroundXOffset: 0,
				backgroundYOffset: -7,

				// Set the z-indexes of both graphics to make sure the background
				// graphics stay in the background (shadows on top of markers looks
				// odd; let's not do that).
				graphicZIndex: 11,
				backgroundGraphicZIndex: 10,

				pointRadius: 10
			}),
			rendererOptions: {yOrdering: true}
		}
	);
	
	switch (type)
	{
		case 'osm':
			
			// create a layer for the osm-map
			var options = {
				projection: new OpenLayers.Projection('EPSG:900913'),
				//projection: new OpenLayers.Projection('EPSG:4326'),
				displayProjection: new OpenLayers.Projection('EPSG:4326'),
				units: 'm',
				maxResolution: 156543.0339,
				numZoomLevels: 19,
				minZoomLevel: 5,
				maxZoomLevel: 19,
				maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
			};
			map = new OpenLayers.Map('map', options);
			
			// add the both layers to the map
			map.addLayers([new OpenLayers.Layer.OSM(), layer]);
			
			
			// check for values in parent window
			var x = parseFloat(parent.$('#input_'+conf.targets.longitude).val()),
				y = parseFloat(parent.$('#input_'+conf.targets.latitude).val());
			
			// default to configuration-values if nothing valid detected
			if ((isNaN(x) || x==0) || (isNaN(y) || y==0))
			{
				x = conf.default_to.lon;
				y = conf.default_to.lat;
			}
			
			// set the center of the map
			var mercator = Conv.ll2m(x, y);//output mercator.x, mercator.y
			//var lonlat = new OpenLayers.LonLat( mercator.x, mercator.y );
			var lonlat = new OpenLayers.LonLat( Lon2Merc(x), Lat2Merc(y) );
			map.setCenter(lonlat, conf.default_to.zoom);
			
			// activate dragging and register a on-end-handler
			var controls = {
				drag: new OpenLayers.Control.DragFeature(
					layer, 
					{
						'onComplete': onCompleteMoveLL
					}
				)
			}
			map.addControl(controls['drag']);
			controls['drag'].activate();
            
            // add a point inside the marker-layer at the center of the map
            layer.removeFeatures(layer.features);
			layer.addFeatures([
				new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat))
			]);
			
		break;// osm END
		
		case 'pic':
			var zoomify_width = conf.width,
				zoomify_height = conf.height,
				zoomify_url = ppath + (conf.src_field 
								? (wizard_mode
									? parent.$('#input_'+conf.src_field).val() 
									: document.getElementById('src_field').value
								  )
								: conf.src) + '/';
			
			var zoomify = new OpenLayers.Layer.Zoomify("Zoomify", zoomify_url, new OpenLayers.Size( zoomify_width, zoomify_height ) );
		  	/* Map with raster coordinates (pixels) from Zoomify image */
	        var options = {
	            maxExtent: new OpenLayers.Bounds(0, 0, zoomify_width, zoomify_height),
	            maxResolution: Math.pow(2, zoomify.numberOfTiers-1 ),
	            numZoomLevels: zoomify.numberOfTiers,
	            units: 'pixels'
	        };

	        map = new OpenLayers.Map("map", options);
	        map.addLayers([zoomify, layer]);
			
            map.setBaseLayer(zoomify);
	        map.zoomToMaxExtent();
	        
	        // activate dragging and register a on-end-handler
			var controls = {
				drag: new OpenLayers.Control.DragFeature(layer, {'onComplete': onCompleteMoveXY} )
			}
			map.addControl(controls['drag']);
			controls['drag'].activate();
			
			// check for values in parent window
			var x = parseInt(parent.$('#input_'+conf.targets.x).val()),
				y = parseInt(parent.$('#input_'+conf.targets.y).val());
				
			// default to configuration-values or the center if nothing valid detected
			if ((isNaN(x) || x==0) || (isNaN(y) || y==0))
			{
				x = conf.default_to ? conf.default_to.x : zoomify_width/2;
				y = conf.default_to ? conf.default_to.y : zoomify_height/2;
			}
	        
	        // add a point inside the marker-layer at the center of the map
            layer.removeFeatures(layer.features);
			layer.addFeatures([
				new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x, y))
			]);
		  	
		break;// zoomify END
	}// switch END
}// init END
