# Prove Validators

## Anatomy of Validators
- jQuery plugin with `this` context of the input to validate.
- Single input param of options:
	- `boolean` debug option: makes validator verbose
	- `booleanator` enabled option: enables or disables the validator
	- anything else the validator might need to perform validation.
- Returns
	- `true` on validation success
	- `false` on validation was not successful
	- `undefined` on validation was not performed (eg blank or empty input)
- If validator binds any events they should be bound to the form container
```javascript
//inside validator
$(this).closest('form').on()
```

You can make your own custom validator which is composed of other validators.

```javascript
//composable validator plugin - required email
$.fn.requiredEmail = function(options){
	var input = $(this);
	var check1 = input.proveRequired(options1);
	var check2 = input.provePattern(options2);
	return (check1 && check2);
};
```

## Validation Return Value

Each validator should return an object:
```javascript
{
	validator: 'proveRequired', // validator name
	result: true, // either true, false, undefined
	field: 'email' // field name
}
```

Where a `result` value of:
- **undefined**
	- Indicates no validation happened.
	- Decorators will teardown any decoration.
- **true**
	- Indicates the input is valid.
	- Decorators will decorate for success.
- **false**
	- Indicates the input is not-valid.
	- Decorators will decorate for failure.

When the validator is:

- **Enabled**
	- If the validator is not enabled then they should return `undefined`.
- **No Value**
	- If the validator has no value to validate they should return `undefined`. The only exeception to this is the proveRequired validator. In other words, all validators are optional execept for the a validator that tests for the existence of a value.
