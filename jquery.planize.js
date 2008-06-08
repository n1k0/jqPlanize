/**
 * The planize jQuery plugin adds some plan features to given DOM node containing HTML headers:
 *  - adds numerotation and anchors in front of all headers
 *  - generates an HTML table of content
 * @author  Nicolas Perriault <nperriault -> gmail.com>
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 * @return  $(this)
 */
jQuery.fn.planize = function(config) {
  /**
   * Self reference
   */
  var self = jQuery(this);
  var processed = false;
  var toc = '<ul class="plan_toc">';
  var defaultConfig = {
    separator    : '',
    add_anchors  : false,
    generate_toc : false,
    toc_elem     : null,
  };
  config = $.extend(defaultConfig, config);
  /**
   * Prepends all headers text with the current tree number reference
   * @return void
   */
  this.process = function() {
    var level       = 0;
    var levels      = [0,0,0,0,0,0,0];
    var hLevelText  = '';
    var prependText = '';
    var prevLevel   = 0;
    self.children('*:header').each(function(index) {
      level = parseInt(this.tagName.substring(1));
      levels[level]++;
      for (var l = 1; l <= level; l++) {
        hLevelText += levels[l] + '.';
      }
      levels[level + 1] = 0;
      hLevelText = hLevelText.substring(0, hLevelText.length - 1);
      prependText = hLevelText;
      if (config.generate_toc || config.add_anchors) {
        if (prevLevel > 0) {
          if (level > prevLevel) {
            toc += '<ul>';
          } else if (level < prevLevel) {
            while (level < prevLevel) {
              toc += '</ul>';
              prevLevel--;
            }
          }
        }
        if (config.generate_toc) {
          toc += '<li><a href="#h' + hLevelText + '">' + hLevelText + (config.separator ? config.separator : '') + ' ' + $(this).text() + '</a></li>';
        }
        prependText = '<span id="h' + hLevelText + '"></span>' + hLevelText;
      }
      if (config.separator) {
        prependText += config.separator;
      }
      jQuery(this).prepend(prependText + ' ');
      prependText = hLevelText = '';
      prevLevel = level;
    });
    processed = true;
  };
  /**
   * Returns the HTML Table Of Content of the parsed document tree
   * @return 
   */
  this.getHtmlToc = function() {
    return toc + '</ul>';
  }
  
  this.process();
  $('body').prepend(this.getHtmlToc());
  return jQuery(this);
}