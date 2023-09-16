# Puzzle Sketch

Puzzle Sketch is a game where users can design puzzles with a drawing canvas. After finishing their sketches, users can attempt to solve their own puzzles. Players start each game with three hearts. Placing a tile in the wrong spot will deduct one heart. However, placing a tile in the correct spot will restore one heart. Players can have a maximum amount of 3 hearts. Puzzle Sketch records each win/loss to a game log database. Users can access this database and view their gameplay history.

This project employs a GO REST API, MySQL database, and React TypeScript UI. It uses Docker to bundle the respective images into a multi-container application. For testing, the project deployed a frontend CI/CD pipeline with Github Actions and Jest. This pipeline verifies the UI components' functionalities with a series of Jest unit tests. It runs when developers create pull requests or push commits to the main branch.

## Gallery

## Stack

- React
- TypeScript
- Docker
- GitHub Actions
- Go
- MySQL
- SQL
- Tailwind CSS
- Material TailWind UI
- Jest
- Vite

## Setup

- Install npm, docker, and docker-compose
- Install MySQL WorkBench to interact with the database (optional step)
- Clone the repo
- Change directory to the `frontend` folder
- Run `npm install`

## Docker Deployment

To start the Docker app, run the following command:

```
docker-compose up -d --build
```

Frontend (http://localhost:5173/) and backend (http://localhost:8080/logs) can be accessed via localhost. If MySQL Workbench is installed, you can access the database at localhost's port: 3307.

## Local Frontend Development

- Change directory to the `frontend` folder
- Run `npm run dev`

Frontend can be accessed at http://localhost:5173/.

## Testing with Jest

The unit tests are located in the `frontend/tests` folder. The GitHub Action file (`jest-unit-tests.yml`) is located at the root of the repo. Each UI page has a corresponding test file. The tests verify if components render properly for different situations. The tests also mock queries and mutations to simulate frontend's data interactions.
