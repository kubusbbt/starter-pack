import $ from 'jquery'
import '../node_modules/popper.js/dist/popper.min.js';
import '../node_modules/bootstrap';
import navComponent from './scripts/nav';

navComponent();

let test = 'jQuery works!';

$(document).ready(function(){
	console.log( test );
})
