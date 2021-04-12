[![License](http://img.shields.io/:license-apache%202.0-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/io.debezium/debezium-connector-vitess/badge.svg)](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22io.debezium%22)
[![Build Status](https://travis-ci.com/debezium/debezium-incubator.svg?branch=master)](https://travis-ci.com/debezium/debezium-connector-vitess/)
[![User chat](https://img.shields.io/badge/chat-users-brightgreen.svg)](https://gitter.im/debezium/user)
[![Developer chat](https://img.shields.io/badge/chat-devs-brightgreen.svg)](https://gitter.im/debezium/dev)
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
mvn clean install
```

The UI part is an SPA application based on the React framework. It is packaged as JAR,
whose contents are then exposed by the Quarkus-based backend application.

### Backend

The UI backend is a Quarkus application located under _backend_.
You can run it in development mode like so:

```
mvn -pl backend compile quarkus:dev
```

Swagger UI can be accessed from:  [http://localhost:8080/swagger-ui/](http://localhost:8080/swagger-ui/)

**NOTE:**
Launching the backend via the mvn command above will utilize the existing frontend UI jar.  
The UI will be available at: [http://localhost:8080/](http://localhost:8080/).  
If you have local frontend changes which need to be included, you can rebuild just the frontend first like so: 

```
mvn -pl ui install
```

### UI Development

The UI frontend code is located under the _ui_ folder.  See the [UI README](./ui/README.md) for more information about UI development.

## Contributing

The Debezium community welcomes anyone that wants to help out in any way, whether that includes
reporting problems, helping with documentation, or contributing code changes to fix bugs, add tests,
or implement new features.
See [this document](https://github.com/debezium/debezium/blob/master/CONTRIBUTE.md) for details.
