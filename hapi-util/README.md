# Hapi util

Hapi route generator. Via command, prompt or file.

## How it works?

To create a route, the following parameters are required:

 - **Http verb**: method used for the new route : `*`, `GET`, `POST`, `DELETE`, `PUT`...
 - **Path**: automatically prefixed with `/app/`. The path can have param using the Hapi syntax, like `{yoghurtID}` to transform a part of the path as route parameter.

To use the generator, three ways are possible.

#### Prompt
Use the basic command to display a prompt which will help you to generate your route. The command will display a list of http verbs to chosse then will ask you to provide the path of your route.
```
yo ghurt:hapi-util
```

#### Command line
Use the basic command with data as parameters to generate your route. The example is to generate a GET route to /api/about/milk
```
yo ghurt:hapi-util get about/milk
```

#### File
This is experimental. The idea is to define all the API routes in a script called `routes.js` in the root folder, following the example structure. Then a simple command with the option `-install` will generate all your routes.
```js
// routes.js
'use strict';

module.exports = [
	{
		method: 'GET',
		route: '/about'
	},
	{
		method: 'GET',
		route: '/yoghurt/{id}'
	},
	{
		method: 'POST',
		route: 'yoghurt/{id}'
	}
];
```
Then run the generator
```
yo ghurt:hapi-util -install
```

When you define a route, feel free to begin the path with a `/` or not. The generator will format it.

## What is it doing?

For each route, there is:

 - **a handler** which treat the request and generate the response.
 - **a router** where the route settings are defined and the handler is linked
 - **the server** where all routers are given to the server object
 
Example: for the route `GET` `hello/world`

 - handler : `src/api/hello/getWorld/getWorld.js`
 - router : `src/api/hello/helloRoutes.js`
 - server : `server.js` (and will always be server.js)

The principle is to use the first chunk of the path as router name. The `src/api/` folder is managed to have a subfolder for each router.

## Command options

```
yo ghurt:hapi-util [-force] [ -install | <http-verb> <path> ]
```

 - `-install` : use routes.js to generate all the routes
 - `-force` : force the overwriting on all files
 - `http-verb` : method used for the route (get, post, delete..)
 - `path` : path of the route