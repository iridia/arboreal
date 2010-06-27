#!/usr/bin/env sh

pictorial.rb --overwrite-existing-file --from-directory "design" --to-directory "frontend/ui" --rename-from "okogreen.scaffold_(.+).png$" --rename-to "\\1.png"




