# DEVELOPER NOTES

## Virtual State

Prove saves the validation state of inputs in memory, but does this without saving a DOM reference. The reason we save the validation states of input is so that async validations do not need to be re-evaluated. 
