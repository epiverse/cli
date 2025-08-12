const hello = "world"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function msg(txt=`${Date()}`,div='epiverseMSG'){
    if(typeof(div)=='string'){
        div = document.querySelector(`#${div}`)
    }
    div.style.fontSize='small'
    for(let i=0;i<=txt.length;i++){
        await sleep(5)
        div.innerText=txt.slice(0,i)
    }
}
function help(){
    window.open('https://github.com/epiverse/cli/wiki/CLI')
}

export{msg,help}