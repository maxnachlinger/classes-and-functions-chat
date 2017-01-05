# classes-and-functions-chat

We start out with some functionality that makes a simple request to get a set of things.

* Pass 0: Simple fetch via a class.
* Pass 1: Simple get via a function, opportunity to discuss partial application

(Pass 0 and 1 are compared)

* Pass 2: Pass 1's function approach refactored, extracting a few pure helper functions. Opportunity to discuss pure
functions.

We then add a requirement to validate the results from our fetch.

* Pass 3: Simple fetch and result validation via a new child class / inheritance.
(Discussion about inheritance)

* Pass 4: Pass 3's inheritance example refactored to use simple DI - the validation class get the requester class 
injected into its constructor.

* Pass 5: A simple function that wraps the response and add validation. More pure functions are extracted, opportunity
to discuss currying.

* Pass 6: The data.task monad is used (from folktale). Benefits in terms of purity can be discussed here as well as
starting-up a system and running it being separate responsibilities.  

Quick segue showing how to use the require.cache and partial application to avoid passing shared config around. There
is also an opportunity to discuss object being passed by reference in javascript and how making deep copies or
using immutable structures helps here.

* Pass 7: 2 common ways of doing that are shown.

* Pass 8: Simple way of running a few data.task monads in parallel.
