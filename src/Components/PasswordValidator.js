// Function that valids the password entered by the user
function passwordValidator(inputs) {
  // Sets the password to the password constant
  const password = inputs.password;
  // Sets the retyped password to the retypedPassword constant
  const retypedPassword = inputs.retypedPassword;

  // Sets validLength to whether password length if more than or equal to 8
  const validLength = password.length >= 8 ? true : false;
  // Sets hasUpperCase to whether the password has atleast one upper case
  const hasUpperCase = password.toLowerCase() !== password;
  // Sets hasLowerCase to whether the password has atleast one lower case
  const hasLowerCase = password.toUpperCase() !== password;
  // Sets hasNumber to whether password has atleast one number
  const hasNumber = /\d/.test(password);
  // Sets hasSpecialChar to whether password has atleast one special character
  const hasSpecialChar = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password);
  // Sets doesMatch to whether password and retyped password are the same
  const doesMatch = password == retypedPassword;

  // Create a variable error which stores the errors are arrays
  var errors = [];

  // If the password is not more than 8 characters long
  if (!validLength) {
    // Add the error text to errors array
    errors.push("Password must be a minimum 8 character long");
  }
  // If the password doesn't have one or more number
  if (!hasNumber) {
    // Add the error text to errors array
    errors.push("Password must have atleast one number");
  }
  // It the password doesn't have one or more upper case characters
  if (!hasUpperCase) {
    // Add the error text to errors array
    errors.push("Password must have atleat one uppercase character");
  }
  // If the password doesn't have one or more lower case characters
  if (!hasLowerCase) {
    // Add the error text to errors array
    errors.push("Password must have atleast one lowercase character");
  }
  // If the password doesn't have one or more special characters
  if (!hasSpecialChar) {
    // Add the error text to errors array
    errors.push("Password must have atleat one special character");
  }
  // If the password and retyped password are not the same
  if (!doesMatch) {
    // Add the error text to errors array
    errors.push("The passwords do not match");
  }

  // Returns the errors array
  return errors;
}

// Export passwordValidator function
export default passwordValidator;
