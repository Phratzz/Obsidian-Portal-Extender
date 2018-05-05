# Obsidian-Portal-Extender

This is a plugin made for ObsidianPortal.com, more specifcally for a better sorting of characters.

Normal sorting is an OR based sorting alogoryth, which you select all the tags you wish to include, then the website outputs any character that has one of those tags.

This replaces that and allows for group sorting, inside any predefined groups OR sorting is used, and between groups AND sorting is used.

In order for the plugin to work you need a browser plugin called Custom Style Script, only avalible for Firefox, Chrome and Opera


# How to use

Insert the Extender.js into Custom Style Scripts .js field, and Extender.css into the .css field

In the URl you put the following:
https://[slug].obsidianportal.com/characters

after you commited the field, more options have arrived, for the checkboxes make sure only "TOP" is checked, otherwise the script will execute on the entire obsidian portal site.

Now the plugin should work

If you want to change to groups that are in use add or remove string variables from the $group array on line 15
