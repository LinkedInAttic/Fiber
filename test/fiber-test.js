var assert = require('assert'),
    vows = require('vows'),
    Fiber = require('../fiber');

var SuperClass = Fiber.extend(function() {
  return {
    init: function(name) {
      this.name = name;
    }
  }
});

var SubClass = SuperClass.extend(function( base ) {
  return {
    init: function(name) {
      base.init.call(this, name);
    }
  }
});

vows.describe('Basic Instantiation').addBatch({
  'When initializing a base class': {
    topic: function() {
      return new SuperClass('super');
    },
    'result should have a name': function (result) {
      assert.equal(result.name, 'super');
    }
  },
  'When initializing a subclass': {
    topic: function() {
      return new SubClass('sub');
    },
    'result should have a name': function (result) {
      assert.equal(result.name, 'sub');
    }
  }
}).export(module);