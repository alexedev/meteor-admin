Meteor.methods({
  adminInsertDoc: function(doc, collection) {
    var Future, fut;
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Future = Npm.require('fibers/future');
      fut = new Future();
      adminCollectionObject(collection).insert(doc, function(e, _id) {
        return fut['return']({
          e: e,
          _id: _id
        });
      });
      return fut.wait();
    }
  },
  adminUpdateDoc: function(modifier, collection, _id) {
    var Future, fut;
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Future = Npm.require('fibers/future');
      fut = new Future();
      adminCollectionObject(collection).update({
        _id: _id
      }, modifier, function(e, r) {
        return fut['return']({
          e: e,
          r: r
        });
      });
      return fut.wait();
    }
  },
  adminRemoveDoc: function(collection, _id) {
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      if (collection === 'Users') {
        return Meteor.users.remove({
          _id: _id
        });
      } else {
        return adminCollectionObject(collection).remove({
          _id: _id
        });
      }
    }
  },
  adminNewUser: function(doc) {
    var emails;
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      emails = doc.email.split(',');
      return _.each(emails, function(email) {
        var user, _id;
        user = {};
        user.email = email;
        if (!doc.chooseOwnPassword) {
          user.password = doc.password;
        }
        _id = Accounts.createUser(user);
        if (doc.sendPassword && typeof AdminConfig.fromEmail !== 'undefined') {
          return Email.send({
            to: user.email,
            from: AdminConfig.fromEmail,
            subject: 'Your account has been created',
            html: 'You\'ve just had an account created for ' + Meteor.absoluteUrl() + ' with password ' + doc.password
          });
        }
      });
    }
  },
  adminUpdateUser: function(modifier, _id) {
    var Future, fut;
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Future = Npm.require('fibers/future');
      fut = new Future();
      Meteor.users.update({
        _id: _id
      }, modifier, function(e, r) {
        return fut['return']({
          e: e,
          r: r
        });
      });
      return fut.wait();
    }
  },
  adminSendResetPasswordEmail: function(doc) {
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      console.log('Changing password for user ' + doc._id);
      return Accounts.sendResetPasswordEmail(doc._id);
    }
  },
  adminChangePassword: function(doc) {
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      console.log('Changing password for user ' + doc._id);
      Accounts.setPassword(doc._id, doc.password);
      return {
        label: 'Email user their new password'
      };
    }
  },
  adminCheckAdmin: function() {
    var adminEmails, email;
    check(arguments, [Match.Any]);
    if (this.userId && !Roles.userIsInRole(this.userId, ['admin'])) {
      email = Meteor.users.findOne({
        _id: this.userId
      }).emails[0].address;
      if (typeof Meteor.settings.adminEmails !== 'undefined') {
        adminEmails = Meteor.settings.adminEmails;
        if (adminEmails.indexOf(email) > -1) {
          console.log('Adding admin user: ' + email);
          return Roles.addUsersToRoles(this.userId, ['admin']);
        }
      } else if (typeof AdminConfig !== 'undefined' && typeof AdminConfig.adminEmails === 'object') {
        adminEmails = AdminConfig.adminEmails;
        if (adminEmails.indexOf(email) > -1) {
          console.log('Adding admin user: ' + email);
          return Roles.addUsersToRoles(this.userId, ['admin']);
        }
      } else if (this.userId === Meteor.users.findOne({}, {
        sort: {
          createdAt: 1
        }
      })._id) {
        console.log('Making first user admin: ' + email);
        return Roles.addUsersToRoles(this.userId, ['admin']);
      }
    }
  },
  adminAddUserToRole: function(_id, role) {
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Roles.addUsersToRoles(_id, role);
    }
  },
  adminRemoveUserToRole: function(_id, role) {
    check(arguments, [Match.Any]);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Roles.removeUsersFromRoles(_id, role);
    }
  },
  adminSetCollectionSort: function(collection, _sort) {
    check(arguments, [Match.Any]);
    return global.AdminPages[collection].set({
      sort: _sort
    });
  }
});
