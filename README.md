# generator-capinnovation

A generator for [Yeoman](http://yeoman.io).

![](http://i.imgur.com/JHaAlBJ.png)

## How it works?

This generator has been built with Yeoman, to make your life easier and create a repo ready to use. It can be used for client side only, or server side only or a combination of both. The idea is to be able to build an application, based on the framework requested. At the moment the generator can only create AngularJS app for the client side, and HapiJS for the server side.

## How is it built?

As explained before, there are different frameworks available. So to keep the main generator as clear as possible, each framework got its own subgenerator. The master generator is only here to pick up the one you want and build your app.

Every subgenerator can be called separately, but by not using the main generator, some options will not be configured, like initializing a git repo to your directory or setting up git hooks for code quality.

For further information, check the readme file in each subgenerator folder.

## How to use it?

This package is a Yeoman generator, so you will first need to install `yo` on your computer.

```
$ npm install -g yo
```

Then install generator-capinnovation from npm, run:

```
$ npm install -g generator-ghurt
```

Finally, initiate the generator in the repo you want:

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

