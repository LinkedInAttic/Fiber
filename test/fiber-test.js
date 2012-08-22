var assert = require('assert'),
    vows = require('vows'),
    Fiber = require('../src/fiber');

// Stub Fiber class definition
var Definition = Fiber.extend(function( base ) {
  return {
    init: function(name) {
      this.name = name;
    },
    getBase: function() {
      return base;
    },
    method1: function() {
      return true;
    },
    method2: function() {
      return true;
    }
  };
});

// BASIC TESTS

vows.describe('Basic Instantiation').addBatch({
  'When initializing a Fiber class via <Fiber.extend>': {
    topic: function() {
      return new Definition('name');
    },
    'the <init> function should execute': function (result) {
      assert.equal(result.name, 'name');
    },
    'and then be destroyed.': function (result) {
      assert.isUndefined(result.init);
    }
  },
  'A Fiber class definition':  {
    topic: function() {
      return Definition;
    },
    'Should have the proper constructor': function (result) {
      assert.equal(result.prototype.constructor, Definition);
    },
    'Should be extendable': function (result) {
      assert.isFunction(result.extend);
    }
  },
  'When calling a method in the class': {
    topic: function() {
      return new Definition();
    },
    'the method should execute': function(result) {
      assert.isFunction(result.method1);
      assert.isTrue(result.method1());
    }
  },
  'Every instance of a class': {
    topic: function() {
      return new Definition();
    },
    'should have access to the super\'s prototype': function (result) {
      assert.isTrue(result.getBase().constructor === Fiber)
    }
  }
}).export(module);

// INHERITANCE

vows.describe('Inheritance').addBatch({
  'When initializing a sub class which doesn\'t override <init>': {
    topic: function() {
      var Sub = Definition.extend(function( base ) {
        return {
          getBase: function() {
            return base;
          }
        };
      });
      var t = new Sub('name');
      return t;
    },
    'the parent <init> function should execute': function (result) {
      assert.equal(result.name, 'name');
    },
    'and then be destroyed.': function (result) {
      assert.isUndefined(result.init);
    },
    'The subclass instance should have access to the super\'s prototype': function (result) {
      assert.isTrue(result.getBase().constructor === Definition)
    }
  },
  'When initializing a sub class': {
    topic: function() {
      var Sub = Definition.extend(function( base ) {
        return {
          method2: function() {
            return true;
          },
        };
      });
      var t = new Sub('name');
      return t;
    },
    'A method that only exists in the super class should stills execute': function (result) {
      assert.isFunction(result.method1);
      assert.isTrue(result.method1());
    },
    'A method that is overridden should execute': function (result) {
      assert.isFunction(result.method2);
      assert.isTrue(result.method2());
    }
  },
  'When initializing a super and sub class': {
    topic: function() {
      // Super class
      var Super = Fiber.extend(function( base ) {
        return {
          init: function(num) {
            this.num = num;
          },
          increment: function() {
            return this.num + 1;
          }
        };
      });
      // Sub Class
      var Sub = Super.extend(function( base ) {
        return {
          init: function(num) {
            base.init.call(this, num);
          },
          increment: function() {
            return base.increment.call(this);
          }
        };
      });
      return new Sub(0);
    },
    'The subclass init constructor should call the super init constructor': function (result) {
      assert.equal(result.num, 0);
    },
    'An overridden method which calls the super\'s method should execute': function (result) {
      assert.isFunction(result.increment);
      assert.equal(result.increment(), 1);
    }
  }
}).export(module);

// DECORATION

vows.describe('Decoration').addBatch({
  'Ensure we can decorate': {
    topic: function() {
      return Fiber;
    },
    'Check <Fiber.decorate> exists': function(result) {
      assert.isFunction(result.decorate);
    }
  },
  'When decorating a <Fiber> instance': {
    topic: function() {
      var Sub = Definition.extend(function( base ) {
        return {};
      });
      var t = new Sub('name');
      Fiber.decorate(t, function(base) {
        this.method3 = function() {
          return true;
        }
      });
      return t;
    },
    'The method added via the decorator should exist': function(result) {
      assert.isFunction(result.method3);
      assert.isTrue(result.method3());
    }
  }
}).export(module);

// MIXIN

// PROXY

// NO-CONFLICT

