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

export default validateNoEmptyInput;