/*jslint indent:4*/
/*global define, L, window*/

define([], function () {

    var CANVAS_SUPPORTED = !!window.HTMLCanvasElement;
    var heatmapLayer = null;

    if (CANVAS_SUPPORTED) {

        var SCALE_CLOSURE = 5;
        var SCALE_SPEED_LIMIT = 1;

        // Let's just load it once for now
        var dataLoaded = null;

        var heatValueFromRow = function (row) {
            var total = 0;

            if (row.a_to_b_is_closed) {
                total += SCALE_CLOSURE;
            }
            if (row.a_to_b_speed_limit) {
                total += SCALE_SPEED_LIMIT;
            }
            if (row.b_to_a_is_closed) {
                total += SCALE_CLOSURE;
            }
            if (row.b_to_a_speed_limit) {
                total += SCALE_SPEED_LIMIT;
            }

            return total;
        };

        heatmapLayer = L.TileLayer.heatMap({
            urlBase: 'http://staging.api.tmpforchch.co.nz/v3/lanerestrictions',
            urlParams: {
                key: 'openhack',
                // nearby: '-43.241886,173.285909',
                // distance: '10',
                starts_at: '2013-12-07T12:00:00Z',
                ends_at: '2013-12-08T12:00:00Z',
                has_restrictions: '1',
                limit: '2000',
                format: 'geojson'
            },
            shouldLoad: function () {
                return dataLoaded === null;
            },
            onLoad: function (layer, layerData) {
                // As an example I am processing the geojson data by converting the restrictions
                //  to a number value and showing that value as a heatmap point for each closure.
                var dataArray = [];
                var max = 0;
                var i;
                var j;
                for (i = layerData.features.length - 1; i >= 0; i--) {
                    var row = layerData.features[i];
                    var val = heatValueFromRow(row.properties);
                    if (val > max) {
                        max = val;
                    }
                    for (j = row.geometry.coordinates.length - 1; j >= 0; j--) {
                        dataArray.push({
                            "lon": row.geometry.coordinates[j][0],
                            "lat": row.geometry.coordinates[j][1],
                            "val": val
                        });
                    }
                }
                // Now scale the values to between 0 and 1
                if (max > 0) {
                    for (i = dataArray.length - 1; i >= 0; i--) {
                        dataArray[i].val = dataArray[i].val / max;
                    }
                }
                dataLoaded = dataArray;
                layer.setData(dataArray);
            },
            radius: {
                value: 15,
                absolute: false
            },
            opacity: 0.9,
            gradient: {
                1.0: '#FF0000',
                0.5: '#FF6600',
                0.1: '#FFCC00'
            }
        });
    }

    return heatmapLayer;
});