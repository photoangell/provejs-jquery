## Decorators

A decorator is a jQuery plugin which:
- listens to prove events (validated.input.prove),
- decorates the form inputs using event data.

### Server Side Errors

On initial page load you might need to decorate your form with server-side errors. You can decorate your form with server side errors.
```javascript
var errors = {
	field1: 'Your server side error message.',
	field2: 'Your server side error message.'
};
form.prove(options);
form.decorate('bootstrap');
form.decorateErrors(errors);
```

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

The **validation valid** will be passed to the decorators via the `validated.input.prove` event data.
