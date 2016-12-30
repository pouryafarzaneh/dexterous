/*------------------------------------------
Project:    HandyMan
Author:     P. Roy
URL:        http://www.handyman.proy.info/
Version:    1.0
Last change:    20/02/2015
------------------------------------------*/


/* Preloader ---------------------------- */
$(window).load(function(){   
	$('.preloader').fadeOut(1000); 
});


/* From Select ------------------------- */
$(function() { 
	$('select').selectize(); 
});


/* Mobile Menu ------------------------- */
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});


// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


/* Smooth Scrolling -------------------- */
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});


/* Work portfolio Grid------------------ */
$(function() {
		
	/* initialize shuffle plugin */
	var $grid = $('#portfoliogrid');

	$grid.shuffle({
		itemSelector: '.portfolio-item' // the selector for the items in the grid
	});

	/* reshuffle when user clicks a filter item */
	$('#filters a').click(function (e) {
		e.preventDefault();

		// set active class
		$('#filters a').removeClass('active');
		$(this).addClass('active');

		// get group name from clicked item
		var groupName = $(this).attr('data-group');
		//alert(groupName);
		// reshuffle grid
		$grid.shuffle('shuffle', groupName );
	});

});


/* Work Portfolio Gallery -------------- */
$(document).ready(function(){ 	
	$("a[data-rel^='prettyPhoto']").prettyPhoto({hook: 'data-rel'});
	setTimeout(function(){ $('#filters li a.active').click(); }, 2000);//little patch for grid height
});


/* Form Captcha Security ---------------- */
$(function() {
	$('.captcha').realperson({ 
	    length: 4, // Number of characters to use 
	    regenerate: 'Click to change', // Instruction text to regenerate 
	    hashName: '{n}B4429CD97EAEA9CFBBFBDFCD46554', // Name of the hash value field to compare with, 
	        // use {n} to substitute with the original field name 
	    dot: '*', // The character to use for the dot patterns 	    
	    chars: $.realperson.alphanumeric  // The characters allowed */ 
	});  
	
});


/* Process Form ------------------------ */

// prepare the form when the DOM is ready 
$(document).ready(function() { 
    var getFormDataObject = function(form) {
      var result = {};
      Array.prototype.slice.call(form.elements).forEach(function(el) { 
        if (el.type!=='submit') result[el.name] = el.value;
      });
      return result;
    };
  
    var createContactMessage = function(data) {
      return "Hello Pourya, \n A customer has sent the follwing details for a job: \n\n\" +
             "Name: " + data.name +
             "\nAddress: " + data.address +
             "\nEmail: " + data.email + 
             "\nMessage: " + data.message;
    };
     
    var contactFormEl = $('.contact__form--js');
    var form = contactFormEl;
    //var parent = form.parent();
    var submitbutton = form.children('input[type="submit"]');
    var submit_orginaltext= submitbutton.val();
    var submit_actiontext= "Submitting, please wait...";

    form.validate({
        errorClass: "has-error",
        validClass: "has-success",
        errorElement: "label",			
        submitHandler: function(form) {
          var actionUrl = form.action;
          var method = form.method;

          $.ajax({
            url: actionUrl
            method: method, 
            headers: {
              "x-message": createContactMessage(getFormDataObject(form))
            },
            beforeSubmit: function(formData, jqForm, options) { 
              submitbutton.val(submit_actiontext);
              return true; 
            }   
          }).then(function(responseText, statusText, xhr, form)  { 
                    if (responseText.success) form[0].reset();
                    form.children('.messagebox').html(responseText.message);
                    submitbutton.val(submit_orginaltext);     
          }, function(){
            console.log('Error', arguments);
          });  
        }
      });
}); 
