# generator-capinnovation

A generator for [Yeoman](http://yeoman.io).

![](http://i.imgur.com/JHaAlBJ.png)

## How it works?

This generator has been built with Yeoman, to make your life easier and make a repo ready to use. It can be used for client side only, or server side only or a combinaison of both. The idea is to can build a repo, based on the framework requested. At the moment the generator can only create AngularJS app for the client side, and HapiJS for the server side.

## How is it built?

As explained before, there different frameworks available. So to keep the repo as clear as possible, each framework got his own subgenerator. The master generator is only here to pickup the one you want and build your repo.

Every subgenerator can be called separately, but by passing out of the main generator, some options can miss, like the git init.

For further informations, check the readme file in each subgenerator folder.

## How to use it?

This package is a Yeoman generator, so you will need first to install `yo` on your computer.

```
$ npm install -g yo
```

Then install generator-capinnovation from npm, run:

```
$ npm install -g generator-capinnovation
```

Finally, initiate the generator in the repo you want:

```
$ yo capinnovation
```

## then..

After the last command, the questionning and the downloading of hundreds of node packages: your repo is ready. 

 - [Grunt](http://gruntjs.com) : the javascript task runner
 - [Bower](http://bower.io) : a package manager for the web
 - [Git](http://git-scm.com) : version control system 
 - [Node](http://nodejs.org) : scalable network applications


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
