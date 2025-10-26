const btnSortear = document.getElementById("buttonSortear")
const textoVitoria = document.getElementById("texto1")
const t2 = document.getElementById("texto2")
const t3 = document.getElementById("texto3")
const t4 = document.getElementById("texto4")


const som1 = new Audio("sons/som_derrota.mp3")
const som2 = new Audio("sons/game_over.mp3")
const som3 = new Audio("sons/som_vitoria.mp3")
const som4 = new Audio("sons/som_girando_mod.mp3")
let vitorias = 0
let derrotas = 0
let jogos = 0
let sons = []


// --------------------- Subalgoritmos auxiliares

function tocaSom(som, sons, tempo)
{
    if (sons.length != 0)
    {
        sons[(sons.length) - 1].pause()
    }
    som.currentTime = tempo
    sons.push(som)
    som.play()
}

function derrota()
{
    // dinheiro.innerHTML = dinheiro.innerHTML - inputValor
    tocaSom(som1, sons, 0)
 
}

function vitoria()
{
    // const simbolos = retornaSimbolos()
    // dinheiro.innerHTML = parseInt(dinheiro.innerHTML) + (inputValor * simbolos.indexOf(arrayNumbers[0]) * 3)
    tocaSom(som3, sons, 0)
}

function geraValor()
{
    const simbolos = retornaSimbolos()
    return simbolos[Math.floor(Math.random() * retornaSimbolos().length)]
}

function formataVitoria(ganhou)
{
    if(ganhou == true)
    {
        return "GANHOU!"
    }
    return "PERDEU!"
}

function formataNumeros(arrayNumbers)
{
    let mensagem = ""
    for(i=0; i < arrayNumbers.length; i++)
    {
        mensagem += arrayNumbers[i] + "  "
    }
    return mensagem
}

function preencheArray(tamanho)
{
    let arrayNumbers = []
    for (i = 0; i < tamanho; i++)
    {
        arrayNumbers.push(geraValor())
    }
    return arrayNumbers
}

function configuraRandom(minimo, maximo)
{
    while(true)
    {
        let t = Math.floor(Math.random() * maximo)
        if(t > minimo)
        {
            return t
        }
    }
}

function contornaAteAcharNumero(numeroProcurado, listaContornada, texto, tempo)
{
    const simbolos = retornaSimbolos()
    let i = 0
    let j = 0;
    let achou = false
    let limite = configuraRandom(4, 7)

    return new Promise((resolve) =>
    {
        const intervalo = setInterval(function(){
        if(achou)
        {
            clearInterval(intervalo)
            resolve()
        }
        texto.innerHTML = listaContornada[i]

        if(i === listaContornada.length - 1)
        {
            j++
            i = 0
        }
        else
        {
            i++
        }
        if(j === limite)
        {
            if(numeroProcurado === simbolos[i])
            {
                achou = true
            }
        }
    }, tempo)
    })
}


function retornaSimbolos()
{
    return ["🍒", "🍋", "🔔", "⭐", "💎", "FIM"]
}

async function girar(arrayNumbers)
{
    const simbolos = retornaSimbolos()
    let tempo1 = configuraRandom(100, 250)
    let tempo2 = configuraRandom(100, 250)
    let tempo3 = configuraRandom(100, 250)
    await Promise.all([contornaAteAcharNumero(arrayNumbers[0], simbolos, t2, tempo1), contornaAteAcharNumero(arrayNumbers[1], simbolos, t3, tempo2), contornaAteAcharNumero(arrayNumbers[2], simbolos, t4, tempo3)])
}


function count(valor, arrayNumbers)
{
    let qtd = 0
    for(i = 0; i < arrayNumbers.length; i++)
    {
        if(arrayNumbers[i] == valor)
        {
            qtd+=1
        }
    }

    return qtd
}


function verificaIgualdade(arrayNumbers)
{
    if(count(arrayNumbers[0], arrayNumbers) == arrayNumbers.length)
    {
        return true
    }
    return false
}

function verificaDisponibilidade(inputValor, dinheiro)
{
    if(inputValor === "" || inputValor == 0)
    {
        return "Campo está vazio"
    }

    if(inputValor < 0)
    {
        return "Não é possível apostar um valor negativo"
    }

    if(inputValor > parseInt(dinheiro.innerHTML))
    {
        return "Saldo indisponível. Você possui " + parseInt(dinheiro.innerHTML) + "."
    }

    return "disponivel"
}


// --------------------- Subalgoritmos principais

async function retornaResultadoSorteio(texto)
{
    let arrayNumbers = []

    let manipulacao = (jogos == 1) ? true : false
    if(manipulacao)
    {
        simbolo = retornaSimbolos()[configuraRandom(0, retornaSimbolos().length - 1)]
        arrayNumbers = ["FIM", "FIM", "FIM"]
        texto.innerHTML = "Girando..."
        tocaSom(som4, sons, 0.34)
        btnSortear.disabled = true
        await girar(arrayNumbers)
        texto.style.fontSize = "20px"
        document.getElementById("cas").style.fontSize = "20px"
        document.getElementById("cas").innerHTML = "Ohhh, o período de teste acabou..."
        document.getElementsByClassName("slot").disabled = true
        texto.innerHTML = "Para mais, venha nos visitar em: RUA ALCANTÂRA, 113 - ETEC HAS - SALA 08"
        btnSortear.disabled = false
        btnSortear.innerText = "Clique aqui para acessar"
        vitoria()
    }
    else if(jogos > 1)
    {
        window.open("https://share.google/B78GObTscYDpUkpzv", "_blank")
        // window.location.href = "https://share.google/B78GObTscYDpUkpzv"
    }
    else
    {

        let manipulacao = (configuraRandom(0, 10) >= 3) ? true : false
        if(manipulacao)
        {
            simbolo = retornaSimbolos()[configuraRandom(0, retornaSimbolos().length - 1)]
            arrayNumbers = [simbolo, simbolo, simbolo]
        }
        else
        {
            arrayNumbers = preencheArray(3)
        }
        texto.innerHTML = "Girando..."
        tocaSom(som4, sons, 0.34)
        btnSortear.disabled = true
        await girar(arrayNumbers)

        if(verificaIgualdade(arrayNumbers))
        {
            vitoria()
            vitorias++
        }
        else
        {
            derrota()
            derrotas++
        }
        texto.innerHTML = formataVitoria(verificaIgualdade(arrayNumbers))


        btnSortear.disabled = false
    }
}

document.addEventListener("keydown", function(event)
{
    if(event.key === " " || event.key === "Enter")
    {
        btnSortear.click()
    }
})

btnSortear.addEventListener("click", () =>
{
    retornaResultadoSorteio(textoVitoria)
    jogos++
})

