AutoForm.hooks({
  admin_insert: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      Meteor.call('adminInsertDoc', insertDoc, Session.get('admin_collection_name'), function(e, r) {
        if (e) {
          return AdminDashboard.alertFailure('Error: ' + e);
        } else {
          $('.btn-primary').removeClass('disabled');
          AutoForm.resetForm('admin_insert');
          adminCallback('onInsert', [Session.get('admin_collection_name', insertDoc, updateDoc, currentDoc)], function(collection) {
            return Router.go("/admin/" + collection);
          });
          return AdminDashboard.alertSuccess('Successfully created');
        }
      });
      return false;
    },
    beginSubmit: function(formId, template) {
      return $('.btn-primary').addClass('disabled');
    },
    onError: function(operation, error, template) {
      return AdminDashboard.alertFailure(error.message);
    }
  },
  admin_update: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      Meteor.call('adminUpdateDoc', updateDoc, Session.get('admin_collection_name'), Session.get('admin_id'), function(e, r) {
        if (e) {
          console.log(e);
          return AdminDashboard.alertFailure('Error: ' + e);
        } else {
          AdminDashboard.alertSuccess('Updated');
          $('.btn-primary').removeClass('disabled');
          AutoForm.resetForm('admin_insert');
          $('.btn-primary').removeClass('disabled');
          return adminCallback('onUpdate', [Session.get('admin_collection_name', insertDoc, updateDoc, currentDoc)], function(collection) {
            return Router.go("/admin/" + collection);
          });
        }
      });
      return false;
    },
    beginSubmit: function(formId, template) {
      return $('.btn-primary').addClass('disabled');
    },
    onError: function(operation, error, template) {
      return AdminDashboard.alertFailure(error.message);
    }
  },
  adminNewUser: {
    onSuccess: function(operation, result, template) {
      return Router.go('adminDashboardUsersView');
    },
    onError: function(operation, error, template) {
      return AdminDashboard.alertFailure(error.message);
    }
  },
  admin_update_user: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      Meteor.call('adminUpdateUser', updateDoc, Session.get('admin_id'), function(e, r) {
        return $('.btn-primary').removeClass('disabled');
      });
      return false;
    },
    onError: function(operation, error, template) {
      return AdminDashboard.alertFailure(error.message);
    }
  },
  adminSendResetPasswordEmail: {
    onSuccess: function(operation, result, template) {
      return AdminDashboard.alertSuccess('Email Sent');
    },
    onError: function(operation, error, template) {
      return AdminDashboard.alertFailure(error.message);
    }
  },
  adminChangePassword: {
    onSuccess: function(operation, result, template) {
      return AdminDashboard.alertSuccess('Password reset');
    },
    onError: function(operation, error, template) {
      return AdminDashboard.alertFailure(error.message);
    }
  }
});
