export default class ViewController{

    constructor(){
        this.full_url = window.location.href;
        this.base_url = window.location.origin;
        this.resource_path = 'view';
        this.file_type = '.html';
        this.url = (this.resource_path + '/index' + this.file_type);
        this.container = '.index-main';
        this.data = { default: null };

        this.params = {
            url: this.url,
            container: this.container,
            data: this.data
        };
    }

    Home(url = '', container = '', data = {}) {

        this.url = this.setUrl([url,'/home']);
        this.container = (this.isEmptyString(container)) ?  this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    About(url = '', container = '', data = {}) {

        this.url = this.setUrl([url, '/about']);
        this.container = (this.isEmptyString(container)) ?  this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    Skills(url = '', container = '', data = {}) {

        this.url = this.setUrl([url, '/skills']);
        this.container = (this.isEmptyString(container)) ?  this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    Contact(uri = '', container = '', data={}){

        this.url = this.setUrl(uri, '/contact');
        this.container = (this.isEmptyString(container)) ? this.container : container;
        this.data = this.objectHasKey(data);

        return this;
    }

    async LoadContent(url = '', container = this.container, data = this.data){

        try{
            const response = await $.ajax({
                url:  this.isEmptyString(url) ? this.url: this.setUrl([url, url]),
                type: 'GET',
                data: data,
                cache: true,
                timeout: 10000
            });

            $(container).fadeOut(100, function(){
                $(this).html(response).fadeIn().delay(200);
            });

            await this.updateActive(url);
            await this.updateConstructorParams(url, container, data);
 

        }
        catch (error){
            this.params.url = url;

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

    async updateActive(url){
        $('.index-nav .nav-ul li a').removeClass('active');

        let uri = $('.index-nav .nav-ul li').find('a').filter(function(){
            return $(this).data('uri') === url;
        });

        if(uri.length){
            $(uri).addClass('active');
        } else{
            $(uri).removeClass('active');
        }
    }

    async updateConstructorParams(url, container, data){

        let newUrl = url;

        if(!(url.startsWith(this.resource_path))){
            newUrl = (this.resource_path + url);
        }

        if(!(newUrl.endsWith(this.file_type))){
            newUrl = (newUrl + this.file_type);
        }

        this.params.url = `${this.full_url}/${newUrl}`;
        this.params.container = container;
        this.params.data = data;
    }

    isEmptyString(string){
        return (string.trim() === '') ? true : false;
    }

    objectHasKey(object){
        return (Object.keys(object).length > 0) ? object : { default: null };
    }

    setUrl(locator = [checkUri = '', setUri = ''], resource_path = this.resource_path, file_type = this.file_type){
        let [checkUri, setUri] = this.LocatorParameter(locator);
        let newUrl = checkUri;

        if(this.isEmptyString(checkUri)){
            return (resource_path + setUri + file_type);
        } else{

            if(!(checkUri.startsWith(resource_path))){
                newUrl = (resource_path + checkUri + file_type);
            }

            return newUrl;
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