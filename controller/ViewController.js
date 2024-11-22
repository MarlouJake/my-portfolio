export default class ViewController{

    constructor(url = '', container = '.index-main', data = {}){
        this.controller = "view";
        this.file_type = ".html";
        this.url = (this.controller + url + this.file_type);
        this.container = container;
        this.data = (Object.keys(data).length > 0)  ? data : { default: null };
        this.params = {
            url: this.url,
            container: this.container,
            data: (Object.keys(data).length > 0) ? this.data : this.defaultData,
        };
    }

    Home(url = '', container = '', data = {}) {

        this.url = (url.trim() === '') ? (this.controller + 'home' + this.file_type) : url;
        this.container = (container.trim() === '') ?  this.container : container;
        this.data =  (Object.keys(data).length > 0) ? data : this.data
        this.params = {
            url: this.url,
            container: this.container,
            data: this.data
        };

        return this;
    }

    About(url = '', container = '', data = {}) {

        this.url = (url.trim() === '') ? (this.controller + 'about' + this.file_type) : url;
        this.container = (container.trim() === '') ?  this.container : container;

        this.params = {
            url: this.url,
            element: this.container,
            data: (Object.keys(data).length > 0) ? data : this.data,
        };

        return this;
    }

    Skills(url = '', container = '', data = {}) {

        this.url = (url.trim() === '') ? (this.controller + 'skills' + this.file_type) : url;
        this.container = (container.trim() === '') ?  this.container : container;

        this.params = {
            url: this.url,
            element: this.container,
            data: (Object.keys(data).length > 0) ? data : this.data,
        };

        return this;
    }

    async LoadContent(url = '', container = this.container, data = this.data){

        url = (url.trim() !== '') ? (this.controller + url + this.file_type) : this.url;

        try{
            const response = await $.ajax({
                url:  url,
                type: 'GET',
                data: data,
                cache: true,
                timeout: 10000
            });

            $(container).html(response);
            await this.updateActive(url);
        }
        catch (error){
            this.params.url = url;
            console.error(`[${error.status} ${error.statusText}] An error occurred while loading the view.
                \n%cPayload:`, 'font-weight: bold;', `\n\t\t${JSON.stringify(this.params)}`);
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
}