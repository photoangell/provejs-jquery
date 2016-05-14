# Prove Validators

Each validator is simply a jquery plugin which validates the input value. The validator will return a validation result object as defined below. This result object is used as the event data that is passed to the decorators.

## Validator Return Object

Each validator should return either:
- result object defined below,
- jquery deferred which promises to return the result object below.

```javascript
{
	field: 'email', // field name
	validator: 'validatorName', // validator name
	status: 'validated',
	validation: 'success', // 'success', 'danger', 'warning', 'reset'
	message: 'Your error message or error code used by the validation decorator.'
}
```

Where `validation` is either:
- **'reset'**
	- Indicates no validation happened. No validation should happen when:
		- validator is disabled
		- input has no value (except required validators).
	- Decorators will teardown any decoration.
- **'success'**
	- Indicates the input is valid.
	- Decorators will decorate for success.
- **'danger'**
	- Indicates the input is not-valid.
	- Decorators will decorate for failure.
- **'warning'**
	- Indicates the input is valid, but with a warning.
	- Decorators will decorate for warning.

## Message

The message string passed input to the validators can be either:
- a string representing the actual message to show the user or
- an error code which the decorator has a list of predefined messages to decorate the form with (e.g. i18n support).

Your custom validators can change the message value.

## Deferred Validators

Creating deferred validators is easy. Please see [$.fn.proveDeferred()](./proveDeferred.js) for an example. 
