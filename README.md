# Fiber.js: Lightweight, fast, JavaScript inheritance model

[![Build Status](https://secure.travis-ci.org/linkedin/Fiber.png?branch=master)](http://travis-ci.org/linkedin/Fiber)

## Why another JavaScript inheritance library?

Take a look at the [performance tests](http://jsperf.com/js-inheritance-performance) to see how it compares against commonly used inheritance libraries.

## Inheritance

### Usage

`[[constructor]].extend( function )`

#### Example

```javascript
// Animal base class
var Animal = Fiber.extend(function() {
    return {
        // The `init` method serves as the constructor.
        init: function() {
            // Private
            function private1(){}
            function private2(){}

            // Privileged
            this.privileged1 = function(){}
            this.privileged2 = function(){}
        },
        // Public
        method1: function(){}
    }
});
```

The `init` method acts as the constructor, which is invoked when an instance is created:

```javascript
var animal = new Animal(); // Create a new Animal instance
```

`init` is invoked automatically.

### Inheritance

```javascript
// Extend the Animal class.
var Dog = Animal.extend(function() {
    return {
        // Override base class `method1`
        method1: function(){
            console.log('dog::method1');
        },
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
```

Create an instance of `Dog`:

```javascript
var husky = new Dog();
husky.scare(); // "Dog::I scare you'"
```

#### Accessing parent prototype

Every class definition has access to the parent's prototype via the first argument passed into the function:

```javascript
// Extend the Animal class.
var Dog = Animal.extend(function( base ) {
    return {
        // Override base class `method1`
        method1: function(){
            // Call the parent method
            base.method1.call(this);
        },
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
```

## Mixin

Mixins are a way to add functionality to a Fiber definition.  Basically, they address the problem of "multiple inheritance".  [Read more.](http://www.joezimjs.com/javascript/javascript-mixins-functional-inheritance/)

### Usage

`Fiber.mixin( object, function1, function2, ... )`

```javascript
var Foo = Fiber.extend(function(base) {
    return {
        method1: function(){}
    }
});

var f = new Foo();
f.method1();

var mix1 = function(base) {
    return  {
        method2: function() {}
    }
}

Fiber.mixin(Foo, mix1);

f.method2();
```

## Decorators

With decorators you can dynamically attach additional properties to an instance.  [Read more.](http://en.wikipedia.org/wiki/Decorator_pattern)

### Usage

`Fiber.decorate( instance, decorator_1, ... , decorator_n )`

```javascript
function CarWithPowerWindows(base) {
    return {
        roll: function() {}
    }
}

Fiber.decorate(myCar, CarWithPowerWindows);
```

## Proxy

### Usage

`Fiber.proxy( base, instance )`

```javascript
// Extend the Animal class;
var Dog = Animal.extend(function(base) {
    return {
        init: function() {
            this.base = Fiber.proxy(base, this);
            this.base.init();
        }
    }
});
```

## noConflict

### Usage

`Fiber.noConflict()`

Returns a reference to the Fiber object, and sets the `Fiber` variable to its previous owner.


