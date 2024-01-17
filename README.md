[![License](http://img.shields.io/:license-apache%202.0-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![User chat](https://img.shields.io/badge/chat-users-brightgreen.svg)](https://debezium.zulipchat.com/#narrow/stream/302529-users)
[![Developer chat](https://img.shields.io/badge/chat-devs-brightgreen.svg)](https://debezium.zulipchat.com/#narrow/stream/302533-dev)
[![Google Group](https://img.shields.io/:mailing%20list-debezium-brightgreen.svg)](https://groups.google.com/forum/#!forum/debezium)
[![Stack Overflow](http://img.shields.io/:stack%20overflow-debezium-brightgreen.svg)](http://stackoverflow.com/questions/tagged/debezium)

Copyright Debezium Authors.
Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

# Debezium UI

![image](https://github.com/debezium/debezium-ui/assets/8264372/fe5be39f-33dd-45de-a7c6-fcb8b91207b3)


Debezium is an open source distributed platform for change data capture (CDC).

This repository contains a web-based UI for Debezium, allowing to configure Debezium connectors in an intuitive way, control their lifecycle, and more.
The Debezium UI is a React-based Single Page Application code based on [Patternfly](https://www.patternfly.org/) 5, which connects to Kafka Connect via its REST API.

This project is under active development, any contributions are very welcome.

## Requirements
node (version 16.x.x or higher) and npm (version 8.x.x or higher).

## Quick-start

To quickly start react based web app UI. 

```bash
git clone https://github.com/debezium/debezium-ui
cd debezium-ui
npm install && export KAFKA_CONNECT_CLUSTERS={kafka-cluster-URLs} && npm run start:dev
```

**kafka-cluster-URLs** is comma separated list of kafka connect cluster URL's.

Debezium UI will be available on [http://localhost:9000](http://localhost:9000)  

## Running UI app with local Dev env. setup

### Prerequisites

With the latest update to Debezium UI you need a properly running Debezium instance version 2.5 or newer with Debezium kafka connect rest extension enabled and running DB instances, depending on what connectors you are going to use (Postgres, Mongo DB, MySQL, etc).

#### DEV Infrastructure with Docker-Compose

```bash
git clone https://github.com/debezium/debezium-ui
cd debezium-ui
```

You can setup a running DEV infrastructure with Zookeeper, Kafka, Debezium, MySql, Postgres, SQL Server and
Mongo DB using docker compose:

```
## start containers
$ DEBEZIUM_VERSION={DEBEZIUM_VERSION} docker compose up -d

[+] Running 8/8
 ✔ Network debezium-ui_default
 ✔ Container zookeeper  Started
 ✔ Container mysql      Started
 ✔ Container sqlserver  Started
 ✔ Container postgres   Started
 ✔ Container mongodb    Started
 ✔ Container kafka      Started
 ✔ Container connect    Started

```
    
Kafka Connect REST API with Debezium will be available on local port **8083**.   
Postgres will be available on local port **5432**.  
MySQL will be available on local port **3306**.  
SqlServer will be available on local port **1433**
Mongo DB will be available after ~20 seconds on local port **27017** (connect via `mongo -u debezium -p dbz --authenticationDatabase admin localhost:27017/inventory`).

Kafka will be available on local port **9092**.  

### UI Development

Install all the dependencies
```bash
npm install
```

Running UI web app targeting local dev setup 
```bash
export KAFKA_CONNECT_CLUSTERS={http://localhost:8083/} && npm run start:dev
```

Debezium UI will be available on [http://localhost:9000](http://localhost:9000)  

### Cleanup

later stop running containers.

```
$ DEBEZIUM_VERSION=2.5 docker compose down

[+] Running 8/7
 ✔ Container connect    Removed
 ✔ Container mongodb    Removed
 ✔ Container mysql      Removed
 ✔ Container postgres   Removed
 ✔ Container kafka      Removed
 ✔ Container sqlserver  Removed
 ✔ Container zookeeper  Removed
 ✔ Network debezium-ui_default        Removed

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

## Contributing

The Debezium community welcomes anyone that wants to help out in any way, whether that includes
reporting problems, helping with documentation, or contributing code changes to fix bugs, add tests,
or implement new features.
See [this document](https://github.com/debezium/debezium/blob/main/CONTRIBUTE.md) for details.