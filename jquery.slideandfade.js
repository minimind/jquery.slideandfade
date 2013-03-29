/*
 * A simple jQuery plugin to slide and fade elements within a number of divs.
 * It is published under the MIT open source license, which can be found
 * in the accompanying file LICENSE.
 *
 * In the comments and code below, we use the term 'fragment' to refer to an element that we're moving around.
 * We use 'displayBox' to refer to one of the current display boxes.
 *
 * Here is a brief snippet of HTML to show you roughly how the plugin can be used:
 *
 * <div class="display-screen-description" id="display-screen1">
 *   <div class="displayBox" id="displayBox1_0">
 *     <div class="fragment" id="a">The owl and the pussy cat</div>
 *     <div class="fragment" id="b">Went to sea</div>
 *     <div class="fragment" id="c">In a beautiful pea green boat</div>
 *   </div>
 *   <div class="displayBox" id="displayBox1_1">
 *     <div class="fragment" id="d">They took some honey,</div>
 *     <div class="fragment" id="e">And plenty of money</div>
 *     <div class="fragment" id="f">Wrapped up in a five pound note.</div>
 *   </div>
 * </div>
 *
 * The repo for this plugin can be found here:
 *
 * https://github.com/minimind/jquery-slideandfade
 *
 * This was initially written by Ian Macinnes and I can be found at:
 *
 * http://www.ianmacinnes.net
 */

(function($) {
    "use strict";

    /*
     Dead simple utility function. It seems like there should be a standard function for this...?
     */
    function randomWithinRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /*
     Fades in or fades out all the fragments of the given display box over time.
     Afterwards we call the given callback too.
     */
    function changeFragmentsAlpha(displayBox, delay, fade_to, callback) {
        var fragments = $(displayBox).data("originalFragments"),
            totalFinished = 0,
            fragment,
            i;

        for (i = 0; i < fragments.length; ++i) {
            fragment = fragments[i];
            $("#" + fragment.id).fadeTo(delay, fade_to, function () {
                totalFinished += 1;
                if (totalFinished === fragments.length) {
                    callback();
                }
            });
        }
    }

    /*
     We pick random positions for all the fragments to slide to, then
     we slide them.
     */
    function slideElementsToRandomPosition(delay, displayBox,  width, height, callback) {

        var $displayBox = $(displayBox),
            fragments = $displayBox.data("originalFragments"),
            totalFinished = 0,
            fragment,
            left,
            top,
            i;

        for (i = 0; i < fragments.length; ++i) {
            fragment = fragments[i];

            // We'll pick random top and left so the fragment is just out of the screen
            left = fragment.left;
            top  = fragment.top;

            switch (randomWithinRange(0, 4)) {
                case 0:
                    left = -fragment.width;
                    break;
                case 1:
                    left = width;
                    break;
                case 2:
                    top = -fragment.height;
                    break;
                case 3:
                    top = height;
                    break;
            }

            // Now we slide it along
            $("#" + fragment.id).delay(i * delay).animate({
                left: left,
                top:  top
            }, 750, function() {
                totalFinished += 1;
                if (totalFinished === fragments.length) {
                    // Now that we're finished, we can made the whole display box hidden
                    $displayBox.css("visibility", "hidden");
                    callback();
                }
            });
        }
    }

    /*
     There are elements placed at random locations. Now we need to slide them across to the
     original correct locations.
     */
    function moveFragmentsToCorrectPosition(displayBox, callback) {
        var $displayBox = $(displayBox),
            fragments = $displayBox.data("originalFragments"),
            totalFinished = 0,
            fragment,
            i;

        $displayBox.css("visibility", "visible");

        // OK, first we have to pick random starting positions for all the fragments
        for (i = 0; i < fragments.length; ++i) {
            fragment = fragments[i];
            $("#" + fragment.id).delay(i * 100).animate({
                left: fragment.left,
                top:  fragment.top
            }, 750, function () {
                totalFinished += 1;
                if (totalFinished === fragments.length) {
                    callback();
                }
            });
        }
    }

    $.fn.slideandfade = function(displayBox, options) {
        /*
         Configurable options. Not so many at the moment...
         */
        var settings = $.extend({
            callback : function() {}
        }, options);

        return this.each(function() {
            /*
             We need to set up a namespace environment for each display box so we can deal with
             multiple boxes at the same time.
             */
            var $this = $(this),
                width  = $this.width(),
                height = $this.height(),
                nspace = $this.data("nspace"),
                displayBoxesTemp,
                showNewDisplayBox;

            if (nspace === undefined) {
                displayBoxesTemp = $(".displayBox", this);
                nspace = {
                    currentDisplayBox :      displayBoxesTemp[0], // The box we're currently looking at.
                    busy :                   false,               // Can we change display boxes right now or not?
                    haveScatteredFragments : false,               // Have we initialised the elements?
                    displayBoxes :           displayBoxesTemp     // A selection of all the display boxes.
                };

                $this.data("nspace", nspace);

                // We analyse the page, grab all the element positions and store them.
                nspace.displayBoxes.each(function() {
                    var $this = $(this),
                        fragments = [];
                    $this.children(".fragment").each(function(j) {
                        var $this = $(this),
                            f = {};

                        f.id = $this.attr("id");
                        f.width = $this.width();
                        f.height = $this.height();
                        f.top = $this.position().top;
                        f.left = $this.position().left;
                        fragments[j] = f;
                    });

                    $this.data("originalFragments", fragments);
                });
            }

            function performSlideAndFade(displayBox, callback) {
                var lastCurrentDisplayBox = nspace.currentDisplayBox,
                    moveFragmentsToCorrectPosition_Fn = (function(displayBox) {
                        return function() {
                            moveFragmentsToCorrectPosition(displayBox, function() {
                                changeFragmentsAlpha(displayBox, 250, 1.0, function() {
                                    nspace.busy = false;
                                    callback();
                                });
                            });
                        };
                    }(displayBox)),
                    completedDisplayBoxSwitch_Fn = (function(lastCurrentDisplayBox) {
                        return function() {
                            changeFragmentsAlpha(lastCurrentDisplayBox, 250, 0.2, function() {
                                slideElementsToRandomPosition(100, lastCurrentDisplayBox, width, height, moveFragmentsToCorrectPosition_Fn);
                            });
                        };
                    }(lastCurrentDisplayBox));

                nspace.currentDisplayBox = displayBox;
                completedDisplayBoxSwitch_Fn();
            }

            var counter, i, callIfFinished;

            if (!nspace.busy) {
                nspace.busy = true;

                if (!nspace.haveScatteredFragments || displayBox === undefined) {
                    /*
                     We know that we need to put all the fragments in random positions since we have not set
                     the haveScatteredFragments value to true yet. We do this by first fading all the elements
                     and then moving them to random positions, just out of view.
                     */
                    nspace.haveScatteredFragments = true;
                    counter = 0;

                    callIfFinished = function() {
                        ++counter;
                        if (counter === 2 * nspace.displayBoxes.length) {
                            if (displayBox === undefined) {
                                nspace.busy = false;
                                settings.callback();
                            } else {
                                performSlideAndFade(displayBox, settings.callback);
                            }
                        }
                    };

                    for (i = 0; i < nspace.displayBoxes.length; ++i) {
                        slideElementsToRandomPosition(0, nspace.displayBoxes[i], width, height, callIfFinished);
                        changeFragmentsAlpha(nspace.displayBoxes[i], 0, 0.2, callIfFinished);
                    }
                } else {
                    performSlideAndFade(displayBox, settings.callback);
                }
            }
        });
    };
}(jQuery));
