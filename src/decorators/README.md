## Decorators

Decorators should do the following on validation result valid:
- `undefined`
	- Indicates no validation happened.
	- Decorators should teardown any decoration.
- `true`
	- Indicates the input is valid.
	- Decorators should decorate for success.
- `false`
	- Indicates the input is not-valid.
	- Decorators should decorate for failure.

The **validation valid** will be passed to the decorators via the `validated.field.prove` event data.
