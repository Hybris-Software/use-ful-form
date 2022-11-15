import { useState, useEffect } from "react";
import {
  getDefaultValue,
  getValidator,
  getFormatter,
  getRequiredValidator,
} from "./Utils/getters";

const useForm = ({ inputs }) => {
  const initialValues = Object.keys(inputs).reduce((result, key) => {
    result[key] = getDefaultValue(inputs[key].nature, inputs[key].value);
    return result;
  }, {});

  const initialShowErrors = Object.keys(inputs).reduce((result, key) => {
    if (
      inputs[key].value &&
      inputs[key].value !== "" &&
      inputs[key].value !== false
    ) {
      result[key] = true;
    }
    return result;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(initialShowErrors);

  useEffect(() => {
    _validate(initialValues);
  }, []);

  /***************************************
   * UTILITIES
   ***************************************/

  const _getKeyFromApiName = (apiName) => {
    const key = Object.keys(inputs).find(
      (inputKey) => inputs[inputKey].apiName === apiName || inputKey === apiName
    );
    if (!key) {
      throw new Error(`Input with apiName ${apiName} not found`);
    } else {
      return key;
    }
  };

  /***************************************
   * INPUT CHANGE
   ***************************************/

  const _validate = (values, updatedKey = null, oldShowErrors = null) => {
    const newErrors = {};
    const newShowErrors = {};
    Object.entries(inputs).forEach(([key, inputDetails]) => {
      if (inputDetails.required) {
        if (!getRequiredValidator(inputDetails.nature)(values[key])) {
          newErrors[key] = [false, "This field is required"];
          return;
        }
      }

      const validator = getValidator(inputDetails.nature, inputDetails.validator);
      if (validator) {
        newErrors[key] = validator(values[key], values);
      } else {
        newErrors[key] = [true, null];
      }
    });

    if (updatedKey && inputs[updatedKey].errorOnEveryChange === true) {
      setShowErrors((showErrors) => ({
        ...showErrors,
        [updatedKey]: true,
      }));
    }

    Object.entries(inputs).forEach(([key, inputDetails]) => {
      if (
        inputs[key].checkSuccessOnEveryChange === true &&
        newErrors[key][0] === true
      ) {
        newShowErrors[key] = true;
      }
    });

    setShowErrors((showErrors) => ({
      ...(oldShowErrors || showErrors),
      ...newShowErrors,
    }));
    setErrors(newErrors);
    return newErrors;
  };

  const setFieldValue = (key, value) => {
    const formatter = getFormatter(inputs[key].nature, inputs[key].formatter);
    const formattedValue = formatter ? formatter(value) : value;
    const newValues = { ...values, [key]: formattedValue };

    setValues(newValues);
    _validate(newValues, key);
  };

  /***************************************
   * RESET FUNCTIONS
   ***************************************/

  const resetInput = (input) => {
    const newValues = {
      ...values,
      [input]: initialValues[input],
    };
    const newShowErrors = {
      ...showErrors,
      [input]: false,
    };
    setValues(newValues);
    _validate(newValues, null, newShowErrors);
  };

  const reset = () => {
    setValues(initialValues);
    _validate(initialValues, null, {});
  };

  /***************************************
   * ERRORS
   ***************************************/

  const pushErrorDetails = (apiName, errorDetails) => {
    const key = _getKeyFromApiName(apiName);
    const _errorDetails = Array.isArray(errorDetails) ? errorDetails.join(" ") : errorDetails;

    setErrors((errors) => ({
      ...errors,
      [key]: [false, _errorDetails],
    }));
  };

  const fetchQueryErrors = (receivedErrors) => {
    const newErrors = Object.keys(receivedErrors).reduce((result, errorKey) => {
      const key = _getKeyFromApiName(errorKey);
      result[key] = [false, Array.isArray(receivedErrors[errorKey]) ? receivedErrors[errorKey].join(" ") : receivedErrors[errorKey]];
    }, {});

    setErrors((errors) => ({
      ...errors,
      ...newErrors,
    }));
  };

  const getError = (key) => {
    if (showErrors[key] && errors[key]) {
      return errors[key];
    } else {
      return [null, null];
    }
  };

  /***************************************
   * INPUT
   ***************************************/

  const getInputProps = (key) => {
    return {
      value: values[key],
      setValue: (value) => setFieldValue(key, value),
      isValid: getError(key)[0],
      errorDetails: getError(key)[1],
      setShowErrors: () => setShowErrors({ ...showErrors, [key]: true }),
    };
  };

  /***************************************
   * GENERIC FUNCTIONS
   ***************************************/

  const isValid = () => {
    return (
      Object.keys(errors).length == Object.keys(inputs).length &&
      Object.keys(errors).every((key) => errors[key] && errors[key][0] === true)
    );
  };

  const getApiBody = () => {
    return Object.keys(inputs).reduce((result, key) => {
      if (inputs[key].sendToApi !== false) {
        result[key] = values[key];
      }
      return result;
    }, {});
  };

  return {
    values,
    errors,
    getInputProps,
    isValid,
    reset,
    resetInput,
    getApiBody,
    pushErrorDetails,
    fetchQueryErrors,
  };
};

export default useForm;
