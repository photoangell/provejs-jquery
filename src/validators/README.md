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
