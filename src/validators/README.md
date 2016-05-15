# Prove Validators

An input validator is a jquery plugin which validates the input value. There are two types of validators:
- Synchronous - immediately returns a result object,
- Asynchronous - returns a deferred/promise that will return a result object in the future.

The validator result object is defined below and is used as the event data which the decorators listen. Therefore, the result object is passed to the decorators to decorate the form inputs.

## Synchronous Validators

A synchronous validators should return the result object below:

```javascript
{
	field: 'fieldName',
	validator: 'validatorName',
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

## Asynchronous Validators

Asynchronous validators can return return the following:
- validated result object
	- Required: true,
	- Description: returned when the asynchrous validator is finished validating.
	- Code: dfd.resolve(result)
- progress object
	- Required: false,
	- Description: periodically notify of progress.
	- Code: dfd.notify(progress)
- reject object
	- Required: false,
	- Description: if ajax error or validation error return reject object.
	- Code: dfd.reject(reject)

## Message

The message string passed input to the validators can be either:
- a string representing the actual message to show the user or
- an error code which the decorator has a list of predefined messages to decorate the form with (e.g. i18n support).

Your custom validators can change the message value.

## Deferred Validators

Creating deferred validators is easy. Please see [$.fn.proveDeferred()](./deferred.js) for an example. 
