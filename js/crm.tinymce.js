(function($, _) {
  // Export default settings so they can be overridden
  CRM.config.tinymce = {
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
    apply_source_formatting: true,
    setup: function(ed) {
      var height = $("#" + ed.editorId).attr("height");
      $("#" + ed.editorId + "_tbl, #" + ed.editorId + "_ifr").css("height", height);
    }
  };

  function getInstance(item) {
    var id = $(item).attr("id");
    return id ? tinyMCE.get(id) : null;
  }

  function openFiles(field_name, url, type, win) {
    var browseUrl = CRM.config.userFrameworkResourceURL + "packages/kcfinder/browse.php?opener=tinymce4&cms=civicrm&type="+type+"&field="+field_name+"&theme=default";
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

  CRM.wysiwyg.supportsFileUploads = true;
  CRM.wysiwyg.create = function(item) {
    var id = $(item).attr("id"),
      blurEvent,
      changeEvent,
      deferred = $.Deferred(),
      editor = tinymce.createEditor(id, CRM.config.tinymce);

    editor.on('init', function() {
      deferred.resolve();
    });

    editor.render();

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

    return deferred;
  };

  CRM.wysiwyg.destroy = function(item) {
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
