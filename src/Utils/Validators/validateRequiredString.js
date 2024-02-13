const validateRequiredString = (value) => {
  if (value === null || value === undefined || value.trim() === "") {
    return false;
  } else {
    return true;
  }
};

export default validateRequiredString;
