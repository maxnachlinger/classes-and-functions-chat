### Changes
So if we don't use the class approach to requesting things, do we still have to pass the ``serviceConfig`` parameter to
request each time?

Nope. Assuming your config won't change while the app is running, you can partially apply the ``serviceConfig ``to
``request()`` and add that to the ``require.cache``. If you config is dynamic, you really should pass it each time you invoke
the function :)

### 2 simple approaches:
init-0.js
Objects are passed by reference in javascript (yeah I know you knew that :).
So our exported object is a reference in the require.cache. ``init()`` simply adds our partially-applied method as a
new request property to that object.

init-1.js
``init()`` sets a variable in the module, ``request()`` is exported as a normal function but uses that variable.

### Warning
Passing around shared config means that any function which receives a reference to that shared config can now screw
with it. These kinds of side-effects are especially hard to track down.

So, we need to share this config, but we don't want to give every function which receives a reference to it the power
to screw it up.

### Solution
Give each function a copy of the shared config :) That's why the shared variable reference is ``deep-copy``ied in the examples.
