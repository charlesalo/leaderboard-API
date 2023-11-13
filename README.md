## Project Name
Leaderboard API
- A standalone RESTful API service designed for seamless management of users and leaderboards.

## Framework and Setup
- Framework: Express, TypeScript
- Database: MongoDB
- Other Tools:
    - Node.js
    - npm (Node Package Manager)
    - MongoDB
    - TypeScript Compiler (tsc)
    - Postman (for API testing)

## Installation
Make sure to have the following installed before running the project:
- Node.js
- npm (Node Package Manager)
- MongoDB

1. Clone the repository:
    git clone https://github.com/charlesalo/leaderboard-API.git

2. Navigate to the project directory:
    cd your-repository

3. Install dependencies:
    npm install

4. Set up your MongoDB database:
    - Create a MongoDB Atlas account (if not already done).
    - Create a new cluster and a database for the project.
    - Obtain your MongoDB connection string.
    - Edit the .env file and set MONGO_URI=<your-mongodb-connection-string>

5. Set up environment variables:
    Create a .env file in the root of the project and add the necessary environment variables. For example:
    MONGO_PASSWORD=your-mongodb-password


## Running the Project
1. Run the project:
    npm start

## API Endpoints
- POST /user: Create a user.
- POST /admin/leaderboard: Admin endpoint for an instance of the leaderboard.
- GET /user/:_id: Retrieve a user by ID.
- GET /leaderboard/:_id?per_page=x&page=y: Retrieve a leaderboard with a list of entries sorted entries.
- PUT /leaderboard/:_id/user/:user_id/add_score: Adds score_to_add value to the score of the user with the corresponding user_id.

## Usage
Creating a User
- Endpoint: POST /user
    - Request:
        {
            "name": "Randy"
        }

    - Response:
        {
            "user": {
                "_id": "6551aa0d47cc762b21ef1cb3",
                "name": "Randy",
                "created_at": "2023-11-13T04:46:05.354Z",
                "updated_at": "2023-11-13T04:46:05.355Z",
                "__v": 0
            }
        }

Retrieving a User
- Endpoint: GET /user/:_id
    - Response:
        {
            "user": {
                "_id": "6551aa0d47cc762b21ef1cb3",
                "name": "Randy",
                "created_at": "2023-11-13T04:46:05.354Z",
                "updated_at": "2023-11-13T04:46:05.355Z",
                "__v": 0
            }
        }

Creating a Leaderboard
- Endpoint: POST /admin/leaderboard
    - Request:
        {
            "name": "WatchMojo Top 10"
        }

    - Response:
        {
        "board": {
            "_id": "5e25c253830ff6000c7ecb40",
            "name": "WatchMojo Top 10"
            }
        }

Retrieving a Leaderboard
- Endpoint: GET /leaderboard/:_id?per_page=x&page=y
    - Response:
        {
            "board": {
                "_id": "5e25c253830ff6000c7ecb40",
                "name": "WatchMojo Top 10",
                "entries": [
                    {
                        "score": 70,
                        "user_id": "5e25c5cf830ff6000c7ecb43",
                        "scored_at": "2020-01-20T15:26:35.115Z",
                        "rank": 0,
                        "name": "Plurk"
                    },
                    {
                        "score": 40,
                        "user_id": "5e25bfed830ff6000c7ecb3e",
                        "scored_at": "2020-01-20T15:25:49.955Z",
                        "rank": 1,
                        "name": "Randy"
                    },
                    {
                        "score": 30,
                        "user_id": "5e25c5d9830ff6000c7ecb44",
                        "scored_at": "2020-01-20T15:25:10.699Z",
                        "rank": 2,
                        "name": "Burp"
                    },
                    {
                        "score": 20,
                        "user_id": "5e25c5bf830ff6000c7ecb42",
                        "scored_at": "2020-01-20T15:40:28.882Z",
                        "rank": 3,
                        "name": "Derp"
                    }
                ]
            }
        }

Adding Score to a User in a Leaderboard
- Endpoint: PUT /leaderboard/:_id/user/:user_id/add_score
    - Request:
        {
            "score_to_add": 10
        }

    -Response
        {
        "entry": {
            "_id": "5e25c608830ff60009268354",
            "board_id": "5e25c253830ff6000c7ecb40",
            "score": 20,
            "scored_at": "2020-01-20T15:40:28.882+00:00",
            "user_id": "5e25c5bf830ff6000c7ecb42"
            }
        }

Use tools like Postman or cURL to make HTTP requests to these endpoints and test the functionality of the API.