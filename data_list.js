/* global $, URI */

'use strict';

var baseDataUrl = 'http://unsdi-dev.csiro.au/sissvoc/lid-fsdf/resourcelist?baseuri=http%3A%2F%2Fenvironment.data.gov.au%2Fwater%2Fid%2Fcatchment&item=100862&_lang=en&_format=json';

var baseUriParts = URI(baseDataUrl).query(true);
var primaryUrl = baseUriParts.baseuri + '/' + baseUriParts.item;
var viewUrl = primaryUrl.concat('?_view=');

function formatLinks(formats, linkUrl) {
  var links = [];

  function linkWithFormat(format, linkUrl) {
    var linkStyle = '<a href="{{url}}">{{name}}</a>';
    var url = linkUrl + '&_format=' + format;

    return linkStyle.replace('{{url}}', url).replace('{{name}}', format);
  }

  if (formats) {
    if (Array.isArray(formats)) {
      formats.forEach(function (format) {
        links.push(linkWithFormat(format.ldatoken, linkUrl));
      });
    } else {
      // Only one format
      links.push(linkWithFormat(formats.ldatoken, linkUrl));
    }
  }

  return links.join(' ');
}

function handleData(data) {
  var features;
  var featureList = $('ul#feature-list');

  features = data.result.primaryTopic.feature;
  features.forEach(function (feature) {
    var viewName,
        description,
        formats,
        listItem;

    viewName = feature.viewName;
    description = feature.label;
    formats = formatLinks(feature.hasFormat, viewUrl.concat(viewName));

    listItem = ['<li>', viewName, description, formats, '</li>'].join(' ');
    featureList.append(listItem);
  });
}

$.get(baseDataUrl).done(function (baseData) {
  handleData(baseData);
})
.fail(function (jqXHR) {
  window.alert('Failed to load data. Status code: ' + jqXHR.status);
});

