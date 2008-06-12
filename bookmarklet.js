/**
 * jqplanize script to be launched from this bookmarklet code:
 *
 *  javascript:var%20s=document.createElement('script');s.setAttribute('src','http://prendreuncafe.com/work/jqplanize/bookmarklet.js');document.getElementsByTagName('head')[0].appendChild(s);void(0)
 *
 * @author  Nicolas Perriault
 * @license MIT
 */
(function() {

  var debug = false;
  var h = document.getElementsByTagName('head')[0];
  var scripts = { 
                  jquery:  'http://ajax.googleapis.com/ajax/libs/jquery/1.2/jquery.js',
                  planize: 'http://prendreuncafe.com/work/jqplanize/jquery.planize.js',
                };
  var t1, t2;
  var css = document.createTextNode (
    "#jqplanize_bookmarklet_toc * { text-align: left; color: #fff; font-family: Arial, sans; font-size: 1em; font-weight: normal; font-variant: normal; line-height: 1.2em; }" +
    "#jqplanize_bookmarklet_toc { position: fixed; top: 0; right: 0; bottom: 0; width: 40%; margin: 0 0 0 1em; padding: .5em; background: #000; border-left: 5px solid #ccc; overflow: auto; z-index: 3000; opacity: 0.95 }" +
    "#jqplanize_bookmarklet_toc h4 { padding: 0; margin: 0; font-size: 1.2em; color: #fff; }" +
    "#jqplanize_bookmarklet_toc a { color: #fff; }" +
    "#jqplanize_bookmarklet_toc ul { list-style-type: none; margin-left: 1em; padding-left: 0; line-height: 1.5em; }"
  );
  var loadInterval = 250;
  
  var process = function() {
    log('Start processing document');
    var s3 = document.createElement('style');
    s3.setAttribute('type', 'text/css');
    s3.setAttribute('media', 'screen');
    s3.appendChild(css);
    h.appendChild(s3);
    
    var toc = document.createElement('div');
    toc.id = 'jqplanize_bookmarklet_toc';
    var b = document.getElementsByTagName('body')[0];
    b.appendChild(toc);
    
    jQuery('html *').planize({ 
      debug:        debug,
      generate_toc: true, 
      toc_elem:     jQuery('#jqplanize_bookmarklet_toc'),
      toc_title:    'jqPlanize generated TOC',
      callback:     function(e) {
        jQuery(e).children('a:link').css('color', '#fff');
        jQuery(e).prepend('<a href="#" onclick="jQuery(\'#jqplanize_bookmarklet_toc\').hide(\'slow\');return false" style="float:right">[x]</a>');
        log('Processing done.');
      },
    });
  };
  
  var scriptEmbedded = function(name) {
    for (node in h.childNodes) {
      if (node.nodeType == 1 && node.tagName.toLowerCase() == 'script' && node.getAttribute('src') && node.getAttribute('src') == scripts[name]) {
        return true;
      }
    }
    return false;
  }
  
  var loadJQuery = function() {
    if (typeof jQuery == 'undefined') {
      if (!scriptEmbedded(scripts.jquery)) {
        log('Loading jQuery...');
        var s1 = document.createElement('script');
        s1.setAttribute('src', scripts.jquery);
        s1.setAttribute("type","text/javascript");
        h.appendChild(s1);
      }
    } else {
      log('jQuery plugin loaded');
      // Check for prototype
      if (typeof window.Prototype != 'undefined' && typeof window.Prototype.Version == 'string')
      {
        log('Prototype library detected, jQuery noconflict mode enabled');
        jQuery.noConflict();
      }
      clearInterval(t1);
      delete t1;
      t2 = setInterval(loadPlanize, loadInterval);
    }
  };
  
  var loadPlanize = function() {
    if (typeof jQuery.fn.planize == 'undefined') {
      if (!scriptEmbedded(scripts.planize)) {
        log('Loading jqplanize plugin...');
        var s2 = document.createElement('script');
        s2.setAttribute('src', scripts.planize);
        s2.setAttribute("type","text/javascript");
        h.appendChild(s2);
      }
    } else {
      log('jqplanize plugin loaded');
      clearInterval(t2);
      delete t2;
      process();
    }
  };
  
  var log = function() {
    if (!debug) {
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
  
  t1 = setInterval(loadJQuery, loadInterval);
  
})();