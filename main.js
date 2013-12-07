/*jslint indent:4*/
/*global $, require, L, window*/

require([
    'tmp-lines',
    'tmp-heatmap'
], function (tmpLayer, tmpheatmap) {

    var map = L.map('map').setView([-43.527, 172.64], 13);
    var googleTiles = new L.Google();
    var osmTiles = new L.TileLayer('http://{s}.tile.cloudmade.com/884b2cab686b4b29950f2b8a151ceced/106694/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    });
    osmTiles.addTo(map);


    var tileLayers = {
        'Street Map': osmTiles,
        'Satellite': googleTiles
    };
    var dataLayers = {
        'Restrictions': tmpLayer
    };

    if (tmpheatmap !== null) {
        dataLayers['Restrictions Heatmap'] = tmpheatmap;
    }


    //Called when an item in the layer control box is ticked
    map.on('overlayadd', function (leafletEvent) {
        if (leafletEvent.layer.options.shouldLoad()) {
            // Load the data
            $.get(leafletEvent.layer.options.urlBase, leafletEvent.layer.options.urlParams)
                .done(function (layerData, statusString, jqXHR) {
                    leafletEvent.layer.options.onLoad(leafletEvent.layer, layerData);
                })
                .fail(function (jqXHR) {
                    window.alert('Failed to load data. Status code: ' + jqXHR.status);
                });
        }
    });

    L.control.layers(tileLayers, dataLayers, {collapsed: false, autoZIndex: true}).addTo(map);

});
