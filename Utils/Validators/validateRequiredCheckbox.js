const requiredCheckboxValidator = (value) => {
  if (value === true) {
    return true;
  } else {
    return false;
  }
};

export default requiredCheckboxValidator;
