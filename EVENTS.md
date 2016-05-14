# Prove Events

Prove is both a consumer and publisher of events.

### Published Events

The following events are published (emitted) by Prove. The decorator plugin listens to these events in order to decorate the form. Your code may also listen to these events.

#### Event: `status.input.prove` ####
- **Description** The status of the input has changed.
- **Publisher** Form input DOM element.

```javascript
{
    field: 'email',
    validator: 'validator', //validator name or undefined
    status: 'validated', //'setup', 'validating', 'progress', 'validated', 'destroy'
    validation: 'success', //'success', 'danger', 'warning', 'reset' //consider 'default' instead of 'reset'?
    message: 'Your error or warning message.'
}
```
Where `status`:
- `setup` - triggered on field setup
```javascript
{
	field: 'email',
	status: 'setup'
}
```
- `validating` - triggered at start of validation
```javascript
{
	field: 'email',
	status: 'validating',
}
```
- `progress` - triggered periodically by a deferred validator
```javascript
{
	field: 'email',
	validator: 'validatorName',
	status: 'progress'
}
```
- `validated` - triggered after input validation
```javascript
{
	field: 'email',
	validator: 'validatorName',
	status: 'validated',
	validation: 'success', //'danger', 'warning', 'reset',
	message: 'Validation message or error code'
}
```
- `destroy` - triggered immediately before input teardown which part of the form.prove('destroy')
```javascript
{
	field: 'email',
	status: 'destroy',
}
```

### Listened To Events

Prove listens to the following events on the form container and inputs (delegated to the form container).


#### Event: `validate.input.prove` ####

- **Description** When Prove hears this event it will validate just this input.
- **Target** Form input.
- **Publisher** Your code.

```javascript
input.trigger('validate.input.prove'); // or input.validate()
```
