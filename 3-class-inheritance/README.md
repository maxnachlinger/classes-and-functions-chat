This example adds result-validation by extending ThingRequest with a new child class ValidatedThingRequest.

Unfortunately we had to modify ThingRequest and export serviceConfigSchema, then use the exported serviceConfigSchema
in ValidatedThingRequest's validation.

Wasn't the whole point of inheritance the ability to re-use code without modifying it? Modifying a base class when
inheriting is sadly quite common, and it lots of classes inherit from that base class, you can cause lots of bugs.

There are other ways of structuring ThingRequest and ValidatedThingRequest to get around some of these issues but
that's not the point here.

The point is that your requirements will change, and when they do you'll not only have to change the functionality
itself, but you'll also have to contend with a whole set of Classes meant to describe those requirements as a world
consisting of objects.

When using inheritance the issue gets even more complex as child classes gain access to and alter the internal state
of their parent classes. As systems structured in this way grow, these dependencies are rarely obvious and the
side-effects to altering state are even less obvious.
