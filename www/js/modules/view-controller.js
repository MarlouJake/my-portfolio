export default class ViewController{

    constructor(){
        this.full_url = window.location.href;
        this.base_url = window.location.origin;
        this.resource_path = 'view';
        this.file_type = '.html';
        this.url = (this.resource_path + '/index' + this.file_type);
        this.container = '.index-main';
        this.data = { view: "portfolio_view"};

        this.params = {
            url: this.url,
            container: this.container,
            data: this.data
        };
    }

    Home(uri = '', container = '', data = {}) {

        this.url = this.setUrl([uri,'/home']);
        this.container = (this.isEmptyString(container)) ?  this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    About(uri = '', container = '', data = {}) {

        this.url = this.setUrl([uri, '/about']);
        this.container = (this.isEmptyString(container)) ?  this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    Skills(uri = '', container = '', data = {}) {

        this.url = this.setUrl([uri, '/skills']);
        this.container = (this.isEmptyString(container)) ?  this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    Contact(uri = '', container = '.index-body', data={}){

        this.url = this.setUrl([uri, '/contact']);
        this.container = (this.isEmptyString(container)) ? this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    async LoadContent(uri = '', container = this.container, data = this.data){

        try{
            const response = await $.ajax({
                url:  this.isEmptyString(uri) ? this.url: this.setUrl([uri, uri]),
                type: 'GET',
                data: data,
                cache: true,
                timeout: 10000
            });

            $(container).fadeOut(50, async function(){
                await $(this).html(response).fadeIn().delay(50);
            });

            this.updateActive(uri);
            this.updateConstructorParams(uri, container, data);


        }
        catch (error){
            this.params.url = uri;

            const response = [error.status || '500', error.statusText || 'Internal Server Error', error.responseText];
            const [status, statusText, responseText] = response;
            let apiMessage;

            if(responseText){
                const DOM = new DOMParser();
                const doc = DOM.parseFromString(responseText, 'text/html');
                apiMessage = doc.querySelector('pre').textContent;
            }

            console.error(`[%c${status} ${statusText}`,`font-weight: bold;`,`] An error occurred while loading the view.
                \n${ apiMessage || error}\n\nPayload:\n\t\t${JSON.stringify(this.params)}`);
        }

        return this.params;
    };

    updateActive(uri){
        $('.index-nav .nav-ul li a').removeClass('active');

        let data_uri = $('.index-nav .nav-ul li').find('a').filter(function(){
            return $(this).data('uri') === uri;
        });

        if(data_uri.length){
            $(data_uri).addClass('active');
        } else{
            $(data_uri).removeClass('active');
        }
    }

    updateConstructorParams(uri, container, data){

        let resource_locator = uri;

        if(!(uri.startsWith(this.resource_path))){
            resource_locator = [this.resource_path, uri].join('');
        }

        if(!(resource_locator.endsWith(this.file_type))){
            resource_locator = [resource_locator, this.file_type].join('');
        }

        this.params.url = [this.full_url.replace('index.html', ''), resource_locator].join('');
        this.params.container = container;
        this.params.data = data;
    }

    isEmptyString(string){
        return (string.trim() === '') ? true : false;
    }

    objectHasKey(object){
        return (Object.keys(object).length > 0) ? object : this.data;
    }

    setUrl(locator = [checkUri = '', setUri = ''], resource_path = this.resource_path, file_type = this.file_type){
        let [checkUri, setUri] = this.LocatorParameter(locator);
        let new_url = checkUri;
        let url_format = [resource_path, file_type];

        try{
            if(this.isEmptyString(checkUri)){
                return url_format = [resource_path, setUri, file_type].join('');
            } else{
                if(!(checkUri.startsWith(resource_path))){
                    url_format = [resource_path, checkUri, file_type];
                    new_url = url_format.join('');
                }
                return new_url;
            }
        } catch(error){
            throw new Error(error);
        }
    }

    LocatorParameter(locator = [checkUri = '', setUri = '']){
        let [, setUri] = locator;

        if (!Array.isArray(locator)) {
            throw new Error("Invalid parameter: locator must be an array.");
        }

        if(locator.length < 2){
            throw new Error("Invalid parameter: parameter must have 2 elements.");
        }

        if(this.isEmptyString(setUri)){
            throw new Error(`\nInvalid parameter: locator element [setUri] cannot be empty string.`);
        }

        if(!(setUri.startsWith('/'))){
            throw new Error(`'\nInvalid parameter: locator element [setUri]' ${setUri} must start with: '/' `);
        }

        return locator;
    }
}