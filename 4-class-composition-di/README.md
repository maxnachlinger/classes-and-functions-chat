#### Changes
This attempts to add result-validation by creating a class which adds that validation by having an instance of
``ThingRequest`` injected into it.

#### Dependency Injection

A fancy term for passing a class it's dependencies.

Consider this code:
```javascript
class ValidatedThingRequest {
  constructor (serviceConfig, responseSchema) {
    // snip
    this._thingRequest = new ThingRequest(serviceConfig);
  }
  
  // more methods here etc
```

Notice that:

1. ``ValidatedThingRequest`` is now responsible for creating and destroying that instance of ``ThingRequest``.
2. It's also harder to test ``ValidatedThingRequest`` since we can easily supply a mocked ``ThingRequest``.
3. There are loads of other benefits (like loose coupling and programming to interfaces) but those are less relevant for Javascript IMHO.

Consider this code:
```javascript
class ValidatedThingRequest {
  constructor (responseSchema, thingRequest) {
    // snip
    this._thingRequest = thingRequest
  }
  
  // more methods here etc
```
We're _injecting_ ``ValidatedThingRequest``'s ``ThingRequest`` dependency. 

Now we can easily mock thingRequest, and ``ValidatedThingRequest`` isn't responsible for managing ``ThingRequest`` is can simply use the instance passed in.

The takeaway here is that if you're going to use classes to construct your programs, you should learn about OO Design
Patterns and techniques like dependency injection. There are book-shelves filled with great old tomes on this stuff.

For my part, what I love about javascript is that I can use much simpler approaches to get decoupled testable code :)
