#!/usr/bin/env bash





# Initiate submodules

git submodule sync;
git submodule init;
git submodule update;

# Build jQuery

cd frontend/ui/lib.jquery;
cd ../../..;

sudo gem install less;
lessc frontent/ui/arboreal.style.less;

open .;