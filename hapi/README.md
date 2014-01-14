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
Contains all the settings related to the server. At the moment it only contains the server port.

### server.js
Main script of the app. Initializes hapi with the provided configuration and a simple route.

### docs/
Documentation folder, generated during `grunt build`. Built with ngDocs, based on jsdoc.

### report/
Reporting folder, generated after `grunt report` or `grunt build`. It contains two subfolders:

 - coverage: stats from jasmine node for test coverage
 - plato: static analysis report

### src/
Contains all the scripts.

 - api: all server scripts
 - error_messages: error message json database. Used by Joi.

### test/
Contains all the necessary specs for our unit tests.


## Grunt tasks

This repo is configured to work with Grunt. The basic tasks are already set. Here is the list of what is available:

### develop
Develop is the task to run during the development process. It keeps watching the changes on scripts and re-runs jshint and test on any change.

### test
Run jasmine_node to test scripts.

### server
Start server by running server.js

### report
Run ngDocs to generate the documentation, then plato and coverage to generate reports.

### build
Run jshint, the tests, generate the documentation and reports. There's nothing to compile or combine here ;-)