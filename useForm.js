import { useEffect, useState } from "react";

// Validators 
import validateNoEmptyInput from "./FormValidators/validateNoEmptyInput";
import validatePassword from "./FormValidators/validatePassword";
import validateEmail from "./FormValidators/validateEmail";
import validateConfirmPassword from "./FormValidators/validateConfirmPassword";

// Formatters
import formatterLowerCase from "./FormFormatters/formatterLowerCase";
import formatterUsername from "./FormFormatters/formatterUsername";

// Input Parameters: apiName, builtInValidator, builtInFormatter, formatter, required, value, validator 

function defaultValue(type) {
  switch (type) {
    case "checkbox":
      return false;
    default:
      return "";
  }
}

function createInitialValues(inputs) {

  const inputList = Object.keys(inputs);
  const values = {};

  inputList.forEach(item => {
    values[item] = inputs[item].value ? inputs[item].value : defaultValue(inputs[item].type);
  })

  return values;
}

function createInitialErrors(inputs) {
  const inputList = Object.keys(inputs);
  const errors = {};

  inputList.forEach(item => {
    if (inputs[item].validator || inputs[item].required) {
      errors[item] = { value: null };
    }
  }
  );

  return errors;
}

function createInitialDirty(inputs) {
  const inputList = Object.keys(inputs);
  const dirty = {};

  inputList.forEach(item => {
    if (inputs[item].validator || inputs[item].required) {
      dirty[item] = false;
    }
  }
  );

  return dirty;
}

function createInitialApiNames(inputs) {
  const inputList = Object.keys(inputs);
  const apiNames = {};

  inputList.forEach(item => {
    apiNames[item] = inputs[item].apiName ? inputs[item].apiName : item;
  });

  return apiNames;
}

function builtInFormatter(type, value) {
  if (type === "email") {
    return formatterLowerCase(value);
  } else if (type === "username") {
    return formatterUsername(value);
  } else {
    return value
  }
}

function builtInValidator(type, value, values) {
  if (type === "email") {
    return validateEmail(value);
  } else if (type === "password") {
    return validatePassword(value);
  } else if (type === "confirmPassword") {
    return validateConfirmPassword(value, values);
  } else {
    return undefined
  }
}


const useForm = (inputs) => {

  const [values, setValues] = useState(createInitialValues(inputs));
  const [errors, setErrors] = useState(createInitialErrors(inputs));
  const [dirty, setDirty] = useState(createInitialDirty(inputs));
  const apiNames = createInitialApiNames(inputs);

  useEffect(() => {
    // Validate input
    Object.keys(inputs).forEach(inputName => {
      const input = inputs[inputName];
      const builtInValidation = input.builtInValidator ? input.builtInValidator : true;
      var requiredVerification = true;

      if (!dirty[inputName]) {
        return
      }

      if (input.required && dirty[inputName]) {
        const result = validateNoEmptyInput(values[inputName], values);
        if (result.value === false) {
          requiredVerification = false;
        }
        updateError(inputName, result);
      } else {
        updateError(inputName, { value: true });
      }

      if (requiredVerification) {
        if (input.validator && dirty[inputName]) {
          const result = input.validator(values[inputName], values);
          updateError(inputName, result);
        } else if (builtInValidation && dirty[inputName]) {
          const result = builtInValidator(input.type, values[inputName], values);
          if (result !== undefined) {
            updateError(inputName, result);
          }
        }
      }

    })
  }, [dirty, values]);


  // Update value and format it if needed
  function updateValue(key, value, validate = true) {
    setValues((oldValues) => ({
      ...oldValues,
      [key]: inputs[key].formatter ? inputs[key].formatter(value) : inputs[key].builtInFormatter !== false ? builtInFormatter(inputs[key].type, value) : value
    }));

    setDirty(oldDirty => ({
      ...oldDirty,
      [key]: validate
    }))
  }

  // Update error
  function updateError(key, error) {

    if (error === null) {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [key]: { value: null }
      }));
    } else {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [key]: error
      }));
    }
  }

  // Push error
  function pushError(apiName, error) {

    const key = Object.keys(apiNames).find(key => apiNames[key] === apiName);

    setErrors((oldErrors) => ({
      ...oldErrors,
      [key]: error
    }));

    setDirty(oldDirty => ({
      ...oldDirty,
      [key]: false
    }))
  }

  // Check if all the fields are valid
  function isFormValid() {
    let isValid = true;
    Object.keys(errors).forEach(item => {
      if (errors[item].value !== true) {
        isValid = false;
      }
    }
    );

    return isValid;
  }

  // Get data from hook
  function getInputProps(key) {
    return {
      error: errors[key],
      setValue: (value, validate) => { updateValue(key, value, validate) },
      value: values[key],
      required: inputs[key].required ? true : false,
    }
  }

  // Get api body from hook
  function getApiBody() {
    const apiBody = {};
    const inputList = Object.keys(inputs);

    inputList.forEach(item => {
      apiBody[apiNames[item]] = inputs[item].value ? inputs[item].value : "";
    })

    return apiBody;
  }

  return { values, errors, isFormValid, getInputProps, getApiBody, pushError };

};

export default useForm

