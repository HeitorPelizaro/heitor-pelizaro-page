export type Locale = "pt" | "en";

export const messages = {
  pt: {
    metaTitle: "Heitor Pelizaro — DevOps, automação & fullcycle",
    metaDescription:
      "DevOps na NovaHaus. Infra, CI/CD, Python, cloud e sistemas fullcycle.",
    nav: {
      hero: "Início",
      skills: "Stack",
      projects: "Projetos",
      authority: "Lab",
      instagram: "Instagram",
      contact: "Contato",
    },
    hud: {
      orbit: "Órbita",
      sys: "SYS",
      perf: "Performance",
      motion: "Reduzir movimento",
      lang: "Idioma",
    },
    hero: {
      role: "DevOps · Fullcycle · IA",
      tagline:
        "Infra, automação e entrega ponta a ponta. O foco é o que sobe, aguenta carga e tem causa clara quando dá ruim.",
      sub:
        "Ciência da Computação (IFTM). DevOps na NovaHaus; fullcycle quando o projeto exige ir além do pipe.",
      ctaGithub: "GitHub",
      ctaEmail: "E-mail",
    },
    skills: {
      title: "Módulos",
      subtitle: "O que roda em produção na minha cabeça",
      legend: "L1 = decisão técnica · L2 = expansão ativa",
    },
    projects: {
      title: "Projetos",
      subtitle: "Fullcycle: da arquitetura ao DNS",
      nhPong: {
        name: "NH Pong",
        desc: "Monitoramento interno com checks massivos, alertas em tempo real, SMTP, dashboards e logs estruturados a partir de falhas e métricas.",
        tag: "Interno · NovaHaus",
      },
      pronto: {
        name: "Pronto Dental",
        desc: "Prontuário odontológico online. Stack completa, servidor e DNS sob controle.",
        tag: "Produto",
        link: "Visitar",
      },
    },
    authority: {
      title: "Laboratório",
      subtitle: "Conteúdo (em construção)",
      body:
        "Pretendo usar este bloco para artigos, talks e cases. Por enquanto não tem texto de enchimento: quando publicar, será algo que eu considerar útil de fato.",
      soon: "Em breve",
    },
    instagram: {
      title: "Instagram",
      subtitle: "Outro canal pra me conhecer",
      body:
        "Fotos do dia a dia, projeto e viagem. O feed oficial continua no app; aqui é um recorte que combina com o resto do site.",
      cta: "Abrir perfil",
    },
    contact: {
      title: "Canal aberto",
      subtitle: "Networking antes de tudo",
    },
    achievements: {
      title: "Conquistas",
      unlocked: "desbloqueada",
      a11y: "Modo acessível",
      perf: "Modo performance",
      lang: "Poliglota",
      projects: "Explorador de builds",
      egg: "Init 0",
    },
    footer: {
      copy: "Heitor Cunha Pelizaro · IFTM · Ciência da Computação",
    },
    jsonLd: {
      jobTitle: "DevOps Engineer",
    },
  },
  en: {
    metaTitle: "Heitor Pelizaro — DevOps, automation & fullcycle",
    metaDescription:
      "DevOps at NovaHaus. Infra, CI/CD, Python, cloud and fullcycle systems.",
    nav: {
      hero: "Home",
      skills: "Stack",
      projects: "Projects",
      authority: "Lab",
      instagram: "Instagram",
      contact: "Contact",
    },
    hud: {
      orbit: "Orbit",
      sys: "SYS",
      perf: "Performance",
      motion: "Reduce motion",
      lang: "Language",
    },
    hero: {
      role: "DevOps · Fullcycle · AI",
      tagline:
        "Infra, automation, and shipping end to end. I care about what stays up under load and has a clear trail when it fails.",
      sub:
        "Computer Science (IFTM). DevOps at NovaHaus; fullcycle work when the project needs more than the pipeline.",
      ctaGithub: "GitHub",
      ctaEmail: "Email",
    },
    skills: {
      title: "Modules",
      subtitle: "What runs in production inside my head",
      legend: "L1 = technical lead · L2 = active expansion",
    },
    projects: {
      title: "Projects",
      subtitle: "Fullcycle: architecture to DNS",
      nhPong: {
        name: "NH Pong",
        desc: "Internal monitoring with many concurrent checks, real-time alerts, SMTP, dashboards and structured logs from failures and metrics.",
        tag: "Internal · NovaHaus",
      },
      pronto: {
        name: "Pronto Dental",
        desc: "Online dental records. Full stack, server and DNS under control.",
        tag: "Product",
        link: "Visit",
      },
    },
    authority: {
      title: "Lab",
      subtitle: "Content (under construction)",
      body:
        "I'll use this section for articles, talks, and case studies. No filler for now—when something goes live, it'll be because it's worth your time.",
      soon: "Coming soon",
    },
    instagram: {
      title: "Instagram",
      subtitle: "Another way to get to know me",
      body:
        "Day-to-day, builds, trips. The real feed lives in the app; this panel matches the rest of the site.",
      cta: "Open profile",
    },
    contact: {
      title: "Open channel",
      subtitle: "Networking first",
    },
    achievements: {
      title: "Achievements",
      unlocked: "unlocked",
      a11y: "Accessible mode",
      perf: "Performance mode",
      lang: "Polyglot",
      projects: "Build explorer",
      egg: "Init 0",
    },
    footer: {
      copy: "Heitor Cunha Pelizaro · IFTM · Computer Science",
    },
    jsonLd: {
      jobTitle: "DevOps Engineer",
    },
  },
} as const;

export type Messages = (typeof messages)["pt"];
