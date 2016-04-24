# DEVELOPER NOTES

## Stateful Validation

Prove saves the validation state of inputs in memory, but does this without saving a DOM reference. The reason we save the validation states of input is so that async validations do not need to be re-evaluated. Instead of saving a DOM reference we create a UUID that is saved as a data attribute (data-prove-uuid) on each form input. Later when that input should be validated we read the input's uuid and use the uuid to retreive the validation state of the input.

### Initialization

On initialization of prove each input is:
- a uuid is created and saved on the input ($.fn.uuid),
- the input's value is hashed and saved on the input ($.fn.dirty),
```javascript
var uuid = input.uuid();
var dirty = input.dirty();
```
The next time we encounter this input we can determine if the input value has changed.

```javascript
var uuid = input.uuid();
var previousValidationResult = prove.states[uuid];
var dirty = input.dirty(); // => true or false
```
