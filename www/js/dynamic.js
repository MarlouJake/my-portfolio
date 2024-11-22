import ViewController from "../../controller/ViewController.js";

$(document).ready(async function(){

    let controller = new ViewController();

    await controller.Home().LoadContent();
    await controller.updateActive('/home');

    $('.index-nav .nav-ul li').on('click', async function(){
        let uri = $(this).find('a').data('uri');

        await controller.LoadContent(uri);
        await controller.updateActive(uri);
    });
});



