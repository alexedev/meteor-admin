Template.AdminLayout.events({
  'click .btn-delete': function(e, t) {
    var _id;
    _id = $(e.target).attr('doc');
    Session.set('admin_id', _id);
    if (Session.equals('admin_collection_name', 'Users')) {
      return Session.set('admin_doc', Meteor.users.findOne({
        _id: _id
      }));
    } else {
      return Session.set('admin_doc', adminCollectionObject(Session.get('admin_collection_name')).findOne({
        _id: _id
      }));
    }
  }
});

Template.AdminDeleteModal.events({
  'click #confirm-delete': function() {
    var collection, _id;
    collection = Session.get('admin_collection_name');
    _id = Session.get('admin_id');
    return Meteor.call('adminRemoveDoc', collection, _id, function(e, r) {
      return $('#admin-delete-modal').modal('hide');
    });
  }
});

Template.AdminDashboardUsersEdit.events({
  'click .btn-add-role': function(e, t) {
    console.log('adding user');
    return Meteor.call('adminAddUserToRole', $(e.target).attr('user'), $(e.target).attr('role'));
  },
  'click .btn-remove-role': function(e, t) {
    console.log('removing user');
    return Meteor.call('adminRemoveUserToRole', $(e.target).attr('user'), $(e.target).attr('role'));
  }
});

Template.AdminHeader.events({
  'click .btn-sign-out': function() {
    return Meteor.logout(function() {
      return Router.go('/');
    });
  }
});
