console.log(`index.js at ${Date()}`);

(async function(){ // anonymous asynchronous execution
    let cli = await import('./cli.mjs')
    cli.msg() // opening message
})();
