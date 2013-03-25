# jquery.slideandfade plugin

Simple, jquery.slideandfade is a jQuery plugin that allows you to easily slide and fade out whole
groups of elements. Why use it? It looks nice and it's very easy to set up and use.

## Contents
- [Getting and installing](#getting)
- [Simple usage](#usage)
- [Contributors](#contributors)

## Getting and installing

You can download the latest version from here:

http://github blah blah

There are a few simple examples in the index.html.
To use in your own page, place the jquery.slideandfade.min.js file where your web page can load it,
and copy the examples!

## Simple usage

Here is an simple example of how a part of your web page might be set out:

```html
<div class="display-screen-description" id="display-screen">
    <div class="displayBox" id="displayBox1_0">
        <div class="fragment" id="a">The owl and the pussy cat</div>
        <div class="fragment" id="b">Went to sea</div>
        <div class="fragment" id="c">In a beautiful pea green boat</div>
    </div>
    <div class="displayBox" id="displayBox1_1">
        <div class="fragment" id="d">They took some honey,</div>
        <div class="fragment" id="e">And plenty of money</div>
        <div class="fragment" id="f">Wrapped up in a five pound note.</div>
    </div>
</div>
```

You would ask to display the first page like this:

```js
$('#display-screen').slideandfade($('#displayBox0'));
```

All the elements with the fragment class presently showing will fade out and gently slide out of view.
Then the faded elements of displayBox0 will slide in and become opaque when in position. You can have as
many of these display screens are you like.

## Contributors

ian.macinnes@gmail.com
