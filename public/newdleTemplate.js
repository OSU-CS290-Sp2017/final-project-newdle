(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['newdle'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <article class=\"newdle\">\r\n    <div class=\"newdle-content\">\r\n      <p class=\"newdle-text\">\r\n		"
    + alias4(((helper = (helper = helpers.day || (depth0 != null ? depth0.day : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"day","hash":{},"data":data}) : helper)))
    + "\r\n		"
    + alias4(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data}) : helper)))
    + "\r\n      </p>\r\n      <p class=\"newdle-attribution\">\r\n		\r\n        <a href=\"#\">"
    + alias4(((helper = (helper = helpers.openings || (depth0 != null ? depth0.openings : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"openings","hash":{},"data":data}) : helper)))
    + " openings</a>\r\n      </p>\r\n    </div>\r\n  </article>\r\n\r\n";
},"useData":true});
})();