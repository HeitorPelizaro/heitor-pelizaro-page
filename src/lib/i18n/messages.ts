export type Locale = "pt" | "en";

export const messages = {
  pt: {
    metaTitle: "Heitor Pelizaro — DevOps, automação & fullcycle",
    metaDescription:
      "DevOps na NovaHaus. Infra, CI/CD, Python, cloud e sistemas fullcycle. Laboratório neural em heitor.pelizaro.com.br.",
    nav: {
      hero: "Início",
      skills: "Stack",
      projects: "Projetos",
      authority: "Lab",
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
        "Curiosidade e criatividade no mesmo pipeline. Infra que respira, automações que escutam.",
      sub:
        "Quando o sistema falha, eu leio os logs antes de culpar o DNS. (Às vezes é o DNS.)",
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
        desc: "Prontuário odontológico online — stack completa, servidor e DNS sob controle.",
        tag: "Produto",
        link: "Visitar",
      },
    },
    authority: {
      title: "Laboratório",
      subtitle: "Autoridade & conteúdo (em construção)",
      body:
        "Espaço reservado para artigos, talks e cases. Se você chegou até aqui, já sabe que eu gosto de sistema nervoso estável.",
      soon: "Em breve",
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
      "DevOps at NovaHaus. Infra, CI/CD, Python, cloud and fullcycle systems. Neural lab at heitor.pelizaro.com.br.",
    nav: {
      hero: "Home",
      skills: "Stack",
      projects: "Projects",
      authority: "Lab",
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
        "Curiosity and creativity in the same pipeline. Infra that breathes, automations that listen.",
      sub:
        "When things break, I read the logs before blaming DNS. (Sometimes it is DNS.)",
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
        desc: "Online dental records — full stack, server and DNS under control.",
        tag: "Product",
        link: "Visit",
      },
    },
    authority: {
      title: "Lab",
      subtitle: "Authority & content (under construction)",
      body:
        "Reserved for articles, talks and case studies. If you made it here, you know I like a stable nervous system.",
      soon: "Coming soon",
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
