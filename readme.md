# Job API

This is a REST API built with Node.js, Express, and MongoDB to create a job board where employers can post job opportunities and employees can upload their resume and apply for jobs.

## Getting Started

To run the API locally, follow the steps below:

- Clone this repository
- Install the dependencies with npm install
- Start the server with npm start
- Open your web browser and go to http://localhost:3000

## API Endpoints

The API provides the following endpoints:

### Jobs

- GET /jobs - get all jobs
- GET /jobs/:id/:slug - get job by id and slug
- GET /jobs/:zipcode/:distance - get jobs in radius
- POST /jobs/new - create a new job
- GET /stats/:topic - get job stats
- PUT /jobs/:id/apply - apply to job by id
- PUT /jobs/:id - update job by id
- DELETE /jobs/:id - delete job by id
