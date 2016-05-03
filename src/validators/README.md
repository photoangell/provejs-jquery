# Prove Validators

Each validator is simply a jquery plugin which validates the input(s) value.

## Validator Return Object

Each validator should return either:
- result object defined below,
- jquery deferred which promises to return the result object below.

Validation returned result object which used as event data to communicate with the decorators:
```javascript
{
	field: 'email', // field name
	validator: 'nameOfValidator', // validator name
	valid: true, // either true, false, undefined
	message: 'Your error message or error code used by the validation decorator.'
}
```

Where `valid` is either:
- **undefined**
	- Indicates no validation happened. No validation should happen when:
		- validator is disabled
		- input has no value (except required validators).
	- Decorators will teardown any decoration.
- **true**
	- Indicates the input is valid.
	- Decorators will decorate for success.
- **false**
	- Indicates the input is not-valid.
	- Decorators will decorate for failure.

