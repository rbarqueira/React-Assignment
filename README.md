# Sixth (AND LAST) Laboratory Assignment: React, Redux, and the server
## Internet Applications Design and Implementation 2021/22 

### Introduction

This year's theme is a service to help in the management of its users reading habits. Our core concern is a service that stores information about books, ratings of books, and the reading habits of its users. Users can collaboratively add information about books, report the ownership of a given book, the desire to read it, and the fact that they read it, along with the possibility of recording a rating and a review. This is the general topic for this year. Each assignment will add the details needed for each instalment.

Your sixth assignment is to implement an interface using react and redux that correctly connects with a backend using a swagger-based generated api module.

You must use swagger for the generation of the API, TypeScript, React and Redux for the implementation, and the methods recommended in the lectures and lab classes to guide the definition of fluid and effective user interfaces. 

### Technical details

Your user interface should allow for an efficient and authenticated management of a paged list of books, the insertion of one particular book for registered users, the edition of books' information if the user is a reviewer, and the deletion of a book if the user is the owner of the book or an admin. 

The UI should be dynamic and flexible enough to support the addition of authors and pictures to the book record as needed. 

You will need to use the backend provided in a public repository (on the 21st of December) in the assignments GitHub team, generate the API, and implement the user interface using redux and react.

### Submission details

This assignment is a GitHub classroom assignment. You should clone the assignment and push your solution before the defined deadline. Start with the assignment repository and use the backend application and the empty react application in the repository to start implementing your user interface.

### Evaluation Criteria

The assignment will be graded from 0 to 5 in the following criteria:

* Modularization of the React/Redux code
* Paged interface with efficient redux implementation
* Flexible edition of books, images and authors
* Usage of the generated swagger-based API to connect to the backend
* Usage of redux asynchronous actions to connect to the backend 
* Correct usage of the three composition techniques explored in lectures (composition, render props, and context-based -- through redux)
* Correct composition of the state in redux 
* The differences in the UI targeting the roles of the users.
* Client-side authentication using tokens

### Important Dates

Strict submission deadline: Monday, 7th of January 2022

