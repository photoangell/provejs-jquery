# Prove Validators

## Anatomy of Validators

Each validator is simply a jquery plugin which validates the input(s) value.

## Validator Return Value

Each validator should return either:
- result object defined below,
- jquery deferred which promises to return the result object below.

Validation returned result object:
```javascript
{
	validator: 'nameOfValidator', // validator name
	message: 'Your error message or error code used by the validation decorator.',
	field: 'email', // field name
	valid: true // either true, false, undefined
}
```

Where `valid` is either:
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
