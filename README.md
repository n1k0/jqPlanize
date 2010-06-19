jqPlanize
=========

The planize [jQuery](http://jquery.com/) plugin adds some hierarchical data organization features to given DOM node containing HTML headings:

* adds numerotation and anchors in front of all headings,
* generates an HTML table of contents,
* degrades gracefully if javascript is not available/enabled. 

You can see the plugin in action on [this page](http://prendreuncafe.com/work/jqplanize/index.html).

How does this work?
-------------------

The plugin parse the given DOM node children to find existing headings, and renumerote them according to their hierarchical structure.

Have you got some examples?
---------------------------

For example, if you have this HTML structure:

    <h1>Main title</h1>
    <h2>Sub section</h2>
    <h3>Sub sub question</h3>
    <h3>Other sub sub question</h3>
    <h2>Other sub section</h2>

Running this snippet:

    $(document).ready(function(){
      $('html *').planize({ number_suffix: ')' });
    });

Will produce:

    <h1><span id="h1"></span>1) Main title</h1>
    <h2><span id="h1.1"></span>1.1) Sub section</h2>
    <h3><span id="h1.1.1"></span>1.1.1) Sub sub question</h3>
    <h3><span id="h1.1.2"></span>1.1.2) Other sub sub question</h3>
    <h2><span id="h1.2"></span>1.2) Other sub section</h2>

Optionnaly, the plugin can generate the corresponding Table Of Content:

    $(document).ready(function(){
      $('html *').planize({
        number_suffix:    ')', 
        generate_toc:     true, 
        toc_elem:         $('#toc')}),
    });

Will produce:

    <div id="toc">
      <ul>
        <li><a href="#h1">1) Main title</a>
          <ul>
            <li><a href="#h1.1">1.1) Sub section</a>
              <ul>
                <li><a href="#h1.1.1">1.1.1) Sub sub question</a></li>
                <li><a href="#h1.1.2">1.1.2) Other sub sub question</a></li>
              </ul>
            </li>
            <li><a href="#h1.2">1.2) Other sub section</a></li>
          </ul>
        </li>
      </ul>
    </div>

    <h1><span id="h1"></span>1) Main title</h1>
    <h2><span id="h1.1"></span>1.1) Sub section</h2>
    <h3><span id="h1.1.1"></span>1.1.1) Sub sub question</h3>
    <h3><span id="h1.1.2"></span>1.1.2) Other sub sub question</h3>
    <h2><span id="h1.2"></span>1.2) Other sub section</h2>

This work is in a very early state and has not been thoroughly tested, but your contributions are warmly welcome.

Installation
------------

Installation is fairly simple. Just add these lines within the `<head>` tag of your HTML document:

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.x.x/jquery.js"></script>
    <script type="text/javascript" src="jquery.planize.js"></script>

Note: Maybe storing your own local copy of the jquery.planize.js would be a great idea.

Known issues
------------

* Currently jqPlanize doesn't work in Opera.

License
-------

This work is released under the terms of the [MIT license](http://en.wikipedia.org/wiki/MIT_License).

FAQ
---

>Why didn't you use the ordered list features of the HTML/CSS2 specs?

Because it's lame. Well okay, let's say, bloated and complex. I'll try to implement it when Internet Explorer will have full css2.1 support (read: never). 

> Why the hell the code is so ugly?

This is my first jQuery plugin authoring attempt, that's maybe why. 

>Why didn't you use a recursive function to generate TOC subitems code?

Because parsing a linear array of headings and generating a nested list is not that easy, but I can't wait seeing your patch. 
