define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "manage_schema_item",
    template: 'item',
    events: {
      'click .add-item': 'add',
      'click .del-item': 'del',
      'click .cbx-template': 'toggleTemplate'
    },
    name: function() {
      return 'fields';
    },
    value: function() {
      var $fields = this.$('.field-item');
      var fields = [];
      $fields.each(function(i, field) {
        var $field = $(field);
        var customtmpl = $field.find('[name="field_customtmpl"]').val();
        fields.push({
          name: $field.find('[name="field_name"]').val(),
          alias: $field.find('[name="field_alias"]').val(),
          type: $field.find('[name="field_type"]').val(),
          index: $field.find('[name="field_index"]').val(),
          defaults: $field.find('[name="field_defaults"]').val(),
          display: $field.find('[name="field_display"]').val(),
          get: $field.find('[name="field_get"]').val(),
          editable: $field.find('[name="field_editable"]').val(),
          customtmpl: customtmpl,
          template: (customtmpl === '1' ? $field.find('[name="field_template"]').val() : '')
        });
      });
      return fields;
    },
    init: function() {
      this.initView();
      this.$('.schema-list').sortable();
      this.on('afterrender', this.check.bind(this));
    },
    initView: function() {
      var self = this;
      var fields = this.$('.schema-list').attr('data-fields');
      var controls = this.$('.schema-list').attr('data-controls');
      if (fields) {
        fields = JSON.parse(fields);
      } else {
        fields = [null];
      }
      if (controls) {
        controls = JSON.parse(controls);
      } else {
        controls = [null];
      }
      if (fields) {
        this.loadTemplate('item', function(template) {
          _.forEach(fields, function(field) {
            var html = template({
              field: field,
              controls: controls
            });
            self.$('.schema-list').append(html);
          });
        });
      }
    },
    toggleTemplate: function(e) {
      var $target = $(e.target);
      if ($target[0].checked) {
        $target[0].value = '1';
        $target.parent().parent().next().show();
      } else {
        $target[0].value = '0';
        $target.parent().parent().next().hide();
      }
    },
    add: function(e) {
      e.preventDefault();
      var self = this;
      var controls = this.$('.schema-list').attr('data-controls');
      if (controls) {
        controls = JSON.parse(controls);
      } else {
        controls = [null];
      }
      this.loadTemplate('item', function(template) {
        var html = template({
          controls: controls
        });
        self.$('.schema-list').append(html);
        self.check();
      });
    },
    del: function(e) {
      e.preventDefault();
      var $items = this.$('.schema-list .form-group');
      $items.last().remove();
      this.check();
    },
    check: function() {
      var $items = this.$('.schema-list .form-group');
      if ($items.length > 1) {
        this.$('.del-item').removeAttr('disabled');
      } else {
        this.$('.del-item').attr('disabled', 'disabled');
      }
    }
  });
  return View;
});