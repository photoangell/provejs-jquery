# jquery-prove

An event based validation plugin used for client-side validation of html forms.

## Design Considerations

How is this validator plugin different than other jquery plugin form validators?

###Validations

Unlike all other form validations this plugin primary focus is the validation rules and not the form inputs. During validations the plugin will loop the defined fields config looking for any inputs which might exist and if and only if the form input exists validate the input's value. All other plugins loop the inputs and validate the form inputs. This plugin loops the validations and could careless if a form input exists or not.

This plugin will validate only what you specify. If you do not define a field to be validated it will be not be validated. Also, if you define a field to be validated it will be validated event if the input is hidden, disabled, or readonly. All other plugins will validate what you don't want them to and expect you figure out how to exclude/ignore these inputs you did not ask be validated from being validated. They will also ignore inputs you explictly asked to be validated with no reasonable way to force the validation to happen. For example, try validating a form which uses jquery-multiselect on it using any of the other validation plugins.

### Validators

The validator methods should be seperate from the validation plugin. This is again because of seperation of concerns, but also because the validators maybe shared between the frontend and backend (via Node.js). Theis would imply that the validators should not be passed DOM references.

###Decoration

Form and input decorations should not be part of a validation plugin (e.g. seperation of concerns). The validation code should be loosely coupled with the decoration code by DOM events. The validation code triggers events and the decoration code listens to these events and decorates the DOM accordingly. See jquery-decorator.

###Delagated Events

All other form validation plugins attach keyup events directly to the form inputs to provide live validation to the user. These event listens should be **delegated** to the plugin container (ie normally the form tag) to allow for dynamic changes to the form DOM. Changes to the form DOM are common with most advanced form control plugins, dynamic HTML features.

## Advantages

These design considerations have the following advantages:

* The form DOM can change at anypoint in time.
* You can define validation fields and validators in advance of the form inputs actually entering the DOM.
* Form control plugins can be instateated before or after the prove plugin.
* When form control plugins modify events you do not need to invoke the prove to validate any inputs.

## Usage

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

## Events

Prove is both a consumer and publisher of events.

### Published Events

The following events are emitted by Prove on the form container. The decorator plugin listens to these events in order to decorate the form. Your code may also listen to these events.

**`field.prove`**
- **Description** A field has been validated. The event data indicates validation state.
- **Publisher** Form input DOM element.
- **Listener** Attached your listner to the form container.

```javascript
form.on('field.prove', function(event, data){
	var input = $(event.target);
	var state = data.state;
	var validator = data.validator;

	//do something
})
```

**`field.prove`**

### Listened To Events

Prove listens to the following events on the form container and inputs (delegated to the form container).

`validate.form.prove`
`validate.field.prove`


## Others

- http://formvalidation.io/
- http://jqueryvalidation.org/
	- Issue: multiple inputs with same name
		- http://stackoverflow.com/questions/931687/using-jquery-validate-plugin-to-validate-multiple-form-fields-with-identical-nam/4136430#4136430
		- https://github.com/jzaefferer/jquery-validation/pull/717
		- http://blog.kyawzinwin.me/jquery-validation-for-array-of-input-elements/
		- http://www.codeboss.in/web-funda/2009/05/27/jquery-validation-for-array-of-input-elements/
	- Issue: any input (ie tagsinput) without name attribute will throw an error
		- ignore: '*:not([name])'
		- https://github.com/jzaefferer/jquery-validation/labels/name-attribute
- http://www.formvalidator.net/

##

