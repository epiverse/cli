const hello = "world"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function msg(txt=`${Date()}`,div='cliDiv'){
    if(typeof(div)=='string'){
        div = document.querySelector(`#${div}`)
    }
    div.style.fontSize='small'
    div.style.color='maroon'
    for(let i=0;i<=txt.length;i++){
        await sleep(5)
        div.innerText=txt.slice(0,i)
    }
}

function help(){
    window.open('https://github.com/epiverse/cli/wiki/CLI')
}

async function unzipURL(url="https://raw.githubusercontent.com/epiverse/pathembed/refs/heads/main/tcgaSlideEmbeddings.json.zip") {
    //const localForage = await import("https://esm.sh/localforage")
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    // xx = await (await import('./embedStats.mjs')).unzipURL()
    console.log(`unzipping from ${url}\nthis may take a few seconds, maybe a minute ...`)
    msg.value = `unzipping from ${url}\nthis may take a few seconds, maybe a minute ...`
    let response = await fetch(url)
    let data = await response.arrayBuffer()
    let zip = await JSZip.loadAsync(data);
    let filename = Object.entries(zip.files)[0][0]
    let file = zip.file(filename)
    let content = await file.async('string')
    if (content.match(/^[\[\{]/)) {
        // text content starts with '[' or '{'
        content = await JSON.parse(content)
        console.log('JSON text detected, ... parsed:')
    }
    return content
    console.log(`... ${content.length} embedded vectors loaded and unzipped`)
}

function saveFile(txt=':-)', fileName="hello.txt") {
    var bb = new Blob([txt]);
    var url = URL.createObjectURL(bb);
    var a = document.createElement('a')
    a.hidden = true
    document.body.appendChild(a)
    a.href = url;
    a.download = fileName;
    a.click()
    a.parentElement.removeChild(a)
    // cleanup
    return a
}

// simple vectors to tsv conversion
function vec2tsv(vec) {
    return vec.map(v => v.join('\t')).join('\n')
}

// simple tsv to vectors conversion
function tsv2vec(tsv) {
    return tsv.split(/\n/g).map(row=>row.split(/\t/g).map(c=>parseFloat(c)))
}


export{msg,help,unzipURL,saveFile,vec2tsv,tsv2vec}