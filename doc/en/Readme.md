# Map Editor

## About

This Wizard lets you manage geographical Data via a Map-Interface. It provides a draggable Marker to easily inspect and define the Location of your Entry.

In Addition to a normal Outdoor-Map (Map-Data provided by Openstreetmap) it is possible to Use a scanned Picture as a Indoor-Map[^1]. This is usefull if you want to manage Facilities.

[^1]: to use a Picture as a Map within this Wizard you have to "zoomify" it. Tools for this task can be downloaded at <http://zoomify.com> (Win) or at <http://sourceforge.net/projects/zoomifyimage> (Mac/Linux).

## Setup/Example

In this Example two Map-Wizards are bound to the Fields "lon" and "y" while we need a Sibling-Field per Coordinate (a Coordinate has to be described with *two* Fields).

* lat
* lon <= Button to activate a Street-Map Wizard
* ...
* x
* y   <= Button to activate a Indoor Wizard

Activation in the respective Fields

	wizard:map
	external:true

Object-Configuration for the default-Template


	{
	  "default": {
	    "mapwizard": {
	      "lon": {
		"type": "osm",
		"targets": {
		  "latitude": "lat",
		  "longitude": "lon"
		},
		"default_to": {
		  "lat": 47.123,
		  "lon": 7.899,
		  "zoom": 16
		}
	      },
	      "y": {
		"type": "pic",
		"src": "office_maps/first_floor",
		"width": 2481,
		"height": 3509,
		"targets": {
		  "x": "x",
		  "y": "y"
		},
		"default_to": {
		  "x": 1200,
		  "y": 1500,
		  "zoom": 1
		}
	      }
	    }
	  }
	}


The **Street-Map** has the Type "osm". The Parameter "targets" defines where to lookup/save the Data in the main Window (Fieldnames). The Parameter "default_to" defines the what to show if no (valid) Coordinates are given.


The **Indoor-Map** has the Type "pic" and needs a "src"-Parameter pointing to the Folder where the Zoomify-Map is located (relative to the Project-Folder)[^2]. Additionally we need to define the original "width" and "height" of the Map-Image (whitch can be found in ImageProperties.xml within your Zoomify-Folder). The Parameter "default_to" is optional here. If omitted the Marker will be placed per default at the Center of the Map.


[^2]: Alternatively to "src" it is possible to define a "src_field" containing a Field-Name in the Parent-Window where the Folder-Path can be defined individually per Entry. If this Field is defined as a (String-)Selectbox one can easily point to the right Map. Think of it a a "Floor-Selector"...

