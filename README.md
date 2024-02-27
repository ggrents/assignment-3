# Assignment 4. Final Project
## Grents Artem SE-2205
- git clone 
- npm install
- node server.js
- go to http://localhost:3000


## Key Features
- The registration login and logout functionalities for users have been implemented on the respective register , login and logout routes.
- Upon entering the credentials: username: "artem", password: "grents", you will be redirected to the admin panel ("/admin"), where you can monitor and manage users in various ways.
- In the header there is a navigation menu with two routes that utilize APIs:  
  https://api.api-ninjas.com/v1/recipe
  https://api.api-ninjas.com/v1/cocktail
- On the recipes and cocktails pages, users can use keywords to find entries they are interested in
- On the profile page, the user can view their notes, as well as perform all CRUD operations on them.
- Admin has the ability to view and edit all notes on the profile page(!)
- To identify the current user, sessions are used, which are issued at login and expire when the browser is closed
- The application uses logic to verify whether the user is authenticated to issue the relevant content.
- Also, for the security of the admin panel, a middleware is used, which checks whether the current user is an admin
- All application logic is implemented on the server side. The ejs engine was used to display the content.
  

## Deployment

- The application is deployed using the service render.com
- https://grents-assignment-3.onrender.com
  
(!!!) Due to the free subscription plan on this resource, the first connection to my application may take some time.
