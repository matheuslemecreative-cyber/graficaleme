// ==========================================
// 1. CONTROLE DO MENU HAMBÚRGUER (MOBILE)
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const navMenu = document.getElementById('navMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (menuToggle && menuClose && navMenu && sidebarOverlay) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.add('open');
        sidebarOverlay.classList.add('active');
    });

    const fecharMenu = () => {
        navMenu.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    };

    menuClose.addEventListener('click', fecharMenu);
    sidebarOverlay.addEventListener('click', fecharMenu);
}

// ==========================================
// 2. CONTROLE DO BANNER PRINCIPAL (AUTO + MULTI-SLIDE)
// ==========================================
let slideIndex = 0;
const slides = document.querySelectorAll('.banner-item');
const dots = document.querySelectorAll('.dot');
const carouselContainer = document.querySelector('.carousel-container');
let carouselTimer;

function showSlides(index) {
    if (slides.length === 0) return;
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    if(dots.length > 0) dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function nextSlide() { slideIndex++; showSlides(slideIndex); }
function startTimer() { clearInterval(carouselTimer); carouselTimer = setInterval(nextSlide, 4000); }
function currentSlide(index) { slideIndex = index; showSlides(slideIndex); startTimer(); }

if (carouselContainer) {
    let touchStartX = 0; let touchEndX = 0;
    carouselContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carouselContainer.addEventListener('touchend', (e) => { 
        touchEndX = e.changedTouches[0].screenX; 
        if (touchStartX - touchEndX > 50) { nextSlide(); } 
        if (touchEndX - touchStartX > 50) { slideIndex--; showSlides(slideIndex); } 
        startTimer(); 
    }, { passive: true });
    showSlides(slideIndex);
    startTimer();
}

// ==========================================
// 3. CATALOGO COMPLETO DE PRODUTOS (DATABASE VIA JS) - ATUALIZADO COM MAIS VENDIDOS
// ==========================================
const produtosDB = {
    // ---- PRODUTOS ATIVOS EM MAIS VENDIDOS ----
    "papel-antigordura": { title: "Papel Antigordura Premium", isBestSeller: true, img: "papel-antigordura.jpg", desc: "Papel barreira antigordura ideal para embrulhar hambúrgueres, sanduíches, doces e alimentos fritos. Mantém a apresentação do produto impecável, retém o óleo e garante higiene total para o seu delivery ou balcão." },
    "apostilas": { title: "Apostilas Educacionais e Corporativas", isBestSeller: true, img: "apostilas.jpg", desc: "Apostilas e manuais de treinamento com impressão nítida frente e verso. Opções de capas coloridas em alta gramatura, fechamento em espiral ou wire-o e folhas internas ideais para leitura e anotações manuais." },
    "papel-seda": { title: "Papel Seda para Presente", isBestSeller: true, img: "papel-seda.jpg", desc: "Papel seda personalizado com a sua logomarca repetida (padrão rapport). Perfeito para envolver roupas, calçados, perfumes e presentes dentro de sacolas ou caixas, agregando uma experiência de unboxing elegante e profissional." },
	"panfletos": { title: "Panfletos Promocionais", isBestSeller: true, img: "panfletos.jpg", desc: "Panfletos produzidos em papel couchê brilho ou fosco (90g a 150g). Impressão offset de altíssima definição, ideal para panfletagens massivas, divulgação de ofertas, eventos e promoções comerciais de grande impacto visual." },
    "adesivos-vinil": { title: "Adesivos em Vinil", isBestSeller: true, img: "adesivos-vinil.jpg", desc: "Adesivos em Vinil impermeável (Branco ou Fosco) com meio-corte digital em qualquer formato. Resistentes à água, rasgos e variações de temperatura. Excelentes para rotulagem de produtos, potes, congelados e brindes." },
    "adesivos-papel": { title: "Adesivos em Papel", isBestSeller: true, img: "adesivos-papel.jpg", desc: "Adesivos em papel couchê autocolante com excelente aderência e brilho. Solução muito econômica para identificação de embalagens de delivery, sacolas plásticas ou de papel, caixas de papelão e marcação de preços." },
    "cartao-visita": { title: "Cartão de Visita", isBestSeller: true, img: "cartao-visita.jpg", desc: "Cartões de visita com ampla gama de acabamentos: Couchê 300g com Verniz Total, Laminação Fosca (BOPP) com Verniz Localizado (Scodix), Cantos Arredondados ou Hot Stamping. Máxima sofisticação para sua apresentação comercial." },
    "agendas": { title: "Agendas Personalizadas", isBestSeller: true, img: "agendas.jpg", desc: "Agendas institucionais com capa dura personalizada, laminação protetora (BOPP fosco ou brilho) e acabamento em wire-o metálico robusto. Ideais para brindes corporativos de fim de ano ou organization interna com a cara da sua marca." },
    
    // ---- OUTROS PRODUTOS DO CATÁLOGO ----
    "flyers": { title: "Flyers Corporativos", isBestSeller: false, img: "flyers.jpg", desc: "Flyers institucionais desenvolvidos em papéis de gramaturas superiores (150g ou 250g) com opção de verniz total. Formato sofisticado para apresentações de serviços refinados, cardápios resumidos e lançamentos imobiliários." },
    "folhetos": { title: "Folhetos Informativos", isBestSeller: false, img: "folhetos.jpg", desc: "Folhetos com opções de dobras (2 ou 3 dobras / sanfona) para melhor distribuição do conteúdo técnico ou institucional. Excelente legibilidade para guias de produtos, manuais práticos e cartilhas explicativas." },
    "papel-timbrado": { title: "Papel Timbrado Oficial", isBestSeller: false, img: "papel-timbrado.jpg", desc: "Papel Sulfite/Offset 75g ou 90g timbrado com alta fidelidade de cor para aceitar impressões subsequentes a laser ou jato de tinta. Padronização indispensável para contratos, orçamentos, receitas e documentos oficiais." },
    "pasta-orelhas": { title: "Pastas com Orelha", isBestSeller: false, img: "pasta-orelhas.jpg", desc: "Pastas institucionais em papel Supremo ou Couchê 300g com orelhas internas vincadas para grampear ou encaixar folhas soltas. Excelente apresentação para propostas comerciais, lâminas de produtos e entrega de exames." },
    "pasta-bolsa": { title: "Pastas com Bolsa Personalizada", isBestSeller: false, img: "pasta-bolsa.jpg", desc: "Pastas executivas com bolsa interna acoplada (branca ou totalmente personalizada). Ideal para transportar grandes volumes de documentos, contratos e relatórios com segurança e alto profissionalismo corporativo." },
    "marca-paginas": { title: "Marcadores de Página", isBestSeller: false, img: "marca-paginas.jpg", desc: "Marcadores de páginas em papel firme 300g com opções de cantos arredondados, furo superior ou aplicação de verniz. Excelente brinde promocional para livrarias, editoras, escolas, igrejas e eventos culturais." },
    "mobile": { title: "Móbiles Promocionais", isBestSeller: false, img: "mobile.jpg", desc: "Móbiles para teto ou gôndola impressos em papel cartão rígido e cortados em formatos especiais. Acompanham fio de nylon para instalação dinâmica. Atraia a atenção do cliente no ponto de venda (PDV)." },
    "tags-hotel": { title: "Tags Não Perturbe (Hotel)", isBestSeller: false, img: "tags-hotel.jpg", desc: "Tags suspensas para maçaneta com corte especial padrão para fechaduras eletrônicas ou convencionais. Alta durabilidade, ideal para sinalização de quartos em hotéis, pousadas, resorts e escritórios privados." },
    "calendarios": { title: "Calendários de Mesa e Parede", isBestSeller: false, img: "calendarios.jpg", desc: "Calendários de mesa com base rígida (Triplex) e wire-o ou calendários de parede com folhas destacáveis. Exposição diária garantida da sua logomarca na visão do seu cliente durante os 365 dias do ano." },
    "cadernos": { title: "Cadernos Corporativos", isBestSeller: false, img: "cadernos.jpg", desc: "Cadernos com capa dura customizada e folhas internas pautadas com a sua marca d'água. Excelente opção para kits de integração (onboarding) de funcionários ou material de apoio em workshops." },
    "cartao-vacina-pet": { title: "Cartões de Vacinação Pet", isBestSeller: false, img: "cartao-vacina-pet.jpg", desc: "Livretos ou cartões dobráveis impressos em papel offset (que permite escrita perfeita a caneta) para controle rigoroso de vacinas e consultas. Item indispensável para clínicas veterinárias, petshops e criadores." },
    "cartazes": { title: "Cartazes e Posters", isBestSeller: false, img: "cartazes.jpg", desc: "Cartazes em formatos ampliados (A3, A2 ou sob medida) impressos em papel de alta vivacidade de cor. Perfeitos para fixação em murais informativos, fachadas internas, avisos de condomínio e eventos de varejo." },
    "catalogo": { title: "Catálogos de Produtos", isBestSeller: false, img: "catalogo.jpg", desc: "Catálogos completos com acabamento em dobra central e grampo canoa ou lombada quadrada. Diagramação e impressão profissional para expor portfólios imobiliários, lines de produtos industriais ou moda." },
    "revista": { title: "Revistas Editoriais", isBestSeller: false, img: "revista.jpg", desc: "Publicações periódicas com capas em gramaturas pesadas e miolo leve em couchê fosco ou brilho. Perfeitas para informativos de sindicatos, revistas de bairros, relatórios anuais de gestão e publicações independentes." },
    "certificados": { title: "Certificados e Diplomas", isBestSeller: false, img: "certificados.jpg", desc: "Impressos em papéis nobres de alta textura (como Vergê, Opalina ou Texturizados) com acabamentos que garantem autenticidade. Solução oficial para cursos livres, formaturas, palestras e premiações corporativas." },
    "convite-casamento": { title: "Convites de Casamento", isBestSeller: false, img: "convite-casamento.jpg", desc: "Convites de casamento confeccionados com papéis especiais importados, acabamento em relevo seco, hot stamping, corte a laser ou fechamento com cordões e lacres de cera. Design afetivo, fino e personalizado." },
    "crachas": { title: "Crachás de Identificação", isBestSeller: false, img: "crachas.jpg", desc: "Crachás em PVC rígido de alta durabilidade com impressão direta antifraude que não desbota. Ideais para controle de acesso físico, identificação de funcionários em lojas, indústrias, portarias e eventos." },
    "credencial": { title: "Credenciais para Eventos", isBestSeller: false, img: "credencial.jpg", desc: "Credenciais em formato expandido com furo ovoide para cordão. Impressas em papel rígido ou PVC flexível. Solução perfeita para controle de áreas VIP, palestrantes, staff e participantes em grandes congressos." },
    "envelopes": { title: "Envelopes Timbrados", isBestSeller: false, img: "envelopes.jpg", desc: "Envelopes comerciais em diversos formatos (Ofício, Saco, Meio Saco) personalizados com a identidade da sua empresa. Segurança e seriedade no envio de faturas, correspondências confidenciais e propostas." },
    "filipetas": { title: "Filipetas e Vouchers", isBestSeller: false, img: "filipetas.jpg", desc: "Filipetas em formatos alongados (tipo canhoto), ideais para ingressos de baladas, cupons de sorteio, vouchers promocionais e bilheterias em geral. Opção de numeração sequencial e canhoto destacável." },
    "carnes": { title: "Carnês de Pagamento", isBestSeller: false, img: "carnes.jpg", desc: "Talões de carnê impressos com capa protetora e folhas internas serrilhadas para fácil destaque. Ideal para controle de crediários próprios, escolas, mensalidades de cursos, consórcios e cobranças recorrentes." },
    "cardapio": { title: "Cardápios com Laminação BOPP/Plastificados", isBestSeller: false, img: "cardapio.jpg", desc: "Cardápios robustos com laminação protetora BOPP fosca (anti-gordura e marcas de dedo) ou totalmente plastificados com bordas seladas à prova d'água. Higiênicos, duráveis e ideais para a rotina intensa de restaurantes." },
    "caixas-salgados": { title: "Caixas para Salgados e Doces", isBestSeller: false, img: "caixas-salgados.jpg", desc: "Caixas em papelão ondulado ou papel cartão acoplado rígido, próprio para contato direto com alimentos. Retém o calor dos salgados, doces, pizzas e salgadinhos de festa de forma segura e higiênica." },
    "sacolas": { title: "Sacolas de Papel e Plásticas", isBestSeller: false, img: "sacolas.jpg", desc: "Sacolas de papel offset/kraft ou plásticas de alta densidade personalizadas com a sua marca. Fortaleça a identidade visual do seu comércio, ótica ou loja de roupas no momento da entrega." },
    "sacos-lanche": { title: "Sacos para Lanche (Delivery)", isBestSeller: false, img: "sacos-lanche.jpg", desc: "Sacos de papel antigordura (Kraft ou Monolúcido) ideais para hambúrgueres, batatas fritas e salgados. Embalagem respirável que mantém a crocância do alimento intacta até a casa do cliente via delivery." },
    "tapete-carro": { title: "Tapetes de Papel para Lava-Rápido", isBestSeller: false, img: "tapete-carro.jpg", desc: "Tapetes de proteção em papel jornal ou offset de alta absorção para assoalhos automotivos. Demonstre capricho, higiene e profissionalismo na entrega de veículos em oficinas, funilarias e lava-rápidos." },
    "adesivos-metalizados": { title: "Adesivos Prata e Ouro", isBestSeller: false, img: "adesivos-metalizados.jpg", desc: "Adesivos confeccionados em vinil metalizado premium (efeito espelhado ouro ou prata escovado). Destaque de luxo imediato para selos de garantia, marcas de cosméticos, casamentos e produtos artesanais finos." },
    "adesivos-casca-ovo": { title: "Adesivos Casca de Ovo (Destrutíveis)", isBestSeller: false, img: "adesivos-casca-ovo.jpg", desc: "Adesivos ultra-frágeis de segurança. Ao tentar ser removido, o material se quebra em micro pedaços (como uma casca de ovo), inviabilizando a colagem em outro local. Perfeito para lacres de garantia eletrônica." },
    "adesivos-transparentes": { title: "Adesivos Transparentes", isBestSeller: false, img: "adesivos-transparentes.jpg", desc: "Adesivos em vinil cristal totalmente transparente com opção de calço branco sob a impressão. Ideal para aplicação em vitrines, vidros de veículos, frascos de acrílico ou superfícies onde o fundo deve aparecer." },
    "planner": { title: "Planners Personalizados", isBestSeller: false, img: "planner.jpg", desc: "Planners semanais, mensais ou anuais com layouts focados em produtividade. Capa dura robusta, elástico de fechamento e miolo encorpado que não vaza a tinta da caneta. O brinde mais desejado por profissionais." },
    "banners": { title: "Banners em Lona e Papel", isBestSeller: false, img: "banners.jpg", desc: "Banners impressos em lona fosca/brilho de alta gramatura ou papel foto premium. Acabamento completo com bastão de madeira, ponteiras plásticas e cordão de sustentação. Perfeitos para fachadas, palestras e festas." },
    "faixas-lona": { title: "Faixas de Lona", isBestSeller: false, img: "faixas-lona.jpg", desc: "Faixas horizontais de grande extensão em lona resistente com acabamento em bainha e ilhós metálicos para amarração firme. Excelente resistência contra sol e chuva para anúncios de imóveis e inaugurações." },
    "tripe-banner": { title: "Tripés Porta-Banner", isBestSeller: false, img: "tripe-banner.jpg", desc: "Pedestais e tripés reguláveis em alumínio ou ferro com pintura eletrostática preta. Sistema de garra prático para montagem e desmontagem rápida de banners informativos em stands, feiras e recepções." },
    "roll-up": { title: "Roll-Up (Kit Estrutura + Lona)", isBestSeller: false, img: "roll-up.jpg", desc: "Estrutura retrátil em alumínio anodizado que recolhe o banner automaticamente para dentro da base protetora. Acompanha bolsa de transporte. O display mais prático, elegante e imponente para eventos executivos." },
    "blocos-capadura": { title: "Blocos de Anotação Capa Dura", isBestSeller: false, img: "blocos-capadura.jpg", desc: "Blocos compactos de rascunho com acabamento luxuoso de capa dura laminada. Folhas internas brancas ou personalizadas em papel offset encorpado, garantindo elegância nas suas anotações rápidas de reuniões." },
    "blocos-colados": { title: "Blocos Blocado / Colados", isBestSeller: false, img: "blocos-colados.jpg", desc: "Blocos de rascunho tradicionais unidos por cola vermelha ou transparente no topo, facilitando o destaque limpo de folhas individuais. Solução muito econômica e funcional para uso diário em escritórios e balcões." },
    "blocos-espiral": { title: "Blocos com Acabamento Espiral", isBestSeller: false, img: "blocos-espiral.jpg", desc: "Blocos práticos encadernados com espiral plástico flexível de alta resistência. Facilidade total para virar as páginas em 360 graus, perfeito para anotações em movimento de técnicos, pesquisadores ou estudantes." },
    "blocos-wireo": { title: "Blocos com Acabamento Wire-O", isBestSeller: false, img: "blocos-wireo.jpg", desc: "Blocos de notas executivos encadernados com garra metálica dupla de passo duplo (Wire-O). Alinha sofisticação com durabilidade industrial extrema, agregando altíssimo valor percebido ao brinde institucional." },
    "comandas": { title: "Comandas para Restaurantes", isBestSeller: false, img: "comandas.jpg", desc: "Comandas em papel autocopiativo (vias separadas por cor) ou papel offset firme com numeração controlada em código de barras. Organização à prova de falhas para garçons, bares, lanchonetes e pizzarias." },
    "receituarios": { title: "Receituários Médicos", isBestSeller: false, img: "receituarios.jpg", desc: "Blocos de receituário impressos em papel offset alvíssimo que aceita carimbos e escrita fluida sem borrar. Formatação técnica rigorosa para médicos, dentistas, veterinários, psicólogos e clínicas integradas." },
    "taloes": { title: "Talões de Pedido e Recibo", isBestSeller: false, img: "taloes.jpg", desc: "Talões gerais de ordens de serviço, orçamentos, recibos e notas de entrega. Acabamento blocado com numeração sequencial impressa em vermelho e serrilha de destaque preciso para controle contábil manual." }
};

// ==========================================
// 4. INJEÇÃO DOS CARDS INTELIGENTES NA TELA
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const gridMaisVendidos = document.getElementById('cards-mais-vendidos');
    const gridTodosProdutos = document.getElementById('cards-todos-produtos');

    if (gridMaisVendidos && gridTodosProdutos) {
        let htmlMaisVendidos = "";
        let htmlTodosProdutos = "";

        for (const id in produtosDB) {
            const produto = produtosDB[id];
            
            const cardHTML = `
                <div class="product-card" onclick="window.location.href='produto.html?id=${id}'">
                    <div class="product-image">
                        <img src="${produto.img}" alt="${produto.title}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${produto.title}</h3>
                        <p>${produto.desc}</p>
                        <span class="product-price">Sob Consulta</span>
                    </div>
                </div>
            `;

            if (produto.isBestSeller) {
                htmlMaisVendidos += cardHTML;
            }
            htmlTodosProdutos += cardHTML;
        }

        gridMaisVendidos.innerHTML = htmlMaisVendidos;
        gridTodosProdutos.innerHTML = htmlTodosProdutos;
        
        configurarBusca();
        configurarSetasHome(); // Ativa as setinhas da página inicial
    }

    // ==========================================
    // 5. CARREGAMENTO DA PÁGINA INTERNA (`produto.html`)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    if (document.getElementById('product-title') && produtoId) {
        const produtoAtivo = produtosDB[produtoId];

        if (produtoAtivo) {
            document.title = `Gráfica ${produtoAtivo.title}`;
            document.getElementById('product-title').innerText = produtoAtivo.title;
            document.getElementById('product-large-img').src = produtoAtivo.img;
            document.getElementById('product-large-img').alt = produtoAtivo.title;
            document.getElementById('product-desc').innerText = produtoAtivo.desc;

            const numeroGrafica = "5514988378102";
            const textoMensagem = `Olá! Estava navegando no catálogo do site e gostaria de solicitar uma cotação para o produto: ${produtoAtivo.title}.`;
            document.getElementById('btn-quote-whatsapp').href = `https://wa.me/${numeroGrafica}?text=${encodeURIComponent(textoMensagem)}`;
        } else {
            document.getElementById('product-title').innerText = "Produto não localizado";
        }
    }
});

// Sistema complementar de busca dinâmica por texto
function configurarBusca() {
    const inputBusca = document.getElementById('inputBusca');
    const btnBusca = document.getElementById('btnBusca');

    if (inputBusca) {
        const filtrar = () => {
            const termo = inputBusca.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.product-card');
            
            cards.forEach(card => {
                const titulo = card.querySelector('h3').innerText.toLowerCase();
                if (titulo.includes(termo)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        };

        inputBusca.addEventListener('input', filtrar);
        if(btnBusca) btnBusca.addEventListener('click', filtrar);
    }
}

// Função para filtrar os produtos na Home pelas categorias do cabeçalho
function filtrarPorCategoria(categoria) {
    if (window.event) window.event.preventDefault();
    
    const cards = document.querySelectorAll('#cards-todos-produtos .product-card');
    const secaoTodos = document.getElementById('todos-produtos');
    
    if (secaoTodos) {
        secaoTodos.scrollIntoView({ behavior: 'smooth' });
    }

    cards.forEach(card => {
        const titulo = card.querySelector('h3').innerText.toLowerCase();
        
        if (categoria === 'todos') {
            card.style.display = "flex";
        } else if (categoria === 'adesivos' && titulo.includes('adesivo')) {
            card.style.display = "flex";
        } else if (categoria === 'agendas' && (titulo.includes('agenda') || titulo.includes('planner'))) {
            card.style.display = "flex";
        } else if (categoria === 'brindes' && (titulo.includes('chaveiro') || titulo.includes('caneta') || titulo.includes('brinde') || titulo.includes('marca página') || titulo.includes('calendário'))) {
            card.style.display = "flex";
        } else if (categoria === 'cadernos' && (titulo.includes('caderno') || titulo.includes('bloco') || titulo.includes('apostila'))) {
            card.style.display = "flex";
        } else if (categoria === 'caixas' && (titulo.includes('caixa') || titulo.includes('cartucho'))) {
            card.style.display = "flex";
        } else if (categoria === 'cartao' && titulo.includes('cartão')) {
            card.style.display = "flex";
        } else if (categoria === 'panfletos' && (titulo.includes('panfleto') || titulo.includes('flyer') || titulo.includes('folheto') || titulo.includes('cartaz'))) {
            card.style.display = "flex";
        } else if (categoria === 'sacolas' && (titulo.includes('sacola') || titulo.includes('saco') || titulo.includes('seda') || titulo.includes('antigordura'))) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// =======================================================
// CONTROLE DAS SETINHAS DE ROLAGEM NA HOME (CORRIGIDO)
// =======================================================
function configurarSetasHome() {
    const maisVendidosGrid = document.getElementById('cards-mais-vendidos');
    const todosProdutosGrid = document.getElementById('cards-todos-produtos');
    
    // Captura as setas de "Mais Vendidos" (Adicione esses IDs nas respectivas setas no seu HTML da Home)
    const btnMaisVendidosPrev = document.getElementById('maisVendidosPrev');
    const btnMaisVendidosNext = document.getElementById('maisVendidosNext');

    // Captura as setas de "Todos os Produtos" (Adicione esses IDs nas respectivas setas no seu HTML da Home)
    const btnTodosPrev = document.getElementById('todosProdutosPrev');
    const btnTodosNext = document.getElementById('todosProdutosNext');

    // Configura cliques para a fileira de Mais Vendidos
    if (maisVendidosGrid) {
        if (btnMaisVendidosNext) {
            btnMaisVendidosNext.addEventListener('click', () => {
                const cardWidth = maisVendidosGrid.querySelector('.product-card')?.offsetWidth || 280;
                maisVendidosGrid.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
            });
        }
        if (btnMaisVendidosPrev) {
            btnMaisVendidosPrev.addEventListener('click', () => {
                const cardWidth = maisVendidosGrid.querySelector('.product-card')?.offsetWidth || 280;
                maisVendidosGrid.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
            });
        }
    }

    // Configura cliques para a fileira de Todos os Produtos
    if (todosProdutosGrid) {
        if (btnTodosNext) {
            btnTodosNext.addEventListener('click', () => {
                const cardWidth = todosProdutosGrid.querySelector('.product-card')?.offsetWidth || 280;
                todosProdutosGrid.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
            });
        }
        if (btnTodosPrev) {
            btnTodosPrev.addEventListener('click', () => {
                const cardWidth = todosProdutosGrid.querySelector('.product-card')?.offsetWidth || 280;
                todosProdutosGrid.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
            });
        }
    }
}

// =======================================================
// CONTROLE DA PÁGINA DE CATEGORIAS INTERNA 
// =======================================================
window.addEventListener('DOMContentLoaded', () => {
    const gridCategoriaInterna = document.getElementById('cards-categoria-interna');
    const tituloCategoria = document.getElementById('categoria-titulo');
    
    const urlParams = new URLSearchParams(window.location.search);
    const catAtiva = urlParams.get('cat');

    if (gridCategoriaInterna && tituloCategoria && catAtiva) {
        let htmlFiltrado = "";
        
        const mapeamentoTitulos = {
            'adesivos': 'Adesivos e Lacres',
            'agendas': 'Agendas e Planners',
            'brindes': 'Brindes em Geral',
            'cadernos': 'Cadernos e Blocos',
            'caixas': 'Caixas e Cartuchos',
            'cartao': 'Cartões de Visita e Crachás',
            'panfletos': 'Panfletos, Flyers e Folhetos',
            'sacolas': 'Sacolas e Sacos Delivery',
            'todos': 'Todos os Produtos'
        };

        const nomeVisualCategoria = mapeamentoTitulos[catAtiva] || "Produtos Cadastrados";
        tituloCategoria.innerText = nomeVisualCategoria;
        document.title = `Gráfica - ${nomeVisualCategoria}`;

        for (const id in produtosDB) {
            const produto = produtosDB[id];
            const tituloItem = produto.title.toLowerCase();
            let pertence = false;

            if (catAtiva === 'todos') {
                pertence = true;
            } 
            else if (catAtiva === 'adesivos' && tituloItem.includes('adesivo')) pertence = true;
            else if (catAtiva === 'agendas' && (tituloItem.includes('agenda') || tituloItem.includes('planner'))) pertence = true;
            else if (catAtiva === 'brindes' && (tituloItem.includes('chaveiro') || tituloItem.includes('caneta') || tituloItem.includes('brinde') || tituloItem.includes('marca página') || tituloItem.includes('calendário'))) pertence = true;
            else if (catAtiva === 'cadernos' && (tituloItem.includes('caderno') || tituloItem.includes('bloco') || tituloItem.includes('apostila'))) pertence = true;
            else if (catAtiva === 'caixas' && (tituloItem.includes('caixa') || tituloItem.includes('cartucho'))) pertence = true;
            else if (catAtiva === 'cartao' && (tituloItem.includes('cartão') || tituloItem.includes('crachá') || tituloItem.includes('credencial'))) pertence = true;
            else if (catAtiva === 'panfletos' && (tituloItem.includes('panfleto') || tituloItem.includes('flyer') || tituloItem.includes('folheto') || tituloItem.includes('cartaz') || tituloItem.includes('papel timbrado') || tituloItem.includes('pasta'))) pertence = true;
            else if (catAtiva === 'sacolas' && (tituloItem.includes('sacola') || tituloItem.includes('saco') || tituloItem.includes('seda') || tituloItem.includes('antigordura'))) pertence = true;

            if (pertence) {
                htmlFiltrado += `
                    <div class="product-card" onclick="window.location.href='produto.html?id=${id}'">
                        <div class="product-image">
                            <img src="${produto.img}" alt="${produto.title}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3>${produto.title}</h3>
                            <p>${produto.desc}</p>
                            <span class="product-price">Sob Consulta</span>
                        </div>
                    </div>
                `;
            }
        }

        if (htmlFiltrado !== "") {
            gridCategoriaInterna.innerHTML = htmlFiltrado;
        } else {
            gridCategoriaInterna.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:#666; padding: 40px 0;'>Nenhum item encontrado nesta categoria no momento.</p>";
        }
    }
});

// =======================================================
// SEÇÃO DINÂMICA DE "MAIS PRODUTOS" (RECOMENDADOS NA PAG INTERNA)
// =======================================================
window.addEventListener('DOMContentLoaded', () => {
    const trilhoRecomendados = document.getElementById('cards-mais-produtos');
    const btnPrev = document.getElementById('recomendadosPrev');
    const btnNext = document.getElementById('recomendadosNext');

    if (trilhoRecomendados) {
        const urlParams = new URLSearchParams(window.location.search);
        const produtoAtualId = urlParams.get('id');

        let htmlRecomendados = "";
        let contador = 0;

        for (const id in produtosDB) {
            if (id === produtoAtualId) continue;

            const produto = produtosDB[id];
            
            htmlRecomendados += `
                <div class="product-card" onclick="window.location.href='produto.html?id=${id}'">
                    <div class="product-image">
                        <img src="${produto.img}" alt="${produto.title}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${produto.title}</h3>
                        <p>${produto.desc}</p>
                        <span class="product-price">Sob Consulta</span>
                    </div>
                </div>
            `;
            
            contador++;
            if (contador >= 8) break;
        }

        trilhoRecomendados.innerHTML = htmlRecomendados;

        if (btnPrev && btnNext) {
            btnNext.addEventListener('click', () => {
                const cardWidth = trilhoRecomendados.querySelector('.product-card')?.offsetWidth || 280;
                trilhoRecomendados.scrollBy({ left: (cardWidth + 20) * 3, behavior: 'smooth' });
            });

            btnPrev.addEventListener('click', () => {
                const cardWidth = trilhoRecomendados.querySelector('.product-card')?.offsetWidth || 280;
                trilhoRecomendados.scrollBy({ left: -(cardWidth + 20) * 3, behavior: 'smooth' });
            });
        }
    }
});

// Função para as setas no HTML executarem o salto de 3 em 3 cards
function scrollProducts(gridId, direcao) {
    const grid = document.getElementById(gridId);
    if (grid) {
        const firstCard = grid.querySelector('.product-card');
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth; 
            const gap = parseInt(window.getComputedStyle(grid).gap) || 20; 
            const quantidadeDeCards = 3;
            const scrollAmount = (cardWidth + gap) * quantidadeDeCards;
            
            grid.scrollBy({ 
                left: scrollAmount * direcao, 
                behavior: 'smooth' 
            });
        }
    }
}

// =======================================================
// MECANISMO DE BUSCA INTELIGENTE (IGNORA ACENTOS)
// =======================================================

// Função auxiliar para remover acentos e espaços extras das strings
function removerAcentos(texto) {
    return texto
        .normalize("NFD") // Desmembra os acentos das letras (ex: 'ã' vira 'a' + '~')
        .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos, deixando apenas as letras puras
}

// 1. Função principal disparada pelo botão ou pelo Enter
function executarBusca(e) {
    if (e) e.preventDefault(); 

    const inputBusca = document.getElementById('inputBusca');
    if (!inputBusca) return;

    const termo = inputBusca.value.trim().toLowerCase();
    
    if (termo === "") return;

    const novaUrl = `categoria.html?busca=${encodeURIComponent(termo)}`;

    // Se já estiver na página de categorias, muda a URL e re-filtra sem recarregar tudo
    if (window.location.pathname.includes('categoria.html')) {
        window.history.pushState({}, '', novaUrl);
        inicializarPaginaCategoria();
    } else {
        window.location.href = novaUrl;
    }
}

// 2. Configura os gatilhos de clique e enter toda vez que a página inicia
function vincularEventosBusca() {
    const btnBusca = document.getElementById('btnBusca');
    const inputBusca = document.getElementById('inputBusca');

    if (btnBusca) {
        btnBusca.addEventListener('click', executarBusca);
    }

    if (inputBusca) {
        inputBusca.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executarBusca(e);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', vincularEventosBusca);

// 3. Função que lê a URL, remove os acentos e renderiza os cards filtrados na tela
function inicializarPaginaCategoria() {
    const gridCategoriaInterna = document.getElementById('cards-categoria-interna');
    const tituloCategoria = document.getElementById('categoria-titulo');
    
    const urlParams = new URLSearchParams(window.location.search);
    const termoBuscado = urlParams.get('busca');

    if (gridCategoriaInterna && tituloCategoria && termoBuscado) {
        let htmlFiltrado = "";
        
        // Mantém o título visual bonito com acentos na tela do usuário
        tituloCategoria.innerText = `Resultados para: "${termoBuscado}"`;
        document.title = `Flexo Gráfica - Busca: ${termoBuscado}`;

        // Prepara o termo de busca removendo os acentos para a comparação em segundo plano
        const termoSemAcento = removerAcentos(termoBuscado.toLowerCase());

        for (const id in produtosDB) {
            const produto = produtosDB[id];
            
            // Remove os acentos do título e da descrição do banco antes de comparar
            const tituloSemAcento = removerAcentos(produto.title.toLowerCase());
            const descSemAcento = removerAcentos(produto.desc.toLowerCase());

            // Agora a comparação é feita de letras puras contra letras puras
            if (tituloSemAcento.includes(termoSemAcento) || descSemAcento.includes(termoSemAcento)) {
                htmlFiltrado += `
                    <div class="product-card" onclick="window.location.href='produto.html?id=${id}'">
                        <div class="product-image">
                            <img src="${produto.img}" alt="${produto.title}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3>${produto.title}</h3>
                            <p>${produto.desc}</p>
                            <span class="product-price">Sob Consulta</span>
                        </div>
                    </div>
                `;
            }
        }

        if (htmlFiltrado !== "") {
            gridCategoriaInterna.innerHTML = htmlFiltrado;
        } else {
            gridCategoriaInterna.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; color:#666; padding: 60px 20px;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Nenhum resultado encontrado</p>
                    <p style="font-size: 14px;">Não encontramos produtos correspondentes a "${termoBuscado}". Verifique a grafia ou tente outros termos.</p>
                </div>
            `;
        }
    }
}

window.addEventListener('DOMContentLoaded', inicializarPaginaCategoria);

// =======================================================
// ANIMAÇÃO DOS CONTADORES DA FAIXA ROSA
// =======================================================
function animarContadores() {
    const contadores = document.querySelectorAll('.counter-number');
    const duracaoTotal = 2000; // Tempo da animação em milissegundos (2 segundos)

    contadores.forEach(contador => {
        const alvo = parseInt(contador.getAttribute('data-target'));
        const sufixo = contador.getAttribute('data-suffix') || '';
        const possuiMais = alvo === 10000 || alvo === 200 || alvo === 10; // Adiciona o '+' nos que precisam
        
        let valorInicial = 0;
        
        // Define a velocidade da contagem com base no tamanho do número alvo
        const incremento = alvo / (duracaoTotal / 16); 

        const atualizarNumero = () => {
            valorInicial += incremento;

            if (valorInicial < alvo) {
                // Formata números grandes como "10.000" usando o padrão brasileiro
                contador.innerText = Math.ceil(valorInicial).toLocaleString('pt-BR') + sufixo;
                requestAnimationFrame(atualizarNumero);
            } else {
                // Garante que o valor final termine exato e com a formatação certa
                let valorFinalFormatado = alvo.toLocaleString('pt-BR');
                if (possuiMais) valorFinalFormatado += '+';
                contador.innerText = valorFinalFormatado + sufixo;
            }
        };

        atualizarNumero();
    });
}

// Configura o observador para ativar a animação apenas quando a faixa aparecer na tela
document.addEventListener('DOMContentLoaded', () => {
    const secaoFaixa = document.querySelector('.counter-section');
    
    if (secaoFaixa) {
        const observador = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animarContadores();
                    observer.unobserve(entry.target); // Para de observar para a animação rodar só uma vez
                }
            });
        }, { threshold: 0.3 }); // Dispara quando 30% da faixa estiver visível

        observador.observe(secaoFaixa);
    }
});
