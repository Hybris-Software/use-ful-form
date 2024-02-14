import { useState, useEffect } from "react";
import {
  getDefaultValue,
  getValidator,
  getFormatter,
  getRequiredValidator,
} from "../utils/getters";
import {
  Input,
  FormInputValues,
  FormShowErrors,
  FormErrors,
  InputValue,
} from "../types";

export type UseFormProps = {
  inputs: {
    [key: string]: Input;
  };
};

export const useForm = ({ inputs }: UseFormProps) => {
  const initialValues: FormInputValues = Object.keys(inputs).reduce(
    (result, key) => {
      result[key] = getDefaultValue(inputs[key].nature, inputs[key].value);
      return result;
    },
    {} as FormInputValues
  );

  // TODO: check if this works
  const initialShowErrors: FormShowErrors = Object.keys(inputs).reduce(
    (result, key) => {
      if (
        inputs[key].value &&
        inputs[key].value !== "" &&
        inputs[key].value !== false
      ) {
        result[key] = true;
      }
      return result;
    },
    {} as FormShowErrors
  );

  const [values, setValues] = useState<FormInputValues>(initialValues);
  const [lastUpdatedKey, setLastUpdatedKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] =
    useState<FormShowErrors>(initialShowErrors);

  useEffect(() => {
    _validate(values);
  }, [values]);

  /***************************************
   * UTILITIES
   ***************************************/

  const _getKeyFromApiName = (apiName: string) => {
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

  const _validate = (values: FormInputValues) => {
    const newErrors: FormErrors = {};
    const newShowErrors: FormShowErrors = {};

    Object.entries(inputs).forEach(([key, inputDetails]) => {
      if (inputDetails.required) {
        if (!getRequiredValidator(inputDetails.nature)(values[key])) {
          newErrors[key] = [false, "This field is required"];
          return;
        }
      }

      const validator = getValidator(
        inputDetails.nature,
        inputDetails.validator
      );
      if (validator) {
        newErrors[key] = validator(values[key], values);
      } else {
        newErrors[key] = [true, null];
      }
    });

    if (lastUpdatedKey && inputs[lastUpdatedKey].errorOnEveryChange === true) {
      setShowErrors((showErrors) => ({
        ...showErrors,
        [lastUpdatedKey]: true,
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
      ...showErrors,
      ...newShowErrors,
    }));
    setErrors(newErrors);
    return newErrors;
  };

  const setFieldValue = (
    key: string,
    value: InputValue,
    showErrors = false
  ) => {
    const formatter = getFormatter(inputs[key].nature, inputs[key].formatter);
    const formattedValue = formatter ? formatter(value) : value;

    setLastUpdatedKey(key);
    setValues((oldValues) => ({ ...oldValues, [key]: formattedValue }));
    if (showErrors) {
      setShowErrors((oldValues) => ({ ...oldValues, [key]: true }));
    }
  };

  const pushFieldValue = (apiName: string, value: InputValue) => {
    const key = _getKeyFromApiName(apiName);

    const formatter = getFormatter(inputs[key].nature, inputs[key].formatter);
    const formattedValue = formatter ? formatter(value) : value;

    setLastUpdatedKey(null);
    setValues((oldValues) => ({ ...oldValues, [key]: formattedValue }));
    setShowErrors((oldValues) => ({ ...oldValues, [key]: true }));
  };

  // TODO: replace with generic function
  const fetchQueryValues = (
    receivedData: any,
    { include, exclude }: { include?: string[]; exclude?: string[] } = {}
  ) => {
    let dataKeys = Object.keys(receivedData);
    if (include) {
      dataKeys = dataKeys.filter((apiName) => include.includes(apiName));
    }
    if (exclude) {
      dataKeys = dataKeys.filter((apiName) => !exclude.includes(apiName));
    }

    const newValues = dataKeys.reduce((result, apiName) => {
      const key = _getKeyFromApiName(apiName);
      result[key] = receivedData[apiName];
      return result;
    }, {} as FormInputValues);

    setLastUpdatedKey(null);
    setValues((oldValues) => ({
      ...oldValues,
      ...newValues,
    }));
    setShowErrors((oldValues) => ({
      ...oldValues,
      ...Object.keys(newValues).reduce((result, key) => {
        result[key] = true;
        return result;
      }, {} as FormShowErrors),
    }));
  };

  /***************************************
   * RESET FUNCTIONS
   ***************************************/

  const resetInput = (input: string) => {
    setLastUpdatedKey(null);
    setShowErrors((oldValues) => ({ ...oldValues, [input]: false }));
    setValues((oldValues) => ({ ...oldValues, [input]: initialValues[input] }));
  };

  const reset = () => {
    setLastUpdatedKey(null);
    setShowErrors({});
    setValues(initialValues);
  };

  /***************************************
   * ERRORS
   ***************************************/

  const _showAllErrors = () => {
    const newShowErrors = Object.keys(inputs).reduce((result, key) => {
      result[key] = true;
      return result;
    }, {} as FormShowErrors);
    setShowErrors(newShowErrors);
  };

  const pushErrorDetails = (
    apiName: string,
    errorDetails: InputValue | Array<InputValue>
  ) => {
    const key = _getKeyFromApiName(apiName);
    const _errorDetails = Array.isArray(errorDetails)
      ? errorDetails.join(" ")
      : errorDetails;

    setErrors((errors) => ({
      ...errors,
      [key]: [false, _errorDetails],
    }));
  };

  const fetchQueryErrors = (receivedErrors: any) => {
    const newErrors = Object.keys(receivedErrors).reduce((result, errorKey) => {
      const key = _getKeyFromApiName(errorKey);
      result[key] = [
        false,
        Array.isArray(receivedErrors[errorKey])
          ? receivedErrors[errorKey].join(" ")
          : receivedErrors[errorKey],
      ];
      return result;
    }, {} as FormErrors);

    setErrors((errors) => ({
      ...errors,
      ...newErrors,
    }));
    _showAllErrors();
  };

  const getError = (key: string) => {
    if (showErrors[key] && errors[key]) {
      return errors[key];
    } else {
      return [null, null];
    }
  };

  /***************************************
   * INPUT
   ***************************************/

  const getInputProps = (key: string) => {
    return {
      value: values[key],
      setValue: (value: InputValue) => setFieldValue(key, value),
      isValid: getError(key)[0],
      errorDetails: getError(key)[1],
      setShowErrors: () =>
        setShowErrors((oldShowErrors) => ({ ...oldShowErrors, [key]: true })),
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

  const validate = () => {
    _showAllErrors();
    return isValid();
  };

  const getApiBody = (): any => {
    return Object.keys(inputs).reduce((result, key) => {
      if (inputs[key].sendToApi !== false) {
        const apiName = inputs[key].apiName || key;
        result[apiName] = values[key];
      }
      return result;
    }, {} as { [key: string]: InputValue });
  };

  return {
    values,
    errors,
    getInputProps,
    isValid,
    validate,
    reset,
    resetInput,
    getApiBody,
    pushErrorDetails,
    fetchQueryErrors,
    setFieldValue,
    pushFieldValue,
    fetchQueryValues,
  };
};
