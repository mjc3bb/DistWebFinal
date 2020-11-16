let quill;

let renderQuill = () => {
    quill = new Quill('#editor', {theme: 'snow'});
    if (!!delta) {
        quill.setContents(delta)
    }
}

const saveFile = async () => {
    const delta = quill.getContents()
    try {
        const response = await fetch("/save", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                delta: delta,
                name: name_input.value,
            })
        })
        const data = await response.json()
        window.location.href = `/pasta/${data.id}`
    }catch (e){
        console.error(e)
        throw e
    }
}

const cancelFile = async () => {
    window.location.href = '/'
}

let pasta_name = document.getElementById("pasta-name");
let name_input = document.getElementById("name-input");

const enableNameEditing = () => {
    pasta_name.classList.add("hidden")
    name_input.value = pasta_name.innerText
    name_input.classList.remove("hidden")
    name_input.focus()
}

const disableNameEditing = () => {
    pasta_name.classList.remove("hidden")
    pasta_name.innerText = name_input.value
    name_input.classList.add("hidden")
}

document.getElementById("b_save").addEventListener("click", saveFile)
document.getElementById("b_cancel").addEventListener("click", cancelFile)
pasta_name.addEventListener("click", enableNameEditing)
name_input.addEventListener("blur", disableNameEditing)
name_input.value = pasta_name.innerText
