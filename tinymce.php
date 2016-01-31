<?php

require_once 'tinymce.civix.php';

/**
 * Implements hook_civicrm_coreResourceList
 *
 * Add TinyMCE javascript.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_coreResourceList
 */
function tinymce_civicrm_coreResourceList($list, $region) {
  if ($region == 'html-header') {
    if (CRM_Core_BAO_Setting::getItem(CRM_Core_BAO_Setting::SYSTEM_PREFERENCES_NAME, 'editor_id') == "TinyMCE") {
      CRM_Core_Resources::singleton()->addScriptFile('com.aghstrategies.tinymce', 'js/tinymce/tinymce.min.js', -99, 'html-header');
      CRM_Core_Resources::singleton()->addScriptFile('com.aghstrategies.tinymce', 'js/crm.tinymce.js', -97, 'html-header');
    }
  }
}

/**
 * Implementation of hook_civicrm_install
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_install
 */
function tinymce_civicrm_install() {
  Civi::settings()->set('editor_id', 'TinyMCE');
  return _tinymce_civix_civicrm_install();
}

/**
 * Implementation of hook_civicrm_uninstall
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_uninstall
 */
function tinymce_civicrm_uninstall() {
  Civi::settings()->set('editor_id', 'CKEditor');
  return _tinymce_civix_civicrm_uninstall();
}

/**
 * Implementation of hook_civicrm_enable
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_enable
 */
function tinymce_civicrm_enable() {
  Civi::settings()->set('editor_id', 'TinyMCE');
  return _tinymce_civix_civicrm_enable();
}

/**
 * Implementation of hook_civicrm_disable
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_disable
 */
function tinymce_civicrm_disable() {
  Civi::settings()->set('editor_id', 'CKEditor');
  return _tinymce_civix_civicrm_disable();
}

/**
 * Implementation of hook_civicrm_upgrade
 *
 * @param $op string, the type of operation being performed; 'check' or 'enqueue'
 * @param $queue CRM_Queue_Queue, (for 'enqueue') the modifiable list of pending up upgrade tasks
 *
 * @return mixed  based on op. for 'check', returns array(boolean) (TRUE if upgrades are pending)
 *                for 'enqueue', returns void
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_upgrade
 */
function tinymce_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _tinymce_civix_civicrm_upgrade($op, $queue);
}

/**
 * Implementation of hook_civicrm_managed
 *
 * Generate a list of entities to create/deactivate/delete when this module
 * is installed, disabled, uninstalled.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_managed
 */
function tinymce_civicrm_managed(&$entities) {
  $entities[] = array(
    'module' => 'com.aghstrategies.tinymce',
    'entity' => 'OptionValue',
    'name'  => 'TinyMCE',
    'params' => array(
      'version' => 3,
      'option_group_id' => "wysiwyg_editor",
      'label' => 'TinyMCE',
      'is_active' => '1',
    ),
  );
  return _tinymce_civix_civicrm_managed($entities);
}
