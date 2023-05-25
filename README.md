# JWT-Playground
A basic JWT authentication system for experimentation purposes only. It should not be used as a reference implementation, as it was created in a short time frame to teach about JWT concepts and the theoretical brute force attacks used to discover the signing key and forge new JWT tokens.
# Installation
You will need npm and nodejs installed in your system.

Clone this repo.

Change the working directory to JWT-Playground, with the command `cd JWT-Playground`

Inside the folder, run `npm i`.

To start the app run `npm start`.
# Features:
A login form for two default users (Bob and admin user Bobby), and includes a 'fake database' to assist with authentication. Once logged in, users can view the JWT token and the decoded data contained within it. Additionally, users can update their JWT tokens, potentially gaining unauthorized access to the dashboard by cracking the secret key and forging new JWT tokens with admin permissions.
![image](https://user-images.githubusercontent.com/69057368/220212339-d5de145f-f65f-4a49-b6bc-bee2bf476f06.png)
![image](https://user-images.githubusercontent.com/69057368/220212391-069971ac-1a79-483c-a888-23dcb00aa1e5.png)
Since it is possible to change the secret without getting logged out, users can use the 'validate' button to check if the current JWT is still valid. Or, users can change the JWT token and verify if it is still valid.
## Default user credential
- Email: user@email.com
- Password: 123
# Made with:
- ExpressJS
- Bootstrap
- Javascript
- Jsonwebtoken
