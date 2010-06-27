#!/usr/bin/env sh

externals/pictorial/pictorial.rb --overwrite-existing-file --from-directory "design" --to-directory "frontend/ui" --rename-from "okogreen.scaffold_(.+).png$" --rename-to "\\1.png"




