document.addEventListener('DOMContentLoaded', async () => {
    const requisicoesConteiner = document.getElementById('requisicoes-conteiner');
    const eleitoresConteiner = document.getElementById('eleitores-conteiner');

    setInterval(async () => {
        const requisicoes = await fetch('/validar').then(response => response.json()).then((data) => {return data}).catch(error => console.log(error));
        requisicoesConteiner.innerHTML = ``;
        
        requisicoes.forEach((requisicao) => {
            const div = document.createElement('div');
            const parsed = JSON.parse(requisicao);
    
            const aprovarB = document.createElement('button');
            aprovarB.innerHTML = 'APROVAR';
            aprovarB.addEventListener('click', async () => {
                await fetch('/checar', {
                    method: 'POST',
                    headers: {
                        'Contenty-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'matricula': `${parsed[0].fields.matricula}`,
                        'aprovado': true,
                    }),
                }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));
            });
    
            const negarB = document.createElement('button');
            negarB.innerHTML = 'NEGAR';
            negarB.addEventListener('click', async () => {
                await fetch('/checar', {
                    method: 'POST',
                    headers: {
                        'Contenty-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'matricula': `${parsed[0].fields.matricula}`,
                        'aprovado': false,
                    }),
                }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));
            });
    
            console.log(parsed);
            div.innerHTML = `| Nome: ${parsed[0].fields.nome} | Matricula: ${parsed[0].fields.matricula} | Votou: ${parsed[0].fields.votou} |`;
            div.append(negarB);
            div.append(aprovarB);
            requisicoesConteiner.append(div);
        });

        const eleitores = await fetch('/checar').then(response => response.json()).then((data) => { return JSON.parse(data) }).catch(error => console.log(error));
        eleitoresConteiner.innerHTML = ``;

        eleitores.forEach(eleitor => {
            const div = document.createElement('div')
            div.innerHTML = `| Nome: ${eleitor.fields.nome} | Matricula: ${eleitor.fields.matricula} | Votou: ${eleitor.fields.votou} |`;
            eleitoresConteiner.append(div);
        });
    }, 3000);
});