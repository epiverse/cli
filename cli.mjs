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

async function docs2meta(docs,attrs){ // docs is array of objs
    if(!docs){
        docs = await (await fetch('https://raw.githubusercontent.com/epiverse/nico/refs/heads/main/extract.json')).json()
    }
    // you can use custom attrs
    if(!attrs){
        attrs = Object.keys(docs[0])
    }
    let tb = attrs.join('\t')
    // assemble table
    for( let i=0 ; i<docs.length ; i++){
        let row = `\n${attrs.map((aj,j)=>{return docs[i][attrs[j]]}).join('\t')}`
        tb+=row
        console.log(i,row)
    }
    return tb
}

/**
 * Opens a file picker and returns the text content of the selected file.
 * This function returns a Promise, so you should use `await` to get the result.
 * @returns {Promise<string>} A Promise that resolves with the file's text content.
 * It rejects if the user cancels the file selection or if a file-reading error occurs.
 */
function readTextFile() {
  return new Promise((resolve, reject) => {
    // Create a hidden file input element to trigger the file selection dialog.
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none'; // Use style.display for hiding
    document.body.appendChild(input);

    // --- Event Handlers & Cleanup ---

    // This function removes the input element and the 'focus' event listener.
    // It's called when the operation is complete (success, error, or cancel).
    const cleanup = () => {
      document.body.removeChild(input);
      window.removeEventListener('focus', handleCancel);
    };

    // This handler runs when the user has selected a file.
    input.onchange = () => {
      const file = input.files[0];
      if (!file) {
        cleanup();
        // Reject the promise if, for some reason, no file is selected.
        return reject(new Error('No file was selected.'));
      }

      const reader = new FileReader();

      // When the file is successfully read, resolve the promise with the content.
      reader.onload = (e) => {
        cleanup();
        resolve(e.target.result);
      };

      // If there's an error reading the file, reject the promise.
      reader.onerror = (e) => {
        cleanup();
        reject(new Error('Error reading file:', e.target.error));
      };

      // Start reading the file as text.
      reader.readAsText(file);
    };

    // This handler detects when the user closes the file dialog without a selection.
    const handleCancel = () => {
      // A brief timeout is needed because the 'onchange' event fires before 'focus'.
      // This ensures we don't incorrectly assume cancellation if a file was chosen.
      setTimeout(() => {
        if (input.files.length === 0) {
          cleanup();
          reject(new Error('File selection was canceled.'));
        }
      }, 300);
    };
    
    // The 'focus' event fires on the window when the file dialog is closed.
    window.addEventListener('focus', handleCancel, { once: true });

    // --- Action ---
    // Programmatically click the hidden input to open the file dialog.
    input.click();
  });
}

/**
 * Programmatically opens a file picker for the user to select a .zip file,
 * then decompresses it and returns its contents.
 *
 * @returns {Promise<Map<string, any>>} A Promise that resolves with a Map,
 * where keys are the filenames (string) and values are their content (e.g., text, ArrayBuffer).
 */

async function loadAndUnzipFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip'; // Suggests only accepting zip files

    // Create a Promise to handle the asynchronous file selection
    return new Promise((resolve, reject) => {
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];

            if (!file) {
                reject(new Error('No file selected.'));
                return;
            }

            try {
                const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
                const zip = await JSZip.loadAsync(file); // Load the zip file
                resolve(zip); // Resolve with the JSZip object
            } catch (error) {
                reject(new Error('Failed to load or unzip the file: ' + error.message)); // Catch any errors
            }
        });

        fileInput.click(); // Programmatically trigger the file input
    });
}

export{msg,help,unzipURL,saveFile,vec2tsv,tsv2vec,readTextFile,loadAndUnzipFile, docs2meta}