# Prove Validators

## Anatomy of Validators
- jQuery plugin
- Single input options parameter which is the field validator config object.
- The `this` context is the DOM input to validate.
- Returns
	- `true` on validation success
	- `false` on validation was not successful
	- `undefined` on validation was not performed (eg blank or empty input)
- Accepts a boolean debug option
- Accepts a booleanator enabled option
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

## Validation State

Each validator should only return the following values:
- `undefined`
	- Indicates no validation happened.
	- Decorators will teardown any decoration.
- `true`
	- Indicates the input is valid.
	- Decorators will decorate for success.
- `false`
	- Indicates the input is not-valid.
	- Decorators will decorate for failure.

When the validator is:

- **Enabled**
	- If the validator is not enabled then they should return `undefined`.
- **No Value**
	- If the validator has no value to validate they should return `undefined`. The only exeception to this is the proveRequired validator. In other words, all validators are optional execept for the a validator that tests for the existence of a value.
