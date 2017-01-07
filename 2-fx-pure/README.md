### Changes:
A few new pure functions are extracted, namely ``prepareParams()``, ``prepareRequestParams()``, and ``transformResults()``.

Promises are used to compose those functions along with ``requestP()``.

### Benefits of this approach:
- Each function gets just enough state to do it's job
- Each function has one responsibility
- + all the benefits of pure functions.

In case you've no idea what a Pure function is:

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

