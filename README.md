# **4.2 useForm**:

## **Introduction**

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

**_Returned parameters:_**

| Parameter     | Type                                              | Description                                                                                                 |
| ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| getInputProps | `(fieldName: string) => props`                    | Used to obtain the necessary functions and values of an input to get and update its value and get the error |
| values        | `{fieldName: string,}`                            | A dictionary containing the values of all the inputs                                                        |
| errors        | `{fieldName: {value: boolean?, message: string?}` | A dictionary containing the errors of all the inputs                                                        |
| isFormValid   | `() => boolean`                                   | Returns `true` if all the validations pass, `false` otherwise                                               |
| getApiBody    | `() => any`                                       | Returns the body that sould be sent in the API call                                                         |

## **Example**

```javascript
const  validateEmail = (e) => {
	if (e.length === 0) {
		return { value: null };
	}
	if (checkIfIsEmail(e)) {
		return { value: true };
	} else {
		return { value: false, message: "Invalid email" };
	}
};

function  formatterLowerCase(value) {
	return value.toLowerCase();
}

function  validateConfirmPassword(value, values) {
	if (value !== values["password"]) {
		return {
			value:  false,
			message: "Passwords do not match",
		};
	} else {
		return {
			value: true,
		};
	}
}

const  form = useForm({
	email: {
		value:  "",
		validator:  validateEmail,
		formatter:  formatterLowerCase,
	},
	password: {
		value:  "",
		validator:  validatePassword,
	},
	confirmPassword: {
		value:  "",
		validator:  validateConfirmPassword,
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
...
)
```
