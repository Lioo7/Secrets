# Secrets

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2012.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-%3E%3D%204.17.1-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D%204.4.0-green)](https://www.mongodb.com/)
[![Passport.js](https://img.shields.io/badge/Passport.js-%3E%3D%200.4.1-orange)](http://www.passportjs.org/)
[![Google OAuth 2.0](https://img.shields.io/badge/Google%20OAuth%202.0-%3E%3D%202.0.0-yellow)](https://developers.google.com/identity/protocols/oauth2)
[![Jest](https://img.shields.io/badge/Tests-Jest-9cf)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/Code%20Style-ESLint-4B32C3)](https://eslint.org/)

**Description**: This project is a web application built with Node.js and Express that allows users to register, log in, and share secrets anonymously. It follows the MVC architecture, uses MongoDB as the database and implements authentication using Passport.js and the Google OAuth 2.0 strategy.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Routes](#routes)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository.
2. Install the required dependencies by running the following command:
```bash
npm install
```
3. Set up the environment variables by creating a `.env` file and providing the necessary values.
4. Start the application by running the following command:
```bash
npm start
```
5. Access the application in your web browser at `http://localhost:3000`.

## Usage

1. Register a new account by clicking on the "Register" link on the home page.
2. Log in with your account credentials or using your Google account.
3. Share your secrets anonymously by navigating to the "Submit" page and entering your secret.
4. View secrets shared by other users on the "Secrets" page.
5. Log out by clicking on the "Logout" button.

## Configuration

The application uses environment variables for configuration. Ensure that the following variables are set in the `.env` file or your hosting environment:

- `PORT`: The port number on which the server should listen (default is 3000).
- `SESSION_SECRET`: A secret key used to sign the session ID cookie.
- `MONGODB_URI`: The URI for the main MongoDB database. 
- `TEST_MONGODB_URI`: The URI for the test MongoDB database (used exclusively for testing the project). 
- `CLIENT_ID`: The client ID for Google OAuth 2.0 authentication.
- `CLIENT_SECRET`: The client secret for Google OAuth 2.0 authentication.

## Routes

- `/`: The home page of the application.
- `/auth/google`: Initiates the Google OAuth 2.0 authentication flow.
- `/auth/google/secrets`: Callback URL for Google OAuth 2.0 authentication.
- `/register`: Page for user registration.
- `/login`: Page for user login.
- `/logout`: Endpoint for user logout.
- `/secrets`: Page displaying secrets shared by users.
- `/submit`: Page for submitting a new secret.

## Running Tests
To run the tests, use the following command:
```bash
npm jest
```

## Contributing

Contributions to the project are welcome. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your forked repository.
5. Submit a pull request describing your changes.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
