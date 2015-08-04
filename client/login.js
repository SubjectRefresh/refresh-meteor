// trim helper
var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
}

Template.login.events({
    'submit #login-form': function(e, t) {
        e.preventDefault();
        // retrieve the input field values
        var email = trimInput(t.find('#login-email').value),
            password = t.find('#login-password').value;

        Meteor.loginWithPassword(email, password, function(err) {
            if (err) {
                console.log("User Not Logged In");
            }
            // The user might not have been found, or their passwword
            // could be incorrect. Inform the user that their
            // login attempt has failed. 
            else {
                console.log("User Logged In");
            }
            // The user has been logged in.
        });
        return false;
    }
});
