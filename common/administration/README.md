# Administration stuff / business logic
This folder here should contain parts of our application's business logic. 
Following an MVC pattern (where the business logic is more and more implemented with the model), this represents a part of the model.

Functions/logic/stuff here is usually used by some parts of the web- and the jobs- part of our application. It's the administrational stuff (that is primarily related to our user management) of the model that both parts share (or have in "common").

Stuff here is not exactly like the transaction log (where also web and jobs share parts). The transaction log is more technically related to logging on server side and does not implement business logic that is related to user management or general administrational tasks from a user support perspective. 