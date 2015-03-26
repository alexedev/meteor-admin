Template.AdminDashboardViewWrapper.rendered = function() {
  var node;
  node = this.firstNode;
  return this.autorun(function() {
    var data;
    data = Template.currentData();
    if (data.view) {
      Blaze.remove(data.view);
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    return data.view = Blaze.renderWithData(Template.AdminDashboardView, data, node);
  });
};

Template.AdminDashboardViewWrapper.destroyed = function() {
  return Blaze.remove(this.data.view);
};

Template.AdminDashboardView.rendered = function() {
  var filter, length, table;
  table = this.$('.dataTable').DataTable();
  filter = this.$('.dataTables_filter');
  length = this.$('.dataTables_length');
  filter.html('<div class="input-group"> <input type="search" class="form-control input-sm" placeholder="Search"> <div class="input-group-btn"> <button class="btn btn-sm btn-default"> <i class="fa fa-search"></i> </button> </div> </div>');
  length.html('<select class="form-control input-sm"> <option value="10">10</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> records per page');
  filter.find('input').on('keyup', function() {
    return table.search(this.value).draw();
  });
  return length.find('select').on('change', function() {
    return table.page.len(parseInt(this.value)).draw();
  });
};

Template.AdminDashboardView.helpers({
  hasDocuments: function() {
    var _ref;
    return ((_ref = AdminCollectionsCount.findOne({
      collection: Session.get('admin_collection_name')
    })) != null ? _ref.count : void 0) > 0;
  }
});
