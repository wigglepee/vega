var dl = require('datalib'),
    Model = require('../core/Model'), 
    View = require('../core/View'), 
    parseBg = require('../parse/background'),
    parsePadding = require('../parse/padding'),
    parseMarks = require('../parse/marks'),
    parseSignals = require('../parse/signals'),
    parsePredicates = require('../parse/predicates'),
    parseData = require('../parse/data'),
    parseInteractors = require('../parse/interactors');

function parseSpec(spec, callback, viewFactory) {
  // protect against subsequent spec modification
  spec = dl.duplicate(spec);

  viewFactory = viewFactory || View.factory;

  var width = spec.width || 500,
      height = spec.height || 500,
      viewport = spec.viewport || null,
      model = new Model();

  parseInteractors(model, spec, function() {
    model.defs({
      width: width,
      height: height,
      viewport: viewport,
      background: parseBg(spec.background),
      padding: parsePadding(spec.padding),
      signals: parseSignals(model, spec.signals),
      predicates: parsePredicates(model, spec.predicates),
      marks: parseMarks(model, spec, width, height),
      data: parseData(model, spec.data, function() { callback(viewFactory(model)); })
    });
  });
}

module.exports = parseSpec;
parseSpec.schema = {
  "defs": {
    "spec": {
      "title": "Vega visualization specification",
      "type": "object",

      "allOf": [{"$ref": "#/defs/container"}, {
        "properties": {
          "data": {
            "type": "array",
            "items": {"$ref": "#/defs/data"}
          },
          "signals": {
            "type": "array",
            "items": {"$ref": "#/defs/signal"}
          }
        }
      }]
    }
  }
};