# generator-ghurt

A generator for [Yeoman](http://yeoman.io).

![](http://i.imgur.com/JHaAlBJ.png)

## How it works?

This generator has been built with Yeoman, to make your life easier and create a repo ready to use. It can be used for client side only, or server side only or a combination of both. The idea is to be able to build an application, based on the framework requested. At the moment the generator can only create AngularJS app for the client side, and HapiJS for the server side.

## How is it built?

As explained before, there are different frameworks available. So to keep the main generator as clean as possible, each framework got its own subgenerator. The master generator is only here to pick up the one you want and build your app.

Every subgenerator can be called separately, but by not using the main generator, some options will not be configured, like initializing a git repo to your directory or setting up git hooks for code quality.

## How to install it?

This package is a Yeoman generator, so you will first need to install `yo` on your computer.

```
$ npm install -g yo
```

Then install generator-ghurt from npm, run:

```
$ npm install -g generator-ghurt
```

## How to use it?

In order to use the generator just create a new project directory and run the following command from this directory.

```
$ yo ghurt
```

If you only want to run a subgenerator:

```
$ yo ghurt:angular #for the angular subgenerator
```
```
$ yo ghurt:hapi #for the hapijs subgenerator
```

For further information, check the README file in each subgenerator folder.
- [Angular](./angular)
- [Hapi](./hapi)

## Additional Utilities

We also provide you with a set of tools to make your development in Angular and Hapi much easier.
For example, you can use a simple command to create all the boilerplate code for your Angular controllers, directives etc or set up a new Hapi route.

If you want to use our Angular utilities:

```
$ yo ghurt:angular-util
```

If you want to use our Hapi utilities:

```
$ yo ghurt:hapi-util
```

In order to see what these tools do for you we highly recommend to take a look at the README files: 

- [Angular utilities](./angular-util)
- [Hapi utilities](./hapi-util)

## Then..

After providing any required information and configuration to the generator, it will install the required dependencies and you are ready to roll! 

 - [Grunt](http://gruntjs.com) : the javascript task runner
 - [Bower](http://bower.io) : a package manager for the web
 - [Git](http://git-scm.com) : version control system 
 - [Node](http://nodejs.org) : scalable network applications

### Author
**Capgemini Digital Innovation Lab**

### Contributors
- [Max Duluc](https://github.com/maxwellito)
- [Lefteris Paraskevas](https://github.com/lefos987)
- [Cam Parry](https://github.com/wallies)




## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

