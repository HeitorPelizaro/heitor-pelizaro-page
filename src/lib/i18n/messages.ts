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
      glitch: "Glitch",
      glitchAria: "Tema visual glitch exclusivo (liga e desliga)",
    },
    hero: {
      role: "DevOps · Fullcycle · IA",
      tagline:
        "Atuo com foco em escalabilidade, segurança e automação ao longo do ciclo de entrega. Em incidentes, priorizo diagnóstico objetivo e restauração do serviço com o menor impacto possível.",
      sub:
        "Ciência da Computação (IFTM). DevOps na NovaHaus — com escopo full cycle quando o contexto exige ir além da automação do pipeline.",
      ctaGithub: "GitHub",
      ctaEmail: "E-mail",
      themePicker: "Escolher cores de destaque do tema",
      themeWheelHint: "Arraste na roda para ajustar o matiz",
      themeReset: "Voltar ao padrão",
      themeRingHint:
        "Anel colorido: clique ou arraste na cor. Com o botão do mouse pressionado, o arraste continua válido um pouco fora do anel.",
      themeSimpleHint: "Modo reduzido: use Voltar ao padrão abaixo.",
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
      exclusiveThemeHint:
        "Complete todas as conquistas para liberar um tema visual exclusivo na página (modo glitch). Você liga e desliga no painel de cima.",
      allCompleteTitle: "Parabéns!",
      allCompleteBody:
        "Você liberou todas as conquistas. Vá na página de celebração para ativar o tema glitch; depois use o interruptor no topo do site.",
      allCompleteCta: "Ir para a celebração",
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
        graph_cut_50: {
          name: "Cinquenta cortes",
          desc: "Corte 50 conexões no grafo de fundo passando o mouse pelos fios como se estivesse cortando.",
        },
        theme_chroma_3: {
          name: "Cromático ×3",
          desc: "Mude as cores de destaque pelo anel no hero pelo menos 3 vezes.",
        },
        easter_egg: {
          name: "Konami",
          desc: "Tem um comando secreto neste site. Consegue descobrir qual é?",
        },
      },
    },
    reward: {
      metaTitle: "Recompensa",
      loading: "Carregando…",
      gateTitle: "Acesso negado (só de brincadeira)",
      gateBody:
        "Esta página só abre com 100% das conquistas no ACH. Volte ao site, complete o que falta e tente de novo.",
      gateCta: "Voltar ao início",
      fireworksEyebrow: "Modo festa",
      fireworksTitle: "Boom. Parabéns.",
      fireworksSub:
        "Fogos de artifício virtuais: zero barulho pros vizinhos, 100% de poluição luminosa na tela.",
      prizeTitle: "Seu prêmio oficial",
      prizeBody:
        "Certifico que você completou o tour curioso deste site. Não tem troféu físico; o troféu emocional é a curiosidade satisfeita e o direito de dizer que viu isso até o fim.",
      unlockGlitch: "Liberar tema glitch exclusivo",
      glitchUnlockedHint:
        "Tema liberado. Ligue ou desligue quando quiser no painel de cima (interruptor Glitch).",
      glitchAlreadyUnlocked: "O tema glitch já está liberado neste navegador.",
      backHome: "Voltar ao início",
    },
    glitchLab: {
      flares: [
        "[SYS] buffer inconsistente — ignorado",
        "GPU: jitter no scanout (simulado)",
        "heap: suspicious.free() — é pegadinha",
        "render: OK (na verdade tá bonito)",
        "TCP: pacote fantasma 0xDEAD",
        "WARN: framebuffer drift > 0.5px",
        "shader_compile: retry (1)",
      ],
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
      glitch: "Glitch",
      glitchAria: "Exclusive glitch visual theme (toggle)",
    },
    hero: {
      role: "DevOps · Fullcycle · AI",
      tagline:
        "I focus on scalability, security, and automation across the delivery lifecycle. In incidents, I prioritize clear root-cause analysis and restoring service with minimal downtime.",
      sub:
        "Computer Science (IFTM). DevOps at NovaHaus — with end-to-end ownership when delivery calls for more than CI/CD automation.",
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
      exclusiveThemeHint:
        "Complete every achievement to unlock an exclusive visual theme on this site (glitch mode), available from the top panel.",
      allCompleteTitle: "Congratulations!",
      allCompleteBody:
        "You've unlocked every achievement. Head to the celebration page to unlock the glitch theme, then toggle it anytime in the HUD.",
      allCompleteCta: "Go to celebration",
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
        graph_cut_50: {
          name: "Fifty cuts",
          desc: "Break 50 connections on the background graph by slicing wires with the mouse.",
        },
        theme_chroma_3: {
          name: "Chromatic ×3",
          desc: "Change accent colors from the hero ring at least 3 times.",
        },
        easter_egg: {
          name: "Konami",
          desc: "There's a secret command on this site. Can you figure out what it is?",
        },
      },
    },
    reward: {
      metaTitle: "Reward",
      loading: "Loading…",
      gateTitle: "Not yet (playful lock)",
      gateBody:
        "This room only opens with 100% of achievements on ACH. Go back, unlock what's missing, and try again.",
      gateCta: "Back to home",
      fireworksEyebrow: "Party mode",
      fireworksTitle: "Boom. Well done.",
      fireworksSub:
        "Virtual fireworks: no noise for the neighbors, maximum glow on your screen.",
      prizeTitle: "Your official prize",
      prizeBody:
        "I hereby certify you finished the curious path of this site. There is no physical trophy; the emotional trophy is satisfied curiosity and the right to say you saw this through.",
      unlockGlitch: "Unlock exclusive glitch theme",
      glitchUnlockedHint:
        "Theme unlocked. Toggle it anytime from the top bar (Glitch switch).",
      glitchAlreadyUnlocked: "The glitch theme is already unlocked in this browser.",
      backHome: "Back to home",
    },
    glitchLab: {
      flares: [
        "[SYS] buffer inconsistent — ignored",
        "GPU: scanout jitter (simulated)",
        "heap: suspicious.free() — joke",
        "render: OK (actually looks fine)",
        "TCP: ghost packet 0xDEAD",
        "WARN: framebuffer drift > 0.5px",
        "shader_compile: retry (1)",
      ],
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
