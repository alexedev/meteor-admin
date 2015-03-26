var adminCreateTables, adminEditDelButtons, adminPublishTables, adminTablePubName, adminTablesDom;

this.AdminTables = {};

adminTablesDom = '<"box"<"box-body"<"row"<"col-xs-6"<l>><"col-xs-6"f>>t<"row"<"col-xs-6"i><"col-xs-6"p>> >>';

adminEditDelButtons = [
  {
    data: '_id',
    title: 'Edit',
    createdCell: function(node, cellData, rowData) {
      return $(node).html(Blaze.toHTMLWithData(Template.adminEditBtn, {
        _id: cellData
      }, node));
    },
    width: '40px',
    orderable: false
  }, {
    data: '_id',
    title: 'Delete',
    createdCell: function(node, cellData, rowData) {
      return $(node).html(Blaze.toHTMLWithData(Template.adminDeleteBtn, {
        _id: cellData
      }, node));
    },
    width: '40px',
    orderable: false
  }
];

var defaultColumns = [
    {
        data: '_id',
        title: 'ID'
    }
];

AdminTables.Users = new Tabular.Table({
  name: 'Users',
  collection: Meteor.users,
  columns: _.union([
    {
      data: '_id',
      title: 'Admin',
      createdCell: function(node, cellData, rowData) {
        return $(node).html(Blaze.toHTMLWithData(Template.adminUsersIsAdmin, {
          _id: cellData
        }, node));
      },
      width: '40px'
    }, {
      data: 'emails',
      title: 'Email',
      render: function(value) {
        return value[0].address;
      }
    }, {
      data: 'emails',
      title: 'Mail',
      createdCell: function(node, cellData, rowData) {
        return $(node).html(Blaze.toHTMLWithData(Template.adminUsersMailBtn, {
          emails: cellData
        }, node));
      },
      width: '40px'
    }, {
      data: 'createdAt',
      title: 'Joined'
    }
  ], adminEditDelButtons),
  dom: adminTablesDom,
    tableTools: {
        "sRowSelect": "os",
        "aButtons": [ "select_all", "select_none" ]
    }
});

adminTablePubName = function(collection) {
  return "admin_tabular_" + collection;
};

adminCreateTables = function(collections) {
  return _.each(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0, function(collection, name) {
    var columns;
    columns = _.map(collection.tableColumns, function(column) {
      var createdCell;
      if (column.template) {
        createdCell = function(node, cellData, rowData) {
          return $(node).html(Blaze.toHTMLWithData(Template[column.template], {
            value: cellData,
            doc: rowData
          }, node));
        };
      }
      return {
        data: column.name,
        title: column.label,
        createdCell: createdCell
      };
    });
    if (columns.length === 0) {
      columns = defaultColumns;
    }
    return AdminTables[name] = new Tabular.Table({
      name: name,
      collection: adminCollectionObject(name),
      pub: collection.children && adminTablePubName(name),
      sub: collection.sub,
      columns: _.union(columns, adminEditDelButtons),
      extraFields: collection.extraFields,
      dom: adminTablesDom,
        tableTools: {
            "sRowSelect": "os",
            "aButtons": [ "select_all", "select_none" ]
        }
    });
  });
};

adminPublishTables = function(collections) {
  return _.each(collections, function(collection, name) {
    if (!collection.children) {
      return void 0;
    }
    return Meteor.publishComposite(adminTablePubName(name), function(tableName, ids, fields) {
      check(tableName, String);
      check(ids, Array);
      check(fields, Match.Optional(Object));
      this.unblock();
      return {
        find: function() {
          this.unblock();
          return adminCollectionObject(name).find({
            _id: {
              $in: ids
            }
          }, {
            fields: fields
          });
        },
        children: collection.children
      };
    });
  });
};

Meteor.startup(function() {
  adminCreateTables(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  if (Meteor.isServer) {
    return adminPublishTables(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  }
});
