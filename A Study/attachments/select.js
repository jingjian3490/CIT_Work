(function($, Drupal) {
  $(".form-checkboxes").prepend($('<input type="checkbox" class="form-checkbox shield-select-all"/><label class="option shield-select-all-label"> Select / Deselect all </label>'));
  $(".shield-select-all").click(function() {
    let $isChecked = (!$(this).attr('checked'));
    $(this).parent().find('.form-type-checkbox input[type=checkbox]').attr('checked', $isChecked);
    $(this).attr('checked', $isChecked)
  })

  if (jQuery('body').hasClass('path-node') && jQuery('form').hasClass('node-form')) {
    $("form.node-form select").select2();
  }
})(jQuery, Drupal);
