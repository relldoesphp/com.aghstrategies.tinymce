(function($, _) {
  var autoId = 0,
  // Default settings (can be overridden in CRM.config.tinymce)
  defaults = {
    menubar: false,
    plugins: [
      "advlist autolink lists link image charmap print preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars code fullscreen",
      "insertdatetime media nonbreaking save table contextmenu directionality",
      "emoticons template paste textcolor colorpicker textpattern"
    ],
    toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | spellchecker separator removeformat separator ",
    toolbar2: "print preview media | forecolor backcolor emoticons | justifyfull separator pastetext pasteword | code | fullscreen help",
    image_advtab: true,
    convert_urls: false,
    remove_script_host: false,
    file_browser_callback: openFiles,
    apply_source_formatting: true
  };

  CRM.wysiwyg.supportsFileUploads = true;

  function getInstance(item) {
    var id = $(item).attr("id");
    return id ? tinyMCE.get(id) : null;
  }

  function openFiles(field_name, url, type, win) {
    var browseUrl = CRM.config.resourceBase + "packages/kcfinder/browse.php?opener=tinymce4&cms=civicrm&type="+type+"&field="+field_name+"&theme=default";
    tinyMCE.activeEditor.windowManager.open({
        file: browseUrl,
        title: ts("CiviCRM File Manager"),
        width: 700,
        height: 500,
        resizable: "yes",
        inline: true,
        close_previous: "no",
        popup_css: false
      },
      {
        window: win,
        input: field_name
      });
    return false;
  }

  CRM.wysiwyg.create = function(item) {
    var id = $(item).attr('id'),
      deferred = $.Deferred(),
      settings = $.extend({}, defaults, CRM.config.tinymce || {});

    settings.setup = function(editor) {
      var blurEvent, changeEvent;

      editor.on('init', function() {
        deferred.resolve();
        $(item).trigger('crmWysiwygCreate', ['tinymce', editor]);
      });

      editor.on('blur', function() {
        if (blurEvent) clearTimeout(blurEvent);
        blurEvent = setTimeout(function() {
          editor.save();
          $(item).trigger("blur");
        }, 100);
      });

      editor.on('change', function() {
        if (changeEvent) clearTimeout(changeEvent);
        changeEvent = setTimeout(function() {
          editor.save();
          $(item).trigger("change");
        }, 100);
      });

      editor.on('LoadContent', function() {
        $(item).trigger("paste");
      });

      // Hide CiviCRM menubar when editor is fullscreen
      editor.on('FullscreenStateChanged', function(e) {
        $('#civicrm-menu, #wpadminbar, #toolbar').toggle(!e.state);
      });
    };

    if (!$(item).length) {
      return deferred.reject();
    }

    if ($(item).hasClass('crm-wysiwyg-enabled')) {
      return deferred.resolve();
    }

    if (!id) {
      id = 'crm-tinymce-instance-' + (autoId++);
      $(item).first().attr('id', id);
    }

    $(item).addClass('crm-wysiwyg-enabled');

    tinymce.createEditor(id, settings).render();

    return deferred;
  };

  CRM.wysiwyg.destroy = function(item) {
    $(item).removeClass('crm-wysiwyg-enabled');
    var editor = getInstance(item);
    if (editor) {
      editor.destroy();
    }
  };

  CRM.wysiwyg.updateElement = function(item) {
    var editor = getInstance(item);
    if (editor) {
      editor.save();
    }
  };

  CRM.wysiwyg.getVal = function(item) {
    var editor = getInstance(item);
    if (editor) {
      return editor.getContent();
    } else {
      return $(item).val();
    }
  };

  CRM.wysiwyg.setVal = function(item, val) {
    var editor = getInstance(item);
    if (editor) {
      return editor.setContent(val);
    } else {
      return $(item).val(val);
    }
  };

  CRM.wysiwyg.insert = function(item, text) {
    var editor = getInstance(item);
    if (editor) {
      editor.insertContent(text);
    } else {
      CRM.wysiwyg._insertIntoTextarea(item, text);
    }
  };
  CRM.wysiwyg.focus = function(item) {
    var editor = getInstance(item);
    if (editor) {
      editor.focus();
    } else {
      $(item).focus();
    }
  };

})(CRM.$, CRM._);
