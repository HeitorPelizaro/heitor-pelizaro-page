export type Locale = "pt" | "en";

export const messages = {
  pt: {
    metaTitle: "Heitor Pelizaro — DevOps, automação & fullcycle",
    metaDescription:
      "DevOps na NovaHaus. Escalabilidade, segurança e automação no ciclo de desenvolvimento — com foco em diagnosticar e corrigir rápido quando algo falha.",
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
        "Trago escalabilidade, segurança e automação para o ciclo de desenvolvimento. Quando quebra, o foco é achar rápido e corrigir ainda mais rápido.",
      sub:
        "Ciência da Computação (IFTM). DevOps na NovaHaus; fullcycle quando o projeto exige ir além do pipe.",
      ctaGithub: "GitHub",
      ctaEmail: "E-mail",
      themePicker: "Escolher cores de destaque do tema",
      themeWheelHint: "Arraste na roda para ajustar o matiz",
      themeReset: "Repor padrão",
      themeRingHint:
        "Anel colorido: clique ou arraste na cor. Com o botão premido, o arraste segue válido um pouco fora do anel.",
      themeSimpleHint: "Modo reduzido: use Repor padrão abaixo.",
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
    contact: {
      title: "Canal aberto",
      subtitle: "Networking antes de tudo",
      instagram: "Instagram",
    },
    achievements: {
      title: "Conquistas",
      unlocked: "desbloqueada",
      close: "Fechar",
      lockedLabel: "Bloqueada",
      items: {
        a11y_motion: {
          name: "Modo acessível",
          desc: 'Ative "Reduzir movimento" no painel superior.',
        },
        performance_mode: {
          name: "Modo performance",
          desc: "Ligue o modo performance para um traço mais leve no fundo.",
        },
        switched_lang: {
          name: "Poliglota",
          desc: "Alterne entre PT e EN pelo link de idioma no HUD.",
        },
        visited_projects: {
          name: "Explorador de builds",
          desc: "Role até a seção Projetos (ou use o atalho no menu).",
        },
        graph_untangle: {
          name: "Teia desfeita",
          desc: "Corte ligações do grafo de fundo com o rato até quase não sobrar fios.",
        },
        theme_chroma_3: {
          name: "Cromático ×3",
          desc: "Mude as cores de destaque pelo anel no hero pelo menos 3 vezes.",
        },
        easter_egg: {
          name: "Init 0",
          desc: "Há um atalho escondido no teclado. Descubra sozinho.",
        },
      },
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
      "DevOps at NovaHaus. Scalability, security, and automation in the development lifecycle—with fast diagnosis and faster fixes when things break.",
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
        "I bring scalability, security, and automation into the development lifecycle. When something breaks, the focus is to find it fast—and fix it faster.",
      sub:
        "Computer Science (IFTM). DevOps at NovaHaus; fullcycle work when the project needs more than the pipeline.",
      ctaGithub: "GitHub",
      ctaEmail: "Email",
      themePicker: "Choose accent theme colors",
      themeWheelHint: "Drag on the wheel to adjust hue",
      themeReset: "Restore default",
      themeRingHint:
        "Color ring: click or drag on the hue. While held, dragging still works slightly outside the ring.",
      themeSimpleHint: "Reduced mode: use Restore default below.",
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
    contact: {
      title: "Open channel",
      subtitle: "Networking first",
      instagram: "Instagram",
    },
    achievements: {
      title: "Achievements",
      unlocked: "unlocked",
      close: "Close",
      lockedLabel: "Locked",
      items: {
        a11y_motion: {
          name: "Accessible mode",
          desc: 'Turn on "Reduce motion" in the top panel.',
        },
        performance_mode: {
          name: "Performance mode",
          desc: "Enable performance mode for a lighter background graph.",
        },
        switched_lang: {
          name: "Polyglot",
          desc: "Switch between PT and EN using the language links in the HUD.",
        },
        visited_projects: {
          name: "Build explorer",
          desc: "Scroll to the Projects section (or use the nav shortcut).",
        },
        graph_untangle: {
          name: "Web untangled",
          desc: "Cut background graph edges with the mouse until almost none remain.",
        },
        theme_chroma_3: {
          name: "Chromatic ×3",
          desc: "Change accent colors from the hero ring at least 3 times.",
        },
        easter_egg: {
          name: "Init 0",
          desc: "There is a hidden keyboard shortcut. Find it on your own.",
        },
      },
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
