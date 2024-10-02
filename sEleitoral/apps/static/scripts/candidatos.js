document.addEventListener('DOMContentLoaded', async () => {
    const marvelDiv = document.getElementById('marvelDiv');
    const dcDiv = document.getElementById('dcDiv');

    /**
     * 
     * @param {Array} partido 
     * @param {HTMLDivElement} div 
     */
    function candidatos(partido, div) {
        const candidatosContiener = div.getElementsByClassName('candidatos-conteiner');
        const prefeitosConteiner = div.getElementsByClassName('prefeitos-conteiner');

        partido.forEach((candidato) => {
            if (candidato.fields.nome == 'Branco' || candidato.fields.proposta == 'partido') return
    
            const div = document.createElement('div');
            div.classList.add('candidate-div');
            div.innerHTML = `<h3>${candidato.fields.cargo.toUpperCase()}</h3>`+
                `<img src="media/${candidato.fields.imagem}" alt="${candidato.fields.nome}">` +
                `<h2>${candidato.fields.apelido}</h2>` +
                `<h4>${candidato.fields.nome}</h4>` +
                `<h3>${candidato.fields.numero}</h3>` +
                `<span>${candidato.fields.proposta}</span>`;
            if (candidato.fields.cargo == 'vereador') candidatosContiener[0].append(div);
            else prefeitosConteiner[0].append(div);
        });
    };

    candidatos(pmc, marvelDiv);
    candidatos(pdc, dcDiv);
});