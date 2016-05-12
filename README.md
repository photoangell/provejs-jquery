# jquery-prove

> A jQuery plugin for client-side validation of html forms.
> Still under active development.

## Table Contents
- [Introduction](#introduction)
- [Examples](#examples)
- [Options](#prove-options)
- [Validators](#prove-validators)
- [Decorators](#prove-decorators)
- [Events](#prove-events)
- [Destroy](#destory)
- [Other Libraries](#other-libraries)
- [Roadmap](#roadmap)

## Introduction

jquery-prove is a client-side form input validation with the following features:
- Input validators are jQuery plugins.
- Input decorators are jQuery plugins.
- Validators share data with decorators via events.
- Validators can return immediately or can return a deferred validation result.
- Stateful validation results.
- All events are delagated to the form so inputs can be dynamically inserted/removed at any time.
- Explict control over configuration via [booleanators](#booleanator).
- Modular design via a suite jQuery utility plugins.

Please read [background notes](./BACKGROUND.md) on why yet another jQuery plugin.

## Examples

Please see [examples folder](./examples).

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
- `enabled` - optional (booleanator) defaults to true. A [booleanator](#booleanator) is something (bool, selector, sudo-selector, function) that evaluates to either true or false. So for example, you specify enabled: ':visible' and the field config will be enabled when the input is visible. Or perhaps, enable validation when the input is not empty by setting enabled to ':filled'.
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
- `enabled` - optional (booleanator) defaults to true. See [booleanator](#booleanator) for more information.
- `message` - optional (string) defaults to undefined. This string is passed into the validator which allows your custom validators to modifiy it. Utlimately, this message value is passed to the decorators via the event data.

## Prove Validators

Prove validators are handled by jQuery [validator plugins](./src/validators).

## Prove Decorators

Form decoration is handled by jQuery [decorator plugins](./src/decorators).

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

## Roadmap

### Deferred [validators](./src/core/README.md#deferred-validation).

### Change Event Data

Consider changing `validated.input.prove` to `status.input.prove`.

This change would allow for decoration of:
- setup: initialization of prove, which is useful for aria decoration
- validating: start of validation, which is useful for async spinners
- validated: validation completed, which is useful for garland and tinsel

`status.input.prove` or `workflow.input.prove`
```javascript
{
    field: 'email',
    validator: 'validator', //validator name or undefined
    workflow: 'validated', //'setup', 'validating', 'validated', 'destroy'
    status: 'success', //'success', 'failure', 'warning', 'reset'
    message: 'Your error or warning message.'
}
```

### Unobtrusive Configuration

Perhaps support unobtrusive configuration via $.fn.proveConfig().
```javascript
var options = form.proveConfig();
form.prove(options);

// or if you dynamically insert an input
input.proveConfig();
```

### Unit Tests

### Reset Input and Forms

Reset input or form
```javascript
input.resetField()
input.trigger('reset.field.prove')
form.trigger.('reset.form.prove')
```

### FAQ

Create an FAQ of frequenty asked questions and answers.


