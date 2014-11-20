<?php
$config = <<<EOD
{
	"info":  {
		"name": "Map-Editor",
		"description": {
			"en": "Edit/Set Coordinates via a Map",
			"de": "Edit/Set Coordinates via a Map"
		},
		"io":  [
			"lat/lon or x/y",
			"lat/lon or x/y"
		],
		"authors":  ["Christoph Taubmann"],
		"homepage": "http://cms-kit.org",
		"mail": "info@cms-kit.org",
		"copyright": "",
		"credits":  [
			""
		]
	},
	"system":  {
		"version": 0.3,
		"inputs":  [
			"INTEGER",
			"FLOAT"
		],
		"dependencies":  {
			"system":  {
				"package_manager"  : 0
			}
		},
		"include":  ["wizard:map\\nexternal:true"],
		"translations":  [
			"en",
			"de"
		]
	}
}
EOD;
?>
