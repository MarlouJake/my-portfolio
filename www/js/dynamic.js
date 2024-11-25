$(document).ready(async function(){

    //let controller = new window.controller;
    let module = await loadModules(["ViewController"]);

    let controller = await new module.ViewController();

    await controller.Home().LoadContent();
    await controller.updateActive('/home');

    $('.index-nav .nav-ul li, .contact-button').on('click', async function(){
        let uri = $(this).find('a').data('uri') || $(this).data('uri');

        let container = (uri === '/contact') ? await ToggleContactContainer() : '';

        await controller.LoadContent(uri, container)
        await controller.updateActive(uri);
    });

    async function ToggleContactContainer(){
        let  contactContainers= $('body .contact-container-backdrop');

        if(contactContainers.length > 0){
            $('.contact-container').fadeOut().remove();
        }

        $('body').append(`<div class="contact-container-backdrop">Contact</div>`);
        $('body .contact-container-backdrop').append(`<div class="contact-container"></div>`);

        return '.contact-container';
    }

    $('body').on('click', '.close-container', function(){
        $('.contact-container-backdrop').fadeOut().remove();
    });
});



