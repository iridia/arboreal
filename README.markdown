#	Project Arboreal

Hello, World!  We are the world!





##	Structure

`./mockups` contains the mockups, and is where most front-end development happens.  Resources reside within `./mockups/ui` and are not to be copied manually.  Stage them by running the helper script so they are automatically copied to the right places.

`./backbone` contains the wordpress installation.  The staging theme resides within it.





##	Bootstraping Process

*	Initialize submodules

		$ git submodule init;
		$ git submodule update;
	
*	Build jQuery

		$ cd mockups/ui/lib.jquery;
		$ ant;
	
*	Build LESS.js (currently unused)

		$ cd mockups/ui/lib.less.js;
		$ make less;
	
*	Build Stylesheets

		$ cd mockups/ui;
		$ lessc arboreal.style.less;




