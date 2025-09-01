   //
        // ========================================
        // LÓGICA DO JAVASCRIPT
        // ========================================
        //
        document.addEventListener('DOMContentLoaded', () => {

            // ========================================
            // VARIÁVEIS E CONSTANTES GLOBAIS
            // ========================================
            const botoesReservar = document.querySelectorAll('.botao-reservar');
            const janelaChatbot = document.querySelector('.janela-chatbot');
            const botaoFecharChatbot = document.querySelector('.botao-fechar');
            const mensagensChatbot = document.querySelector('.mensagens-chatbot');
            const secaoEntrada = document.querySelector('.secao-entrada');
            const toastContainer = document.querySelector('.toast-container');
            const menuHamburguer = document.querySelector('.botao-menu-hamburguer');
            const menuNavegacao = document.querySelector('.menu-navegacao');

            // Array de datas já reservadas para simulação. Formato YYYY-MM-DD.
            // Para adicionar/remover datas, basta editar este array.
            const datasIndisponiveis = [
                '2025-09-05',
                '2025-09-12',
                '2025-10-01',
                '2025-12-25' // Exemplo de data de feriado
            ];

            // Variáveis de estado do chatbot
            let estadoChatbot = 'data';
            let dadosReserva = {};
            let timeoutDigitar;

            // ========================================
            // FUNÇÕES DE UTILIDADE
            // ========================================

            // Adiciona uma mensagem na interface do chatbot
            function adicionarMensagem(texto, remetente, tempoDigitar = 500) {
                const balaoWrapper = document.createElement('div');
                balaoWrapper.classList.add('mensagem-balao', remetente);

                const balao = document.createElement('div');
                balao.classList.add('balao', remetente);
                balao.textContent = texto;

                balaoWrapper.appendChild(balao);
                mensagensChatbot.appendChild(balaoWrapper);

                // Rolagem automática para o final
                mensagensChatbot.scrollTop = mensagensChatbot.scrollHeight;
            }

            // Exibe o "digitando..." do chatbot
            function simularDigitando() {
                const balaoWrapper = document.createElement('div');
                balaoWrapper.classList.add('mensagem-balao', 'atendente', 'digitando');

                const balao = document.createElement('div');
                balao.classList.add('balao', 'atendente');
                balao.textContent = '...';

                balaoWrapper.appendChild(balao);
                mensagensChatbot.appendChild(balaoWrapper);
                mensagensChatbot.scrollTop = mensagensChatbot.scrollHeight;

                return balaoWrapper;
            }

            // Mostra uma mensagem temporária (toast)
            function mostrarToast(mensagem, tipo = 'aviso') {
                const toast = document.createElement('div');
                toast.classList.add('toast');
                if (tipo === 'sucesso') {
                    toast.classList.add('toast-sucesso');
                }
                toast.textContent = mensagem;

                toastContainer.appendChild(toast);
                setTimeout(() => {
                    toast.classList.add('mostrar');
                }, 10);

                setTimeout(() => {
                    toast.classList.remove('mostrar');
                    toast.addEventListener('transitionend', () => {
                        toast.remove();
                    });
                }, 4000);
            }

            // Formata uma data para o formato brasileiro DD/MM/AAAA
            function formatarDataBR(data) {
                const [ano, mes, dia] = data.split('-');
                return `${dia}/${mes}/${ano}`;
            }

            // Encontra a próxima data disponível após uma data inicial
            function encontrarProximaDataDisponivel(dataInicial) {
                let data = new Date(dataInicial);
                while (true) {
                    data.setDate(data.getDate() + 1);
                    const dataFormatada = data.toISOString().split('T')[0];
                    if (!datasIndisponiveis.includes(dataFormatada)) {
                        // Comentário: A linha abaixo evita fins de semana. Para aceitar, basta remover a verificação.
                        // if (data.getDay() !== 0 && data.getDay() !== 6) { // 0 = Domingo, 6 = Sábado
                            return dataFormatada;
                        // }
                    }
                }
            }

            // ========================================
            // LÓGICA PRINCIPAL DO CHATBOT
            // ========================================
            
            // Inicia o fluxo do chatbot
            function iniciarChatbot() {
                mensagensChatbot.innerHTML = ''; // Limpa as mensagens
                secaoEntrada.innerHTML = ''; // Limpa os inputs/botões
                estadoChatbot = 'data';
                dadosReserva = {};
                
                // Mensagem inicial do chatbot
                adicionarMensagem('Olá! Vamos agendar sua visita na Chácara Sousa. Por favor, informe a data desejada.', 'atendente');
                
                // Exibe o input de data
                setTimeout(() => {
                    const inputData = document.createElement('input');
                    inputData.type = 'date';
                    inputData.classList.add('campo-data');
                    inputData.min = new Date().toISOString().split('T')[0];
                    
                    const mensagemEstado = document.createElement('p');
                    mensagemEstado.classList.add('mensagem-estado');
                    mensagemEstado.textContent = 'Aguardando sua escolha...';
                    
                    secaoEntrada.appendChild(inputData);
                    secaoEntrada.appendChild(mensagemEstado);
                    
                    inputData.focus();

                    // Evento para validar a data ao ser escolhida
                    inputData.addEventListener('change', (evento) => {
                        const dataEscolhida = evento.target.value;
                        if (dataEscolhida) {
                            validarData(dataEscolhida);
                        }
                    });

                }, 1000);
            }

            // Validação da data escolhida
            function validarData(dataEscolhida) {
                clearTimeout(timeoutDigitar);
                
                const mensagemEstado = secaoEntrada.querySelector('.mensagem-estado');
                mensagemEstado.textContent = '';
                
                adicionarMensagem(formatarDataBR(dataEscolhida), 'usuario');
                
                const balaoDigitando = simularDigitando();

                timeoutDigitar = setTimeout(() => {
                    balaoDigitando.remove();
                    
                    if (datasIndisponiveis.includes(dataEscolhida)) {
                        const proximaDisponivel = encontrarProximaDataDisponivel(dataEscolhida);
                        const dataFormatada = formatarDataBR(proximaDisponivel);
                        
                        adicionarMensagem(`Ops! Este dia já está alugado. Mas a boa notícia é que temos disponibilidade. Sugerimos a data de ${dataFormatada}.`, 'atendente');
                        
                        const botoesAcao = document.createElement('div');
                        botoesAcao.classList.add('botoes-acao');
                        const botaoSugerir = document.createElement('button');
                        botaoSugerir.classList.add('botao-acao');
                        botaoSugerir.textContent = 'Usar data sugerida';
                        botaoSugerir.addEventListener('click', () => {
                            validarData(proximaDisponivel);
                        });
                        botoesAcao.appendChild(botaoSugerir);
                        
                        const botaoOutraData = document.createElement('button');
                        botaoOutraData.classList.add('botao-acao');
                        botaoOutraData.textContent = 'Escolher outra data';
                        botaoOutraData.addEventListener('click', () => {
                            iniciarChatbot();
                        });
                        botoesAcao.appendChild(botaoOutraData);

                        secaoEntrada.innerHTML = '';
                        secaoEntrada.appendChild(botoesAcao);
                        
                    } else {
                        dadosReserva.data = dataEscolhida;
                        avancarParaEtapa2();
                    }
                }, 1500);
            }
            
            // Avança para a Etapa 2 (nome e telefone)
            function avancarParaEtapa2() {
                adicionarMensagem('Ótimo! Data disponível. Agora, por favor, nos informe seu nome e telefone para contato. ', 'atendente');
                
                secaoEntrada.innerHTML = ''; // Limpa a entrada
                estadoChatbot = 'contato';

                const inputNome = document.createElement('input');
                inputNome.type = 'text';
                inputNome.placeholder = 'Seu nome completo';
                inputNome.classList.add('campo-texto');
                inputNome.required = true;
                
                const inputTelefone = document.createElement('input');
                inputTelefone.type = 'tel';
                inputTelefone.placeholder = '(99) 99999-9999';
                inputTelefone.classList.add('campo-texto');
                inputTelefone.required = true;
                inputTelefone.maxLength = 15;
                
                const botaoEnviar = document.createElement('button');
                botaoEnviar.classList.add('botao-primario');
                botaoEnviar.textContent = 'Enviar';
                botaoEnviar.style.width = '100%';
                
                const mensagemErro = document.createElement('p');
                mensagemErro.classList.add('mensagem-estado');
                
                secaoEntrada.appendChild(inputNome);
                secaoEntrada.appendChild(inputTelefone);
                secaoEntrada.appendChild(botaoEnviar);
                secaoEntrada.appendChild(mensagemErro);
                
                inputNome.focus();
                
                // Máscara de telefone
                inputTelefone.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    let maskedValue = '';
                    if (value.length > 0) {
                        maskedValue += `(${value.substring(0, 2)}`;
                    }
                    if (value.length > 2) {
                        maskedValue += `) ${value.substring(2, 7)}`;
                    }
                    if (value.length > 7) {
                        maskedValue += `-${value.substring(7, 11)}`;
                    }
                    e.target.value = maskedValue;
                });
                
                botaoEnviar.addEventListener('click', () => {
                    const nome = inputNome.value.trim();
                    const telefone = inputTelefone.value.trim();
                    if (!nome || telefone.length < 14) { // 14 é o comprimento mínimo da máscara (XX) XXXXX-XXXX
                        mensagemErro.textContent = 'Por favor, preencha todos os campos corretamente.';
                        return;
                    }
                    
                    dadosReserva.nome = nome;
                    dadosReserva.telefone = telefone;
                    
                    adicionarMensagem(`Nome: ${nome}, Telefone: ${telefone}`, 'usuario');
                    avancarParaEtapa3();
                });
            }
            
            // Avança para a Etapa 3 (resumo e confirmação)
            function avancarParaEtapa3() {
                clearTimeout(timeoutDigitar);
                estadoChatbot = 'resumo';
                secaoEntrada.innerHTML = '';

                const dataFormatada = formatarDataBR(dadosReserva.data);
                
                const mensagemResumo = `Sua pré-reserva está pronta!
                <br><b>Data:</b> ${dataFormatada}
                <br><b>Nome:</b> ${dadosReserva.nome}
                <br><b>Telefone:</b> ${dadosReserva.telefone}`;
                
                const balaoDigitando = simularDigitando();

                timeoutDigitar = setTimeout(() => {
                    balaoDigitando.remove();
                    adicionarMensagem('Perfeito! Aqui está o resumo da sua pré-reserva. Confirme para prosseguirmos.', 'atendente');
                    adicionarMensagem(mensagemResumo, 'atendente');
                    
                    const botoesAcao = document.createElement('div');
                    botoesAcao.classList.add('botoes-acao');
                    
                    const botaoConfirmar = document.createElement('button');
                    botaoConfirmar.classList.add('botao-acao');
                    botaoConfirmar.textContent = 'Confirmar pré-reserva';
                    botaoConfirmar.addEventListener('click', finalizarReserva);
                    
                    const botaoEditar = document.createElement('button');
                    botaoEditar.classList.add('botao-acao');
                    botaoEditar.textContent = 'Editar';
                    botaoEditar.addEventListener('click', () => {
                        iniciarChatbot(); // Volta para o início para editar
                    });
                    
                    botoesAcao.appendChild(botaoConfirmar);
                    botoesAcao.appendChild(botaoEditar);
                    secaoEntrada.appendChild(botoesAcao);
                }, 1500);
            }
            
            // Finaliza a reserva, simula salvamento e exibe toast
            function finalizarReserva() {
                dadosReserva.status = 'pre-reservado';
                const reservas = JSON.parse(localStorage.getItem('reservasChacara')) || [];
                reservas.push(dadosReserva);
                localStorage.setItem('reservasChacara', JSON.stringify(reservas));
                
                clearTimeout(timeoutDigitar);
                
                adicionarMensagem('Sua pré-reserva foi registrada com sucesso! Entraremos em contato em breve para confirmar os detalhes. Obrigado!', 'atendente');
                
                secaoEntrada.innerHTML = '';
                
                setTimeout(() => {
                    janelaChatbot.classList.remove('ativo');
                    mostrarToast('Sua pré-reserva foi registrada! Entraremos em contato.', 'sucesso');
                }, 3000);
            }
            
            // ========================================
            // EVENTOS E OUVIDORES
            // ========================================

            // Abertura do modal do chatbot
            botoesReservar.forEach(botao => {
                botao.addEventListener('click', () => {
                    janelaChatbot.classList.add('ativo');
                    iniciarChatbot();
                });
            });

            // Fechamento do modal do chatbot
            botaoFecharChatbot.addEventListener('click', () => {
                janelaChatbot.classList.remove('ativo');
                clearTimeout(timeoutDigitar);
            });
            
            // Fechamento do modal com tecla ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && janelaChatbot.classList.contains('ativo')) {
                    janelaChatbot.classList.remove('ativo');
                    clearTimeout(timeoutDigitar);
                }
            });

            // Fechamento do modal clicando fora
            janelaChatbot.addEventListener('click', (e) => {
                if (e.target === janelaChatbot) {
                    janelaChatbot.classList.remove('ativo');
                    clearTimeout(timeoutDigitar);
                }
            });

            // Menu de hambúrguer para mobile
            menuHamburguer.addEventListener('click', () => {
                menuNavegacao.classList.toggle('ativo');
            });
            
            // Fecha o menu hamburguer ao clicar em um link
            document.querySelectorAll('.menu-navegacao a').forEach(link => {
                link.addEventListener('click', () => {
                    if(menuNavegacao.classList.contains('ativo')) {
                        menuNavegacao.classList.remove('ativo');
                    }
                });
            });

        });