ThingRequest's file-name and the variable we assign the require() to are ProperCased so devs know it's a class to be
instantiated before it can be used.

An instance of ThingRequest is created and passed some config. That instance is kept around in memory and reused.

The request() instance method is invoked with arguments.

Question:
Where does request() get its state from?

Lots of places. The class instance, the function's arguments, the things we required above etc.

How a function gets it's state can be complicated. Minimizing that complexity makes the function easier to think about,
work on, and test.

In ThingRequest we have class instance variables that influence request()'s behavior several lines away from that
function.
