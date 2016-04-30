> BETA: still under active development

# jquery-prove

> An event based jQuery plugin for client-side validation of html forms.

## Table Contents
- [Introduction](#introduction)
- [Advantages](#advanages)
- [Examples](#examples)
- [Options](#prove-options)
- [Validators](#prove-validators)
- [Decorators](#prove-decorators)
- [Events](#prove-events)
- [Destroy](#destory)
- [Other Libraries](#other-libraries)
- [Roadmap](#roadmap)

## Introduction

All of the other form validation libraries work great for simple forms. However, they all have short-comings when trying to validate complex forms. Complex forms have many hidden inputs and collections of inputs (eg tabs or panels). Complex forms have input plugins which modify the form DOM and hide the original inputs. Complex forms have inputs that dynamically inserted or removed from the form. These other form validation libraries make validating complex forms painful.

Below is a list design considerations that address the design problems of the other validators libraries.

### Explict Validation ###

Many of the form validation libraries will not validate hidden or readonly inputs. This fine for simple forms, but becomes a huge pain when you have a multiple input plugins that hide inputs and overlay them with dynamically generated DOM elements modeling an advanced input control. Form validation should be explicit. If you define a field to be validated it should be validated.

I would rather be able to directly control enable/disable of field validation using a [booleanator](./src/utilities/booleanator.js) that is evaluated at time of validation. A booleanator can be defined as either boolean, selector, or callback which is later evaluated to a boolean (true or false).

```javascript
fields: {
	field1: {
		//evaluated at time of validation
		//accepts true, false, selector, callback
		enable: 'fieldset#panel1:visible',
		validators: {
		}
	}
}
```

### Delagated Events ###

Form validation should not be dependent on an javascript references to the form DOM. This is particularly important if the form inputs are inserted or removed dynamically. If a field is defined to be validated, but there is no matching form inputs than the field validation should be skipped silently. If later during another validation attempt the inputs are now found in the form DOM then validation will happen as normally. This allows the developer to pre-define field validations before the inputs are actually in the DOM. This also allows for the removal of field inputs and re-inserting them later - validation will happen as expected.

This lib does not bind any events directly to the input DOM elements. All event binding is delegated to the form. You can delete, insert, or modify form input at anypoint and it will not impact form validation.

While unobtrusive form validation (ie defining the validation config as html data attributes) is not a design goal or feature of this library the goal of not saving a DOM reference would not preclude unbotrusive form validation.

### Form Decoration ###

Form validation libraries should not be directly decorating the form. The form validation libraries should not be adding validation classes, displaying messaging, changing ARIA attributes, or controlling internationalization of error messages. Form decoration should be handled by seperate plugins that are monitoring validation events and decorating the form and form inputs.

This lib introduces a number of [decorator plugins](./src/decorators) to decorate the form on validation events. It is trival to create your own decorator plugins.  You should not need to monkey patch a form validation library to change where you want your error messages to be displayed.

### jQuery Plugins ###

All other form validation libraries are jQuery plugins, but they stop there. They all create thier own proprietary framework for their validation rules and methods. Instead they should have just created their validator methods as jQuery plugins. This would allow the sharing of validators between form validation libs. As a general rule if you are passing in a DOM reference into a method, then you should consider making that method a jQuery plugin.

This lib makes heavy use of the jQuery plugin framework. All validators and decorators are standalone jQuery plugins. All of them are very composable, extendable, and widely understood by the development community. The only draw back of making a jquery plugin built from a suit of other jquery plugins is populuting the $.fn.* namespace. However, after working with design goal the benefits out weight the drawbacks. I believe the code easier to understand and maintain. The result is much cleaner smaller modules.

## Examples

Please see the [examples folder](./examples).

## Prove Options

###  Prove Options

Prove accepts only a single options config with only two properties: debug and fields.

```javascript
form.prove({
	debug: false, //optional (bool), defaults to false
	fields: { // fields to validate
		// see fields configuration below
	}
});
```

- `debug` - (bool) will print out some debug info in the developer console. Debug defaults to false.
- `fields` - (object) defines the field validations to be performed. See below for more details.

### Field Options
```javascript
form.prove({
	fields: {
		field1: {
			debug: false, //optional (bool)
			enabled: true, //optional (booleanator), defaults to true 
			selector: '.selector', //optional (string), defaults to '[name="field1"]'
			trigger: 'click change', //optional (string) defaults to 'change keyup click blur', live validate on these events.
			stateful: true, //optional (bool), defaults to true.
			group: false, //optional (bool), defaults to false for all but radio inputs.
			validators: {
				// see validator options
			}
		},
		field2: {
			// ...
		},
		field3: {
			// ...
		}
	}
});
```

- `debug` - optional (bool) will print out some debug info in the developer console. Debug defaults to false.
- `enabled` - optional (booleanator) defaults to true. A [booleanator]() is something (bool, selector, sudo-selector, function) that evaluates to either true or false. So for example, you specify enabled: ':visible' and the field config will be enabled when the input is visible. Or perhaps, enable validation when the input is not empty by setting enabled to ':filled'.
- `selector` - optional (string) defaults to '[name="field"]'. There are rare cases in which you want to validate a non-input for which you can specify a selector.
- `trigger` optional (string) defaults to 'change keyup click blur'. You change when live validation happens by changing the trigger value. 
- `stateful` - optional (bool) defaults to true. Prove is a stateful validator. You can disable stateful validation by setting stateful to false. Prove hashes the input value to determine if the input value has changed since last validation. Prove does this stateful validation with keeping a DOM reference to any inputs.
- `group` - optional (bool) which defaults to false for all but radio inputs. This option defines if prove should validate the inputs as a group or validate the found inputs indivdually. 

### Validator Options

Prove has a powerful set of validators. A validator is just a jquery plugin. See [validators](./src/validators) for more information.

```javascript
form.prove({
	fields: {
		field1: {
			validators: {
				proveRequired: {
					debug: true, // optional (bool), defaults to false
					enabled: true, //optional (booleanator), defaults to true
					message: 'Message to pass to the decorator.'
				},
				provePattern: {
					regex: /^[my regex pattern]$/,
					message: 'Message to pass to the decorator'
				},
				// ...
			}
		},
		field2: {
			// ...
		},
		field3: {
			// ...
		}
	}
});
```
Each validator has it's own set of options but below is a set of the common options to all prove validators.
- `debug` - optional (bool) defaults to false. Will enalbe the validator to print debug information in the developer console.
- `enabled` - optional (booleanator) defaults to true. See [booleanator]() for more information.
- `message` - optional (string) defaults to undefined. This string is passed into the validator which allows your custom validators to modifiy it. Utlimately, this message value is passed to the decorators via the event data.

## Prove Validators

todo

## Prove Decorators

todo

## Prove Events

Prove is both a consumer and publisher of events.

### Published Events

The following events are published (emitted) by Prove. The decorator plugin listens to these events in order to decorate the form. Your code may also listen to these events.

#### Event: `validated.input.prove` ####
- **Description** A field has been validated.
- **Publisher** Form input DOM element.
- **Listener** Attach your listener to the form container.

```javascript
form.on('validated.input.prove', function(event, data){
	var input = $(event.target);
	var state = data.state; //validation state of input (true, false, null)
	var validator = data.validator;

	//do something
});
```

#### Event: `validated.form.prove` ####

- **Description** All fields in the form have been validated.
- **Publisher** Form DOM element.
- **Listener** Attach your listener to the form container.

```javascript
form.on('validated.form.prove', function(event, data){
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
However, you should can simply call:

```javascript
var isValid = form.validate();
```

#### Event: `validate.input.prove` ####

- **Description** When Prove hears this event it will validate just this input.
- **Target** Form input.
- **Publisher** Your code.

```javascript
input.trigger('validate.input.prove'); // or input.validate()
```

## Form Submission

todo: document submit intercept options here.

Should you want to stop the normally form submittion you will need to bind a handler to the form submit event:

```javascript
form.submit(function(event){
	event.preventDefault(); // stop form submit

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
npm install grunt-contrib-uglify
```

### Lint
```bash
grunt lint
```

### Build
```bash
grunt build
```

## Other Libraries

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

## Roadmap



### Deferred [validators](./src/core/README.md#deferred-validation).

### Server Errors Decotorator

On intial load of the page the form might have some server errors which need decoratoring.
```javascript
var errors = {{{json errors}}}; //custom `json` handlebars helper
form.decorate('bootstrap', errors);
form.prove(options);
```

### Custom Decorators

Provide the ability to specify a custom decorator for a specific field. We could have a field like:
```javascript
form.prove({
	fields: {
		field1: {
			decorator: false,
			validators: {
			//...
			}
		}
	}
});

form.decorate('bootstrap'); //default decorator, but will ignore the field1 events
form.decorateCustom(); //will ignore all events, except field1
```
The default decorators could ignore these prove input events for this field. Which would allow us to create another dectorator which only dectorates this field's inputs. 

### Reset Input and Forms

Reset input or form
```javascript
input.resetField()
input.trigger('reset.field.prove')
form.trigger.('reset.form.prove')
```

### FAQ

Create an FAQ of frequenty asked questions and answers.


