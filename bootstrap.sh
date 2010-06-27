#!/usr/bin/env bash

#	Project Arboreal Bootstrap Script
#	Evadne Wu at Iridia, 2010





#	Initiate submodules.  Synchronize the submodules before initializing so the URIs are always “fresh” in .git/config .

	git submodule sync;
	git submodule init;
	git submodule update;





#	Build jQuery.

	cd frontend/ui/lib.jquery;
	git checkout 1.4.2;
	ant;
	
	cd ../../..;





#	Install LESS gem

	sudo gem install less;
	lessc frontent/ui/arboreal.style.less;

	open .;




