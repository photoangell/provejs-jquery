# Prove Validators

## Design
An input validator is a jquery plugin which validates an input's value. There are two types of validators:
- Synchronous - immediately returns a result object,
- Asynchronous - returns a deferred/promise that will return a result object in the future.

The validator result object is defined below and is used as the event data which the decorators listen. Therefore, the result object is passed to the decorators to decorate the form inputs.

### Synchronous Validators
Synchronous validators should return the result object below:

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

### Asynchronous Validators
Asynchronous validators can return the following objects:
- result
	- Required: true,
	- Description: returned when the asynchrous validator is finished validating.
	- Code: dfd.resolve(result)
- progress
	- Required: false,
	- Description: periodically notify of progress.
	- Code: dfd.notify(progress)
- error
	- Required: false,
	- Description: if ajax error return error object.
	- Code: dfd.reject(error)

### Message
The message option passed to the validators can be either:
- a string representing the actual message to show to the user or
- an error code which the decorator has a list of predefined messages to decorate the form with (e.g. i18n support).

Your custom validators can change the message value.

### Deferred Validators
Creating deferred validators is easy. Please see [$.fn.proveDeferredCallBack()](./deferred-callback.js) for an example.

## Reference
jquery-prove provides some validator plugins out of the box.

```javascript
form.prove({
	fields: {
		field1: {
			validators: {
				provePluginName: {
					// options
				}
			}
		}
	}
});
```

Below is an overview of these provided plugins.

### proveCallback
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `callback`
		- **Type:** function(string `fieldValue`) bool `valid`
		- **Required:** true
		- **Parameters:**
			- `value` (value of jquery element)
				- **Type:** string
				- value of 
		- **Return Value:**
		- **Description:** Function invoked to test whether the field is valid. The function's first parameter is the current value of the field. The return value should be a boolean indicating whether the field passed validation.

### proveCompareTo
- options:
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `compareTo`
	- `ignore`

### proveDeferredCallback
Basic example of a deferred validator.
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `validation`

### proveDeferredRemote
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** false
		- **Description:** Text to display when validation has failed.
	- `url`

### proveEqualTo
- options:
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `equalTo`

### proveLength
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `min`
	- `max`

### proveMax
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `max`

### proveMin
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `min`

### provePattern
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `regex`

### provePrecision
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.

### proveRequired
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `prefix`

### proveUnique
- options:
	- `debug`
		- **Type:** bool
		- **Required:** false
		- **Default:** false
		- **Description:** will print out some debug info in the developer console.
	- `enabled`
		- **Type:** [booleanator](../../README.md#booleanator),
		- **Required:** false
		- **Default:** true
		- **Descrption:** will enable the field for validation while the booleanator is true.
	- `message`
		- **Type:** string
		- **Required:** true
		- **Description:** Text to display when validation has failed.
	- `uniqueTo`
