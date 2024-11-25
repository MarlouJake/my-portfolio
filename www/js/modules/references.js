const  reference = {
    "view-controller" : "/controller/view-controller"
}

async function moduleReference() {
    loadedReferenceModule = {}

    for(let path of reference){
        let reference_path =  reference[path];
        if(reference_path){
            try{
                const imported = await import(reference_path);
                loadedReferenceModule[path] = imported.default;
                console.log("Loaded: ", reference_path);
            } catch (error){
                console.error(`Error loading module: ${path}. ${error}`);
            }
        } else{
            console.warn(`Couldn't locate path for '${path}' : path: ${reference_path}`);
        }
    }
    return loadedReferenceModule;
}
window.moduleReference = moduleReference;