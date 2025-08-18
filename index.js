console.log(`index.js at ${Date()}`);

(async function(){
    // anonymous asynchronous execution
    const cli = await import('./cli.mjs')
    cli.msg('index.js executed') // opening message
    // you can run analysis here
    
})();