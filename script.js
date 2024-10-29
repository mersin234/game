const episData = {
    canteiro: [
        { src: 'imagens/Capacete_e_oculos_e_mascara_e_protetor-removebg-preview.png', alt: 'Capacete e óculos de proteção com máscara', id: 'capacete_oculos_mascara', position: { top: -8, left: 20, width: 167, height: 170 } },
        { src: 'imagens/corpo_remo_2.png', alt: 'Cinto de segurança', id: 'cinto', position: { top: 82, left: 13, width: 240, height: 258 } }
    ],
    laboratorio: [
        { src: 'imagens/cabeça_remo_2.png', alt: 'Óculos de proteção', id: 'oculos', position: { top: 20, left: 60, width: 80, height: 50 } },
        { src: 'imagens/cabeça_remo_3.png', alt: 'Máscara respiratória', id: 'mascara', position: { top: 40, left: 65, width: 80, height: 50 } },
        { src: 'imagens/quimico-removebg-preview_1.png', alt: 'Conjunto Químico Completo', id: 'conjunto_quimico', position: { top: 0, left: 40, width: 150, height: 300 } }
    ],
    industria: [
        { src: 'imagens/cabeça_remo_2.png', alt: 'Óculos de proteção', id: 'oculos', position: { top: 20, left: 60, width: 80, height: 50 } },
        { src: 'imagens/cabeça_remo_3.png', alt: 'Máscara respiratória', id: 'mascara', position: { top: 40, left: 65, width: 80, height: 50 } },
        { src: 'imagens/quimico-removebg-preview_1.png', alt: 'Conjunto Químico Completo', id: 'conjunto_quimico', position: { top: 0, left: 40, width: 150, height: 300 } }
    ]
};

function selecionarCenario(cenario) {
    document.getElementById('cenario').style.display = 'none';
    document.getElementById('jogo').style.display = 'block';

    // Atualize o nome do cenário
    const nomeCenario = cenario === 'canteiro' ? 'Canteiro de Obras' :
                        cenario === 'laboratorio' ? 'Laboratório Químico' :
                        cenario === 'industria' ? 'Indústria' : 'Cenário Desconhecido';
    document.getElementById('nomeCenario').textContent = nomeCenario;

    // Atualize os EPIs
    const episDiv = document.getElementById('epis');
    episDiv.innerHTML = '';
    episData[cenario].forEach(epi => {
        const img = document.createElement('img');
        img.src = epi.src;
        img.alt = epi.alt;
        img.id = epi.id;
        img.draggable = true;
        img.ondragstart = drag;
        img.ontouchstart = touchStart;
        img.ontouchmove = touchMove;
        img.ontouchend = touchEnd;
        img.dataset.position = JSON.stringify(epi.position);
        img.classList.add('selectable-epi');
        episDiv.appendChild(img);
    });

    // Atualize o fundo
    const fundoSrc = cenario === 'canteiro' ? 'imagens/cenario_canteiro.png' :
                     cenario === 'laboratorio' ? 'imagens/fundo_laboratorio.png' :
                     cenario === 'industria' ? 'imagens/industria.png' : '';
    document.getElementById('cenarioFundo').src = fundoSrc;

    // Iniciar música de fundo
    const audioTrilha = document.getElementById('audioTrilha');
    audioTrilha.play();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const element = document.getElementById(data);
    const position = JSON.parse(element.dataset.position);

    const imgClone = element.cloneNode();
    imgClone.style.position = 'absolute';
    imgClone.style.top = position.top + 'px';
    imgClone.style.left = position.left + 'px';
    imgClone.style.width = position.width + 'px';
    imgClone.style.height = position.height + 'px';
    imgClone.classList.add('epi');
    document.getElementById('boneco').appendChild(imgClone);

    element.remove();
}

function verificarEPIs() {
    const boneco = document.getElementById('boneco');
    const feedback = document.getElementById('feedback');
    const cenario = document.getElementById('nomeCenario').textContent;
    const correctEPIs = episData[cenario === 'Canteiro de Obras' ? 'canteiro' :
                                cenario === 'Laboratório Químico' ? 'laboratorio' :
                                'industria']; // Adicionado o novo cenário

    const placedEPIs = Array.from(boneco.getElementsByClassName('epi')).map(epi => epi.id);

    const isCorrect = correctEPIs.every(epi => placedEPIs.includes(epi.id)) && placedEPIs.length === correctEPIs.length;

    if (isCorrect) {
        feedback.textContent = 'Parabéns! Você selecionou todos os EPIs corretos.';
        document.getElementById('audioVitoria').play(); // Toca a música de vitória
    } else {
        feedback.textContent = 'Tente novamente. Alguns EPIs estão faltando ou incorretos.';
        document.getElementById('audioDerrota').play(); // Toca a música de derrota
    }

    // Parar música de fundo
    document.getElementById('audioTrilha').pause();
    document.getElementById('audioTrilha').currentTime = 0;
}

// Mostra a tela inicial com o boneco
document.getElementById('cenario').style.display = 'block';
