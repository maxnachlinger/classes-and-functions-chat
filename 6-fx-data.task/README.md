This example introduces the data.task Monad from the folktale library.

The benefit here is that request-things is now totally pure and we push control for running request() and handling
the error out to the client, which is where those concerns belong.

In systems, how the system is setup and started is a separate concern from how it runs. This captures that. You can
keep composing on to the Task via map and chain until you call fork.
