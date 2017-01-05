This attempts to add result-validation by creating a class which adds that validation by having an instance of
ThingRequest injected into it.

Dependency Injection - a fancy term for passing a class it's dependencies.

Say I have a class ValidatedThingRequest whose constructor instantiates a ThingRequest for use in ValidatedThingRequest.
Now ValidatedThingRequest has a dependency on ThingRequest, but notice that:

1. This dependency isn't explicit, which means it's harder to find and easier to break ValidatedThingRequest when you
change ThingRequest.
2. ValidatedThingRequest is now responsible for creating and destroying that instance of ThingRequest.
3. It's also harder to test ValidatedThingRequest since we can easily supply a mocked ThingRequest.

Dependency injection solves all these issues.

The takeaway here is that if you're going to use classes to construct your programs, you should learn about OO Design
Patterns and techniques like dependency injection. There are book-shelves filled with great old tomes on this stuff.

For my part, what I love about javascript is that I can use much simpler approaches to get decoupled testable code :)
