console.log(`index.js at ${Date()}`);

(async function(){ // anonymous asynchronous execution
    let cli = await import('./cli.mjs')
    cli.msg()
})();

//const help=9
//export {help}