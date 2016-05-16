![Form Image](./media/logo.png)
> A jQuery plugin for client-side validation of html forms.

![Form Image](./media/form.png)

## Introduction

jquery-prove is a client-side form validation plugin:

- Input [validators](./src/validators) are jQuery plugins.
- Input [decorators](./src/decorators) are jQuery plugins.
- Validators share data with decorators via events.
- Validators can be:
	- synchronous - return result immediately.
	- asynchronouscan - return jquery deferred which returns result later.
- Delegated events to the form so the form DOM can be modified at anytime.
- Explict control over configuration options via dynamic [booleanators](#booleanator).
- Modular design via a suite of jQuery [utility plugins](./src/utilities).
- Live and form submit validation.
- Stateful validations.
- Open source MIT license.

## Table Contents
- [Examples](#examples)
- [Options](#prove-options)
- [Validators](#prove-validators)
- [Decorators](#prove-decorators)
- [Methods](#prove-methods)
- [Events](#prove-events)
- [Destroy](#destory)
- [Roadmap](#roadmap)

## Examples

Please see [examples folder](./examples).

## Prove Options

###  Prove Options

Prove accepts only a single options config.

```javascript
form.prove({
	debug: false,
	fields: {
		// see fields options below
	},
	submit: {
		// see submit options below
	}
});
```

- `debug`
	- **Type:** bool,
	- **Required:** false,
	- **Default:** false,
	- **Description:** will print out debug info in the developer console.
- `fields`
	- **Type:** object,
	- **Required:** true,
	- **Description:** defines the field validations to be performed. See below for more details.
- `submit`
	- **Type:** object,
	- **Required:** false,
	- **Description:** defines the submit intercept handler options. See below for more details.

### Field Options
```javascript
form.prove({
	fields: {
		field1: {
			debug: false,
			enabled: true,
			selector: '[name="field1"]',
			trigger: 'click change',
			stateful: true,
			group: false,
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

- `debug`
	- **Type:** bool
	- **Required:** false,
	- **Default:** false,
	- **Description:** will print out some debug info in the developer console. Debug defaults to false.
- `enabled`
	- **Type:** booleanator,
	- **Requied:** false,
	- **Default:** true,
	- **Descrption:** will enable the field for validation. A value of ':visible' will only validate the input if the input if visible. A [booleanator](#booleanator) is something (bool, selector, sudo-selector, function) that evaluates to either true or false. So for example, you specify enabled: ':visible' and the field config will be enabled when the input is visible. Or perhaps, enable validation when the input is not empty by setting enabled to ':filled'.
- `selector`
	- **Type:** string,
	- **Required:** false,
	- **Default:** '[name="field"]',
	- **Description:** jQuery selector which you can shift the context of the validation.
- `trigger`
	- **Type:** string or false,
	- **Required:** false,
	- **Default:** 'change keyup click blur',
	- **Description:** The events on which you want to live validation to happen. A value of false will disable live validation.
- `throttle`
	- **Type:** int,
	- **Required:** false,
	- **Default:** 0,
	- **Description:** The number of milliseconds to throttle (aka debounce) live validation.
- `stateful`
	- **Type:** bool,
	- **Required:** false,
	- **Default:** true,
	- **Description:** jquery-prove is a stateful validator. You can disable stateful validation by setting stateful to false. Prove hashes the input value to determine if the input value has changed since last validation. Prove does this stateful validation without keeping a DOM reference to any inputs.
- `group`
	- **Type:** bool,
	- **Required:** false,
	- **Default:** false for all but radio inputs,
	- **Description:** should jquery-prove validate the found inputs as a group or validate the found inputs indivdually.

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
- `debug`
	- **Type:** bool,
	- **Required:** false,
	- **Default:** false,
	- **Description:** Will enalbe the validator to print debug information in the developer console.
- `enabled`
	- **Type:** booleanator,
	- **Required:** false,
	- **Default:** true,
	- **Description:** enable or disable validation depending on the value of the booleanator.
- `message`
	- **Type:** string,
	- **Required:** true,
	- **Description:** This string is passed into the validator which allows your custom validators to modifiy it. Utlimately, this string value is passed to the decorators via the event data.

### Submit Options

jQuery-Prove uses a submit intercept handler which ensures successful form validation before allowing the form to submit. The submit intercept handler is bound by default to `form.on('click', ':submit', handler)` so really the intercept handler is really a click handler. The submit intercept handler accepts the following options:
```javascript
form.prove({
	fields: {},
	submit: {
		selector: 'button:submit',
		validate: true,
		enabled: true,
	}
})
```
Where:
- `debug`
	- **Type:** bool,
	- **Required:** false,
	- **Default:** false,
	- **Description:** Will enalbe the submit intercept handler to print debug information in the developer console.
- `selector`
	- **Type:** - string,
	- **Required:** - false,
	- **Default:** - 'button:submit',
	- **Description:** - jquery selector used to bind the submit intercept handler.
- `validate`
	- **Type**: - booleanator,
	- **Required:** - false,
	- **Default:** - true,
	- **Description:** - determines if validation should happen when the intercept handler is invoked. If you want the form to submit without validation then set this to a value of false, 'button:submit:not('.skip-validation')' and add class 'skip-validation' (see [booleanator](#booleanator)) or your code could just call `form.submit()'.
- ` enabled`
	- **Type**: - booleanator,
	- **Required**: false,
	- **Default**: true,
	- **Description**: Enables the form to submit after it validates true.

Should you want to stop the normally form submission you will need to bind a handler to the form submit event:

```javascript
form.submit(function(event){
	event.preventDefault(); // stop form submit

	//do something else, like ajax submission of form
});
```

## Prove Validators

Input validation is handled by jQuery [validator plugins](./src/validators).

## Prove Decorators

Form decoration is handled by jQuery [decorator plugins](./src/decorators).

## Prove Methods

The form will automatically be validated when the user clicks the submit button. However, you can programatically validate the form:
```javascript
var dfd = form.validate();
dfd.done(function(isValid){
	console.log('validation', isValid);
});
```
Your code can also validate an input.
```javascript
input.validate(); //returns chainable input reference
```
If you want to by pass validation and immediately submit the form:
```javascript
form.submit();
```

## Prove Events

Prove is a publisher of events. Events are triggered on either the input or the form to share data with the decorators.
- [status.form.prove](./EVENTS.md#) - triggered on the **form**
- [status.input.prove](./EVENTS.md#) - triggered on the **input**

Please see [events](./EVENTS.md) for more details.

## Destroy

You can remove the Prove plugin by either:

```javascript
form.data('prove').destroy();
```
or

```javascript
form.remove();
```

## Booleanator

Many of the Prove options are booleanators. A booleanator is a dynamic configuration option which is evaluated by Prove immediately before it is used. It can be defined as either:

- **Bool:**
	- Evaluation: uses the bool value.
	- Values: true or false,
- **jQuery DOM Selector:**
	- Evaluation: if the DOM selection returns any elements then it evaluates to true otherwise false.
	- Context: the context of the DOM selection is the window.document.
	- Examples: 'fieldset#section:visible', 'input[type="hidden"]:empty', '#other-checkbox:checked'
- **jQuery DOM Pseudo-Selector:**
	- Evaluation: if the DOM selection returns any elements then it evaluates to true otherwise false.
	- Context - the context of the DOM selection is the input.
	- Examples: ':visible', ':empty'
- **Javascript Function:**
	- Evaluation: function should return either true or false and accepts no inputs.
	- Example: function(){ return window.myVar; }

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

Document and test when the deferred validator should call:
- dfd.resolve()
- dfd.notify()
- dfd.reject()

and what value should be returned in each case?

How should these plugins handle these notify ogress and reject:
- $.fn.proveInput()
- $.fn.proveForm()

### Deferred Email Validation with MailGun email validator
It would be nice to have a real deferred example.

### Warning Decoration
The bootstrap decorators should be decoratoring for warnings.

### Unobtrusive Configuration

Perhaps support unobtrusive configuration via $.fn.proveConfig().
```javascript
var options = form.proveConfig();
form.prove(options);

// or if you dynamically insert an input, but for some reason did not already config the field
input.proveConfig();
```

### Unit Tests

Need unit tests.

### FAQ

Create an FAQ of frequenty asked questions and answers.


