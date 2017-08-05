/**
 * Created by Bean on 30-Jul-17.
 */
$(document).ready(function () {
    $('.nav li').click(function(e) {

        $('.nav li').removeClass('active');

        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        //e.preventDefault();
    });

    // $('#myModal').click(function (e) {
    //     $('#myModal').modal('show');
    // });
});