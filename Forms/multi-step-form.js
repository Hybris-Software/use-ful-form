import { useState, useEffect, useMemo } from 'react';
import {
  getDefaultValue,
  getValidator,
  getFormatter,
  getRequiredValidator,
} from '../Utils/getters.js';

const getInitialValues = (steps) => {
  return steps.reduce((result, step) => {
    return {
      ...result,
      ...Object.keys(step.inputs).reduce((result, key) => {
        return {
          ...result,
          [key]: {
            value: getDefaultValue(
              step.inputs[key].nature,
              step.inputs[key].value,
            ),
          },
        };
      }, {}),
    };
  }, {});
};

// Error format
// {
//   [key]: {isValid, errorMessage}
// }

// Force error format
// [key1, key2, key3]

// Values format
// {
//   [key]: {value}
// }

export const useMuliStepForm = ({ steps }) => {
  const [values, setValues] = useState(getInitialValues(steps));
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const flatInputs = useMemo(() => {
    return steps.reduce((result, step) => {
      return {
        ...result,
        ...step.inputs,
      };
    }, {});
  }, [steps]);

  const extractedValues = useMemo(() => {
    return Object.entries(values).reduce(
      (result, [key, value]) => ({ ...result, [key]: value.value }),
      {},
    );
  }, [values]);

  const extractedErrors = useMemo(() => {
    return Object.entries(errors).reduce(
      (result, [key, error]) => ({
        ...result,
        [key]: [error.isValid, error.errorMessage],
      }),
      {},
    );
  }, [errors]);

  useEffect(() => {
    const newErrors = {};

    for (const step of steps) {
      Object.entries(step.inputs).forEach(([key, inputDetails]) => {
        // Validate required
        if (
          (inputDetails.required === true) &
          !getRequiredValidator(inputDetails.nature)(extractedValues[key])
        ) {
          newErrors[key] = {
            isValid: false,
            errorMessage: 'This field is required',
          };
          return;
        }

        // Use validator
        const validator = getValidator(
          inputDetails.nature,
          inputDetails.validator,
        );
        if (validator) {
          const [isValid, errorMessage] = validator(
            extractedValues[key],
            extractedValues,
          );
          newErrors[key] = { isValid, errorMessage };
        } else {
          newErrors[key] = { isValid: true, errorMessage: null };
        }
      });
    }

    setErrors(newErrors);
  }, [extractedValues]);

  useEffect(() => {
    // Get the lowest step with errors
    const stepWithError = steps.findIndex((step) => {
      return Object.keys(step.inputs).some((key) => {
        return errors[key] && !errors[key].isValid;
      });
    });
    setCurrentStep((oldStep) => {
      if (stepWithError === -1) {
        return oldStep;
      } else {
        return Math.min(stepWithError, oldStep);
      }
    });
  }, [errors]);

  function setFieldValue(key, value) {
    const input = flatInputs[key];

    if (!input) {
      console.error(`Error in setFieldValue: Input with key ${key} not found`);
      return;
    }

    const formatter = getFormatter(
      flatInputs[key].nature,
      flatInputs[key].formatter,
    );
    const formattedValue = formatter ? formatter(value) : value;

    setValues((oldValues) => {
      return {
        ...oldValues,
        [key]: {
          value: formattedValue,
        },
      };
    });

    if (input.errorOnEveryChange) {
      setShowError((oldForceError) => {
        if (oldForceError.includes(key)) {
          return oldForceError;
        }
        return [...oldForceError, key];
      });
    }
  }

  function getError(key) {
    const input = flatInputs[key];
    const error = errors[key];

    if (!input) {
      console.error(`Error in getError: Input with key ${key} not found`);
      return [null, null];
    }

    if (!error) {
      return [null, null];
    }

    if (showError.includes(key)) {
      return [error.isValid, error.errorMessage];
    }

    return [null, null];
  }

  function showInputErrors(key) {
    setShowError((oldForceError) => {
      if (oldForceError.includes(key)) {
        return oldForceError;
      }
      return [...oldForceError, key];
    });
  }

  function getInputProps(key) {
    const input = flatInputs[key];

    if (!input) {
      console.error(`Error in getInputProps: Input with key ${key} not found`);
      return {};
    }

    return {
      value: values[key].value,
      setValue: (value) => setFieldValue(key, value),
      isValid: getError(key)[0],
      errorDetails: getError(key)[1],
      setShowErrors: () => showInputErrors(key),
    };
  }

  function isValid() {
    return Object.values(errors).every((error) => error.isValid === true);
  }

  function showAllErrors() {
    setShowError(Object.keys(flatInputs));
  }

  function validate() {
    showAllErrors();
    return isValid();
  }

  function reset() {
    setValues(getInitialValues(steps));
    setShowError([]);
  }

  function resetInput(key) {
    setValues((oldValues) => {
      return {
        ...oldValues,
        [key]: {
          value: getDefaultValue(inputs[key].nature, inputs[key].value),
        },
      };
    });
    setShowError((oldForceError) =>
      oldForceError.filter((oldKey) => oldKey !== key),
    );
  }

  function getApiBody() {
    return Object.entries(flatInputs).reduce(
      (result, [inputKey, inputDetails]) => {
        if (inputDetails.sendToApi !== false) {
          const apiName = inputDetails.apiName || inputKey;
          result[apiName] = values[inputKey];
        }
        return result;
      },
      {},
    );
  }

  function isStepValid(step) {
    return Object.keys(steps[step].inputs).every(
      (key) => errors[key] && errors[key].isValid === true,
    );
  }

  function showStepErrors(step) {
    setShowError((oldForceError) => {
      return oldForceError
        .filter((oldKey) => {
          return !Object.keys(steps[step].inputs).includes(oldKey);
        })
        .concat(Object.keys(steps[step].inputs));
    });
  }

  function validateStep(step) {
    showStepErrors(step);
    return isStepValid(step);
  }

  function nextStep() {
    if (currentStep === steps.length - 1) {
      console.error('Error in nextStep: Already on last step');
      return false;
    }

    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
    return isValid;
  }

  function previousStep() {
    if (currentStep === 0) {
      console.error('Error in previousStep: Already on first step');
      return false;
    }
    setCurrentStep(currentStep - 1);
    return true;
  }

  function setStep(step) {
    if (step < 0 || step >= steps.length) {
      console.error(
        `Error in setStep: Step ${step} is not a valid step number`,
      );
      return -1;
    }

    for (let i = 0; i < step; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return i;
      }
    }

    setCurrentStep(step);
    return null;
  }

  function getKeyFromApiName(apiName) {
    const key = Object.keys(flatInputs).find(
      (inputKey) =>
        flatInputs[inputKey].apiName === apiName || inputKey === apiName,
    );

    return key;
  }

  function pushErrorDetails(apiName, errorDetails) {
    const key = getKeyFromApiName(apiName);

    if (!key) {
      console.error(
        `Error in pushErrorDetails: Input with apiName ${apiName} not found`,
      );
      return;
    }

    setErrors((errors) => ({
      ...errors,
      [key]: {
        isValid: false,
        errorMessage: Array.isArray(errorDetails)
          ? errorDetails.join(' ')
          : errorDetails,
      },
    }));
    showInputErrors(key);
  }

  function fetchQueryErrors(receivedErrors) {
    const newErrors = Object.keys(receivedErrors).reduce((result, errorKey) => {
      const key = getKeyFromApiName(errorKey);
      if (!key) {
        return result;
      }

      result[key] = {
        isValid: false,
        errorMessage: Array.isArray(receivedErrors[errorKey])
          ? receivedErrors[errorKey].join(' ')
          : receivedErrors[errorKey],
      };
      return result;
    }, {});

    setErrors((errors) => ({
      ...errors,
      ...newErrors,
    }));
    showAllErrors();
  }

  function pushFieldValue(apiName, value) {
    const key = getKeyFromApiName(apiName);

    setFieldValue(key, value);
    showInputErrors(key);
  }

  function fetchQueryValues(receivedData, { include, exclude } = {}) {
    let dataKeys = Object.keys(receivedData);
    if (include) {
      dataKeys = dataKeys.filter((apiName) => include.includes(apiName));
    }
    if (exclude) {
      dataKeys = dataKeys.filter((apiName) => !exclude.includes(apiName));
    }

    const newValues = dataKeys.reduce((result, apiName) => {
      const key = getKeyFromApiName(apiName);

      if (!key) {
        return result;
      }

      result[key] = { value: receivedData[apiName] };
      return result;
    }, {});

    setValues((oldValues) => ({
      ...oldValues,
      ...newValues,
    }));
    setShowError((oldForceError) => {
      return oldForceError
        .filter((oldKey) => {
          return !Object.keys(newValues).includes(oldKey);
        })
        .concat(Object.keys(newValues));
    });
  }

  return {
    values: extractedValues,
    errors: extractedErrors,
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
    currentStep,
    isStepValid,
    validateStep,
    nextStep,
    previousStep,
    setStep,
  };
};
