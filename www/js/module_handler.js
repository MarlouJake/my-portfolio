const moduleMap = {
    "view-controller" : "/controller/ViewController.js"
}

async function loadModules(modules) {
    const loadedModules = {};

    for(let module of modules){
        let  module_path = moduleMap[[window.origin, module].join('')];

        if(module_path){
            try{
                const imported_module = await import(module_path);
                loadedModules[module] = imported_module.default;
                console.log(`Module loaded: `, module_path);
            } catch(error){
                console.error(`Error loading module: ${module}.`, error);
            }
        } else{
            console.warn(`[Module Path] Couldn't find specified path for ${module}.\n\t[Path] `, module_path);
        }
    }
    return loadedModules;
}

window.loadModules = loadModules;