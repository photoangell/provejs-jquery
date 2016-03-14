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

## Introduction

All of the other form validation libraries work great for simple forms. However, they all have short-comings when trying to validate complex forms. Complex forms have many hidden inputs and collections of inputs (eg tabs or panels). Complex forms have input plugins which modify the form DOM and hide the original inputs. Complex forms have inputs that dynamically inserted or removed from the form. Thes other form validation libs make validating complex forms painful. 

Below is a list design considerations that address design problems of the other validators libraries.

### Explict Validation ###

Many of the form validation libraries will not validate hidden or readonly inputs. This fine for simple forms, but becomes a huge pain when you have a multiple input plugins that hide inputs and overlay them with dynamically generated DOM elements modeling an advanced input control. Form validation should be explicit. If you define a field to be validated it should be validated. 

I would rather be able to directly control enable/disable of field validation using a [booleanator](./src/utilities/jquery-booleanator.js) that is evaluated at time of validation. A booleanator can be defined as either true, false, selector, or callback which is later evaluated to either true or false.

```javascript
fields: {
	field1: {
		enable: 'fieldset#panel1:visible', //evaluated at time of validation: true, false, selector, callback
		validators: {
		}
	}
}
```

### Delagated Events ###

Form validation should not be dependent on the state of the form inputs. This is particularly important if the form inputs are inserted dynamically. If a field is defined to be validated, but there is no matching form inputs than the field validation should be skipped silently. If later during another validation attempt the inputs are now found in the form than validation will happen as normally. This allows us to pre-define field validations before the inputs are actually in the DOM. This also allows for the removal of field inputs and re-inserting them later - validation will happen as expected.

This lib does not bind any events directly to the input elements. All event binding is delegated to the form. You can delete, insert, or modify form input at anypoint and it will not impact form validation.

### Form Decoration ###

Form validation libraries should not be directly decorating the form. Form decoration should be handled by a seperate plugin that is monitoring validation events and decorating the form and form inputs.

This lib introduces a number of [decorator plugins](./src/decorators) to decorate the form on validation events. It is trival to create your own decorator plugins.

### jQuery Plugins ###

All other form validation libraries are jQuery plugins, but they stop there. They all create thier own proprietary framework for their validation rules and methods. Instead they should have just created their validator methods as jQuery plugins. This would allow the sharing of validators between form validation libs. As a general rule if you are passing in a DOM reference to a method, then you should consider making that method a jQuery plugin.

This lib makes heavy use of the jQuery plugin framework. All validators and decorators are standalone jQuery plugins. All of them are very composable, extendable, and widely understood by the development community.

## Examples

todo

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
