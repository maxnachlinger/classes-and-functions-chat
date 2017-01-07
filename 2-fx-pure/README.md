### Changes:
Pure functions prepareParams, prepareRequestParams, transformResults extracted.

Promises are used as a means of composition of those pure functions.

Another benefit of this code is that each function gets just enough state to do it's job.

What's a Pure function?

### Pure Function:

A fancy phrase which means a function that:
* given the same input will always return the same output
* produces no side effects, which means it cannot alter external state
* gets all its state from its arguments.


Why should I care about all this Pure Function nonsense anyway?

* You can memoize / cache them
* They are super easy to test
* They (can be) simple to reason about and maintain.
* You can run N of them at once without issue (less of a concern in JS)

