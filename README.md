# use-ful-form

## 1 - Introduction

This hook is useful for managing forms: input validation, formatting and saving values.
It works with any input but it is recommended to use the `<InputField />` present in our UIKit.

The input component should receive the required props using the `getInputProps` function returned by the hook. Those props are:

- value: the current input value
- setValue(value): set the input value, to be used in `onInput`
- isValid: boolean, true if valid, false if there is an error, null if error should not be shown
- errorDetails: error informations returned by the validator. Usually a string but may be an object, it depends on the validator output (see below)
- setShowErrors(): to be called to manually trigger error show (usually in `onBlur`)

When the value changes, the following actions will be performed by the hook:

1. Pass the new value to the formatter and saves the output
2. For every input, if the input has the `required` option, executes a function based on the input `nature`, for example `email` and `username` are required to be not empty while `checkbox` has to be true. If it does not pass the check, a generic error is set, otherwise continues.
3. Validation is performed for every input: if it is set a `validator` for the input that function is executed, otherwise one is chosen based on the `nature`, if available

Errors are not always shown: the input has to signal it, for example on blur.

## 2 - How to use it

To install execute:

`npm install @hybris-software/use-ful-form`

Then you can import useForm with `import useForm from "@hybris-software/use-ful-form"`

The hook requires an object as argument. At the moment this object should contain just a key named `inputs`, its value is an object where the key identifies the single input and the content is described below.

### 2.1 - Parameters

The parameter is a dictionary where the keys are the identifiers of the fields and the value is a dictionary with the following parameters:

| Parameter | Type                 | Default | Description                                                                                                                                                 |
| --------- | -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value     | string (optional)    |         | Initial value. Default depends on the input nature, see below.                                                                                              |
| nature    | string (optional)    |         | `email`, `username`, `password`, `confirmPassword`, or `checkbox`. More details below.                                                                      |
| apiName   | string (optional)    |         | The name of the input returned by the `getApiBody` function, by default is the input key.                                                                   |
| required  | boolean (optional)   | false   | If the input is required.                                                                                                                                   |
| validator | Validator (optional) |         | The validation function, see the next section to know how it works and the one about input natures to learn about the default ones. More information below. |
| formatter | Formatter (optional) |         | A function to format the input whenever its value changes. More information below.                                                                          |
| sendToApi | boolean (optional)   | true    | If the input value should be returned bu the `getApiBody` function.                                                                                         |

### 2.2 - Returned values

| Parameter      | Type                                                             | Description                                                                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| values         | { [key: string]: InputValue }                                    | A dictionary containing the values of all the inputs.                                                                                                                                                                                                                        |
| setInputValue  | (key: string, value: InputValue, showErrors?: boolean) => void   | Function used to set the value of a specific input. The optional `showErrors` parameter allows to show the error message if there is any.                                                                                                                                    |
| errors         | { [key: string]: ValidationError }                               | A dictionary containing the errors of all the inputs. The error is a list where the first element is a boolean that stands for valid yes/no and the second value is the error message (or null).                                                                             |
| setInputError  | (key: string, error: string) => void                             | Function that can be used to force an error message for an input.                                                                                                                                                                                                            |
| getInputProps  | (key: string, options?: GetInputPropsOptions) => InputProps      | Function that returns the necessary functions and values of an input to get and update its value and get the error.                                                                                                                                                          |
| resetInput     | (input: string) => void                                          | Function that resets the input's value to its initial state.                                                                                                                                                                                                                 |
| isValid        | boolean                                                          | True if the form passed all the validations, False otherwise.                                                                                                                                                                                                                |
| validate       | () => boolean                                                    | Function that shows all the errors and returns true if the form passed all the validations or false otherwise.                                                                                                                                                               |
| reset          | () => void                                                       | Function that resets the form to its initial state.                                                                                                                                                                                                                          |
| submit         | () => void                                                       | Function that shows all the errors and only if the form passed all the validation checks calls the onSubmit function.                                                                                                                                                        |
| getApiBody     | () => any                                                        | Returns the body that sould be sent in the API call. The output is a JSON with the format `{ apiName: value }`                                                                                                                                                               |
| fetchApiErrors | (receivedErrors: any) => void                                    | Function that gets a JSON with api name as key and error details and adds the errors to the form.                                                                                                                                                                            |
| fetchApiValues | (data, {include, exclude}) => void                               | Function that gets `data` as an object with `apiName: value` format to set in the form the values returned by an API. `include` and `exclude` are two optional string lists that should contain apiNames and allow to set only specific fields or exclude some from the data |
| pushApiError   | (apiName: string, errorDetails: string \| Array<string>) => void | The same as setInputError but using the apiName.                                                                                                                                                                                                                             |
| pushApiValue   | (apiName: string, value: InputValue) => void                     | The same as setInputValue but using the apiName.                                                                                                                                                                                                                             |

### 2.3 - Input props

| Parameter     | Type                                              | Description                                                                                                                        |
| ------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| value         | InputValue                                        | The value of the input.                                                                                                            |
| setValue      | (value: InputValue, showErrors?: boolean) => void | Function used to set the value of the input. The optional `showErrors` parameter allows to show the error message if there is any. |
| isValid       | boolean                                           | False if there is an error and it has to be shown, True otherwise.                                                                 |
| errorDetails  | any                                               | The error message if there is a problem and it has to be shown, otherwise null.                                                    |
| setShowErrors | () => void                                        | Function that when called signals to the form that from then on, the error message should be shown.                                |
| resetInput    | () => void                                        | Function that resets the input's value to its initial state.                                                                       |
| submitForm    | () => void                                        | The same as calling submit for the form.                                                                                           |
| onKeyDown     | (e: React.KeyboardEvent) => void (optional)       | Returned only if the `handleKeyDown` option is true in `getInputProps`.                                                            |

## 3 - Validation and formatting

### 3.1 - Validation function

The validation function receives two arguments:

- `value` which is the value of the input being validated
- `values` which is an object containing the values of all inputs

The output should be a list with two items inside:

- The first one is a validator which will set isValid for the input
- The secount one will set the error details. Is suggested to insert a string but any data type will work

Some prebuilt validators are available and can be imported from use-ful-form:

- `validateConfirmPassword`: checks that the value is the same as the one of the input named "password".
- `validateEmail`: validates the email format using a regex.
- `validatePassword`: this validator is different because does not return a string but an object with message and security ("none" | "low" | "medium" | "high" | "strong").

### 3.2 - Formatter

A formatter is a function that receives the original value as input every time the input changes and should return a formatted value.

Some prebuilt formatters are available and can be imported from use-ful-form:

- `formatEmail`: transform the string to lowercase and remove the spaces.
- `formatLowerCase`: transform the string to lowercase.
- `formatUsername`: : transform the string to lowercase and allow only letters, numbers, dots and underscores.

## 4 - Available input natures

| nature          | default value | default validator         | default formatter | default validator when required |
| --------------- | ------------- | ------------------------- | ----------------- | ------------------------------- |
| email           | `""`          | `validateEmail`           | `formatEmail`     | `validateRequiredString`        |
| username        | `""`          |                           | `formatUsername`  | `validateRequiredString`        |
| password        | `""`          | `validatePassword`        |                   | `validateRequiredString`        |
| confirmPassword | `""`          | `validateConfirmPassword` |                   | `validateRequiredString`        |
| checkbox        | `false`       |                           |                   | `validateRequiredCheckbox`      |
