#	Project Arboreal

Arboreal.  The “we are the world” project of Iridia Productions, 2010.





##	Bootstraping Process

Try `bootstrap.sh` if you’re feeling lazy.

*	Initialize submodules

		$ git submodule sync;
		$ git submodule init;
		$ git submodule update;
	
	
*	Build jQuery 1.4.2

		$ cd frontend/ui/lib.jquery;
		$ git checkout 1.4.2;
		$ ant;


*	Grab the LESS gem

		$ sudo gem install less;
		$ lessc frontend/ui/arboreal.style.less;





##	Structure

###	`frontend/`

Where the coding takes place.  Contains unprocessed front-end code and also those generated Letterpress.

###	`design/`

Where the design document and PNGs (for preview) live.

###	`externals/`

Where the tools are.


####	`externals/pictorial`

The image factory `pictorial.rb` post-processes bitmaps for UI snippets.  Running `pictorial.rb` requires PNGCrush (obtainable thru MacPorts).


####	`externals/letterpress`

Coming soon.


####	`externals/syncho`

Coming soon.


