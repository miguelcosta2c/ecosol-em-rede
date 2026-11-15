
import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Expositor = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  historia: string;
  imagem: string;
  instagram?: string;
  destaque?: boolean;
  tags: string[];
};

const expositores: Expositor[] = [
  {
    id: 1,
    nome: "Paulo Sérgio",
    categoria: "Alimentos",
    descricao: "Produção rural e mel artesanal.",
    historia:
      "Produtor rural há cerca de 40 anos, Paulo Sérgio encontrou na Economia Solidária uma maneira de vender diretamente ao consumidor. Também realiza ações de divulgação e palestras em escolas.",
    imagem: "/images/expositores/paulo-sergio.jpg",
    instagram: "https://www.instagram.com/melevidabocaina/",
    destaque: true,
    tags: ["mel", "apicultura", "produção rural", "sustentabilidade"],
  },
  {
    id: 2,
    nome: "Mônica",
    categoria: "Artesanato",
    descricao: "Costura criativa e reaproveitamento de tecidos.",
    historia:
      "Mônica construiu sua trajetória profissional na área da costura. Hoje, produz suas próprias peças e reaproveita tecidos para criar acessórios, como xuxinhas de cabelo.",
    imagem: "/images/expositores/monica.jpg",
    instagram: "https://www.instagram.com/ateliedonasdapraiaa",
    destaque: true,
    tags: ["costura", "tecidos", "artesanato", "reutilização"],
  },
  {
    id: 3,
    nome: "Dani",
    categoria: "Outros",
    descricao: "Trabalho, renda e cooperação na Economia Solidária.",
    historia:
      "Dani participa da Economia Solidária há aproximadamente três a quatro anos. Para ela, a atividade representa sua fonte de renda, e a união do movimento é um aspecto importante.",
    imagem: "/images/expositores/dani.jpg",
    tags: ["cooperação", "renda", "economia solidária"],
  },
  {
    id: 4,
    nome: "Júlia",
    categoria: "Alimentos",
    descricao: "Empreendimento que busca visibilidade e reduzir embalagens plásticas.",
    historia:
      "Júlia começou a participar da Economia Solidária há cerca de um mês. Utiliza as redes sociais e o boca a boca para divulgar seu trabalho e procura reduzir o uso de plástico nas embalagens.",
    imagem: "/images/expositores/julia.jpg",
    tags: ["divulgação", "embalagens", "sustentabilidade"],
  },
  {
    id: 5,
    nome: "Ariel",
    categoria: "Outros",
    descricao: "Empreendedor que conheceu a feira por meio de uma conhecida.",
    historia:
      "Ariel participa da Economia Solidária há aproximadamente um ano e meio. Conheceu a feira por meio de uma pessoa que já participava e iniciou sua trajetória empreendedora.",
    imagem: "/images/expositores/ariel.jpg",
    tags: ["empreendedorismo", "cooperação", "rede"],
  },
];

const categorias = ["Todos", "Alimentos", "Artesanato", "Outros"];

const valores = [
  {
    icone: "♡",
    titulo: "Valorização",
    texto: "Histórias e talentos locais",
  },
  {
    icone: "⌘",
    titulo: "Cooperação",
    texto: "Uma rede feita em conjunto",
  },
  {
    icone: "♧",
    titulo: "Sustentabilidade",
    texto: "Consumo mais consciente",
  },
];

function App() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [expositorSelecionado, setExpositorSelecionado] =
    useState<Expositor | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [headerSolido, setHeaderSolido] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState("inicio");

  const expositoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return expositores.filter((expositor) => {
      const correspondeCategoria =
        categoriaAtiva === "Todos" ||
        expositor.categoria === categoriaAtiva;

      const textoPesquisa = [
        expositor.nome,
        expositor.categoria,
        expositor.descricao,
        expositor.historia,
        ...expositor.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return correspondeCategoria && textoPesquisa.includes(termo);
    });
  }, [busca, categoriaAtiva]);

  useEffect(() => {
    const aoRolar = () => setHeaderSolido(window.scrollY > 16);

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });

    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    const ids = ["inicio", "expositores", "sobre", "visitar"];
    const secoes = ids
      .map((id) => document.getElementById(id))
      .filter((secao): secao is HTMLElement => secao !== null);

    if (secoes.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setSecaoAtiva(entrada.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    secoes.forEach((secao) => observador.observe(secao));
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("reveal-enabled");

    return () => root.classList.remove("reveal-enabled");
  }, []);

  useEffect(() => {
    const elementos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );

    const revelarTodos = () =>
      elementos.forEach((elemento) => elemento.classList.add("is-visible"));

    if (
      !document.documentElement.classList.contains("reveal-enabled") ||
      !("IntersectionObserver" in window)
    ) {
      revelarTodos();
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elementos.forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, [expositoresFiltrados]);

  useEffect(() => {
    if (!menuAberto) return;

    const overflowAnterior = document.body.style.overflow;
    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAberto(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [menuAberto]);

  useEffect(() => {
    if (!expositorSelecionado) return;

    const overflowAnterior = document.body.style.overflow;
    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setExpositorSelecionado(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [expositorSelecionado]);

  const navLinkClass = (id: string) =>
    `nav-link ${secaoAtiva === id ? "active" : ""}`;

  const fecharModal = () => setExpositorSelecionado(null);

  return (
    <div className="site-wrapper">
      <header className={`site-header ${headerSolido ? "is-scrolled" : ""}`}>
        <a
          className="brand"
          href="#inicio"
          aria-label="ECOSOL EM REDE - Página inicial"
          onClick={() => setMenuAberto(false)}
        >
          <span className="brand-icon" aria-hidden="true">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 34V17M20 25C9 25 6 18 6 9C15 9 22 13 20 25Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 21C20 12 26 6 35 6C35 16 29 23 20 23"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 34H28"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="brand-text">
            <strong>ECOSOL</strong>
            <span>EM REDE · ITAIPU</span>
          </span>
        </a>

        <button
          className={`menu-toggle ${menuAberto ? "is-open" : ""}`}
          type="button"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${menuAberto ? "is-open" : ""}`}>
          <a
            className={navLinkClass("inicio")}
            aria-current={secaoAtiva === "inicio" ? "true" : undefined}
            href="#inicio"
            onClick={() => setMenuAberto(false)}
          >
            Início
          </a>
          <a
            className={navLinkClass("expositores")}
            aria-current={secaoAtiva === "expositores" ? "true" : undefined}
            href="#expositores"
            onClick={() => setMenuAberto(false)}
          >
            Expositores
          </a>
          <a
            className={navLinkClass("sobre")}
            aria-current={secaoAtiva === "sobre" ? "true" : undefined}
            href="#sobre"
            onClick={() => setMenuAberto(false)}
          >
            Sobre o projeto
          </a>
          <a
            className="nav-cta"
            href="#expositores"
            onClick={() => setMenuAberto(false)}
          >
            Explorar a feira <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="eyebrow">
              <span className="status-dot" />
              ECONOMIA SOLIDÁRIA · NITERÓI, RJ
            </span>

            <h1>
              Por trás de cada produto,
              <span> existe uma história.</span>
            </h1>

            <p className="hero-description">
              Conheça quem produz, descubra novas histórias e valorize o
              trabalho de quem fortalece a economia local todos os dias.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#expositores">
                Conhecer os produtores <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href="#sobre">
                Nossa iniciativa
              </a>
            </div>

            <div className="hero-note">
              <span className="hero-note-icon" aria-hidden="true">
                ♧
              </span>
              <p>
                <strong>Produzir, cooperar, transformar.</strong>
                <span>Uma rede que cresce com cada pessoa.</span>
              </p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <img
                src="/images/feira.jpeg"
                alt="Vista da Feira de Economia Solidária de Itaipu"
                className="hero-image"
              />
              <div className="hero-image-caption">
                <span className="caption-marker" />
                <span>
                  <strong>Feira de Economia Solidária</strong>
                  <small>Itaipu · Niterói, RJ</small>
                </span>
              </div>
            </div>

            <div className="floating-note">
              <span className="floating-note-icon">✳</span>
              <span>
                <strong>Feito por pessoas.</strong>
                <small>Fortalecido em comunidade.</small>
              </span>
            </div>

            <span className="hero-decoration hero-decoration-one" />
            <span className="hero-decoration hero-decoration-two" />
            <span className="hero-side-label">
              FEIRA DE ITAIPU · NITERÓI
            </span>
          </div>
        </section>

        <section className="values-strip" aria-label="Valores do projeto">
          <div className="values-track">
            {[0, 1, 2].map((copia) => (
              <div
                className="values-group"
                key={copia}
                aria-hidden={copia > 0 ? "true" : undefined}
              >
                {valores.map((valor) => (
                  <div className="value-item" key={valor.titulo}>
                    <span className="value-icon" aria-hidden="true">
                      {valor.icone}
                    </span>
                    <span>
                      <strong>{valor.titulo}</strong>
                      <small>{valor.texto}</small>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="catalog-section section-container" id="expositores">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">
                <span className="eyebrow-index">01</span>
                CONHEÇA A NOSSA REDE
              </span>
              <h2>
                Quem faz a feira <span>acontecer.</span>
              </h2>
              <p>
                Cada expositor tem sua trajetória, seu trabalho e algo especial
                para compartilhar.
              </p>
            </div>

            <span className="catalog-count">
              <strong>{expositoresFiltrados.length.toString().padStart(2, "0")}</strong>
              <span>perfis encontrados</span>
            </span>
          </div>

          <div className="catalog-controls">
            <label className="search-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M16 16L21 21"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                placeholder="Buscar produtores, produtos..."
                aria-label="Buscar produtores e produtos"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
              {busca && (
                <button
                  type="button"
                  className="clear-search"
                  aria-label="Limpar busca"
                  onClick={() => setBusca("")}
                >
                  ×
                </button>
              )}
            </label>

            <div className="category-filters" aria-label="Filtrar por categoria">
              {categorias.map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  className={`filter-button ${
                    categoriaAtiva === categoria ? "active" : ""
                  }`}
                  aria-pressed={categoriaAtiva === categoria}
                  onClick={() => setCategoriaAtiva(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          <div className="exhibitors-grid">
            {expositoresFiltrados.map((expositor) => (
              <article
                className="exhibitor-card"
                key={expositor.id}
                data-reveal
              >
                <button
                  type="button"
                  className="card-image-button"
                  onClick={() => setExpositorSelecionado(expositor)}
                  aria-label={`Conhecer a história de ${expositor.nome}`}
                >
                  <img
                    className="card-image"
                    src={expositor.imagem}
                    alt={`Barraca de ${expositor.nome}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <span className="card-image-fallback">
                    <span aria-hidden="true">✳</span>
                    <small>Foto do expositor</small>
                  </span>
                  <span className="card-index">
                    {expositor.id.toString().padStart(2, "0")}
                  </span>
                  {expositor.destaque && (
                    <span className="card-badge">Em destaque</span>
                  )}
                  <span className="card-category-pill">
                    {expositor.categoria}
                  </span>
                  <span className="card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>

                <div className="card-content">
                  <h3>{expositor.nome}</h3>
                  <p>{expositor.descricao}</p>

                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setExpositorSelecionado(expositor)}
                  >
                    Conhecer história <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {expositoresFiltrados.length === 0 && (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>Nenhum produtor encontrado</h3>
              <p>
                Tente outro nome ou escolha uma categoria diferente.
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  setBusca("");
                  setCategoriaAtiva("Todos");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          <p className="catalog-disclaimer">
            Este catálogo é uma iniciativa de divulgação. As informações serão
            atualizadas conforme os dados coletados e confirmados com os
            participantes.
          </p>
        </section>

        <section className="about-section" id="sobre">
          <div className="about-inner">
            <div className="about-visual" data-reveal>
              <div className="about-image-wrap">
                <img
                  src="/images/economia-solidaria.jpg"
                  alt="Produtos artesanais e produção local em uma feira"
                  loading="lazy"
                />
              </div>
              <span className="about-stamp">
                <span>JUNTOS</span>
                <strong>somos<br />mais fortes</strong>
                <span aria-hidden="true">✳</span>
              </span>
            </div>

            <div className="about-content" data-reveal>
              <span className="eyebrow">
                <span className="eyebrow-index">02</span>
                MAIS DO QUE UMA FEIRA
              </span>
              <h2>
                Uma economia que coloca <span>as pessoas em primeiro lugar.</span>
              </h2>
              <p>
                A Economia Solidária valoriza a cooperação, a participação
                coletiva e o trabalho digno. É uma forma de produzir e
                comercializar que reconhece a importância das pessoas por trás
                de cada produto.
              </p>
              <p>
                O ECOSOL EM REDE nasce da proposta de aproximar tecnologia e
                comunidade, dando mais visibilidade aos produtores e às
                histórias que fazem parte da feira.
              </p>

              <div className="about-highlight">
                <span aria-hidden="true">✳</span>
                <p>
                  <strong>Tecnologia com propósito.</strong>
                  <span>
                    Um espaço digital para conectar pessoas, histórias e
                    iniciativas locais.
                  </span>
                </p>
              </div>

              <a className="button button-primary" href="#expositores">
                Explorar os expositores <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="visit-section section-container" id="visitar">
          <div className="visit-card" data-reveal>
            <div className="visit-content">
              <span className="eyebrow">
                <span className="eyebrow-index">03</span>
                VENHA CONHECER
              </span>
              <h2>
                A próxima história pode começar <span>na feira.</span>
              </h2>
              <p>
                Conheça os produtores, converse com quem faz e descubra novas
                formas de valorizar o trabalho local.
              </p>
              <div className="visit-location">
                <span className="location-icon" aria-hidden="true">
                  ⌖
                </span>
                <span>
                  <strong>Praça das Amendoeiras</strong>
                  <small>Itaipu · Niterói, Rio de Janeiro</small>
                </span>
              </div>
              <a
                className="button button-primary"
                href="https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+das+Amendoeiras+Itaipu+Niter%C3%B3i"
                target="_blank"
                rel="noreferrer"
              >
                Ver localização <span aria-hidden="true">↗</span>
              </a>
              <small className="visit-note">
                Consulte os canais da feira para confirmar os dias e horários
                de funcionamento.
              </small>
            </div>

            <div className="visit-decoration" aria-hidden="true">
              <span className="visit-circle visit-circle-one" />
              <span className="visit-circle visit-circle-two" />
              <svg viewBox="0 0 220 220" fill="none">
                <path
                  d="M110 190V80M110 140C68 140 42 112 42 68C84 68 116 94 110 140Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M110 115C110 69 139 35 183 35C183 80 155 115 110 121"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M72 190H148"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="visit-decoration-text">
                LOCAL · COLETIVO · SOLIDÁRIO
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#inicio">
            <span className="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 34V17M20 25C9 25 6 18 6 9C15 9 22 13 20 25Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 21C20 12 26 6 35 6C35 16 29 23 20 23"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 34H28"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="brand-text">
              <strong>ECOSOL</strong>
              <span>EM REDE · ITAIPU</span>
            </span>
          </a>

          <p>
            Tecnologia para aproximar pessoas, valorizar histórias e fortalecer
            a economia solidária.
          </p>

          <nav className="footer-nav" aria-label="Navegação do rodapé">
            <a href="#inicio">Início</a>
            <a href="#expositores">Expositores</a>
            <a href="#sobre">Sobre o projeto</a>
            <a href="#visitar">Visite a feira</a>
          </nav>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          ECOSOL <span>EM REDE</span>
        </div>

        <div className="footer-bottom">
          <span>ECOSOL EM REDE · Projeto educacional</span>
          <span>Feito com propósito em Niterói, RJ.</span>
        </div>
      </footer>

      {expositorSelecionado && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fecharModal();
          }}
        >
          <section
            className="expositor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={fecharModal}
              aria-label="Fechar detalhes"
              autoFocus
            >
              ×
            </button>

            <div className="modal-image-wrap">
              <img
                src={expositorSelecionado.imagem}
                alt={`Barraca de ${expositorSelecionado.nome}`}
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
              <span className="modal-image-fallback" aria-hidden="true">
                ✳
              </span>
            </div>

            <div className="modal-content">
              <span className="card-category">
                {expositorSelecionado.categoria}
              </span>
              <h2 id="modal-title">{expositorSelecionado.nome}</h2>
              <p className="modal-description">
                {expositorSelecionado.descricao}
              </p>

              <div className="modal-divider" />

              <h3>Uma história de trabalho</h3>
              <p className="modal-story">
                {expositorSelecionado.historia}
              </p>

              {expositorSelecionado.tags.length > 0 && (
                <div className="modal-tags">
                  {expositorSelecionado.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}

              {expositorSelecionado.instagram && (
                <a
                  className="button button-primary modal-contact"
                  href={expositorSelecionado.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Conhecer no Instagram <span aria-hidden="true">↗</span>
                </a>
              )}

              <p className="modal-disclaimer">
                Perfil elaborado a partir das informações coletadas no projeto.
                Detalhes devem ser confirmados com o expositor antes da
                publicação definitiva.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
