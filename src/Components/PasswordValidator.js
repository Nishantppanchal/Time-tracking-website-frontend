const errorsText = [
  'Password must be a minimum 8 character long',
  'Password must have at least one number',
  'Password must have at least one uppercase character',
  'Password must have at least one lowercase character',
  'Password must have at least one special character',
  'The passwords do not match',
];

// Function that valids the password entered by the user
function passwordValidator(password, retypedPassword) {
  // Sets the retyped password to the retypedPassword so it is just password if null
  retypedPassword = retypedPassword ?? password;

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
    errors.push(errorsText[0]);
  }
  // If the password doesn't have one or more number
  if (!hasNumber) {
    // Add the error text to errors array
    errors.push(errorsText[1]);
  }
  // It the password doesn't have one or more upper case characters
  if (!hasUpperCase) {
    // Add the error text to errors array
    errors.push(errorsText[2]);
  }
  // If the password doesn't have one or more lower case characters
  if (!hasLowerCase) {
    // Add the error text to errors array
    errors.push(errorsText[3]);
  }
  // If the password doesn't have one or more special characters
  if (!hasSpecialChar) {
    // Add the error text to errors array
    errors.push(errorsText[4]);
  }
  // If the password and retyped password are not the same
  if (!doesMatch) {
    // Add the error text to errors array
    errors.push(errorsText[5]);
  }

  // Returns the errors array
  return errors;
}

// Export passwordValidator function
export default passwordValidator;
export { errorsText };
