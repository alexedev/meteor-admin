this.AdminDashboard = {
  schemas: {},
  sidebarItems: [],
  collectionItems: [],
  alertSuccess: function(message) {
    return Session.set('adminSuccess', message);
  },
  alertFailure: function(message) {
    return Session.set('adminError', message);
  },
  checkAdmin: function() {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin');
      if (typeof (typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.nonAdminRedirectRoute : void 0) === "string") {
        Router.go(AdminConfig.nonAdminRedirectRoute);
      }
    }
    if (typeof this.next === 'function') {
      return this.next();
    }
  },
  adminRoutes: ['adminDashboard', 'adminDashboardUsersNew', 'adminDashboardUsersView', 'adminDashboardUsersEdit', 'adminDashboardView', 'adminDashboardNew', 'adminDashboardEdit', 'adminDashboardDetail'],
  collectionLabel: function(collection) {
    if (collection === 'Users') {
      return 'Users';
    } else if ((collection != null) && typeof AdminConfig.collections[collection].label === 'string') {
      return AdminConfig.collections[collection].label;
    } else {
      return Session.get('admin_collection_name');
    }
  },
  addSidebarItem: function(title, url, options) {
    var item;
    item = {
      title: title
    };
    if (_.isObject(url) && typeof options === 'undefined') {
      item.options = url;
    } else {
      item.url = url;
      item.options = options;
    }
    return this.sidebarItems.push(item);
  },
  extendSidebarItem: function(title, urls) {
    var existing;
    if (_.isObject(urls)) {
      urls = [urls];
    }
    existing = _.find(this.sidebarItems, function(item) {
      return item.title === title;
    });
    if (existing) {
      return existing.options.urls = _.union(existing.options.urls, urls);
    }
  },
  addCollectionItem: function(fn) {
    return this.collectionItems.push(fn);
  },
  path: function(s) {
    var path;
    path = '/admin';
    if (typeof s === 'string' && s.length > 0) {
      path += (s[0] === '/' ? '' : '/') + s;
    }
    return path;
  }
};

AdminDashboard.schemas.newUser = new SimpleSchema({
  email: {
    type: String,
    label: "Email address"
  },
  chooseOwnPassword: {
    type: Boolean,
    label: 'Let this user choose their own password with an email',
    defaultValue: true
  },
  password: {
    type: String,
    label: 'Password',
    optional: true
  },
  sendPassword: {
    type: Boolean,
    label: 'Send this user their password by email',
    optional: true
  }
});

AdminDashboard.schemas.sendResetPasswordEmail = new SimpleSchema({
  _id: {
    type: String
  }
});

AdminDashboard.schemas.changePassword = new SimpleSchema({
  _id: {
    type: String
  },
  password: {
    type: String
  }
});
