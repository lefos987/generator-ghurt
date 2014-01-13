# Hapi server

Hapi server generated with capinnovation generator. Configured to be tested with Jasmine.

## Repo structure

```
config.js
server.js
docs/
report/
├── coverage/
└── plato/
src/
├── api/
└── error_messages/
test/
```

### config.js
Contain all the settings related to the server. At the moment it only contain the server port.

### server.js
Main script of the app, init hapi with the config and link the routes.

### docs/
Documentation folder, generated during `grunt build`. Built with ngDocs, based on jsdoc.

### report/
Reporting folder, generated after `grunt report` or `grunt build`. It contain two subfolders:

 - coverage: stats from karma
 - plato: static analysis report

### src/
Contains all the scripts.

 - api: all server scripts
 - error_messages: error message json database. Used by Joi.

### test/
Contain all the necessary scripts for tests.


## Grunt tasks

This repo is configured to work with Grunt. The basic task are already set, here is the list of different tasks programmed.

### develop
Develop is the task to run during the development process. It keeps watching the changes on scripts and repass jshint and test on any change.

### test
Run jasmine to test scripts.

### server
Start server by running server.js

### report
Run ngDocs to generate the documentation, then plato and coverage to generate reports.

### build
Run jshint, the tests, generate the documentation and reports. There's nothing to compile or combine here ;-)