# Angular util

AngularJS objects generator, similar to angular-generator but adapted to our structure.

## How it works?

To create an object, the following parameters are required:

 - **Object type**: at the moment the choice is limited to `controller`, `filter`, `service`, `factory` and `directive`
 - **Object name**: the name of the object you want to create. This must be in camel case, the script will do the rest if it need any string transformation.
 - **Module path**: with our app structure, the script need to locate where the module is, to insert the new object. For example, the path for `src/app/common/utils.js`, just provide `common/utils`, no path to the app folder and no file extension. If the file doesn't exist, the generator will create it for you.

Let say, you want to create a service called 'popupManager', in a module located in 'ui/popup.js'. You can type in your command line (it's quicker)
```
yo ghurt:angular-util service popupManager ui/popup
```
Or you can use the terminal interface by using:
```
yo ghurt:angular-util
```
Then a prompter will ask you the type, name and module path.

**Cheat code**: it might happen often that the object name and module name are the same. In that case just provide the path of the module as object name.
```
yo ghurt:angular-util controller boxes ui/ikea/storage/boxes
yo ghurt:angular-util controller ui/ikea/storage/boxes
```
These two lines got the same behaviour, the second one is just quicker. This trick works for command line as well as prompt interface.

## What is it doing?

For each of these object types, the generator is creating a piece of script in `src/app/` and a unit test in `test/unit/app/`. A view is also generated for every new controller.

## How to implement new object types?

This generator is built on a general object called `ngGenTools`. It contain an object for each command containing all necessary settings.

If the object type you want to add follows this convention(:object name and module path), updating ngGenTools.commands and adding your templates should be enough.

In every template, the object `tpl` will be accessible to help you:

 - **filePath**: path with file name without extension
 - **moduleName**: module name
 - **objectName**: object name in camel case
 - **objectNameDash**: object name in dash case
 - **objectNameClass**: object name capitalised