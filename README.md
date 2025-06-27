### NC News

This project provides a back end to the front end provided by https://github.com/MattChu/nc_news_fe .

It demonstrates skills using server side JS, MVC routing with the express framework, and psql for db creation and query.

The project was built using test driven development in jest and the test for endpoints and util funcitons are included.

# Link to Live Version

/api describes available endpoints

https://nc-news-mnui.onrender.com/api

# Instructions for repo setup, env and dependencies:

- Requirements Node.js v23.11.0 and Postgres v14.18

- To clone the repo run > git clone https://github.com/MattChu/nc_news

- To install dependencies run > npm install

  - Development Dependencies: jest, jest-extended, jest-sorted, supertest, husky

  - Production Dependencies: dotenv, express, pg, pg-format

- For test db location create .env.test file > PGDATABASE=your-test-db-name-here

- For development db location create .env.development file > PGDATABASE=your-dev-db-name-here

- For production db location create .env.production file > DATABASE_URL=your-production-db-url-here

# Database setup and seeding

- To setup local development and test dbs run > npm run setup-dbs

- For testing, test files will seed db with test data prior to each test

- To seed local development db run > npm run seed

- To seed production db run > npm run seed-prod

# Testing

- To run full test suite run > npm test

- Individual test files can be run using e.g > npm test **test**/app.test.js

# Running local development server

- Seed local development db as above > npm run seed

- To start the server run > npm run start

- Acesss endpoints via localhost:9090/api
