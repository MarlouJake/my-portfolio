window.onload = async function() {
    let modules = await loadModules(["view-controller"]);
    let viewController = modules["view-controller"];
    let controller = await new viewController();

    await controller.Home().LoadContent();
    await controller.updateActive('/home');

    $('.index-nav .nav-ul li, .contact-button').on('click', async function(){
        let uri = $(this).find('a').data('uri') || $(this).data('uri');

        let container = (uri === '/contact') ? await ToggleContactContainer() : '.index-main';

        console.log(await controller.LoadContent(uri, container));
        await controller.updateActive(uri);
    });

    async function ToggleContactContainer(){
        let  contactContainers= $('body .contact-container-backdrop');

        if(contactContainers.length > 0){
            $('.contact-container').fadeOut().remove();
        }

        $('body').append(`<div class="contact-container-backdrop"><div class="contact-container"></div></div>`);
        return '.contact-container';
    }

    $('body').on('click', '.close-container', function(){
        $('.contact-container-backdrop').fadeOut().remove();
    });
}



