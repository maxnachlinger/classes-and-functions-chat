## classes-and-functions-chat

### Installation
```shell
npm i
```

### Run the examples
```shell
// you can run the index.js file in the directory
node ./0-class/index.js
```

### Overview

#### Requirement: get a set of results from a REST API on the network

- Pass 0: via a class

- Pass 1: via a function, partial application is discussed and a comparison between the calling code of Pass 0 and Pass 1 is shown

- Pass 2: Pass 1's function approach is refactored, a few pure functions are extracted and pure functions are discussed.

#### Requirement-change: get a set of results from a REST API on the network and validate those results

- Pass 3: via inheritance as well as a discussion about inheritance.

- Pass 4: Pass 3's approach is refactored to use dependency injection and dependency injection is discussed.

- Pass 5: via function composition. More pure functions are extracted, currying is discussed.

- Pass 6: via composition of data.task monads (from the folktale library). Benefits in terms of purity are discussed here as well as system start-up and operation being separate concerns. Yup, I said Monad :)

#### How to use the require.cache and partial application to avoid passing shared config around

- Pass 7: 2 common ways of doing that are shown. A quick discussion also of pass-by-reference in Javascript and how deep copies and immutable data structures are a help.

#### Silly Bonus

* Pass 8: a simple way of running a few data.task monads in parallel.

### Details
[notes.md](./notes.md) contains detailed information regarding each of the solutions.
