# jquery-prove

> An event based jQuery plugin for client-side validation of html forms.

## Table Contents
- [Design Considerations](#design-considerations)
- [Advantages](#advanages)
- [Examples](#examples)
- [Prove Options](#prove-options)
- [Prove Validators](#prove-validators)
- [Prove Decorators](#prove-decorators)
- [Prove Events](#prove-events)
- [Destroy](#destory)
- [Other Libraries](#other-libraries)

## Design Considerations

How is this validator plugin different than other jquery plugin form validators?

- Explicit Validations
- Delagated Events
	- DOM Agnostic
	- Form Control Plugins
- Decorators as Plugins
	- Tinsel
	- Garland
	- Aria
	- Bootstrap
	- huntout('closest', ['selector1', 'selector2', 'selector3'])
- Validators as Plugins
	- Simple
	- Composable
	- Field config are plugin options

```javascript
//composable validator plugin - required email
$.fn.requiredEmail = function(options){
	var input = $(this);
	var check1 = input.proveRequired(options1);
	var check2 = input.provePattern(options2);
	return (check1 && check2);
};
```

Validator Anatomy
- jQuery plugin
- Single input options parameter which is the field validator config object.
- The `this` context is the DOM input to validate.
- Returns
	- `true` on validation success
	- `false` on validation was not successful
	- `undefined` on validation was not performed
- Accepts a boolean debug option
- Must return undefined on blank or empty input.


### Eplicit Validations

Unlike all other form validations this plugin primary focus is the validation rules and not the form inputs. During validations the plugin will loop the defined fields config looking for any inputs which might exist and if and only if the form input exists validate the input's value. All other plugins loop the inputs and validate the form inputs. This plugin loops the validations and could careless if a form input exists or not.

This plugin will validate only what you specify. If you do not define a field to be validated it will be not be validated. Also, if you define a field to be validated it will be validated event if the input is hidden, disabled, or readonly. All other plugins will validate what you don't want them to and expect you figure out how to exclude/ignore these inputs you did not ask be validated from being validated. They will also ignore inputs you explictly asked to be validated with no reasonable way to force the validation to happen. For example, try validating a form which uses jquery-multiselect on it using any of the other validation plugins.

### Validators

The validator methods should be seperate from the validation plugin. This is again because of seperation of concerns, but also because the validators maybe shared between the frontend and backend (via Node.js). Theis would imply that the validators should not be passed DOM references.

###Decoration

Form and input decorations should not be part of a validation plugin (e.g. seperation of concerns). The validation code should be loosely coupled with the decoration code by DOM events. The validation code triggers events and the decoration code listens to these events and decorates the DOM accordingly. See jquery-decorator.

###Delagated Events

All other form validation plugins attach keyup events directly to the form inputs to provide live validation to the user. These event listens should be **delegated** to the plugin container (ie normally the form tag) to allow for dynamic changes to the form DOM. Changes to the form DOM are common with most advanced form control plugins, dynamic HTML features.

Since all events are delagated to the form container cleanup of the DOM for single page applications as simple as form.remove(). You of course would need to cleanup up any field control plugins you have enabled on your form.

## Advantages

These design considerations have the following advantages:

* The form DOM can change at anypoint in time.
* You can define validation fields and validators in advance of the form inputs actually entering the DOM.
* Form control plugins can be instateated before or after the prove plugin.
* When form control plugins modify events you do not need to invoke the prove to validate any inputs.

## Examples

```javascript

var cfg = {
	fields: {
		field1: {
			selector: '', //any jquery selector, defaults to '[name="field1"]'
			validators: {
				required: {
					enabled: true, //true, false, selector (radio#other:checked), callback
					message: 'Please enter an amount.'
				},
				pattern: {
					enabled: true,
					regexp: "[0-9]",
					message: 'You have entered an invalid character.'
				},
				callback: {
					enable: true,
					method: function(...){

					},
					message: 'Some string or function'
				}
			},
			decoration: {
				classPlacement: '.error-class-placement', //any jquery selector
				errorPlacement: '.error-message-placement'
			}
		},
		field2: {
		...
		}
	}
};

var form = $('form');
form.prove(cfg);

//monitor all validation events
var allEvents = $.prove.allEvents; //array of event names
form.on(allEvents, function(event, data){
	console.log(event, data)
});

//decorate the form
form.on(['prove.success', 'prove.failure'], function(event, data){
	console.log(event, data)
	//todo: decorate form/inputs here
});
```

## Prove Options

todo

## Prove Validators

todo

## Prove Decorators

todo

## Prove Events

Prove is both a consumer and publisher of events.

### Published Events

The following events are published (emitted) by Prove. The decorator plugin listens to these events in order to decorate the form. Your code may also listen to these events.

#### Event: `validated.field.prove` ####
- **Description** A field has been validated.
- **Publisher** Form input DOM element.
- **Listener** Attach your listener to the form container.

```javascript
form.on('validated.field.prove', function(event, data){
	var input = $(event.target);
	var state = data.state; //validation state of input (true, false, null)
	var validator = data.validator;

	//do something
});
```

#### Event: `form.prove` ####

- **Description** All fields in the form have been validated.
- **Publisher** Form DOM element.
- **Listener** Attach your listener to the form container.

```javascript
form.on('form.prove', function(event, data){
	var form = $(event.target);
	var state = data.state; //validation state of form (true, false, null)
	var validators = data.validators;

	//do something, like submit form via ajax
});
```

### Listened To Events

Prove listens to the following events on the form container and inputs (delegated to the form container).

#### Event: `validate.form.prove` ####

- **Description** When Prove hears this event it will validate all fields.
- **Target** Form container.
- **Publisher** Your code.

```javascript
form.trigger('validate.form.prove');
```
You can also perform form validation by:

```javascript
var isValid = form.data('prove').validate();
```

#### Event: `validate.field.prove` ####

- **Description** When Prove hears this event it will validate just this input.
- **Target** Form input.
- **Publisher** Your code.

```javascript
input.trigger('validate.field.prove');

//todo: what is wrong with
input.trigger('change') //or
input.trigger('validate')
```

## Form Submission

You will need to stop browser from submitting the form by:

```javascript
form.submit(function(event){
	event.preventDefault();

	//do something else, like ajax submission of form
});
```

## Destroy

You can remove the Prove plugin by either:

```javascript
form.data('prove').destroy();
```
or

```javascript
form.remove();
```

## Contributing

### Setup

```bash
npm install grunt
npm install grunt-eslint
npm install grunt-contrib-concat
```

### Lint
```bash
grunt lint
```

### Build
```bash
grunt build
```

## Others Libraries

There are many other form validation libraries. Just about any of them will work great for simple forms. However, if you have complex forms good luck.

- http://www.formvalidator.net/
	- License:  MIT (declared in bower.json), but not license file.
	- Focus: Unobtrusive form validation declorations.
	- Concerns: It binds event handlers directly to the inputs rather delagate them to the form container. Merges decoration and validation together.
	- Development: Maintained and under active development.

- http://jqueryvalidation.org/
	- License: MIT 
	- Concerns: not actively being maintained. Be prepared to monkey patch.
	
- https://github.com/1000hz/bootstrap-validator
	- License: MIT
	
- http://formvalidation.io/
	- License: Commercial
	- Concerns: Merges decoration and validation into single lib.
	- Development: 

## Todo

proveRequired
1. why do we need the state now that we have field.enabled.
2. should accept regex or regex.source.

Prove.checkField() should be a jquery plugin so that we can:
```javascript
var isValid = input.proveField(field);
```

Reset input or form
```javascript
input.resetField()
input.trigger('reset.field.prove')
form.trigger.('reset.form.prove')
```


Create an FAQ.

Document events setup.field.prove and destroy.field.prove

Document anatomy of validators.
