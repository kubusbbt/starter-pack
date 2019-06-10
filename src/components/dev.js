import $ from "jquery";

export default (function(){

    let test = 'jQuery works!';

    $(document).ready(function(){
        console.log( test );

        $('body').append('<div id="bootstrap-breakpoints" style="background: #563D7B; color: #fff; width: 50px; height: 26px; border-radius: 0 0 0 5px; top: 0; right: 0;" class="position-fixed d-flex justify-content-center align-items-center text-uppercase">B - <span class="d-inline-block d-sm-none">xs</span><span class="d-none d-sm-inline-block d-md-none">sm</span><span class="d-none d-md-inline-block d-lg-none">md</span><span class="d-none d-lg-inline-block d-xl-none">lg</span><span class="d-none d-xl-inline-block">xl</span></div>');
    });

})();
