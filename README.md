# node-api-rest-boilerplate

This project has initials configurations necessary to create a Rest API in NodeJs with several pre-configured features. In addition, it has an architecture that reduces the writed code in the creation of new routes and validations. See the features below.

### Unit Test Coverage

<span><img src="./.badges/badge-branches.svg"></span>
<span><img src="./.badges/badge-functions.svg"></span>
<span><img src="./.badges/badge-lines.svg"></span>
<span><img src="./.badges/badge-statements.svg"></span>

### Sonar Quality Info

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=elitonfreitas_node-api-rest-boilerplate&metric=bugs)](https://sonarcloud.io/dashboard?id=elitonfreitas_node-api-rest-boilerplate)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=elitonfreitas_node-api-rest-boilerplate&metric=alert_status)](https://sonarcloud.io/dashboard?id=elitonfreitas_node-api-rest-boilerplate)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=elitonfreitas_node-api-rest-boilerplate&metric=security_rating)](https://sonarcloud.io/dashboard?id=elitonfreitas_node-api-rest-boilerplate)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=elitonfreitas_node-api-rest-boilerplate&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=elitonfreitas_node-api-rest-boilerplate)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=elitonfreitas_node-api-rest-boilerplate&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=elitonfreitas_node-api-rest-boilerplate)

# Features

## Create new modules easily

For create a new module you just need to specify a Mongoose model and inherit the crud functions from the BaseController. If you need, is possible override the pre-defined functions. See the **TemplateController** to better understand.

## Express + express-validator

Validate your requests on API with express-validator. It's possible create Validator Schemas or use Mongoose schemas to generate express-validator schemas.

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
docker run -d --env-file ./config/local.env --network=host --name node-rest-api node-rest-api:latest

# Check image is run
docker ps
```

## Winston (log manager)

For manager logs we use winston. Is possible integration with LogStash and others applications.

## Eslint and Prettier

Improve code quality and patterns using eslint and prettier.

## Jest (unit test)

Improve unit tests using jest pre setup and structure.

## Postman (automate test)

For automate testing, we use Postman to make requests to our APIs.
