module.exports = {
    validateEmail: function (email) {
        // eslint-disable-next-line no-control-regex
        let regExp = "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
        let emailRegex = new RegExp(regExp);
        return emailRegex.test(email);
    },
    validatePassword: function (password) {
        // Minimum 8 characters and maximum 32 characters
        if (password.length < 8 || password.length > 32) {
            return false;
        }

        // At least 1 special character, 1 number, 1 uppercase letter, and 1 lowercase letter
        const regex = /^(?=.*[!@#$%^&*()\-_=+{}[\]|\\;:'",.<>/?])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/;

        return regex.test(password);
    },
    validateUsername: function (username) {
        return true;
    }
}