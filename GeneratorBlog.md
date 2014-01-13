###Background

Working in the **Innovation Lab of Capgemini** allows us to work with some of the most exciting and interesting emerging technologies out there. However, we are very opinionated about which of those technologies we use in our projects. From the very beginning of our lab, **[Angular.js](http://angularjs.org)** is in the centre of everything we do on the client side. **[Node.js](http://nodejs.org/)**  is also a core element of our stack, but instead of using the more popular **[Express](http://expressjs.com/)** framework, we use **[Hapi.js](http://spumko.github.io/)**. For our styles we prefer **[Zurb’s Foundation](http://foundation.zurb.com/)** framework as opposed to **[Twitter's Bootstrap](http://getbootstrap.com/)**. So even though we follow the trend of **[MEAN](http://mean.io/)** apps there are some key differences to how we roll.

Another thing to point out is that a key objective of our Innovation Lab is not only to experiment with these technologies but try to come up with a set of best practices and standards, so we can share  our methodology and lessons learned with the rest of the organisation in order to successfully deliver projects to our clients. Additionally, more often than not, we find ourselves in a position that we need to quickly check out a new framework or try to add a new element to our existing stack and see how well it plays with what we have. It quickly became obvious that we need a way to automate the bootstrap process so we can allow our developers to start a new app (with our chosen technologies,  and all our build and code quality standards and best practices) in seconds instead of hours.

###Enter Yeoman

For those of you that have not come across it before, **[Yeoman](http://yeoman.io/)** is a collection of great tools that make your life as a developer easier. So much easier that once you start using them it's hard to imagine writing a line of code without them. For more information on Yeoman, Grunt and Bower I highly suggest reading through the docs and try to use them in your next project.

There a lot of amazing Yeoman generators out there. A great example of one is the **[Angular generator](https://github.com/yeoman/generator-angular)**. However. the true magic and power of Yeoman is that it allows you to create your own generators. Generators that you customize according to your stack and according to your ways of working. The [yeoman documentation](http://yeoman.io/generators.html) of how to create your own generator is straightforward, easy to follow and has some very good examples.

###Creating our first Generator
Sometimes we need to quickly create a client (Angular.js) app, some other times we want to create just a server (hapi.js) app and often we want to create both working together. So we decided to create one generator for our projects that will allow our developers to choose what type of app they want to create. This generator should also ask for some basic information regarding the app that it's going to create (eg. name, license, git repo etc). This information will allow us to easily create the package.json file of the app. In the case of creating both a server and a client app we also generate two directories in the root of the project for these separate apps to live in.

When our generator tries to create any app it actually invokes a sub-generator to perform this task. In more simple terms, if we want a client app, after prompting the user to provide us with some basic information, we then run the Angular subgenerator, which will create the project structure, the Grunt file and install any necessary dependencies (npm or bower modules). So let's take a closer look to our two sub-generators before describing some more features of our main generator.

####Angular Sub-Generator

##### Dependencies
When setting up an Angular app we provide the end user with two choices. Either perform a quick installation with our default options or answer some more questions so they can further customize the app. Performing a quick installation means that:

- the latest version of Angular will be installed
- the only Angular module that will also be installed is ngRoute
- no external client libraries will be installed (eg. jQuery, d3 etc)
- Zurb's Foundation framework will be installed for styles (latest version)

However, if the users want to they can:

- add a different version of Angular (which will also be applied to all Angular modules for compatibility reasons)
- add additional Angular modules (eg. ngAnimate, ngTouch)
- add external libraries they want to use (eg. jQuery, d3, moment etc)
- do not include Foundation for styles

This information allow our subgenerator to install any required dependencies for the app. However, the subgenerator does much more than dependency management. 

##### Project Structure
Although the [angular-seed](https://github.com/angular/angular-seed) project is a starting point for many Angular apps in the wild, we follow a different approach that we believe makes our apps much more scalable and maintenable. It is based on Pete Bacon Darwin's and Pawel Kozlowski's approach to [building a basic Angular CRUD app](https://github.com/angular-app/angular-app) (HIGHLY RECOMMENDED!). Instead of creating long `controllers.js`, `directives.js` etc files that easily grow out of control, we organize our project into modules based on the functionality of our app.

For example, let's say we have a login feature. We would have an angular login module (probably in its own directory). Any required controller, factory or directive for this feature would live under this module. This allows us to inject this module as a dependency to our app and keeps our code modular and reusable. 
Unit tests are also essential to any Angular app so we create a `src` and a `test` folder. The `test` folder structure always mirrors the `src` folder so we can add unit tests for each module we create.

##### Grunt configuration
Grunt is a key tool to all our projects. The generator creates a Gruntfile that is already set up with all the required tasks that we need to run during development or deployment. 

- The `grunt develop` task is used when a developer is working on the app. It runs `jshint` and `karma` unit tests, compiles our angular html templates into a js module, compiles our scss into css and concatenates our css and js files into one. It also watches for any changes in our source code and runs the corresponding tasks for the file type that changed (eg. run `compass` if scss file changed, run `jshint` and `karma` if js file changed).
- The `grunt build` task is obviously used when we want to run a build. Apart from the tasks of `grunt develop` it also minifies our css and js files, automatically creates our documentation based on our code comments and runs a series of reports on our code(eg. test coverage, static analysis reports).
- The `grunt server` task is there to give a LiveReload server to our front end developers. Changing a style in scss and see this applied to your browser without reloading the page makes their life so much easier.
- The `grunt test` task allows you to quickly run all unit tests.
- The `grunt reports` tasks generates our documentation, test coverage and static analysis reports.

##### Other important files

- `src/app/app.js`: This is the starting point of our Angular app. It has a very basic controller attached to it and any Angular modules that you requested during installation are also injected here as dependencies.
- `src/index.html`: The entry point of our app. It's templated in a way to allow for dynamically adding any script dependencies (eg. if ngRoute is installed it adds the script tag here). It also has the links to our app.css and app.js files which are the concatenated versions of all our css and js code.
- `src/styles/variables.scss`: This is a file where you can overwrite any Foundation 5 variables to allow you to customize the Foundation framework to your application's needs.

####Hapi Sub-Generator

##### Dependencies
These are handled in a way very similar to the way dependencies are managed for the Angular app. The default installation includes:

- latest version of hapi
- latest version of [joi](https://github.com/spumko/joi) and [catbox](https://github.com/spumko/catbox)
- latest versions of some key to our projects npm modules ([request](https://npmjs.org/package/request), [lodash](https://npmjs.org/package/lodash), [q](https://npmjs.org/package/q), [redis](https://npmjs.org/package/redis), [winston](https://npmjs.org/package/winston))

However, the user has the option to perform a manual installation and configure things, like the port of their server, if they need any noSQL DB installed (eg. MongoDB) etc.

#####Project Structure
Again the project structure follows a lot of the principles of the Angular subgenerator we created. This enforces consistency between our server side and client side code (everything is JavaScript anyway). We have created a very basic node web server with one route as an example. Once again there is a `test` folder that maps our `api` folder, highlighting how core unit tests are to our development workflow.

##### Grunt configuration
Our Gruntfile for the server side is very straightforward. It has a `grunt develop` task that is again used for active development and a `grunt build` task that we run during our builds. One thing to note is that we use `supervisor` as the npm module to restart our node server anytime there is a change to any server code.


###Enforcing Code Quality
As you can probably tell from the `grunt` tasks that we constantly run during our development, we give a great emphasis on maintaining high quality code standards and practices. For example, constantly running our unit tests any time a change is made to a js file, allows us to have instant feedback when we break something. But developers being developers there is always a chance that something will be pushed to our GitHub repo without meeting all our standards and eventually breaking our application. **Git Hooks to the rescue!**

As part of this generator we have included some git hooks to give us an extra layer of protection against a sloppy commit.

- Any time a developer is trying to commit code (even locally), we run our `grunt build` tasks. This is a very close simulation to our actual build so if a developer breaks the build at this point, they cannot even commit without fixing the issue. 
- Any time a developer is trying to push code we display a prompt to make sure they have peer reviewed their code.

Git hooks can be even more sophisticated than that but we feel that the ones we inculde in our generator is a good starting point.


###TODO

- Add E2E and unit test templates for our angular app.
- Add a validate commit message git hook with custom validation defined by the user

