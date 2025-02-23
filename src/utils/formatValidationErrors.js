const formatValidationErrors = (validationErrors = []) => {
    const formattedErrors = validationErrors.map(({ msg, path }) => ({
        message: msg,
        field: path
    }));
    return formattedErrors;
}

module.exports = formatValidationErrors;
