Tasks = new Mongo.Collection("tasks");
Courses = new Mongo.Collection('courses');

if (Meteor.isServer) {}

if (Meteor.isClient) {
    Session.setDefault('currentPage', false);

    Array.prototype.last = function() {
        return this[this.length - 1];
    }

    Template.register.events({
        'submit form': function(event) {
            event.preventDefault();
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;
            Accounts.createUser({
                email: emailVar,
                password: passwordVar
            }, function(error) {
                $("#errors").html("There was an error registering you: <strong>" + error.reason + "</strong>");
                console.log(error.reason);
            });
        }
    });

    Template.login.events({
        'submit form': function(event, template) {
            console.log("Logging in...");
            event.preventDefault();
            var emailVar = event.target.loginEmail.value;
            var passwordVar = event.target.loginPassword.value;
            Meteor.loginWithPassword(emailVar, passwordVar, function(error) {
                if (Meteor.user()) {
                    console.log("Logged in");
                    Session.set('currentPage', "dashboard");
                } else {
                    console.log("Not logged in");
                    $("#form-messages").html("There was an error logging in: <strong>" + error.reason + "</strong>");
                }
            });
        },
        'click #register': function(event, template) {
            Session.set('currentPage', "register");
        }
    });

    Template.nav.events({
        'click #logout': function(event) {
            console.log("Logging out...");
            event.preventDefault();
            Meteor.logout();
            Session.set('currentPage', "login");
        },
        'click #learn': function(event) {
            event.preventDefault();
            Session.set('currentPage', "learn");
        },
        'click #dashboard': function(event) {
            event.preventDefault();
            Session.set('currentPage', "dashboard");
        },
        'click #home': function(event) {
            event.preventDefault();
            Session.set('currentPage', "dashboard");
        }
    });

    Template.register.events({
        'click #login': function(event) {
            event.preventDefault();
            Session.set('currentPage', "login");
        }
    });

    Template.dashboard.events({
        'click #choose': function(event) {
            event.preventDefault();
            Session.set('currentPage', "choose");
        }
    });

    function selectBoard(event) {
        var newVal = $(event.target).val();
        Session.set("board", newVal);
        console.log("Got change on board selection: " + newVal);
        examBoardCIE(function(data) {
            console.log(data)
        });
    }

    Template.choose.events({
        'change #selectBoard': function(event) {
            selectBoard(event);
        },
        'click #selectBoard': function(event) {
            selectBoard(event)
        },
        'change #selectSubject': function(event) {
            var newVal = $(event.target).val();
            Session.set("subject", newVal);
            console.log("Got change on subject selection: " + newVal);
        },
        'change #selectSyllabus': function(event) {
            var newVal = $(event.target).val();
            Session.set("syllabus", newVal);
            console.log("Got change on syllabus selection: " + newVal);
        }
    })

    Template.container_template.helpers({
        whichOne: function() {
            console.log("Redirect to: " + Session.get('currentPage'));
            if (Session.get('currentPage')) {
                return Session.get('currentPage');
            }
            if (Meteor.user()) {
                currentPage = Session.set('currentPage', false);
                return "dashboard";
            }
            if (!Meteor.user()) {
                currentPage = Session.set('currentPage', false);
                return "login";
            }
        }
    });

    Template.dashboard.rendered = function() {
        if (!this._rendered) {
            this._rendered = true;
            var courseData = Courses.find({
                name: Meteor.userId()
            }).fetch()
            for (i = 0; i < courseData.length; i++) {
                console.log(courseData[i].course);
                var courseID = courseData[i].course.split("-")[0];
                var year = courseData[i].course.split("-")[1];
            }
        }
    }
}