
function checkIfIsEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const validateEmail = (e) => {

  if (checkIfIsEmail(e)) {
    return { value: true };
  } else {
    return { value: false, message: "Invalid email" };
  }
};

export default validateEmail;
