# Digimon · Digital Garden

Bichinho virtual em português, para desktop e celular. Escolha Agumon, Renamon ou Guilmon e cuide do seu parceiro em um quintal digital animado.

## Jogar

Abra o link do GitHub Pages publicado neste repositório. Sem instalação, cadastro ou servidor de jogo. O progresso fica no navegador. Configurações permite exportar/importar seu save JSON. Pausar congela o tempo, inclusive offline.

## Comportamento da versão 2.1

- Respiração contínua, gestos de se coçar, olhar ao redor, espreguiçar, sentar e pequenos pulos. Respeita a preferência de movimento reduzido do aparelho.
- IA local por estado e prioridade: temperamento persistente (brincalhão, curioso, carinhoso ou tranquilo), atenção, tédio, metabolismo variável e passeios espontâneos.
- Balões legíveis em qualquer zoom, com pedidos de comida, banheiro, sono, banho, remédio, limpeza, carinho, brincadeira ou fruta. Toque no balão para abrir o cuidado.
- Necessidades urgentes têm prioridade sobre vontades. Os pedidos reagem aos cuidados; atender fortalece o vínculo. Vontades têm intervalo e expiração, sem punições repentinas.
- Exaustão provoca um cochilo automático; nesse cochilo o parceiro acorda quando recupera energia. Sono iniciado pelo jogador continua manual.
- Temperamento e desejos acompanham o save. Pausar congela necessidades e decisões. Os saves da versão anterior são migrados automaticamente.
- Sem chamadas externas, serviços pagos ou envio de dados para uma IA.

## Controles da versão 2

- Quintal ocupa toda a tela. Abra Comida, Cuidar, Status ou Menu pelos botões inferiores.
- Toque/clique no Digimon para fazer carinho, com corações e som.
- Arraste para mover a câmera; use pinça, roda do mouse ou botões −/+ para zoom. O botão centralizar restaura a câmera.
- Toque em ♪ para ligar/desligar os efeitos sonoros. O navegador libera áudio após uma interação.
- Animações e efeitos próprios para alimentação, carinho, brincadeira, banho, banheiro, sono, limpeza, remédio, treino, batalha, exploração e evolução.
- Banheiro com entrada aberta, sem portas nem sinalização de gênero.
- Teclado: M abre o menu, +/− controlam o zoom, 0 centraliza, Esc fecha a janela.
- Mantém compatibilidade com os saves da primeira versão.

## Sistemas

- Fome/saciedade, energia, banheiro, higiene, felicidade, saúde e vínculo.
- Alimentação, banho, brincadeira, carinho, limpeza, remédio, sono e frutas gratuitas.
- Batalhas por turnos com EXP, Bits, técnica, defesa e recuo.
- 5 TP por nível; ginásio com atributos, sete tolerâncias e minijogo de precisão.
- Linhas naturais nos níveis 5, 20 e 40; nível próprio de forma; até três formas equipadas; rotas alternativas selecionadas.
- Ciclo de dia/noite, animação, sons opcionais, filtro CRT, conquistas e diário.
- Até seis horas de simulação offline. Sem morte permanente.

## Escopo

Fan game com cenário e sprites originais gerados, efeitos em Canvas e janelas azuis inspiradas em Digimon World 3. Não reproduz exatamente os gráficos ou menus do original. A progressão foi adaptada para sessões curtas. Contém as três linhas naturais e rotas alternativas selecionadas, não todas as evoluções do jogo. DNA e Blast não estão implementados. Fome, banheiro e sono são a camada de bichinho virtual adicionada.

Referência: [Digivolving FAQ — ZeroSaber](https://gamefaqs.gamespot.com/ps/562323-digimon-world-3/faqs/17462).

## Código

Sem dependências ou build. Sirva a raiz com qualquer servidor HTTP. Os módulos `app.mjs`, `engine.mjs`, `data.mjs`, `art.mjs`, `world.mjs`, `effects.mjs` e `behavior.mjs` usam as imagens locais `garden-v2.png` e `partners-v2.png`. Publicação pelo GitHub Pages a partir de `main`, na raiz.

A publicação inicial foi feita sem executar testes, a pedido do usuário.

Digimon e seus personagens pertencem aos respectivos titulares. Projeto pessoal de fã, sem afiliação oficial.
