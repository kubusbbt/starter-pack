import $ from 'jquery'
import navComponent from './scripts/nav'
import '../node_modules/popper.js/dist/popper.min.js';
import '../node_modules/bootstrap';

navComponent();

let test = 'jQuery works!';

$(document).ready(function(){
	console.log( test )
})
