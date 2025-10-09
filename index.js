console.log(`cli index.js loaded at \n${Date()}`);

(async function(){
    // anonymous asynchronous execution
    const cli = await import('https://epiverse.github.io/cli/cli.mjs')
    cli.msg(`command line interface index.js imported\n${Date()}`)
    window.cli=cli // <-- anchor cli to window
})();