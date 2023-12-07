[![License](http://img.shields.io/:license-apache%202.0-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![User chat](https://img.shields.io/badge/chat-users-brightgreen.svg)](https://debezium.zulipchat.com/#narrow/stream/302529-users)
[![Developer chat](https://img.shields.io/badge/chat-devs-brightgreen.svg)](https://debezium.zulipchat.com/#narrow/stream/302533-dev)
[![Google Group](https://img.shields.io/:mailing%20list-debezium-brightgreen.svg)](https://groups.google.com/forum/#!forum/debezium)
[![Stack Overflow](http://img.shields.io/:stack%20overflow-debezium-brightgreen.svg)](http://stackoverflow.com/questions/tagged/debezium)

Copyright Debezium Authors.
Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

# Debezium UI

![WEB UI SAMPLE](https://user-images.githubusercontent.com/10202690/114378465-05cb5000-9b88-11eb-9914-a8dd5b3994ae.png)

Debezium is an open source distributed platform for change data capture (CDC).

This repository contains a web-based UI for Debezium, allowing to configure Debezium connectors in an intuitive way, control their lifecycle, and more.
The Debezium UI is a standalone web application, which connects to Kafka Connect via its REST API.

This project is under active development, any contributions are very welcome.

## Prerequisites

Debezium UI needs a properly running Debezium instance version 1.4.0.Beta1 or newer and running DB instances, depending
on what connectors you are going to use (Postgres, Mongo DB, MySQL, etc).

### DEV Infrastructure with Docker-Compose

You can setup a running DEV infrastructure with Zookeeper, Kafka, Debezium, Postgres and
Mongo DB using docker-compose:

```
## optionally make sure you have the latest images:
$ docker-compose pull

Pulling dbzui-zookeeper ... done
Pulling dbzui-db-mongo  ... done
Pulling dbzui-db-mysql  ... done
Pulling debezium-ui_mongo-initializer_1 ... done
Pulling dbzui-kafka     ... done
Pulling dbzui-db-pg     ... done
Pulling dbzui-connect   ... done

## start containers
$ docker-compose up -d

Creating dbzui-db-mysql  ... done
Creating dbzui-db-pg     ... done
Creating dbzui-zookeeper ... done
Creating dbzui-db-mongo  ... done
Creating debezium-ui_mongo-initializer_1 ... done
Creating dbzui-kafka     ... done
Creating dbzui-connect   ... done

```

Debezium UI will be available on [http://localhost:8080](http://localhost:8080)      
Kafka Connect REST API with Debezium will be available on local port **8083**.   
Postgres will be available on local port **65432**.  
MySQL will be available on local port **63306**.  
Mongo DB will be availaible after ~20 seconds on local port **37017** (connect via `mongo -u debezium -p dbz --authenticationDatabase admin localhost:37017/inventory`)
Kafka will be available on local port **9092**.  

```
## later stop containers:
$ docker-compose down

Stopping dbzui-connect   ... done
Stopping dbzui-kafka     ... done
Stopping dbzui-zookeeper ... done
Stopping dbzui-db-mongo  ... done
Stopping debezium-ui_mongo-initializer_1 ... done
Stopping dbzui-db-pg     ... done
Stopping dbzui-db-mysql  ... done
Removing dbzui-connect   ... done
Removing dbzui-kafka     ... done
Removing dbzui-zookeeper ... done
Removing dbzui-db-mongo  ... done
Removing debezium-ui_mongo-initializer_1 ... done
Removing dbzui-db-pg     ... done
Removing dbzui-db-mysql  ... done
Removing network debezium-ui_dbzui-network

```

## Build

The entire application (UI and backend) can be built via Maven:

```
./mvnw clean install
```

The UI part is an single-page application (SPA) based on the React framework. It is packaged as JAR,
whose contents are then exposed by the Quarkus-based backend application.

### Backend

The UI backend is a Quarkus application located under _backend_.
You can run it in development mode like so:

```
./mvnw -am -pl backend package quarkus:dev
```

Swagger UI can be accessed from:  [http://localhost:8080/swagger-ui/](http://localhost:8080/swagger-ui/)

## UI Development

The UI frontend code is located under the _ui_ folder.  See the [UI README](./ui/README.md) for more information about UI development.

## Contributing

The Debezium community welcomes anyone that wants to help out in any way, whether that includes
reporting problems, helping with documentation, or contributing code changes to fix bugs, add tests,
or implement new features.
See [this document](https://github.com/debezium/debezium/blob/main/CONTRIBUTE.md) for details.

## Quick-start

```bash
git clone https://github.com/patternfly/patternfly-react-seed
cd patternfly-react-seed
npm install && npm run start:dev
```
## Development scripts
```sh
# Install development/build dependencies
npm install

# Start the development server
npm run start:dev

# Run a production build (outputs to "dist" dir)
npm run build

# Run the test suite
npm run test

# Run the test suite with coverage
npm run test:coverage

# Run the linter
npm run lint

# Run the code formatter
npm run format

# Launch a tool to inspect the bundle size
npm run bundle-profile:analyze

# Start the express server (run a production build first)
npm run start

# Start storybook component explorer
npm run storybook

# Build storybook component explorer as standalone app (outputs to "storybook-static" dir)
npm run build:storybook
```
