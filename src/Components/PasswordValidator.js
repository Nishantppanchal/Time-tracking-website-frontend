function passwordValidator(password, retypedPassword) {
    var validLength = ((password.length >= 8) ? true : false);
    var hasUpperCase = (password.toLowerCase() !== password);
    var hasLowerCase = (password.toUpperCase() !== password);
    var hasNumber = (/\d/.test(password));
    var hasSpecialChar = (/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password));
    var doesMatch = (password == retypedPassword)

    var errors = [];

    if (!validLength) {
        errors.push('Password must be a minimum 8 character long');
    };
    if (!hasNumber) {
        errors.push('Password must have atleast one number');
    };
    if (!hasUpperCase) {
        errors.push('Password must have atleat one uppercase character')
    };
    if (!hasLowerCase) {
        errors.push('Password must have atleast one lowercase character')
    };
    if (!hasSpecialChar) {
        errors.push('Password must have atleat one special character')
    }
    // if (!doesMatch) {
    //     errors.push('The passwords do not match')
    // }

    return errors
};

export default passwordValidator;
