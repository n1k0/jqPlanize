/**
 * The planize jQuery plugin adds some features for dealing with hierarchical headings in a given DOM element.
 * 
 *  * adds enumerations and anchors in all headings,
 *  * can generates an HTML table of content and append it to an existing DOM element,
 *  * in an unobstrusive way.
 * 
 * Example of use:
 * $('html *').planize();
 *
 * Configuration object parameters documentation:
 *  - add_anchors      : generates anchors for each header (automatically set to true if `generate_toc` is set to true)
 *  - debug            : prints pretty debug messages into the firebug or opera console, if available
 *  - generate_toc     : generates an html unordered list containing the table of content of the document
 *  - min_level        : min heading level needed to be included in toc and be renumbered (0 = all headings)
 *  - max_level        : max heading level needed to be included in toc and be renumbered (0 = all headings)
 *  - number_suffix    : heading identifier suffix, eg. ')' in "1.2.3)"
 *  - number_separator : separator for numbers, eg. '.' in "1.2.3)"
 *  - toc_elem         : the dom element where the toc will be append
 *  - toc_title        : the title of the table of content
 *
 * @requires  jQuery v1.2 or later
 * @author    Nicolas Perriault <nperriault -> gmail.com>
 * @license   MIT (http://www.opensource.org/licenses/mit-license.php)
 * @param     Object  config  Plugin configuration
 * @return    jQuery(this)
 *
 */
(function($){

  $.fn.planize = function(config) {
  
    var self          = jQuery(this);
    var processed     = false;
    var toc           = '';
    var defaultConfig = {
      add_anchors      : false,      // generates anchors for each header (automatically set to true if `generate_toc` is set to true)
      debug            : false,      // prints pretty debug messages into the firebug or opera console, if available
      generate_toc     : false,      // generates an html unordered list containing the table of content of the document
      min_level        : 1,          // min heading level needed to be included in toc and be renumbered (0 = all headings)
      max_level        : 6,          // max heading level needed to be included in toc and be renumbered (0 = all headings)
      number_suffix    : '',         // heading identifier suffix, eg. ')' in "1.2.3)"
      number_separator : '.',        // separator for numbers, eg. '.' in "1.2.3)"
      toc_elem         : null,       // the dom element where the toc will be append
      toc_title        : 'Table of contents', // the title of the table of content
    };
    config = jQuery.extend(defaultConfig, config);
  
    /**
     * Prepends all headers text with the current tree number reference
     * @return void
     */
    var process = function() {
      var level       = 0;
      var levels      = [0,0,0,0,0,0,0];
      var hLevelText  = '';
      var prependText = '';
      var prevLevel   = 0;
      self.children('*:header').each(function(index) {
        level = parseInt(this.tagName.substring(1));
        if (config.min_level <= level && level <= config.max_level) {
          levels[level]++;
          for (var l = 1; l <= level; l++) {
            hLevelText += levels[l] > 0 ? levels[l] + config.number_separator : '';
          }
          levels[level + 1] = 0;
          hLevelText = hLevelText.substring(0, hLevelText.length - 1);
          prependText = hLevelText;
          if (config.generate_toc || config.add_anchors) {
            if (config.generate_toc) {
              var elem = "\n"+'<li>' + hLevelText + (config.number_suffix ? config.number_suffix : '') + ' ' + '<a href="#h' + hLevelText + '">' + jQuery(this).text() + '</a>';
              if (level < prevLevel) {
                log(hLevelText + ', unnesting because:' + level + '<' + prevLevel);
                var unnest = '';
                while (level < prevLevel) {
                  unnest += '</ul>';
                  prevLevel--;
                }
                toc += unnest + elem + '</li>';
              } else if (level > prevLevel) {
                log(hLevelText + ', nesting because:' + level + '>' + prevLevel);
                toc += '<ul>' + elem;
              } else {
                log(hLevelText + ', same level (' + level + ')');
                toc += elem;
              }
            }
            prependText = '<span id="h' + hLevelText + '"></span>' + hLevelText;
          }
          if (config.number_suffix) {
            prependText += config.number_suffix;
          }
          jQuery(this).prepend(prependText + ' ');
          prependText = hLevelText = '';
          prevLevel = level;
        }
      });
      processed = true;
    };
  
    /**
     * Logs a message into the firebug or opera console if available
     */
    var log = function() {
      if (!config.debug) {
        return;
      }
      try {
        console.log.apply(console, arguments);
      } catch(e) {
        try {
          opera.postError.apply(opera, arguments);
        } catch(e){}
      }
    }
  
    var getVersion = function() {
      return version;
    }
  
    process();
  
    if (config.generate_toc) {
      if (config.toc_title) {
        toc = '<h4>' + config.toc_title + '</h4>' + toc;
      }
      jQuery(config.toc_elem ? config.toc_elem : 'body').append(toc);
    }
  
    return jQuery(this);
  };

})(jQuery);