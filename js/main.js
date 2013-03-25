$(function() {
    //window.setTimeout(function() {
    //    $('.display-screen').slideandfade($('#displayBox0'));
    //}, 1000);

    // The first example panel
    var screenToDisplay1 = 1;
    var displayScreen1 = $('#display-screen1');
    displayScreen1.click(function() {
        var settings = {callback : function() { screenToDisplay1 = screenToDisplay1 == 0 ? 1 : 0; } };
        $('#display-screen1').slideandfade($('#displayBox1_'+screenToDisplay1), settings );
    });
    displayScreen1.slideandfade($('#displayBox1_0'));

    // The second example panel
    var screenToDisplay2 = 1;
    var displayScreen2 = $('#display-screen2');
    displayScreen2.click(function() {
        var settings = {callback : function() { screenToDisplay2 = screenToDisplay2 == 0 ? 1 : 0; } };
        $('#display-screen2').slideandfade($('#displayBox2_'+screenToDisplay2), settings );
    });
    displayScreen2.slideandfade($('#displayBox2_0'));
});
