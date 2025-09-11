console.log(`index.js at ${Date()}`);

(async function(){
    // anonymous asynchronous execution
    const cli = await import('./cli.mjs')
    cli.msg(`cli index.js executed ${Date()}`)
})();