#	Project Arboreal

Hello, World!  We are the world!





##	This Repository Contains…

`./frontend` contains a WordPress theme, and the appropriate mockups.  `./design` contains the design document.  Resources reside within `./frontend/ui`.





##	Bootstraping Process

*	Initialize submodules

		$ git submodule init;
		$ git submodule update;
	
*	Build jQuery

		$ cd frontend/ui/lib.jquery;
		$ ant;
	
*	Build LESS.js (currently unused)

		$ cd frontend/ui/lib.less.js;
		$ make less;
	
*	Build Stylesheets

		$ cd frontend/ui;
		$ lessc arboreal.style.less;




