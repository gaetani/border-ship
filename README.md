# border-ship

Demo-shop project.


Why did you pick your first particular your design?

The design of this project was build on top of microservices architecture. Using two of the most knows libraries, mongoose and express.

I choose mongodb as database, in opposite with relational database, because the model can grow dinamically without caring of with tipo.

I did several integration tests using avajs and supertest.

What assumptions did you make, and what tradeoffs did you consider?

About the tradeoffs, I kept my focus mainly in Scalability, but i'm also considering:

- Reliability;

- Programmability;

- Maintainability;

- Compatibility;

- Adaptability;

- Availability;

My assumptions was based mainly on the tuple (id, customerName, customerAddress, item, price, currency). Which brought me a ton of questions listed below:

1) Do the customer can buy just one item per order?

    No, so I decided to make an array reference in order to products.

2) Do the price can change? If do, the order will to?

    No, however, this is no what is showing in tuple. The model still can grow, having one more field to collect the order price.

3) How important is the currency field to the business?

    The importance about the currency field is to have the correct price of the product.

4) What if a customer had changed his address, after ordered? Do we have to change the old data?

    No, however, this is no what is showing in tuple. I'll assume that is can be feature do be done.

5) Are the actual model representing a flat structure?

    No, but it's a puzzle to solve. I did my design based on the best for the app.

6) What happens if two or more customers has the same name?

    We can create a collection for customer and store the information of him. This will solve one trouble, the other one is to find all orders based on the name.

    In this case, we'll show all orders from customers with exactly same name.

PS.: My sincerely apologises for not sending you those questions before.

Assuming that I'm building a cool and awesome demo-shop. I build the entirely solution based on my knowledge with e-commerce, however, having in mind to keep it simple.

So I got three collections:

-Products -> CRUD about product which will be used to Order, containing just name and price. It's a flat structure.

-Customers -> CRUD to store information about Customer, it started with just CustomerName and Address, however, some fields were added after reading the second exercise.

-Orders -> Store information about Orders made to this backend.

Besides the table in the example showing a flat structure, I made a decision to go further and normalizing the entirely solution. This make me to solve some questions that I did.

- What happened if a customer decide to change his address?

    R: To solve that, one field called by address in Orders could be created.

- What happened if a Product has his price changed?

    R: To solve that, one field in items could be created.

- What I could do more?

    R: Order could be asynchronous, instead of saving directly to the database, I could put it in a queue and return a token.

    R: Caching using caching would be useful to store information about items whose are most bought.

    R: Logging using logstash.

    R: More tests, edge cases is necessary. Especially when you have especial cases like "an product could not be deleted if there any order".

- What I did?

type docker-compose build && docker-compose up and have fun! :)





What did you consider when you had to design the second solution? And which assumptions and tradeoffs you made?



Easy solution, considering that i'm using mongo. I've just changed my model and added

the fields that was requested. I designed three new routes to solve the following requirements, for this I used aggregation in mongodb as you can see

Get all order bought by a customer

Get the amount of money paid by a customer

Get all customers that bought a certain item



My assumption is:

1) if the customer has just the name in the database. In case of any updates, required fields must be filled.


Tradeoffs:

- Maintainability;

What do you like (and dislike) about Node/Javascript compared to other programming languages?

I don't like dynamic typing in javascript, however this is solved using typescript.

My bullet's about what I like most Javascript are:

-the asynchronous programming;

-event driven oriented;

-closures;

-duck typing;

Besides all, my personal opinion around javascript is the community in github, npm and medium. It''s very well documented and you can start doing programming right after finishing reading.
As opposite than Java, both have good and strong community, however, depending on the architecture of your system it could be more painful.



Days working in this project:
Saturday - 21-08 2hr
Sunday - 22-08 8hrs
Monday - 23-08 2hrs
Tuesday - 24-08  2hrs
Wednesday - 25-08 1hr
