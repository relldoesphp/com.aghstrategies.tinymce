/*_.init(function(){
  tinyMCE.init(
    {selector:"textarea",
     plugins:"link image media",
     toolbar:"link | image | media",
     file_browser_callback:function(d,a,b,c){
      tinyMCE.activeEditor.windowManager.open({
        file:"/demo/kcfinder/browse.php?opener=tinymce4&field="+d+"&type="+b+"&dir="+b+"/public",
        title:"KCFinder web file manager",
        width:700,
        height:500,
        inline:true,
        close_previous:false
      },
      {window:c,input:d});return false}})});

      function openKCFinder(c,a,b,d){
     tinyMCE.activeEditor.windowManager.open({
      file:"/demo/kcfinder/browse.php?opener=tinymce&type="+b+"&dir="+b+"/public",title:"KCFinder",width:700,height:500,resizable:true,inline:true,close_previous:false,popup_css:false},{window:d,input:c});return false}
*/
(function($, _) {
  function getInstance(item) {
    var id = $(item).attr("id");
    return tinyMCE.get(id);
  }

  function openFiles(field_name, url, type, win) {
    var browseUrl = CRM.config.userFrameworkResourceURL + "packages/kcfinder2/browse.php?opener=tinymce4&cms=civicrm&type="+type+"&dir="+url+"&field"+field_name+"&theme=default";
    tinyMCE.activeEditor.windowManager.open({
        file: browseUrl,
        title: "KCFinder Web File Manager",
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
    var id = $(item).attr("id");
    var editor = tinymce.createEditor(id, {
      theme : "modern",
      plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons template paste textcolor colorpicker textpattern"
      ],
      toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | spellchecker separator removeformat separator ",
      toolbar2: "print preview media | forecolor backcolor emoticons | justifyfull separator pastetext pasteword | code | fullscreen help",
      image_advtab: true,
      convert_urls : false,
      remove_script_host : false,
      file_browser_callback:   function(field_name, url, type, win) {
        var browseUrl = CRM.config.userFrameworkResourceURL + "packages/kcfinder/browse.php?opener=tinymce4&cms=civicrm&type="+type+"&field="+field_name+"&theme=default";
        tinyMCE.activeEditor.windowManager.open({
            file: browseUrl,
            title: "CiviCRM File Manager",
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
      },
      apply_source_formatting : true,
      setup : function(ed) {
            var height = cj("#" + ed.editorId).attr("height");
            $("#" + ed.editorId + "_tbl").css("height", height);
            $("#" + ed.editorId + "_ifr").css("height", height);
      }
    });
    editor.render();
    editor.on('blur', function() {
      editor.save();
      $(item).trigger("blur");
      $(item).trigger("change");
    });
    editor.on('change', function() {
      $(item).trigger("change");
    });
    editor.on('LoadContent', function() {
      $(item).trigger("paste");
    });
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
