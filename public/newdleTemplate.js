(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['newdle'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <article class=\"newdle\">\n    <div class=\"newdle-content\">\n      <p class=\"newdle-text\">\n		"
    + alias4(((helper = (helper = helpers.day || (depth0 != null ? depth0.day : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"day","hash":{},"data":data}) : helper)))
    + "\n		"
    + alias4(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data}) : helper)))
    + "\n      </p>\n      <p class=\"newdle-attribution\">\n		\n        <a id=\"openings-count\" href=\"#\">"
    + alias4(((helper = (helper = helpers.openings || (depth0 != null ? depth0.openings : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"openings","hash":{},"data":data}) : helper)))
    + " openings</a>\n      </p>\n    </div>\n  </article>\n\n";
},"useData":true});
})();