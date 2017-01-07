#### Changes 
A ``ThingRequest`` class.

#### Question:
Where does ``ThingRequest::request()`` get its state from?

The answer is _lots of places_. The class instance, the function's arguments, the things we required above etc.

How a function gets it's state can be complicated. Minimizing that complexity makes the function easier to think about,
work on, and test.

In ``ThingRequest`` we have class instance variables that influence ``request()``'s behavior several lines away from that
function. We can improve this,
