
/** Code Snippet JavaScript **/
/* Needs to go at top of script file so copies unaltered code */

$.each($('.component-sample'), function () {
 var componentCode = $(this).html();
 var codeReplace = {
  '<': '&lt;',
  '>': '&gt;',
  '  ': ''
 };
 componentCode = componentCode.replace(/<|>|  /gi, function (matched) {
  return codeReplace[matched];
 });
 //var componentCode = componentCode.replace(/(?:\r\n|\r|\n)/gi, '');
 $(this).append('<pre class="code-sample copy-this card bg-light"><code>' + componentCode + '</code></pre><p><button class="btn copy-btn" data-toggle="tooltip" data-placement="top" title="Copy Code To Clipboard">Copy Code</button></p>');
});


/** Copy Button JavaScript **/
$(".copy-btn").on('click', function () {
 var copyText = $(this).parent().prev('.copy-this');
 /* copyToClipBoard(copyText[0].textContent); */
 var copyTextString = String(copyText[0].textContent);
 var tempTextArea = document.createElement('textarea');
 tempTextArea.value = copyTextString;
 document.body.appendChild(tempTextArea);
 tempTextArea.select();
 document.execCommand('copy');
 document.body.removeChild(tempTextArea);
 $(this).html('Code Copied');
});



/** Create Buttons in Lesson JavaScript **/
//Lessons strips out buttons using the insert stuff > enter embed code workflow - replacing with p tags with classes and then replacing on page load
$.each($("p.btn"), function () {
 $(this).attr("type", "button");
 $(this).replaceWith(function () {
  return this.outerHTML.replace("<p", "<button").replace("</p", "</button");
 });
});

/** Accordions JavaScript **/

/** Accordions - dynamically add id **/
$.each($(".accordion"), function (index) {
 $(this).attr("id", "accordion_" + parseInt(index + 1));
});

/** Accordions - dynamically add interaction **/
$.each($(".accordion > .card"), function (index, value) {
 var num = index + 1;
 $(value).children(".card-header").attr("id", "heading_acc_" + num);
 $(value).find(".card-header > .card-title").wrapInner("<button  class=\"btn btn-link\" type=\"button\" data-toggle=\"collapse\" aria-expanded=\"false\"></button>");
 $(value).find(".card-header > .card-title > button").attr({
  "data-target": "#collapse_acc_" + num,
  "aria-controls": "collapse_acc_" + num
 });
 $(value).children(".collapse").attr({
  id: "collapse_acc_" + num,
  "aria-labelledby": "heading_acc_" + num
 });
});

/* button to open & close all accordion slides. */
$.each($("button.expandall"), function (index) {
 $(this).attr("aria-expanded", "false");
});

$('.expandall').on('click', function () {
 var nextAccordion = $(this).parent().next('.accordion');
 /* in case button is not in p tag */
 if ($(this).next('.accordion').length > 0) {
  nextAccordion = $(this).next('.accordion');
 }
 var nextAccId = '#' + nextAccordion.attr('id');
 if ($(nextAccId).hasClass("show-all")) {
  $(nextAccId + ' .collapse.show').collapse('hide');
  $(nextAccId).removeClass("show-all");
  $(this).attr("aria-expanded", "false");
  $(this).text("Open All Panels");
 } else {
  $(nextAccId + ' .collapse:not(".show")').collapse('show');
  $(nextAccId).addClass("show-all");
  $(this).attr("aria-expanded", "true");
  $(this).text("Close All Panels");
 }
});
$('.card-header').find('button').click(function () {
 // Any time an accordion is clicked, we want to check if any of the panels are open
 var expanded = false;
 // Check each of the accordions
 for (var x = 0; x < $('.card-header').find('button').length; x++) {
  // If the accordion matches the one we clicked on
  if (this === $('.card-header').find('button')[x]) {
   // We need to check if its false, because at this time, the panel won't have expanded yet, but it will
   if ($($('.card-header').find('button')[x]).attr('aria-expanded') === 'false') {
    expanded = true;
    break;
   }
  } else {
   // Otherwise, we just check if the panel is expaned
   if ($($('.card-header').find('button')[x]).attr('aria-expanded') === 'true') {
    expanded = true;
    break;
   }
  }
 }
 // From where the accordion is situated, we go up to the nearest container and then look for the expandall button
 var acc = $(this).closest('.accordion')[0];
 var ea = $(this).closest('.row').find('.expandall')[0];
 // If any of the accordion panels are expanded
 if (expanded === true) {
  // Change the button to Close All Panels
  $(acc.id + ' .collapse:not(".show")').collapse('show');
  $(acc).addClass("show-all");
  $(ea).text("Close All Panels");
  $(ea).attr("aria-expanded", "true");
 } else {
  // Otherwise, set the button to Open All Panels
  $(acc.id + '.collapse .show').collapse('hide');
  $(acc).removeClass("show-all");
  $(ea).text("Open All Panels");
  $(ea).attr("aria-expanded", "false");
 }
});

/** Background Image JavaScript **/
/* Get all the elements with the class bg-img-wrapper on page */
var bgImgWrapper = document.getElementsByClassName("bg-img-wrapper");
/* Cycle through the elements we want to have a background image */
for (var bgImgIndex = 0; bgImgIndex < bgImgWrapper.length; bgImgIndex++) {
 /* Declare variable bgImgId */
 var bgImgWrapperId = "bg-img-wrapper-" + parseInt(bgImgIndex);
 /* Add bgImgWrapperId as unique ID to each element with class .bg-img-wrapper */
 document.querySelectorAll('.bg-img-wrapper')[bgImgIndex].setAttribute("id", bgImgWrapperId);
 /* Get the background image from the source of the first child image */
 var bgImg = document.getElementById(bgImgWrapperId).getElementsByTagName('img')[0].src;
 /* Set the background image on each element with class .bg-img-wrapper */
 document.querySelectorAll('.bg-img-wrapper')[bgImgIndex].setAttribute("style", 'background-image: url(' + bgImg + ');');
}

/** Buttons JavaScript **/

/** Click and Reveal JavaScript **/
$.each($(".card-reveal"), function (index, value) {
 var num = index + 1;
 $(value).find(".card-body > .card-text > .d-flex.flex-column-reverse > div > .btn-reveal").attr({
  "data-target": "#c2r" + num,
  "id": "c2s" + num,
  "data-toggle": "collapse",
  "aria-expanded": "false"
 });
 $(value).find(".card-body > .card-text > .d-flex.flex-column-reverse > .collapse").attr({
  "id": "c2r" + num,
  "aria-labelledby": "c2s" + num,
  "tabindex": "0"
 });
});

/** Click and Reveal JavaScript **/
$.each($(".card-reveal"), function (index, value) {
 var num = index + 1;
 $(value).find(".card-body > .card-text > .card-reveal-collapse > div > .btn-reveal").attr({
  "data-target": "#c2ra" + num,
  "id": "c2sa" + num,
  "data-toggle": "collapse",
  "aria-expanded": "false"
 });
 $(value).find(".card-body > .card-text > .card-reveal-collapse > .collapse").attr({
  "id": "c2ra" + num,
  "aria-labelledby": "c2sa" + num,
  "tabindex": "0"
 });
});

/** Click and Reveal: Inline Question w/ Hero Headline JavaScript **/
$.each($(".overlay-reveal"), function (index, value) {
 var num = index + 1;
 $(value).find(".btn").attr({
  "data-target": "#collapseExample" + num,
  "aria-controls": "collapseExample" + num,
  "data-toggle": "collapse",
  "aria-expanded": "false"
 });
 $(value).find(".collapse").attr({
  "id": "collapseExample" + num
 });
});

/** Click and Reveal: Table JavaScript **/
$.each($(".table-reveal tr"), function (index, value) {
 var num = index + 1;
 $(value).find(".btn-reveal").attr({
  "data-target": "#tc2r" + num,
  "id": "tc2s" + num,
  "data-toggle": "collapse",
  "aria-expanded": "false"
 });
 $(value).find(".collapse").attr({
  "id": "tc2r" + num,
  "aria-labelledby": "tc2s" + num,
  "tabindex": "0"
 });
});

/* Disable button onclick */
$('.btn-reveal').on('click', function () {
 var $_this = $(this);
 setTimeout(function () {
  $_this.attr('disabled', true);
 }, 500);
});




/** Flipcards JavaScript **/
$.each($(".flip-card-content"), function (index) {
 $(this).attr({
  "tabindex": "0",
  "role": "button"
 });
});
$('.flip-card-content').on('click', function () {
 $(this).toggleClass('apply-flip');
});
/** Trigger Click on Focus + Enter  **/
$('.flip-card-content').keydown(function (e) {
 var keyCode = (e.keyCode ? e.keyCode : e.which);
 if (keyCode === 13) {
  $(e.target).trigger('click');
 }
});

/** Icons JavaScript **/

// /** Links JavaScript **/
// $(function () {
//  $('[data-toggle="tooltip"]').tooltip();
// });

// /* Check for links in document */
// var links = document.querySelectorAll("a");
// /* Create index for download links unique id*/
// var downloadIndex = 0;
// /* Create index for new window links unique id*/
// var newWindowIndex = 0;
// /* Check links on page */
// for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
//  /* Creating a span to wrap the screen-reader text */
//  var srTxtWrapper = document.createElement("span");
//  /* Add class .sr-only to screen-reader span */
//  srTxtWrapper.classList.add("sr-only");

//  if (links[linkIndex].classList.contains("download")) {
//   /* Add download attribute */
//   links[linkIndex].setAttribute("download", "");
//   /* Add unique id to download link */
//   links[linkIndex].setAttribute("id", "download-file-" + downloadIndex);
//   /* Add title attribute saying download file */
//   links[linkIndex].setAttribute("title", "download file");
//   /* Add data-toggle tooltip data attribute */
//   links[linkIndex].setAttribute("data-toggle", "tooltip");
//   /* Creating the screen-reader text */
//   var srTxt = document.createTextNode("(this link downloads a file)");
//   /* Adding the screen-reader text to the span*/
//   srTxtWrapper.appendChild(srTxt);
//   links[linkIndex].appendChild(srTxtWrapper);
//   /* Increase downloadIndex by one for next download link */
//   downloadIndex++;
//  } else if (links[linkIndex].classList.contains("new-window")) {
//   /* Add target _blank attribute for link to open in new window */
//   links[linkIndex].setAttribute("target", "_blank");
//   /* Add unique id to new window link */
//   links[linkIndex].setAttribute("id", "new-window" + newWindowIndex);
//   /* Add title attribute saying link opens in new window */
//   links[linkIndex].setAttribute("data-original-title", "opens in new window/tab");
//   /* Add data-toggle tooltip data attribute */
//   links[linkIndex].setAttribute("data-toggle", "tooltip");
//   /* Add rel="noopener" for security - see https://developers.google.com/web/tools/lighthouse/audits/noopener and https://mathiasbynens.github.io/rel-noopener/ */
//   links[linkIndex].setAttribute("rel", "noopener");
//   /* Creating the screen-reader text */
//   var srTxt = document.createTextNode("(this link opens in a new window/tab)");
//   /* Adding the screen-reader text to the span*/
//   srTxtWrapper.appendChild(srTxt);
//   links[linkIndex].appendChild(srTxtWrapper);
//   newWindowIndex++;
//  }
// }
/** Links/ Icons JavaScript **/
/*add class based on link attributes */
$("a[target='_blank']").addClass("new-window");
$("a[download]").addClass("download");
/* Prevent link icons wrapping */
$('.download, .new-window').html(function () {
 var text = $(this).text().split(' ');
 // console.log(text.length);
 if (text.length > 1) {
  text = $(this).text().split(' ');
  var last = text.pop();
  return text.join(" ") + (text.length > 0 ? ' <span class="lastWord">' + last + '</span>' : last);
 } else {
  $(this).wrapInner(' <span class="lastWord"></span>');
 }

});
/*Add a space after the link icon */
$(function () {
 // $('.download, .new-window').after('&#8288;');
 $('.download, .new-window').after('&nbsp;');
});
/** Links JavaScript **/
$(function () {
 $('[data-toggle="tooltip"]').tooltip();
});


/* Check for links in document */
var links = document.querySelectorAll("a");
/* Create index for download links unique id*/
var downloadIndex = 0;
/* Create index for new window links unique id*/
var newWindowIndex = 0;
/* Check links on page */
for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
 /* Creating a span to wrap the screen-reader text */
 var srTxtWrapper = document.createElement("span");
 /* Add class .sr-only to screen-reader span */
 srTxtWrapper.classList.add("sr-only");

 if (links[linkIndex].classList.contains("download")) {
  /* Add download attribute */
  // links[linkIndex].setAttribute("download", "");
  /* Add unique id to download link */
  links[linkIndex].setAttribute("id", "download-file-" + downloadIndex);
  /* Add title attribute saying download file */
  links[linkIndex].setAttribute("title", "download file");
  /* Add data-toggle tooltip data attribute */
  links[linkIndex].setAttribute("data-toggle", "tooltip");
  /* Creating the screen-reader text */
  var srTxt = document.createTextNode("(this link downloads a file)");
  /* Adding the screen-reader text to the span*/
  srTxtWrapper.appendChild(srTxt);
  links[linkIndex].append(srTxtWrapper);
  /* Increase downloadIndex by one for next download link */
  downloadIndex++;
 } else if (links[linkIndex].classList.contains("new-window")) {
  /* Add target _blank attribute for link to open in new window */
  // links[linkIndex].setAttribute("target", "_blank");
  /* Add unique id to new window link */
  links[linkIndex].setAttribute("id", "new-window" + newWindowIndex);
  /* Add title attribute saying link opens in new window */
  links[linkIndex].setAttribute("data-original-title", "opens in new window/tab");
  /* Add data-toggle tooltip data attribute */
  links[linkIndex].setAttribute("data-toggle", "tooltip");
  /* Add rel="noopener" for security - see https://developers.google.com/web/tools/lighthouse/audits/noopener and https://mathiasbynens.github.io/rel-noopener/ */
  links[linkIndex].setAttribute("rel", "noopener");
  /* Creating the screen-reader text */
  var srTxt = document.createTextNode("(this link opens in a new window/tab)");
  /* Adding the screen-reader text to the span*/
  srTxtWrapper.appendChild(srTxt);
  links[linkIndex].append(srTxtWrapper);
  newWindowIndex++;
 }
}


/** Modals JavaScript **/
$.each($("p.close"), function () {
 $(this).wrapInner("<span aria-hidden=\"true\"></span>");
 $(this).attr({
  "type": "button",
  "data-dismiss": "modal",
  "aria-label": "Close"
 });
 $(this).replaceWith(function () {
  return this.outerHTML.replace("<p", "<button").replace("</p", "</button");
 });
});

$.each($(".modal-set"), function (index, value) {
 var num = index + 1;
 $(value).find(".btn").attr({
  "data-target": "#exampleModal" + num,
  "data-toggle": "modal"
 });
 $(value).find(".modal").attr({
  "tabindex": "-1",
  "role": "dialog",
  "id": "exampleModal" + num,
  "aria-labelledby": "exampleModalLabel" + num,
  "aria-hidden": "true"
 });
 $(value).find(".modal-dialog").attr({
  "role": "document"
 });
 $(value).find(".modal-content").attr({
  "role": "dialog"
 });
 $(value).find(".modal-title").attr({
  "id": "exampleModalLabel" + num
 });
 $(value).find(".modal-footer > .btn:contains('Close')").attr({
  "data-dismiss": "modal"
 });
});

// if (window.self !== window.top) {
//  $('[data-toggle="modal"]').click(function () {
//   /* Gets the top offset position of the button triggering modal */
//   /* Check is using the btn-breakout option - see Interest Cards */
//   var buttonTopOffset;
//   if ($(this).hasClass('btn-breakout')) {
//    console.log('btn-breakout found');
//    /* if is using the btn-breakout option offsets from parent element (which can be clicked) */
//    buttonTopOffset = $(this).parent().offset().top;
//   } else {
//    /* else offsets from the top of the button */
//    buttonTopOffset = $(this).offset().top;
//   }
//   $('.modal').on('show.bs.modal', function () {
//    /* Adds he top offset position of the button as padding-top to the modal  */
//    $(this).css("padding-top", buttonTopOffset);
//   });
//  });
// }

/** Interest cards - dynamically add id **/
$.each($(".card-columns"), function (index) {
 $(this).attr("id", "card-columns_" + parseInt(index + 1));
});

/** Interest cards - dynamically add interaction **/
$.each($(".card-columns > .card"), function (index, value) {
 var num = index + 1;
 $(value).find(".btn-breakout").attr({
  "data-target": "#Modal" + num
 });
 $(value).find(".img-btn").attr({
  "type": "button",
  "data-toggle": "modal",
  "data-target": "#Modal" + num
 });
 $(value).find(".modal").attr({
  "id": "Modal" + num,
  "tabindex": "-1",
  "role": "dialog",
  "aria-labelledby": "Modal" + num + "Label",
  "aria-hidden": "true"
 });
 $(value).find(".modal-title").attr(
  "id", "Modal" + num + "Label"
 );
});


$('[data-toggle="modal"]').click(function () {
 var dt = $(this).class('.btn-breakout');
 var refY = $(this).offset().top;
 var refH = $(this).height();
 setTimeout(function () {
  var modalHeight = $(dt).find('.modal-dialog').height();
  var modalOffset = (refY + (refH / 2)) - (modalHeight / 2);
  if (modalOffset < 0) {
   modalOffset = 100;
  }
  if ((modalOffset + modalHeight) > $(window).height()) {
   modalOffset = $(window).height() - modalHeight - 100;
  }
  $('.modal-dialog').css('top', modalOffset);
 }, 250);
});



/** Popovers JavaScript **/
$(function () {
 $('[data-toggle="popover-top"]').popover({
  html: true



 });

 $('[data-toggle="popover-bottom"]').popover({
  html: true



 });

 $('[data-toggle="popover-left"]').popover({
  html: true



 });

 $('[data-toggle="popover-right"]').popover({
  html: true



 });

 //   $('body').on('click', function (e) {
 //     $('[data-toggle="popover"]').each(function () {
 //         //the 'is' for buttons that trigger popups
 //         //the 'has' for icons within a button that triggers a popup
 //         if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
 //             $(this).popover('hide');
 //         }
 //     });
 // });
});

/** Quick Assesments JavaScript **/
/* Quick Assessments - add form element to Quick Assessments - stripped out when use insert stuff in Lessons */
$.each($(".quick-assess"), function () {
 $(this).wrapInner("<form></form>")
});
/* Quick Assessment - Multiple Choice */
$.each($(".quick-assess-mc .form-check"), function (index, value) {
 var num = index + 1;
 $(value).find("label").before("<input type=\"radio\" name=\"MC-answer\" class=\"\" id=\"MC-ans" + num + "\" value=\"MC-ans" + num + "\">").attr({
  "for": "MC-ans" + num
 });
 $(value).html($(value).html().replace("[[Y]]", "<span class=\"fas fa-check ans-symbol invisible float-right\"></span>").replace("[[N]]", "<span class=\"fas fa-times ans-symbol invisible float-right\"></span>"));
});

/* Adding attributes to Quick Assessment - Multiple Choice */
$.each($(".quick-assess-mc"), function (index, value) {
 var num = index + 1;
 $(value).find(".btn-quick-assess")
  .attr({
   "data-target": "#MC-QuizFeedback" + num,
   "aria-controls": "MC-QuizFeedback" + num,
   "id": "MC-QuizButton" + num,
   "data-toggle": "collapse",
   "aria-expanded": "false",
   "disabled": ""
  });
 $(value).find(".collapse").attr({
  "id": "MC-QuizFeedback" + num
 });
 /* Enable Button to Check Answer */
 var MCQuizButtonID = "#MC-QuizButton" + num;
 $(value).find("input").on('click', function () {
  $(MCQuizButtonID).removeAttr("disabled");
 });
 /* When displaying answer - show answer symbols and disable button and radio buttons */
 $(MCQuizButtonID).click(function () {
  $(value).find(".ans-symbol").removeClass("invisible");
  $(value).find('.collapse').on('shown.bs.collapse', function () {
   $(value).find(".btn-quick-assess, input").prop('disabled', true);
  });
 });
});

/* Quick Assessment - All That Apply (Multi-select) */
$.each($(".quick-assess-ms .form-check"), function (index, value) {
 var num = index + 1;
 $(value).find("label").before("<input type=\"checkbox\" name=\"MS-answer\" class=\"\" id=\"MS-ans" + num + "\" value=\"MS-ans" + num + "\">").attr({
  "for": "MS-ans" + num
 });
 $(value).html($(value).html().replace("[[Y]]", "<span class=\"fas fa-check ans-symbol invisible float-right\"></span>").replace("[[N]]", "<span class=\"fas fa-times ans-symbol invisible float-right\"></span>"));

});

/* Adding attributes to Quick Assessment - All That Apply (Multi-select)  */
$.each($(".quick-assess-ms"), function (index, value) {
 var num = index + 1;
 $(value).find(".btn-quick-assess")
  .attr({
   "data-target": "#MS-QuizFeedback" + num,
   "aria-controls": "MS-QuizFeedback" + num,
   "id": "MS-QuizButton" + num,
   "data-toggle": "collapse",
   "aria-expanded": "false",
   "disabled": ""
  });
 $(value).find(".collapse").attr({
  "id": "MS-QuizFeedback" + num
 });
 /* Enable Button to Check Answer */
 var MSQuizButtonID = "#MS-QuizButton" + num;
 $(value).find("input").on('click', function () {
  $(MSQuizButtonID).removeAttr("disabled");
 });
 /* When displaying answer - show answer symbols and disable button and radio buttons */
 $(MSQuizButtonID).click(function () {
  $(value).find(".ans-symbol").removeClass("invisible");
  $(value).find('.collapse').on('shown.bs.collapse', function () {
   $(value).find(".btn-quick-assess, input").prop('disabled', true);
  });
 });
});


/* Quick Assessment - Short Answers (Fill in the Blank) */
/* Replacing [[BLANK]] with input field */
// $.each($(".quick-assess-sa .shortanswer"), function (index, value) {
//  var num = index + 1;
//  $(value).html($(value).html().replace(/\[\[BLANK\]\]/g, "<label  class=\"sr-only\">your answer </label>"));
//  $(value).find("label").after("<input class=\"w-50\" maxlength=\"100\" type=\"text\" placeholder=\"your answer\" required=\"true\" aria-required=\"true\" id=\"FIB-answer1" + num + "\">").attr({
//   "for": "FIB-answer" + num
//  });
//  $(value).html($(value).html().replace("[[Y]]", "<span class=\"fas fa-check ans-symbol invisible\"></span>").replace("[[N]]", "<span class=\"fas fa-times ans-symbol invisible\"></span>"));

// });
// /* Adding attributes to Quick Assessment - Short Answers (Fill in the Blank)  */
// $.each($(".quick-assess-sa"), function (index, value) {
//  var num = index + 1;
//  /*  Enable Button to Check Answer */
//  $(value).find('input[type=text]').keyup(function () {
//   var noInput = false;
//   $(value).find('input[type=text]').each(function () {
//    if ($(this).val() == '') {
//     noInput = true;
//    }
//   });
//   if (noInput) {
//    $(value).find(".btn-quick-assess").prop('disabled', true);
//   } else {
//    $(value).find(".btn-quick-assess").removeAttr("disabled");
//   }
//  });

//  $(value).find(".btn-quick-assess")
//   .attr({
//    "data-target": "#FIB-QuizFeedback" + num,
//    "aria-controls": "FIB-QuizFeedback" + num,
//    "id": "FIB-QuizButton" + num,
//    "data-toggle": "collapse",
//    "aria-expanded": "false",
//    "disabled": ""
//   });
//  $(value).find(".collapse").attr({
//   "id": "FIB-QuizFeedback" + num
//  });
//  /* When displaying answer disable buttons and form fields */
//  var FIBButtonID = "#FIB-QuizButton" + num;
//  $(FIBButtonID).click(function () {
//   $(value).find(".ans-symbol").removeClass("invisible");
//   $(value).find('.collapse').on('shown.bs.collapse', function () {
//    $(value).find(".btn-quick-assess, input").prop('disabled', true);
//   });
//  });
// });




// 
$.each($(".quick-assess-sa"), (function (index, value) {
 var num = index + 1;
 /*  Enable Button to Check Answer */
 $(value).find('input[type=text]').keyup((function () {
  var noInput = false;
  $(value).find('input[type=text]').each((function () {
   if ($(this).val() == '') {
    noInput = true;
   }
  }));
  if (noInput) {
   $(value).find(".btn-quick-assess").prop('disabled', true);
  } else {
   $(value).find(".btn-quick-assess").removeAttr("disabled");
  }
 }));

 $(value).find(".btn-quick-assess")
  .attr({
   "data-target": "#FIB-QuizFeedback" + num,
   "aria-controls": "FIB-QuizFeedback" + num,
   "id": "FIB-QuizButton" + num
  });
 $(value).find(".collapse").attr({
  "id": "FIB-QuizFeedback" + num
 });
 /* When displaying answer disable buttons and form fields */
 var FIBButtonID = "#FIB-QuizButton" + num;
 $(FIBButtonID).click((function () {
  $(value).find('.collapse').on('shown.bs.collapse', (function () { //  $.each($(this).closest('.quick-assess-dd').find('.line-md'), function (index, value) {
   $(value).find(".btn-quick-assess, input").prop('disabled', true);
   $.each($(this).closest(".quick-assess-sa").find(".shortanswer"), (function (index, value) {
    var answer = $(value).find("input").val();
    answer = answer.toLowerCase().split(" ").join("");

    var given_answer = $(value).find("input").attr("data");
    var n = given_answer.indexOf('?');
    given_answer = given_answer.substring(0, n != -1 ? n : s.length);

    if (given_answer == answer) {
     $(value).find(".fas").removeClass("invisible").addClass("fa-check");
    } else {
     $(value).find(".fas").removeClass("invisible").addClass("fa-times");
    }
   }));
  }));
 }));
}));
/* Adding attributes to Quick Assessment - Short Answers (Fill in the Blank)  */
$.each($(".quick-assess-sa .shortanswer"), (function (index, value) {
 var num = index + 1;
 $(value).find("label").attr({
  "for": "FIB-answer" + num
 });
 $(value).find("input").attr({
  "id": "FIB-answer" + num
 });

}));
// 





/* Quick Assessment - Drop Down */

// $.each($(".quick-assess-dd"), function (index, value) {
//  var num = index + 1;
//  /* Switching text wrapped with {{LABEL}} to label tag and creating drop down options from text with [[option1|option2|]] format*/
//  $(value).html($(value).html().replace(/\{\{/g, "<label>").replace(/\}\}/g, "</label>").replace(/\[\[/g, "<select class=\"options\">").replace(/\]\]/g, "</select>"));
//  $(value).find('select.options').each(function () {
//   var ddOptions = $(this).html().split('|');
//   $(this).html('<option disabled="" selected="" value="">...</option>' + $.map(ddOptions, function (v) {
//    return '<option>' + v + '</option>';
//   }).join('') + '');
//  });
//  /* Enable Button to Check Answer  */
//  $(value).find('select').change(function () {
//   var noInput = false;
//   $(value).find('select').each(function () {
//    if ($(this).val() == null) {
//     noInput = true;
//    }
//   });
//   if (noInput) {
//    $(value).find(".btn-quick-assess").prop('disabled', true);
//   } else {
//    $(value).find(".btn-quick-assess").removeAttr("disabled");
//   }
//  });
//  $(value).find(".btn-quick-assess")
//   .attr({
//    "data-target": "#DD-QuizFeedback" + num,
//    "aria-controls": "DD-QuizFeedback" + num,
//    "id": "DD-QuizButton" + num,
//    "data-toggle": "collapse",
//    "aria-expanded": "false",
//    "disabled": ""
//   });
//  $(value).find(".collapse").attr({
//   "id": "DD-QuizFeedback" + num
//  });
//  /* When displaying answer disable buttons and form fields */
//  var DDButtonID = "#DD-QuizButton" + num;
//  $(DDButtonID).click(function () {
//   $(value).find('.collapse').on('shown.bs.collapse', function () {
//    $(value).find(".btn-quick-assess, select").prop('disabled', true);
//   });
//  });
// });
// /* Adding attributes to Quick Assessment - Drop Down  */
// $.each($(".quick-assess-dd label"), function (index) {
//  $(this).attr({
//   "for": "DD-answer" + parseInt(index + 1)
//  });
// });
// $.each($(".quick-assess-dd select"), function (index) {
//  $(this).attr({
//   "id": "DD-answer" + parseInt(index + 1),
//   "name": "select" + parseInt(index + 1)
//  });
// });

/* Quick Assessment - Drop Down */
$.each($(".quick-assess-dd"), (function (index, value) {
 var num = index + 1;
 /* Enable Button to Check Answer  */
 $(value).find('select').change((function () {
  var noInput = false;
  $(value).find('select').each((function () {
   if ($(this).val() == null) {
    noInput = true;
   }
  }));
  if (noInput) {
   $(value).find(".btn-quick-assess").prop('disabled', true);
  } else {
   $(value).find(".btn-quick-assess").removeAttr("disabled");
  }
 }));
 $(value).find(".btn-quick-assess")
  .attr({
   "data-target": "#DD-QuizFeedback" + num,
   "aria-controls": "DD-QuizFeedback" + num,
   "id": "DD-QuizButton" + num
  });
 $(value).find(".collapse").attr({
  "id": "DD-QuizFeedback" + num
 });

 /* When displaying answer disable buttons and form fields */
 var DDButtonID = "#DD-QuizButton" + num;
 $(DDButtonID).click((function () {
  $.each($(this).closest('.quick-assess-dd').find('.line-md'), (function (index, value) {
   var answer = $(value).find("select").val();
   if ($(value).find("select").attr("data-answer") == answer) {
    $(value).find(".fas").removeClass("invisible").addClass("fa-check");
   } else {
    $(value).find(".fas").removeClass("invisible").addClass("fa-times");
   }
  }));
  $(value).find('.collapse').on('shown.bs.collapse', (function () {
   $(value).find(".btn-quick-assess, select").prop('disabled', true);

  }));
 }));
}));

/* Adding attributes to Quick Assessment - Drop Down  */
$.each($(".quick-assess-dd label"), (function (index) {
 $(this).attr({
  "for": "DD-answer" + parseInt(index + 1)
 });
}));
$.each($(".quick-assess-dd select"), (function (index) {
 $(this).attr({
  "id": "DD-answer" + parseInt(index + 1),
  "name": "select" + parseInt(index + 1)
 });
}));



/** Tabs JavaScript **/
/** Tabs - dynamically add interaction **/
/* .list-group add ID */
$.each($(".list-group"), function (index) {
 $(this).attr({
  "id": "list-tab_" + parseInt(index + 1),
  "role": "tablist"
 });
});
/* .list-group-item add attributes */
$.each($(".list-group > .list-group-item"), function (index, value) {
 var num = index + 1;
 $(value).attr({
  "id": "list-" + num + "-list",
  "href": "#list-" + num,
  "aria-controls": "list-" + num,
  "data-toggle": "list",
  "role": "tab"
 });
});
/* .tab-content add ID */
$.each($(".tab-content"), function (index) {
 $(this).attr("id", "nav-tabContent_" + parseInt(index + 1));
});
/* .tab-pane add attributes */
$.each($(".tab-content > .tab-pane"), function (index, value) {
 var num = index + 1;
 $(value).attr({
  "id": "list-" + num,
  "aria-labelledby": "list-" + num + "-list",
  "role": "tabpanel",
  "tabindex": "0"
 });
});

/** Tooltip JavaScript **/
$(function () {
 $('[data-toggle="tooltip"]').tooltip();
 $('.popovers-link').popover({
  html: true,
  trigger: 'focus'
 });
});

/** Video JavaScript **/

/** WheelNav JavaScript **/
$(".btn-reveal1").click(function () {
 $(".collapse").collapse('hide');
});




$.each($(".card-text-area"), (function (index, value) {
 var num = index + 1;
 /*  Enable Button to Check Answer */
 $(value).find('input[type=text]').keyup((function () {
  var noInput = false;
  $(value).find('input[type=text]').each((function () {
   if ($(this).val() == '') {
    noInput = true;
   }
  }));
  if (noInput) {
   $(value).find(".btn-card-text-area").prop('disabled', true);
  } else {
   $(value).find(".btn-card-text-area").removeAttr("disabled");
  }
 }));

 $(value).find(".btn-card-text-area")
  .attr({
   "data-target": "#card-text-area" + num,
   "aria-controls": "FIB-QuizFeedback" + num,
   "id": "std-card-text-area" + num
  });
 $(value).find(".collapse").attr({
  "id": "card-text-area" + num
 });
 /* When displaying answer disable buttons and form fields */
 // var FIBButtonID = "#FIB-QuizButton" + num;
 // $(FIBButtonID).click((function () {
 //  $(value).find('.collapse').on('shown.bs.collapse', (function () { //  $.each($(this).closest('.quick-assess-dd').find('.line-md'), function (index, value) {
 //   $(value).find(".btn-quick-assess, input").prop('disabled', true);
 //   $.each($(this).closest(".quick-assess-sa").find(".shortanswer"), (function (index, value) {
 //    var answer = $(value).find("input").val();
 //    answer = answer.toLowerCase().split(" ").join("");

 //    var given_answer = $(value).find("input").attr("data");
 //    var n = given_answer.indexOf('?');
 //    given_answer = given_answer.substring(0, n != -1 ? n : s.length);

 //    if (given_answer == answer) {
 //     $(value).find(".fas").removeClass("invisible").addClass("fa-check");
 //    } else {
 //     $(value).find(".fas").removeClass("invisible").addClass("fa-times");
 //    }
 //   }));
 //  }));
 // }));
}));