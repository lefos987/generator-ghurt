# Angular app

AngularJS app generated with capinnovation generator. Configured to work with SASS for styling, and tested with Karma.

## Repo structure

```
dist/
├── assets/
└── vendor/
		└── bower.json
docs/
report/
├── coverage/
└── plato/
src/
├── index.html
├── app/
└── styles/
 		├── css/
    └── scss/
test/
├── config/
├── unit/
└── e2e/
```

### dist/
Public folder of the app, where all your final html/js/css and assets will be, ready to be served. This folder contains subfolders:

 - vendor: the bower folder, you can find the bower.json in it
 - assets: where you can set your app assets (fonts, pictures, svg..)

### docs/
Documentation folder, generated during `grunt report`. Built with ngDocs, based on jsdoc.

### report/
Reporting folder, generated after `grunt report` or `grunt build`. It contain two subfolders:

 - coverage: stats from karma
 - plato: static analysis report

### src/
Contains all the source files: scripts, templates and styles.

 - index.html: the index file of the app
 - app: all scripts and templates. Generaly subfolders are organised like the scripts modules.
 - styles: contain a subfolder called scss. This folder contain all scss files and compile them into an other folder called css (generated on the moment).

### test/
Contain all the necessary file for tests.

 - karma: karma config files
 - unit: unit test scripts. Generaly, we respect the same structure as src/app.
 - e2e: end-to-end test scripts


## Grunt tasks

This repo is configured to work with Grunt. The basic task are already set, here is the list of different tasks programmed.

### develop
Develop is the task to run during the development process. It keeps watching the changes and update the dist folder to keep the evironment up to date. 

 - Style: compile SASS and concat all styles in app.css
 - Scripts: concat all script in app.js then pass the unit tests
 - Templates: combine them all in a js script

The task use livereload, so at every change the page will be reloaded in your browser.

### test
Run karma and coverage

### server
Create a simple HTTP server for the dist folder. The page should open automatically in your browser.

### report
Run ngDocs to generate the documentation, then plato and coverage to generate reports.

### build
Run tasks to build the production code of the app. 

 - Converts templates to scripts
 - Combine and uglyfy scripts
 - Compile all SASS files
 - Combine and minify styles
 - Run unit tests and build the reports