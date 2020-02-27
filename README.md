# node-api-rest-boilerplate

This project has the initial configurations necessary for the creation of a Rest API in NodeJs, with several pre-configured features.
In addition, it has an architecture that reduces the writing of code for the creation of new routes and validations. See the features below.

## Tests coverage

<span><img src="./.badges/badge-branches.svg"></span>
<span><img src="./.badges/badge-functions.svg"></span>
<span><img src="./.badges/badge-lines.svg"></span>
<span><img src="./.badges/badge-statements.svg"></span>

# Features

## Ease to create new modules

To create a new module you just need to specify a Mongoose model and inherit the crud functions from the BaseController. If you need, is possible override the pre-defined functions. See the **TemplateController** to better understand.

## Express with express-validator

Validate you requests on API with express-validator. Is possible to create Validator Schemas or use Mongoose schema to create express-validator schema.

## Mongoose

For manager MongoDB connection e operations, use Mongoose and integrate Mongoose Schema to express-validator to validate requests on API.

## i18n

Translate API response massages using i18n lib. You just need to set the locale in the request headers.

## Docker

Run the application using Docker. Below are the commands needed to run the app on Docker:

On root path of project:

```docker
# Create docker image
docker build -f ./dockers/Dockerfile -t node-rest-api:latest .

# Run docker image in localhost network
docker run -d --env-file ./path/to/config/local.env --network=host --name node-rest-api node-rest-api:latest

# Check image is run
docker ps
```

## Winston (log manager)

To manager logs we use winston. Is possible integration with LogStash and others applications.

## Eslint and Prettier

Improve code quality and patterns using eslint and prettier.

## Jest (unit test)

Improve unit tests using jest pre setup and structure.

## Postman (automate test)

To automate testing, we use Postman to make requests to our APIs.
