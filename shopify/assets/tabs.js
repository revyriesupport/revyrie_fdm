$(document).ready(function(){
$('.tabs.product div.tab-content').hide();
$('.tabs.product div.tab-content:first').show();
$('.tabs.product ul.tab-nav li.tab-link:first').addClass('active');

$('.tabs.product ul.tab-nav li.tab-link a').click(function(){
$('.tabs.product ul.tab-nav li.tab-link').removeClass('active');
$(this).parent().addClass('active');
var currentTab = $(this).attr('href');
$('.tabs.product div.tab-content').hide();
$(currentTab).show();
return false;
});




$('.tabs.sizing div.tab-content').hide();
$('.tabs.sizing div.tab-content:first').show();
$('.tabs.sizing ul.tab-nav li.tab-link:first').addClass('active');

$('.tabs.sizing ul.tab-nav li.tab-link a').click(function(){
$('.tabs.sizing ul.tab-nav li.tab-link').removeClass('active');
$(this).parent().addClass('active');
var currentTab = $(this).attr('href');
$('.tabs.sizing div.tab-content').hide();
$(currentTab).show();
return false;
});



});
