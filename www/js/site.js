var environment;
window.onload = async function(){
    let ignore = ['view-controller'];
    environment = "default_environment";
    deployed = false;

    try{
        let config = await getConfig();
        let { environments : {cloud = "deploy", local = "local"}, domains  : {github = 'cloudDomain', localhost = 'localDomain'}} = config;
        let dummyDomain = github;
        let currentDomain = dummyDomain || CheckDomain();
        if(currentDomain === localhost){
            environment = local;
            deployed = false;
        } else{
            environment = cloud;
            deployed = true;
        }

        includeHeadReferences(config, ignore);

        if (!deployed) return console.info("Hosting State:",  {currentDomain, environment});

    } catch (error){
        console.error(error);
    }
}

function CheckDomain() {
    return window.location.hostname;
}

function includeHeadReferences(config = 'config', ignore = []){
    let {protocol , domains, assets} = config;
    let { github, localhost } = domains
    let  {"style-sheets" : styles_sheets, scripts : {modules}} = assets;
    let scheme = [protocol, "://"].join("");
    let scripts_path = setFilePath(config, modules, '.js', ignore);
    let styles_path = setFilePath(config, styles_sheets, '.css');

    switch(environment){
        case config.environments.local:
            AddElementToHead('<link>', 'href', styles_path, scheme);
            AddElementToHead('<script>', 'src', scripts_path, scheme);
            break;
        case config.environments.cloud:
            AddElementToHead('<link>', 'href', styles_path, scheme, github);
            AddElementToHead('<script>', 'src', scripts_path, scheme, github);
            break;
        default:
            console.error(`Environment '${environment}' not implemented`);
    }
}

function AddElementToHead(tag = '<script>', link_attribute = 'src', paths = '/index.html', scheme = 'https://', domain = '127.0.0.1', ){
    let scriptTemplate = $('<script></scrip>').attr('type', 'module');
    let linkTemplate = $('<link>').attr('rel', 'stylesheet');
    let htmlElement;

    switch(tag){
        case '<script>':
            htmlElement = scriptTemplate;
            break;
        case '<link>':
            htmlElement= linkTemplate;
            break;
        default:
            console.error(`Adding ${tag} to <head> not yet implemented`);
            break;
    }

    for(let path in paths){
        let cloneElement = htmlElement.clone();
        cloneElement.attr(link_attribute,
            (environment === 'development') ? paths[path] : scheme + [domain, paths[path]].join("/")
        ).prop('defer', true);
        $('head').append(cloneElement);
    }
}

function getJsonValues(object_key, ignore_keys = []){
    let values = {};
    for(let value_key in object_key){
        if(ignore_keys.includes(value_key)){
            continue;
        }
        values[value_key] = object_key[value_key];
    };
    return values;
}


function setFilePath(config, object_key, file_extension, ignore_files = []) {
    // Check if lookup_key is valid
    if (!object_key) return `Invalid object key: ${object_key}`;
    if(file_extension !== '.js' && file_extension !== '.css') return `Invalid file type: ${file_extension}`;

    // Retrieve JSON values
    let assets_files = getJsonValues(object_key, ignore_files);
    //let assets_filenames = changeFileByFileType(assets_files, file_extension);
    let relative_paths = changePathByEnvironment(config, file_extension);
    let formatted_Paths = formattedPaths(assets_files, relative_paths);

    return formatted_Paths;
}

function formattedPaths(assets_filenames, relative_paths, ignore_files = []){
    let paths = [];
    for(let filename in assets_filenames){
        if(ignore_files.includes(assets_filenames[filename])){
            // Skip this iteration if the current file matches ignore_file items
            continue;
        } else {
            // Push insert the formatted path to the array
            paths.push([relative_paths, assets_filenames[filename]].join("/"));
        }
    }
    return paths;
}

function changePathByEnvironment(config, file_extension){
    let { "cloud-paths": cloud_paths, "local-paths": local_paths } = getJsonValues(config);
    let {www, js, css} = local_paths;
    let {assets, portfolio, styles} = cloud_paths;
    let type = 'default_type';
    let path = [];

    switch(environment){
        case config.environments.local:
            path = (file_extension === '.js') ?
                [www, js, local_paths.modules]
             :
                [www, css]
            break;
        case config.environments.cloud:
            type = (file_extension === '.js') ? cloud_paths.modules : styles;
            path = [portfolio, assets, type];
            break;
        default:
            break;
    }
    return path.join("/");
}

function changeFileByFileType(assets_files, file_extension){
    //let {"style-sheets" : styles , scripts : {modules}} = assets_files;
    let lookup_file;
    switch(file_extension){
        case '.css':
            lookup_file = styles;
            break;
        case '.js':
            lookup_file = modules;
            break;
        default:
            lookup_file = {"error" : `No file found with the file extension of '${file_extension}'`};
            break;
   }
   return lookup_file;
}

async function getConfig(){

    const url = 'www/config.json';

    try{
        const response = await $.ajax({
            url: url,
            type: 'GET',
            cache: true,
            timeout: 10000
        });

        return response;

    } catch (error){
        console.error(`Error fetching '${url}'. `, error);
    }
}