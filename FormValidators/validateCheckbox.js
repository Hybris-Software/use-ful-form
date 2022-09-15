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

export default validateCheckbox;
