window.onload = async function () {
    let module = await moduleReference(["view-controller"]);
    let controllerModule = module["view-controller"];
    let controller = new controllerModule();
}