# Background

All of the other form validation libraries work great for simple forms. However, they all have short-comings when trying to validate complex forms. Complex forms have many hidden inputs and collections of inputs (eg tabs or panels). Complex forms have input plugins which modify the form DOM and hide the original inputs. Complex forms have inputs that dynamically inserted or removed from the form. These other form validation libraries make validating complex forms painful.

Below is a list design considerations that address the design problems of the other validators libraries.

### Explict Validation ###

Many of the form validation libraries will not validate hidden or readonly inputs. This fine for simple forms, but becomes a huge pain when you have a multiple input plugins that hide inputs and overlay them with dynamically generated DOM elements modeling an advanced input control. Form validation should be explicit. If you define a field to be validated it should be validated.

I would rather be able to directly control enable/disable of field validation using a [booleanator](./src/utilities/booleanator.js) that is evaluated at time of validation. A booleanator can be defined as either boolean, selector, or callback which is later evaluated to a boolean (true or false).

```javascript
fields: {
	field1: {
		//evaluated at time of validation
		//accepts true, false, selector, callback
		enable: 'fieldset#panel1:visible',
		validators: {
		}
	}
}
```

### Delagated Events ###

Form validation should not be dependent on an javascript references to the form DOM. This is particularly important if the form inputs are inserted or removed dynamically. If a field is defined to be validated, but there is no matching form inputs than the field validation should be skipped silently. If later during another validation attempt the inputs are now found in the form DOM then validation will happen as normally. This allows the developer to pre-define field validations before the inputs are actually in the DOM. This also allows for the removal of field inputs and re-inserting them later - validation will happen as expected.

This lib does not bind any events directly to the input DOM elements. All event binding is delegated to the form. You can delete, insert, or modify form input at anypoint and it will not impact form validation.

While unobtrusive form validation (ie defining the validation config as html data attributes) is not a design goal or feature of this library the goal of not saving a DOM reference would not preclude unbotrusive form validation.

### Form Decoration ###

Form validation libraries should not be directly decorating the form. The form validation libraries should not be adding validation classes, displaying messaging, changing ARIA attributes, or controlling internationalization of error messages. Form decoration should be handled by seperate plugins that are monitoring validation events and decorating the form and form inputs.

This lib introduces a number of [decorator plugins](./src/decorators) to decorate the form on validation events. It is trival to create your own decorator plugins.  You should not need to monkey patch a form validation library to change where you want your error messages to be displayed.

### jQuery Plugins ###

All other form validation libraries are jQuery plugins, but they stop there. They all create thier own proprietary framework for their validation rules and methods. Instead they should have just created their validator methods as jQuery plugins. This would allow the sharing of validators between form validation libs. As a general rule if you are passing in a DOM reference into a method, then you should consider making that method a jQuery plugin.

This lib makes heavy use of the jQuery plugin framework. All validators and decorators are standalone jQuery plugins. All of them are very composable, extendable, and widely understood by the development community. The only draw back of making a jquery plugin built from a suit of other jquery plugins is populuting the $.fn.* namespace. However, after working with design goal the benefits out weight the drawbacks. I believe the code easier to understand and maintain. The result is much cleaner smaller modules.

## Other Libraries

There are many other form validation libraries. Just about any of them will work great for simple forms. However, if you have complex forms good luck.

- http://www.formvalidator.net/
	- License:  MIT (declared in bower.json), but not license file.
	- Focus: Unobtrusive form validation declorations.
	- Concerns: It binds event handlers directly to the inputs rather delagate them to the form container. Merges decoration and validation together.
	- Development: Maintained and under active development.

- http://jqueryvalidation.org/
	- License: MIT
	- Concerns: not actively being maintained. Be prepared to monkey patch.

- https://github.com/1000hz/bootstrap-validator
	- License: MIT

- http://formvalidation.io/
	- License: Commercial
	- Concerns: Merges decoration and validation into single lib.
	- Development: