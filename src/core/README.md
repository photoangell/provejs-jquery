# DEVELOPER NOTES

## Virtual State

Prove saves the validation state of inputs in memory, but does this without saving a DOM reference. The reason we save the validation states of input is so that async validations do not need to be re-evaluated. Instead of saving a DOM reference we create a UUID that is saved as a data attribute (data-prove-uuid) on each form input. Later when that input should be validated we read the input's uuid and use the uuid to retreive the validation state of the input.

### Initialization

On initialization of prove inputs each input:
- a uuid is created and saved on the iput (input.uuid()),
- the input's value is hashed (input.hash()),
- the input value hash is saved in the state (prove.states[uuid].hash = hash).
