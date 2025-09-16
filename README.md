# Synapse

A capstone project developed for Tardigrade Ltd.

## Developers

Alejo Kim Uy

Pedro Henirque Gomes de Toledo

Theodore Frocklage

Joseph Sabo

George Sabo

## Getting Started

### Backend

There are multiple things that are needed to be able to run the application.

> ALL COMMANDS ARE PRESUMED TO BE EXECUTED IN THE `backend` FOLDER

1. Install the node modules. Navigate to the `backend` folder and run `npm install` to install all required packages.
2. Once that is done, run `npm compose:up` to create the docker containers that require the application to run. Only when the containers are fully initialized should you go to the next step.
    1. Conversely, running `npm compose:stop` will turn all of them off. Deleting any of the containers will RESET the keycloak settings to its original state as the data is being maintained by the container and NOT being stored in a local database.
3. Generate the local prisma files. This is done by running the following command: `npx prisma generate`

For steps 4 and 5, the latest files must be requested from the developer who has them.

4. Make sure to setup the .env file with the correct values.
5. Initialize the correct keycloak realm using the latest realm.json.
    1. To access the ADMIN MASTER console, navigate to http://localhost:4000
    2. Sign in
    3. Navigate to Manage Realms > Create Realm
6. Run the migrations for the local database using the command: `npx prisma migrate dev`
7. Lastly, seed the database using `npm run db:seed`
8. To run the application, run the command `npm run dev`
9. To confirm the server is working, navigate to `http://localhost:8080/api/v1/debug` and it should return a json response.

### Frontend

1. Navigate to the `frontend` folder and install the modules using `npm install`
2. Run the application using `npm run dev`
3. To confirm the frontend is working, navigate to `http://localhost:3000`

## Miscellaneous

Documentation involving various things can be found in the `backend/wiki` folder
