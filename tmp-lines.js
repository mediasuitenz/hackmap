/*jslint indent:4*/
/*global define, L*/

define([], function () {

    // Let's just load it once for now
    var dataLoaded = null;

    return new L.GeoJSON(null, {
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
        shouldLoad: function () {
            return dataLoaded === null;
        },
        onLoad: function (layer, layerData) {
            // Optionally process the data here
            dataLoaded = layerData;
            layer.addData(layerData);
        },
        style: function (feature) {
            // Optionally return styling based on point data
            var color = '#00FF00';
            if (feature.properties.a_to_b_is_closed || feature.properties.b_to_a_is_closed) {
                color = '#FF0000';
            } else if (feature.properties.a_to_b_speed_limit || feature.properties.b_to_a_speed_limit) {
                color = '#FFCC00';
            }
            return {color: color};
        }
        // Optionally return a specific marker type with pointToLayer: function (feature, latlng) {
    });
});