/*jslint indent:4*/
/*global $, document, L, window*/

$(document).on('ready', function () {

    var CANVAS_SUPPORTED = !!window.HTMLCanvasElement;

    var map = L.map('map').setView([-43.527, 172.64], 13);
    var googleTiles = new L.Google();
    var osmTiles = new L.TileLayer('http://{s}.tile.cloudmade.com/884b2cab686b4b29950f2b8a151ceced/106694/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    });
    osmTiles.addTo(map);


    var tmplayer = new L.GeoJSON(null, {
        urlBase: 'http://staging.api.tmpforchch.co.nz/v3/lanerestrictions',
        urlParams: {
            key: 'openhack',
            // You may want to limit this to a smaller number (or use nearby)
            limit: '2000',
            // nearby: '-43.241886,173.285909',
            // distance: '10',
            starts_at: '2013-12-07T12:00:00Z',
            ends_at: '2013-12-08T12:00:00Z',
            has_restrictions: '1',
            format: 'geojson'
        },
        onLoad: function (layer, layerData) {
            // Optionally process the data here
            layer.addData(layerData);
        },
        style: function (feature) {
            // Optionally return styling based on point data
            var color = 'green';
            if (feature.properties.a_to_b_is_closed || feature.properties.b_to_a_is_closed) {
                color = 'red';
            } else if (feature.properties.a_to_b_speed_limit || feature.properties.b_to_a_speed_limit) {
                color = 'yellow';
            }
            return {color: color};
        }
        // Optionally return a specific marker type with pointToLayer: function (feature, latlng) {
    });

    var tileLayers = {
        'Street Map': osmTiles,
        'Satellite': googleTiles
    };
    var dataLayers = {
        'Restrictions': tmplayer
    };


    //Called when an item in the layer control box is ticked
    map.on('overlayadd', function (leafletEvent) {
        // Load the data
        $.get(leafletEvent.layer.options.urlBase, leafletEvent.layer.options.urlParams)
            .done(function (layerData, statusString, jqXHR) {
                leafletEvent.layer.options.onLoad(leafletEvent.layer, layerData);
            })
            .fail(function (jqXHR) {
                window.alert('Failed to load data. Status code: ' + jqXHR.status);
            });
    });

    L.control.layers(tileLayers, dataLayers, {collapsed: false, autoZIndex: true}).addTo(map);

});
