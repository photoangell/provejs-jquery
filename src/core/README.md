# DEVELOPER NOTES

## Stateful Validation

Prove saves the validation state of inputs in memory, but does this without saving a DOM reference. The reason we save the validation states of input is so that async validations do not need to be re-evaluated. Instead of saving a DOM reference we create a UUID that is saved as a data attribute (data-prove-uuid) on each form input. Later when that input should be validated we read the input's uuid and use the uuid to retreive the validation state of the input.

### Initialization

On initialization of each input we create and save an uuid as data attribute:
```javascript
var uuid = input.uuid();
```
### On Validation

During input validation we can retrieve the previous validation result using the uuid.

```javascript
var uuid = input.uuid();
var previous = prove.states[uuid];
```
We also make use of a plugin to detect dirty inputs where the value has changed. The dirty plugin uses a hash algorithm to save a hash of the previous input's value to determine between validation attempts if the value has changed.
```javascript
var dirty = input.dirty();
```
