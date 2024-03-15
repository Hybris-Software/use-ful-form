import { useState, useEffect, useMemo } from "react"
import {
  getDefaultValue,
  getValidator,
  getFormatter,
  getRequiredValidator,
} from "../utils/getters"
import {
  FormInputValues,
  FormShowErrors,
  FormErrors,
  InputValue,
  UseFormProps,
  GetInputPropsOptions,
  UseFormReturn,
  InputProps,
} from "../types"

export const useForm = ({ inputs, onSubmit }: UseFormProps): UseFormReturn => {
  const initialValues: FormInputValues = Object.keys(inputs).reduce(
    (result, key) => {
      result[key] = getDefaultValue(inputs[key].nature, inputs[key].value)
      return result
    },
    {} as FormInputValues
  )

  const initialShowErrors: FormShowErrors = Object.keys(inputs).reduce(
    (result, inputKey) => {
      if (
        inputs[inputKey].value &&
        inputs[inputKey].value !== "" &&
        inputs[inputKey].value !== false
      ) {
        result[inputKey] = true
      } else {
        result[inputKey] = false
      }

      return result
    },
    {} as FormShowErrors
  )

  const [values, setValues] = useState<FormInputValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showErrors, setShowErrors] =
    useState<FormShowErrors>(initialShowErrors)

  useEffect(() => {
    _validate(values)
  }, [values])

  /***************************************
   * UTILITIES
   ***************************************/

  const _getKeyFromApiName = (apiName: string) => {
    const key = Object.keys(inputs).find(
      (inputKey) => inputs[inputKey].apiName === apiName || inputKey === apiName
    )
    if (!key) {
      console.warn(`Input with apiName ${apiName} not found`)
      return null
    } else {
      return key
    }
  }

  /***************************************
   * INPUT CHANGE
   ***************************************/

  const _validate = (values: FormInputValues) => {
    const newErrors: FormErrors = {}

    Object.entries(inputs).forEach(([key, inputDetails]) => {
      if (inputDetails.required) {
        if (!getRequiredValidator(inputDetails.nature)(values[key])) {
          newErrors[key] = [false, "This field is required"]
          return
        }
      }

      const validator = getValidator(
        inputDetails.nature,
        inputDetails.validator
      )
      if (validator) {
        newErrors[key] = validator(values[key], values)
      } else {
        newErrors[key] = [true, null]
      }
    })

    setErrors(newErrors)
    return newErrors
  }

  const setInputValue = (
    key: string,
    value: InputValue,
    showErrors = false
  ) => {
    if (!inputs[key]) {
      throw new Error(`Input with key ${key} not found`)
    }

    const formatter = getFormatter(inputs[key].nature, inputs[key].formatter)
    const formattedValue = formatter ? formatter(value) : value

    setValues((oldValues) => ({ ...oldValues, [key]: formattedValue }))
    if (showErrors) {
      setShowErrors((oldValues) => ({ ...oldValues, [key]: true }))
    }
  }

  const setInputError = (key: string, error: string) => {
    if (!inputs[key]) {
      throw new Error(`Input with key ${key} not found`)
    }

    setErrors((oldErrors) => ({ ...oldErrors, [key]: [false, error] }))
    setShowErrors((oldShowErrors) => ({ ...oldShowErrors, [key]: true }))
  }

  const pushApiValue = (apiName: string, value: InputValue) => {
    const key = _getKeyFromApiName(apiName)

    if (!key) {
      return
    }

    const formatter = getFormatter(inputs[key].nature, inputs[key].formatter)
    const formattedValue = formatter ? formatter(value) : value

    setValues((oldValues) => ({ ...oldValues, [key]: formattedValue }))
    setShowErrors((oldValues) => ({ ...oldValues, [key]: true }))
  }

  const fetchApiValues = (
    receivedData: any,
    { include, exclude }: { include?: string[]; exclude?: string[] } = {}
  ) => {
    // TODO: allow custom value mapping

    let dataKeys = Object.keys(receivedData)
    if (include) {
      dataKeys = dataKeys.filter((apiName) => include.includes(apiName))
    }
    if (exclude) {
      dataKeys = dataKeys.filter((apiName) => !exclude.includes(apiName))
    }

    const newValues = dataKeys.reduce((result, apiName) => {
      const key = _getKeyFromApiName(apiName)

      if (!key) {
        return result
      }

      result[key] = receivedData[apiName]
      return result
    }, {} as FormInputValues)

    setValues((oldValues) => ({
      ...oldValues,
      ...newValues,
    }))
    setShowErrors((oldValues) => ({
      ...oldValues,
      ...Object.keys(newValues).reduce((result, key) => {
        result[key] = true
        return result
      }, {} as FormShowErrors),
    }))
  }

  /***************************************
   * RESET FUNCTIONS
   ***************************************/

  const resetInput = (input: string) => {
    setShowErrors((oldValues) => ({ ...oldValues, [input]: false }))
    setValues((oldValues) => ({ ...oldValues, [input]: initialValues[input] }))
  }

  const reset = () => {
    setShowErrors({})
    setValues(initialValues)
  }

  /***************************************
   * ERRORS
   ***************************************/

  const _showAllErrors = () => {
    const newShowErrors = Object.keys(inputs).reduce((result, key) => {
      result[key] = true
      return result
    }, {} as FormShowErrors)
    setShowErrors(newShowErrors)
  }

  const pushApiError = (
    apiName: string,
    errorDetails: string | Array<string>
  ) => {
    const key = _getKeyFromApiName(apiName)

    if (!key) {
      return
    }

    const _errorDetails = Array.isArray(errorDetails)
      ? errorDetails.join(" ")
      : errorDetails

    setErrors((errors) => ({
      ...errors,
      [key]: [false, _errorDetails],
    }))
  }

  const fetchApiErrors = (receivedErrors: any) => {
    // TODO: allow custom error mapping
    const newErrors = Object.keys(receivedErrors).reduce((result, errorKey) => {
      const key = _getKeyFromApiName(errorKey)

      if (!key) {
        return result
      }

      result[key] = [
        false,
        Array.isArray(receivedErrors[errorKey])
          ? receivedErrors[errorKey].join(" ")
          : receivedErrors[errorKey],
      ]
      return result
    }, {} as FormErrors)

    setErrors((errors) => ({
      ...errors,
      ...newErrors,
    }))
    _showAllErrors()
  }

  const getError = (key: string) => {
    if (showErrors[key] && errors[key]) {
      return errors[key]
    } else {
      return [null, null]
    }
  }

  /***************************************
   * INPUT
   ***************************************/

  const defaultOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit()
    }
  }

  const getInputProps = (
    key: string,
    options?: GetInputPropsOptions
  ): InputProps => {
    return {
      value: values[key],
      setValue: (value: InputValue, showErrors?: boolean) =>
        setInputValue(key, value, showErrors),
      isValid: getError(key)[0] || true,
      errorDetails: getError(key)[1],
      setShowErrors: () =>
        setShowErrors((oldShowErrors) => ({ ...oldShowErrors, [key]: true })),
      resetInput: () => resetInput(key),
      submitForm: submit,
      ...(options?.handleKeyDown && { onKeyDown: defaultOnKeyDown }),
    }
  }

  /***************************************
   * GENERIC FUNCTIONS
   ***************************************/

  const isValid = useMemo(
    () =>
      Object.keys(errors).length == Object.keys(inputs).length &&
      Object.keys(errors).every(
        (key) => errors[key] && errors[key][0] === true
      ),
    [errors]
  )

  const validate = () => {
    _showAllErrors()
    return isValid
  }

  const getApiBody = (): any => {
    return Object.keys(inputs).reduce(
      (result, key) => {
        if (inputs[key].sendToApi !== false) {
          const apiName = inputs[key].apiName || key
          result[apiName] = values[key]
        }
        return result
      },
      {} as { [key: string]: InputValue }
    )
  }

  const submit = () => {
    if (validate()) {
      onSubmit({ data: values, apiBody: getApiBody() })
    }
  }

  return {
    // Values
    values,
    setInputValue,
    // Errors
    errors,
    setInputError,
    // Inputs
    getInputProps,
    resetInput,
    // Form
    isValid,
    validate,
    reset,
    submit,
    // Api
    getApiBody,
    fetchApiErrors,
    fetchApiValues,
    pushApiError,
    pushApiValue,
  }
}
