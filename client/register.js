// trim helper
var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
}

Template.register.events({
    'submit #register-form': function(e, t) {
        e.preventDefault();

        var email = trimInput(t.find('#account-email').value),
            password = t.find('#account-password').value;

        // Trim and validate the input

        Accounts.createUser({
            email: email,
            password: password
        }, function(err) {
            if (err) {
                console.log(err);
                console.log("Account Creation Error!");
            } else {
                console.log("Account Creation Success!");
            }

        });

        return false;
    }
});
