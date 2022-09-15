# **use-ful-form | useForm**:

## **Introduction**

This is a hook designed to be used with the `<InputField />` component we developed. The component has not yet been released to the public. As soon as the package is released on npm, we will post the download link here. In the meantime you can use this hook with your own components or download the github repository and fork it to add new features or adapt it to your own components!

Hook used to manage the status of form inputs, their validation and formatting.

The input component should receive the required props using the `getInputProps` function returned by the hook. Those props are:

- error: the current error object
- value: the current input value
- required: boolean, if the field is required
- setValue(value, validate): set the input value, if validate is true the input will be validated, otherwise it will just be stored (default true)

The input validation is done by the hook which follows this order: `validateNoEmptyInput` if field is required, then if the field is not empty executes the specified `validator` or the built-in one, based on the field type.

The error object format is variable and depends on the values required by the input. It is automatically initialized as `{value: null}` at the beginning and then the validator should update it to `true` if the value is valid and `false` if there are some errors. It may contain other keys in addition to `value`, for example:

```
{
	value: boolean?
	message: string?
}
```

<br>

## **How to use it**

To install execute:

`npm install @hybris-software/use-ful-form`

**_Parameter:_**

The parameter is a dictionary where the keys are the identifiers of the fields and the value is a dictionary with the following parameters:

| Parameter | Type                                                                | Description                                                                                                                                                                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type      | string                                                              | `email`, `username`, `password`, `confirmPassword`, `checkbox` or other                                                                                                                                                                                                                                                                               |
| value     | string                                                              | Initial value. Default is `false` for `checkbox` type, otherwise is an empty string                                                                                                                                                                                                                                                                   |
| required  | boolean                                                             | Default `false`. If is `true`, the default `validateNoEmptyInput` validator is executed which sets the error to `{ value: false, message: "This field is required" }` if the field is empty                                                                                                                                                           |
| validator | `(input: string, values: any) => {value: boolean, message: string}` | A function used to validate the field. It takes the current value of the input and a dictionary `{fieldName: "actualValue"}` containing the values of all other inputs to the form. It should return the error value in the format described above. If it is not specified, the form will try to execute a built-in validator based on the input type |
| formatter | `(value: string) => string`                                         | A function to format the input whenever its value changes                                                                                                                                                                                                                                                                                             |

<br>
<br>

**_Returned parameters:_**

| Parameter     | Type                                              | Description                                                                                                 |
| ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| getInputProps | `(fieldName: string) => props`                    | Used to obtain the necessary functions and values of an input to get and update its value and get the error |
| values        | `{fieldName: string,}`                            | A dictionary containing the values of all the inputs                                                        |
| errors        | `{fieldName: {value: boolean?, message: string?}` | A dictionary containing the errors of all the inputs                                                        |
| isFormValid   | `() => boolean`                                   | Returns `true` if all the validations pass, `false` otherwise                                               |
| getApiBody    | `() => any`                                       | Returns the body that sould be sent in the API call                                                         |

<br>

## **Example**

### **Example 1 - Basic Usage**: use useForm() with built-in validators and built-in foramtter based on type. If you don't specify a validator, the hook will try to execute a built-in one based on the type.

```javascript
const  form = useForm({
	email: {
		type: "email",
	},
	password: {
		type: "password",
	},
	confirmPassword: {
		type: "confirmPassword",
	},
}

return (
...

<InputField
	className={Style.inputField}
	label="Your Email"
	type="email"
	placeholder="Email"
	onPaste={false}
	validationOnBlur={true}
	icon={<TbMail  />}
	{...form.getInputProps("email")}
/>

<InputField
	className={Style.inputField}
	label="Your Password"
	type="password"
	placeholder="Password"
	onPaste={false}
	validationOnBlur={true}
	icon={<TbMail  />}
	{...form.getInputProps("password")}
/>
<InputField
	className={Style.inputField}
	label="Confirm Password"
	type="confirmPassword"
	placeholder="Confirm Password"
	onPaste={false}
	validationOnBlur={true}
	icon={<TbMail  />}
	{...form.getInputProps("confirmPassword")}
/>

...
)
```

### **Example 2 - Advanced Usage**: use useForm() with custom validators and custom formatter. If you specify your own validator and/or formatter, the hook will override the built-in ones.

```javascript
const  yourEmailValidator = (e) => {
	// your email validator
};

function  yourFormatter(value) {
	// your formatter
}

const  form = useForm({
	email: {
		validator:  yourEmailValidator,
	},
	firstNAme: {
		formatter:  yourFormatter,
	},
}

return (
...
<InputField
	className={Style.inputField}
	label="Your Email"
	type="email"
	placeholder="Email"
	onPaste={false}
	validationOnBlur={true}
	icon={<TbMail  />}
	{...form.getInputProps("email")}
/>
<InputField
	className={Style.inputField}
	label="First Name"
	placeholder="First Name"
	onPaste={false}
	validationOnBlur={true}
	icon={<TbMail  />}
	{...form.getInputProps("firstName")}
/>
...
)
```

## **Built-in Validators**

```javascript
function validateCheckbox(value) {
  if (!value) {
    return {
      value: false,
    };
  } else {
    return {
      value: true,
    };
  }
}

function validateConfirmPassword(value, values) {
  if (value !== values["password"]) {
    return {
      value: false,
      message: "Passwords do not match",
    };
  } else {
    return {
      value: true,
    };
  }
}

const validateEmail = (e) => {
  function checkIfIsEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  if (checkIfIsEmail(e)) {
    return { value: true };
  } else {
    return { value: false, message: "Invalid email" };
  }
};

function validateNoEmptyInput(input) {
  let inputSanitized;
  inputSanitized = input.trim();

  if (inputSanitized === "") {
    return {
      value: false,
      message: "This field is required",
    };
  } else {
    return {
      value: true,
    };
  }
}

function checkPassword(password) {
  if (password.length <= 8 || !password.match(/[a-z]/i)) {
    return {
      value: false,
      message:
        "Password must be at least 8 characters long and one lowercase letter",
      security: "none",
    };
  } else if (!password.match(/[0-9]/)) {
    return {
      value: false,
      message: "Password must contain at least one number",
      security: "low",
    };
  } else if (!password.match(/[A-Z]/)) {
    return {
      value: false,
      message: "Password must contain at least one uppercase letter",
      security: "medium",
    };
  } else if (!password.match(/[^a-zA-Z0-9]/g)) {
    return {
      value: false,
      message: "Password must contain at least one special character",
      security: "high",
    };
  } else {
    return {
      value: true,
      security: "strong",
    };
  }
}

const validatePassword = (value) => {
  if (value.length === 0) {
    return { value: null };
  } else {
    return checkPassword(value);
  }
};
```

## **Built-in Formatters**

```javascript
function formatterLowerCase(value) {
  return value.toLowerCase();
}

function formatterUsername(value) {
  function replaceSpecialCharacterWithSpace(str) {
    return str.replace(/[^a-zA-Z0-9]\_\./g, "");
  }

  return replaceSpecialCharacterWithSpace(value.replace(" ", "").toLowerCase());
}
```
