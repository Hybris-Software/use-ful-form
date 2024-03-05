# **use-ful-form | useForm**:

## **Introduction**

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

Errors are not always shown; the behavior is decided in the input options:

- Error/success will be always shown after a blur
- If `errorOnEveryChange` is `true` the error/success will be shown while writing
- If `checkSuccessOnEveryChange` is `true` the error/success will be shown after the first time the validation is successful

## **How to use it**

To install execute:

`npm install @hybris-software/use-ful-form`

Then you can import useForm with `import useForm from "@hybris-software/use-ful-form"`

The hook requires an object as argument. At the moment this object should contain just a key named `inputs`, its value is an object where the key identifies the single input and the content is described below.

**_Parameter:_**

The parameter is a dictionary where the keys are the identifiers of the fields and the value is a dictionary with the following parameters:

| Parameter          | Type                                         | Description                                                                                                                        |
| ------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --- |
| apiName            | string                                       | The name of the input returned by the `getApiBody` function, by default is the input key                                           |
| nature             | string                                       | `email`, `username`, `password`, `confirmPassword`, `checkbox` or other. More details below                                        |
| required           | boolean                                      | If the input is required, default `false`                                                                                          |
| value              | string                                       | Initial value. Default depends on the input nature, see below                                                                      |
| validator          | `(value, values) => [isValid, errorDetails]` | The validation function, see the next section to know how it works and the one about input natures to learn about the default ones |
| formatter          | `(value) => formattedValue`                  | A function to format the input whenever its value changes                                                                          |
| sendToApi          | boolean                                      | If the input value should be returned bu the `getApiBody` function                                                                 |
| errorOnEveryChange | boolean                                      | Show the error immediately after first input, default `false`                                                                      |
| <!--               | checkSuccessOnEveryChange                    | boolean                                                                                                                            | Start showing errors from the first input without errors, default `false` | --> |

**_Values returned by the hook:_**

| Parameter        | Type                                   | Description                                                                                                                                                                                                                  |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| values           | `{inputName: inputValue,}`             | A dictionary containing the values of all the inputs                                                                                                                                                                         |
| errors           | `{inputName: [isValid, errorDetails]`  | A dictionary containing the errors of all the inputs                                                                                                                                                                         |
| getInputProps    | `(inputName) => {props}`               | Used to obtain the necessary functions and values of an input to get and update its value and get the error                                                                                                                  |
| isValid          | `() => boolean`                        | Returns `true` if all the validations pass, `false` otherwise                                                                                                                                                                |
| validate         | `() => boolean`                        | Returns `true` if all the validations pass, `false` otherwise. Like `isValid` but shows all the errors on the inputs                                                                                                         |
| reset            | `() => void`                           | Reset the form to the initial state                                                                                                                                                                                          |
| resetInput       | `(inputName) => void`                  | Reset a single input to the initial state                                                                                                                                                                                    |
| getApiBody       | `() => any`                            | Returns the body that sould be sent in the API call                                                                                                                                                                          |
| pushErrorDetails | `(apiName, errorDetails) => {}`        | Pushes the errorDetails to an input and sets isValid to false                                                                                                                                                                |
| fetchQueryErrors | `(errors) => {}`                       | Pass an object with api name as key and error details to this function and it will push error details to any of the received inputs                                                                                          |
| setFieldValue    | `(key, value, showErrors=false) => {}` | Set the value of an input. Specify its `key` and the `value`. If `showErrors` is `true` it will show the errors if there are any. `pushFieldValue` is preferred over this function                                           |
| pushFieldValue   | `(apiName, value) => {}`               | Similar to `setFieldValue` but accepts the `apiName` instead of the key and automatically shows the errors if there are any. This is the preferred solution                                                                  |
| fetchQueryValues | `(data, {include, exclude}) => {}`     | Pass to this function the `data` as an object with `apiName: value` format. `include` and `exclude` are two optional arrays that should contain apiNames and allow to set only specific fields or exclude some from the data |

## **Validation and formatting**

### Validation function

The validation function receives two arguments:

- `value` which is the value of the input being validated
- `values` which is an object containing the values of all inputs

The output should be a list with two items inside:

- The first one is a validator which will set isValid for the input
- The secount one will set the error details. Is suggested to insert a string but any data type will work

Some prebuilt validators are available.

```javascript
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRequiredCheckbox,
  validateRequiredGeneric,
  validateRequiredString,
} from "@hybris-software/use-ful-form/Utils/Validators"
```

### Formatter

A formatter is a function that receives the original value as input every time the input changes and should return a formatted value.

Some prebuilt formatters are available.

```javascript
import {
  formatEmail,
  formatLowerCase,
  formatUsername,
} from "@hybris-software/use-ful-form/Utils/Formatters"
```

## **Available input natures**

| nature          | default value | default validator         | default formatter | default validator when required |
| --------------- | ------------- | ------------------------- | ----------------- | ------------------------------- |
| email           | `""`          | `validateEmail`           | `formatEmail`     | `validateRequiredString`        |
| username        | `""`          |                           | `formatUsername`  | `validateRequiredString`        |
| password        | `""`          | `validatePassword`        |                   | `validateRequiredString`        |
| confirmPassword | `""`          | `validateConfirmPassword` |                   | `validateRequiredString`        |
| checkbox        | `false`       |                           |                   | `validateRequiredCheckbox`      |

## **Examples**

### **Example 1 - Basic Usage**

```javascript
import logo from "./logo.svg"
import "./App.css"

import { ThemeProvider, InputField, Button } from "@hybris-software/ui-kit"
import useForm from "@hybris-software/use-ful-form"
import { validateEmail } from "@hybris-software/use-ful-form/Utils/Validators"

const exampleInput = {
  inputs: {
    username: {
      //apiName: "username", // Default: key
      type: "username", // Default: undefined
      required: true, // Default: false
      //value: "", // Default: depends on type, empty string otherwise
      //validator: (val, values) => ([true, null]), // Default: depends on type, undefined otherwise
      //formatter: (val) => (val),  // Default: depends on type, undefined otherwise
      //sendToApi: true, // Default: true
      //errorOnEveryChange: true, // Default: false
      checkSuccessOnEveryChange: true, // Default: false
    },
    email: {
      value: "test@no.no",
      type: "email",
      required: true,
      checkSuccessOnEveryChange: true,
      validator: validateEmail, // Optional, is validateEmail by default due to type
    },
    password: {
      type: "password",
      required: true,
      errorOnEveryChange: true,
    },
    confirmPassword: {
      type: "confirmPassword",
      required: true,
      checkSuccessOnEveryChange: true,
      sendToApi: false,
    },
  },
}

function App() {
  const form = useForm(exampleInput)
  return (
    <ThemeProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>
            <InputField
              maxLength={2}
              readOnly={true}
              {...form.getInputProps("username")}
            />
            <InputField readOnly={false} {...form.getInputProps("email")} />
            <InputField {...form.getInputProps("password")} />
            <InputField {...form.getInputProps("confirmPassword")} />
            <Button
              disabled={!form.isValid()}
              onClick={() => console.log(form.getApiBody())}
            >
              Submit
            </Button>
            <Button onClick={() => console.log(form.reset())}>Reset</Button>
            <Button onClick={() => console.log(form.resetInput("username"))}>
              Reset username
            </Button>
            <Button onClick={() => console.log(form.resetInput("email"))}>
              Reset email
            </Button>
          </div>
        </header>
      </div>
    </ThemeProvider>
  )
}

export default App
```
