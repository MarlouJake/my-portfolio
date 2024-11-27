const moduleMap = {
    "view-controller" : "./view-controller.js",
}

async function loadModules(modules) {
    const loadedModules = {};

    for(let module of modules){
        let  module_path = moduleMap[module];

        if(module_path){
            try{
                const imported_module = await import(module_path);
                loadedModules[module] = imported_module.default;
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