document.addEventListener('DOMContentLoaded', async () => {
    const teclado = document.getElementById('teclado');
    const digitsInput = document.getElementById('digits-input');
    const displayText = document.getElementById('display-text');
    const cellsConteiner = document.getElementById('cells-conteiner');
    const imagemDiv = document.getElementById('img-div');
    const partidoSpan = document.getElementById('partido');
    const nomeSpan = document.getElementById('nome');
    const acoesDiv = document.getElementById('acoes');

    const body = document.getElementsByTagName(`body`);
    const validationBG = document.createElement('div');
    validationBG.id = 'validationBG'
    validationBG.setAttribute('style', 'width: 100%; height: 100%; background-color: rgba(0, 0, 0, .6); position: absolute; top: 0; display: flex; justify-content: center; align-items: center;');
    validationBG.innerHTML = `<div style="background-color: white; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 10px; border-radius: 10px"><h3>Informe sua matrícula</h3><span>Você deve informar seu núrmero de matrícula para poder continuar.</span><input type="text" id="matriculaInput" style="padding: 4px 6px; border-radius: 10px; width: 75%;" placeholder="Insira seu número de matrícula..."><div style="width: 100%; display: flex; justify-content: space-between;"><a href="/">voltar</a><button id="matriculaEnviar">ENVIAR</button></div></div>`;
    body.item(0).append(validationBG);
    const sendButton = document.getElementById('matriculaEnviar');
    sendButton.addEventListener('click', async () => {
        const matricula = document.getElementById('matriculaInput');
        await fetch('/validar', {
            method: 'POST',
            headers: {
                'Contenty-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'matricula': `${matricula.value}`
            })
        }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));

        const update = setInterval(async () => {
            const data = await fetch(`/checar?matricula=${matricula.value}`).then(response => response.json()).then((data) => { return data }).catch(error => console.log(error));
            if (data.status == 'approved') {
                clearInterval(update);
                validationBG.remove();
            };
        }, 3000);
    })

    votacao();

    function votacao(tipo) {
        displayText.innerHTML = ``;
        digitsInput.value = ``;
        nomeSpan.innerHTML = ``;
        partidoSpan.innerHTML = ``;
        imagemDiv.innerHTML = ``;
        cellsConteiner.style.display = 'flex';
        acoesDiv.innerHTML = `<button style="background-color: white" id="bBranco">BRANCO</button><button style="background-color: #F39D45" id="bCorrige">CORRIGE</button><button style="background-color: #40C073" id="bConfirma">CONFIRMA</button>`;

        const bBranco = document.getElementById('bBranco');
        const bCorrige = document.getElementById('bCorrige');
        const bConfirma = document.getElementById('bConfirma');

        let cellsNumber = 0;
        let title = '';
        if (tipo == 'prefeito') {
            cellsNumber = 2;
            title = 'Prefeito';
        }
        else {
            cellsNumber = 5;
            title = 'Vereador';
        };

        displayText.innerHTML = `${title}`;
        cellsConteiner.innerHTML = null;
        for (let index = 1; index <= cellsNumber; index++) {
            cellsConteiner.innerHTML += `<span id="cell_${index}" style="font-size: xx-large"></span>`;
        };

        let filtered = [];

        digitsInput.addEventListener('keyup', (e) => {
            cellsConteiner.style.display = 'flex';
            if (!isNaN(e.key) || e.key == undefined) {
                if (digitsInput.value.length <= cellsNumber) {
                    document.getElementById(`cell_${digitsInput.value.length}`).innerHTML = digitsInput.value[digitsInput.value.length - 1];
                }
                else {
                    digitsInput.value = digitsInput.value.slice(0, cellsNumber);
                    alert(`Deve ter exatos ${cellsNumber} números`);
                };
            }
            else {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    digitsInput.value = null;
                    for (let index = 0; index < cellsNumber; index++) {
                        document.getElementById(`cell_${index + 1}`).innerHTML = ``;
                    };
                    filtered = [];
                };
                digitsInput.value = digitsInput.value.replace(e.key, '');
            };

            if (digitsInput.value.length < 2) {
                displayText.innerHTML = `${title}`;
                partidoSpan.innerHTML = ``;
                imagemDiv.innerHTML = ``;
                nomeSpan.innerHTML = ``;
            }
            else {
                filtered = candidatos.filter(candidato => `${candidato.fields.numero}`.includes(`${digitsInput.value}`) && candidato.fields.cargo == title.toLocaleLowerCase());
                if (filtered.length > 1) {
                    displayText.innerHTML = `Voto de Legenda`;
                    partidoSpan.innerHTML = filtered[0].fields.partido;
                }
                else if (filtered.length == 1) {
                    displayText.innerHTML = `${title}`;
                    partidoSpan.innerHTML = filtered[0].fields.partido;
                    nomeSpan.innerHTML = filtered[0].fields.apelido;
                    imagemDiv.innerHTML = `<img src="/media/${filtered[0].fields.imagem}" alt="${filtered[0].fields.apelido}">`;
                }
                else {
                    partidoSpan.innerHTML = ``;
                    displayText.innerHTML = `Voto Nulo`;
                };
            };
        });

        digitsInput.addEventListener('blur', () => {
            digitsInput.focus();
        });

        bBranco.addEventListener('click', async () => {
            digitsInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Backspace' }));
            displayText.innerHTML = `Voto em Branco`;
            cellsConteiner.style.display = 'none';
        });

        bCorrige.addEventListener('click', () => {
            digitsInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Backspace' }));
        });

        bConfirma.removeEventListener('click', handleConfirmClick);
        bConfirma.addEventListener('click', handleConfirmClick);

        async function handleConfirmClick() {
            let numero;
            if (filtered.length > 1) numero = digitsInput.value.slice(0, 2);
            else if (filtered.length == 1) numero = digitsInput.value;
            else numero = '0';

            console.log(cellsNumber);

            if (cellsNumber == 5) {
                fetch('/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'numero': `${numero}`,
                        'cargo': 'vereador',
                    }),
                }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));
                return votacao('prefeito');
            }
            else if (cellsNumber == 2) {
                bConfirma.removeEventListener('click', handleConfirmClick);
                fetch('/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'numero': `${numero}`,
                        'cargo': 'prefeito',
                    }),
                }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));
                alert('Seus votos foram contabilizados');
                displayText.innerHTML = `Votação Concluida`;
                imagemDiv.remove();
                cellsConteiner.remove();
                nomeSpan.remove();
                partidoSpan.remove();
            }
        };
    };

    for (let index = 0; index <= 9; index++) {
        const button = document.createElement('button');
        button.innerHTML = index;
        button.style.gridArea = `b${index}`;
        button.addEventListener('click', (e) => {
            digitsInput.value += index;
            digitsInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        });
        teclado.firstElementChild.appendChild(button)
    };
});