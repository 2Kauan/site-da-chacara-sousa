
        document.addEventListener('DOMContentLoaded', () => {

            // ========================================
            // VARIÁVEIS E CONSTANTES GLOBAIS
            // ========================================
          
            const menuHamburguer = document.querySelector('.botao-menu-hamburguer');
            const menuNavegacao = document.querySelector('.menu-navegacao');

        

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