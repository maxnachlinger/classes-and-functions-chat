pass-thru is extracted since it's a common requirement to call a function on a promise with the promise's result and
return the promise's result.

add-validation simply adds a validation check to the result of a promise, this is another bit of reusable code.
Both functions are curried.
