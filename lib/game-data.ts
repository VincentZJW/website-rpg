import type { Language } from "@/lib/translations";
import type { FallbackType, ModelId } from "@/types/models";

export type GameObjectType = "npc" | "boss" | "portal";
export type NpcVariant = "sage" | "scout" | "guild-master" | "librarian";
export type AnimationProfile = "sage-orbit" | "scout-scan" | "guild-greet" | "librarian-pages" | "fog-dragon-pulse" | "portal-guide";
export type InteractionStyle = "calm" | "scan" | "mentor" | "warm" | "boss" | "portal";

export type LocalizedText = {
  zh: string;
  en: string;
};

export type ExternalLink = {
  label: LocalizedText;
  description: LocalizedText;
  url: string;
};

export type FeaturedProject = {
  name: string;
  description: LocalizedText;
  url: string;
};

export type FeaturedRepository = {
  name: string;
  description: LocalizedText;
  url: string;
};

export type ExtraSection = {
  title: LocalizedText;
  items: LocalizedText[];
};

export type CompanyRadarGroup = "china" | "overseas";

export type CompanyRadarEntry = {
  name: string;
  nameZh?: string;
  group: CompanyRadarGroup;
  region: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  logoPath?: string;
  logoAltZh?: string;
  logoAltEn?: string;
  logoUrl: string;
  websiteUrl: string;
  fallbackIcon: string;
};

export type NodeCopy = {
  zone: string;
  label: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  cta: string;
};

export type GameObject = {
  id: string;
  type: GameObjectType;
  variant?: NpcVariant;
  position: [number, number, number];
  landmarkPosition: [number, number, number];
  themeColor: string;
  icon: string;
  discovered: boolean;
  modelId: ModelId;
  fallbackType: FallbackType;
  animationProfile: AnimationProfile;
  interactionStyle: InteractionStyle;
  initialRotation?: number;
  externalLinks?: ExternalLink[];
  featuredProjects?: FeaturedProject[];
  featuredProjectsIntro?: LocalizedText;
  featuredRepository?: FeaturedRepository;
  extraSections?: ExtraSection[];
  secondaryCta?: LocalizedText;
  marketView?: {
    title: LocalizedText;
    content: LocalizedText;
  };
  companyRadarTitle?: LocalizedText;
  companyRadarIntro?: LocalizedText;
  companyRadarDisclaimer?: LocalizedText;
  companyRadar?: CompanyRadarEntry[];
  zh: NodeCopy;
  en: NodeCopy;
};

export const spawnPlazaPosition: [number, number, number] = [0, 0, 1];
export const playerSpawnPosition: [number, number, number] = [0, 0, 0];

export const gameObjects: GameObject[] = [
  {
    id: "data-sage",
    type: "npc",
    variant: "sage",
    position: [-10, 0, -5.7],
    landmarkPosition: [-11.3, 0, -7.5],
    themeColor: "#35cfff",
    icon: "◈",
    discovered: false,
    modelId: "data-sage",
    fallbackType: "data-sage-procedural",
    animationProfile: "sage-orbit",
    interactionStyle: "calm",
    featuredProjectsIntro: {
      zh: "这里汇总了我的数据分析、预测建模与行业研究项目。",
      en: "This section brings together my data analysis, forecasting, and industry research projects.",
    },
    featuredProjects: [
      {
        name: "Steam Reviews Analysis",
        description: {
          zh: "分析 Steam 评论数据，提炼玩家反馈与产品洞察。",
          en: "Analyzes Steam review data to surface player feedback and product insights.",
        },
        url: "https://github.com/VincentZJW/steam-reviews-analysis",
      },
      {
        name: "LTD Forecasting",
        description: {
          zh: "面向业务决策的时间序列预测与建模实践。",
          en: "Time-series forecasting and modeling practice for business decisions.",
        },
        url: "https://github.com/VincentZJW/ltd_forecasting",
      },
      {
        name: "Transport Analysis",
        description: {
          zh: "围绕交通数据展开分析，识别趋势与结构性模式。",
          en: "Studies transport data to identify trends and structural patterns.",
        },
        url: "https://github.com/VincentZJW/transport_analysis",
      },
      {
        name: "Game Package",
        description: {
          zh: "将游戏相关分析与工具整理为可复用的软件包。",
          en: "Packages game-related analysis and utilities into a reusable toolkit.",
        },
        url: "https://github.com/VincentZJW/game-package",
      },
    ],
    zh: {
      zone: "数据实验室",
      label: "数据贤者",
      title: "数据与统计背景",
      subtitle: "用结构化分析理解人才与行业",
      content:
        "我拥有 Data Analysis 和 Statistics 背景，熟悉数据清洗、建模、可视化和商业分析。相比只凭直觉判断市场，我更希望用数据思维去拆解 AI 与机器人行业的人才结构、公司分布和岗位需求。",
      tags: ["Data Analysis", "Statistics", "Business Analytics", "Research"],
      cta: "继续浏览",
    },
    en: {
      zone: "Data Lab",
      label: "Data Sage",
      title: "Data & Statistics Foundation",
      subtitle: "Using structured analysis to understand talent and markets",
      content:
        "I come from a Data Analysis and Statistics background, with experience in data cleaning, modelling, visualization, and business analytics. Instead of relying only on intuition, I aim to use data-driven thinking to understand talent structures, company landscapes, and hiring needs in AI and Robotics.",
      tags: ["Data Analysis", "Statistics", "Business Analytics", "Research"],
      cta: "Continue browsing",
    },
  },
  {
    id: "robotics-scout",
    type: "npc",
    variant: "scout",
    position: [9.8, 0, -5.4],
    landmarkPosition: [11.5, 0, -7],
    themeColor: "#5cf2c7",
    icon: "⬡",
    discovered: false,
    modelId: "robotics-scout",
    fallbackType: "robotics-scout-procedural",
    animationProfile: "scout-scan",
    interactionStyle: "scan",
    marketView: {
      title: {
        zh: "我的观察",
        en: "My View",
      },
      content: {
        zh: "我目前对具身智能的看法是：这是一个长期空间很大的方向，但短期内仍处在从研发、样机验证、数据采集、场景试点到早期商业化过渡的阶段。\n\n很多公司已经在运动控制、机器人本体、大模型接入、数据采集和场景展示上取得了很大进展，但距离真正大规模、稳定、可复制的商业化落地，仍然需要时间。尤其是在成本、可靠性、安全性、泛化能力、供应链和真实场景 ROI 方面，还需要持续验证。\n\n但我对这个市场保持积极和乐观。原因是具身智能把 AI 从屏幕和软件带到真实世界，一旦技术和成本逐步成熟，它可能会影响制造、物流、商业服务、家庭服务、医疗康复、教育科研等很多场景。\n\n对我来说，作为一名新手 Consultant，我更希望保持长期主义：持续学习技术趋势、关注公司动态、积累人才地图，也用更真诚和专业的方式理解候选人和企业的真实需求。",
        en: "My current view on Embodied Intelligence is that it has significant long-term potential, but in the short term, many companies are still moving through R&D, prototype validation, data collection, pilot scenarios, and early commercialization.\n\nMany companies have made strong progress in motion control, robot hardware, foundation model integration, data collection, and public demonstrations. However, large-scale, stable, and repeatable commercialization still takes time. Cost, reliability, safety, generalization, supply chain maturity, and real-world ROI all need further validation.\n\nThat said, I remain positive and optimistic about this market. Embodied AI brings intelligence from screens and software into the physical world. Once technology and cost structures mature, it could influence manufacturing, logistics, commercial services, home services, rehabilitation, education, and research.\n\nAs a new consultant, I want to take a long-term view: continuously learning technology trends, following company updates, building talent maps, and understanding the real needs of candidates and companies with sincerity and professionalism.",
      },
    },
    companyRadarTitle: {
      zh: "具身智能公司雷达",
      en: "Embodied AI Company Radar",
    },
    companyRadarIntro: {
      zh: "以下是我正在持续关注的一些具身智能、机器人和人形机器人方向的代表公司。这个列表不是完整排名，而是一个用于理解行业生态、公司分布和人才机会的观察入口。",
      en: "Below are some representative companies I am following across Embodied AI, Robotics, and humanoid robots. This is not a complete ranking, but an entry point for understanding the industry ecosystem, company landscape, and talent opportunities.",
    },
    companyRadarDisclaimer: {
      zh: "代表公司观察，不代表排名",
      en: "Representative companies, not a ranking",
    },
    companyRadar: [
      {
        name: "Unitree Robotics",
        nameZh: "宇树科技",
        group: "china",
        region: { zh: "中国 · 杭州", en: "Hangzhou, China" },
        category: { zh: "四足机器人 / 人形机器人", en: "Quadruped Robots / Humanoid Robots" },
        description: {
          zh: "以高性能四足机器人和人形机器人出圈，是国内具身智能与机器人领域的代表公司之一。",
          en: "Known for high-performance quadruped and humanoid robots, Unitree is one of the representative robotics companies in China.",
        },
        logoPath: "/company-logos/unitree.svg",
        logoUrl: "",
        websiteUrl: "https://www.unitree.com/",
        fallbackIcon: "UR",
      },
      {
        name: "AgiBot",
        nameZh: "智元机器人",
        group: "china",
        region: { zh: "中国 · 上海", en: "Shanghai, China" },
        category: { zh: "通用具身机器人 / 人形机器人 / 数据平台", en: "General-purpose Embodied Robots / Humanoid Robots / Data Platform" },
        description: {
          zh: "聚焦通用具身机器人、人形机器人和数据平台，持续探索具身智能的产品化路径。",
          en: "Focuses on general-purpose embodied robots, humanoid robots, and data platforms while exploring productization paths for Embodied AI.",
        },
        logoPath: "/company-logos/agibot.ico",
        logoUrl: "",
        websiteUrl: "https://www.agibot.com/",
        fallbackIcon: "AG",
      },
      {
        name: "UBTECH",
        nameZh: "优必选",
        group: "china",
        region: { zh: "中国 · 深圳", en: "Shenzhen, China" },
        category: { zh: "人形机器人 / 服务机器人 / 工业场景", en: "Humanoid Robots / Service Robots / Industrial Scenarios" },
        description: {
          zh: "长期投入人形机器人和服务机器人，并积极推进工业场景中的机器人应用。",
          en: "Invests in humanoid and service robots while advancing robot applications across industrial scenarios.",
        },
        logoAltZh: "优必选 Logo",
        logoAltEn: "UBTECH logo",
        logoPath: "/company-logos/ubtech.png",
        logoUrl: "",
        websiteUrl: "https://www.ubtrobot.com/",
        fallbackIcon: "UB",
      },
      {
        name: "Fourier Intelligence",
        nameZh: "傅利叶智能",
        group: "china",
        region: { zh: "中国 · 上海", en: "Shanghai, China" },
        category: { zh: "通用人形机器人 / 康复机器人", en: "General-purpose Humanoid Robots / Rehabilitation Robots" },
        description: {
          zh: "从康复机器人积累出发，持续拓展通用人形机器人方向。",
          en: "Builds on rehabilitation robotics experience while expanding into general-purpose humanoid robots.",
        },
        logoPath: "/company-logos/fourier.ico",
        logoUrl: "",
        websiteUrl: "https://www.fftai.com/",
        fallbackIcon: "FT",
      },
      {
        name: "Galbot",
        nameZh: "银河通用",
        group: "china",
        region: { zh: "中国 · 北京", en: "Beijing, China" },
        category: { zh: "具身智能 / 通用机器人", en: "Embodied AI / General-purpose Robots" },
        description: {
          zh: "围绕具身智能和通用机器人展开探索，关注真实场景中的机器人能力。",
          en: "Explores Embodied AI and general-purpose robots with a focus on robot capabilities in real-world scenarios.",
        },
        logoPath: "/company-logos/galbot.gif",
        logoUrl: "",
        websiteUrl: "https://www.galbot.com/",
        fallbackIcon: "GB",
      },
      {
        name: "EngineAI",
        nameZh: "众擎机器人",
        group: "china",
        region: { zh: "中国", en: "China" },
        category: { zh: "人形机器人 / 通用机器人", en: "Humanoid Robots / General-purpose Robots" },
        description: {
          zh: "关注人形机器人与通用机器人产品，探索机器人本体和运动能力。",
          en: "Focuses on humanoid and general-purpose robot products while developing robot hardware and mobility.",
        },
        logoPath: "/company-logos/engineai.ico",
        logoUrl: "",
        websiteUrl: "https://www.engineai.com.cn/",
        fallbackIcon: "EA",
      },
      {
        name: "LimX Dynamics",
        nameZh: "逐际动力",
        group: "china",
        region: { zh: "中国 · 深圳", en: "Shenzhen, China" },
        category: { zh: "足式机器人 / 人形机器人 / 运动控制", en: "Legged Robots / Humanoid Robots / Motion Control" },
        description: {
          zh: "聚焦足式机器人、人形机器人和运动控制，持续提升复杂环境中的移动能力。",
          en: "Develops legged and humanoid robots with motion-control capabilities for increasingly complex environments.",
        },
        logoPath: "/company-logos/limx.ico",
        logoUrl: "",
        websiteUrl: "https://www.limxdynamics.com/",
        fallbackIcon: "LX",
      },
      {
        name: "Leju Robotics",
        nameZh: "乐聚机器人",
        group: "china",
        region: { zh: "中国 · 深圳", en: "Shenzhen, China" },
        category: { zh: "人形机器人 / 教育与服务场景", en: "Humanoid Robots / Education and Service Scenarios" },
        description: {
          zh: "围绕人形机器人产品，探索教育、服务与更多落地场景。",
          en: "Develops humanoid robot products for education, service, and additional application scenarios.",
        },
        logoPath: "/company-logos/leju.png",
        logoUrl: "",
        websiteUrl: "https://www.lejurobot.com/",
        fallbackIcon: "LJ",
      },
      {
        name: "Robot Era",
        nameZh: "星动纪元",
        group: "china",
        region: { zh: "中国", en: "China" },
        category: { zh: "人形机器人 / 具身智能", en: "Humanoid Robots / Embodied AI" },
        description: {
          zh: "关注人形机器人与具身智能，探索面向真实世界任务的机器人能力。",
          en: "Explores humanoid robots and Embodied AI capabilities for real-world tasks.",
        },
        logoPath: "/company-logos/robot-era.png",
        logoUrl: "",
        websiteUrl: "https://www.robotera.com/",
        fallbackIcon: "RE",
      },
      {
        name: "Deep Robotics",
        nameZh: "云深处科技",
        group: "china",
        region: { zh: "中国 · 杭州", en: "Hangzhou, China" },
        category: { zh: "四足机器人 / 行业巡检与特种场景", en: "Quadruped Robots / Inspection and Specialized Scenarios" },
        description: {
          zh: "以四足机器人为核心，面向巡检和特种场景推进机器人应用。",
          en: "Advances quadruped robot applications for inspection and specialized scenarios.",
        },
        logoPath: "/company-logos/deeprobotics.ico",
        logoUrl: "",
        websiteUrl: "https://www.deeprobotics.cn/",
        fallbackIcon: "DR",
      },
      {
        name: "Tesla Optimus",
        nameZh: "Tesla",
        group: "overseas",
        region: { zh: "美国", en: "United States" },
        category: { zh: "人形机器人 / 通用自动化", en: "Humanoid Robots / General Automation" },
        description: {
          zh: "以 Optimus 探索人形机器人和通用自动化，关注规模化制造与真实任务执行。",
          en: "Explores humanoid robots and general automation through Optimus, with attention to scalable manufacturing and real-world tasks.",
        },
        logoAltZh: "Tesla Logo",
        logoAltEn: "Tesla logo",
        logoPath: "/company-logos/tesla.ico",
        logoUrl: "",
        websiteUrl: "https://www.tesla.com/AI",
        fallbackIcon: "TS",
      },
      {
        name: "Figure AI",
        group: "overseas",
        region: { zh: "美国", en: "United States" },
        category: { zh: "人形机器人 / 工业与通用场景", en: "Humanoid Robots / Industrial and General Scenarios" },
        description: {
          zh: "聚焦人形机器人，探索工业和通用场景中的任务执行能力。",
          en: "Develops humanoid robots for task execution across industrial and general-purpose scenarios.",
        },
        logoPath: "/company-logos/figure.png",
        logoUrl: "",
        websiteUrl: "https://www.figure.ai/",
        fallbackIcon: "FG",
      },
      {
        name: "Agility Robotics",
        group: "overseas",
        region: { zh: "美国", en: "United States" },
        category: { zh: "双足机器人 / 仓储与物流", en: "Bipedal Robots / Warehousing and Logistics" },
        description: {
          zh: "以双足机器人为特色，关注仓储与物流等实际运营场景。",
          en: "Develops bipedal robots for practical operations such as warehousing and logistics.",
        },
        logoPath: "/company-logos/agility.png",
        logoUrl: "",
        websiteUrl: "https://agilityrobotics.com/",
        fallbackIcon: "AR",
      },
      {
        name: "Boston Dynamics",
        group: "overseas",
        region: { zh: "美国", en: "United States" },
        category: { zh: "足式机器人 / 工业机器人", en: "Legged Robots / Industrial Robots" },
        description: {
          zh: "以高动态足式机器人广为人知，持续探索工业机器人能力与应用。",
          en: "Known for highly dynamic legged robots, Boston Dynamics continues to explore industrial robot capabilities and applications.",
        },
        logoPath: "/company-logos/boston-dynamics.jpg",
        logoUrl: "",
        websiteUrl: "https://bostondynamics.com/",
        fallbackIcon: "BD",
      },
      {
        name: "1X Technologies",
        group: "overseas",
        region: { zh: "挪威 / 美国", en: "Norway / United States" },
        category: { zh: "人形机器人 / 家庭与通用机器人", en: "Humanoid Robots / Home and General-purpose Robots" },
        description: {
          zh: "探索面向家庭与通用任务的人形机器人，关注机器人走入日常环境的可能性。",
          en: "Explores humanoid robots for homes and general-purpose tasks, focusing on their potential in everyday environments.",
        },
        logoPath: "/company-logos/1x.png",
        logoUrl: "",
        websiteUrl: "https://www.1x.tech/",
        fallbackIcon: "1X",
      },
    ],
    zh: {
      zone: "机器人入口",
      label: "机器人侦察员",
      title: "具身智能与机器人方向",
      subtitle: "关注前沿 AI 与真实世界交互",
      content:
        "我正在持续学习具身智能、机器人、人形机器人、AI Infra、Embodied AI Engineer、Robotics Researcher 等方向。我希望理解技术趋势，也理解这些趋势背后的人才需求。\n\n我希望自己不只是知道这些公司名字，而是逐步理解它们的技术路线、商业化场景、人才结构和招聘需求。",
      tags: ["Embodied AI", "Robotics", "Humanoid Robots", "AI Infra"],
      cta: "继续浏览",
    },
    en: {
      zone: "Robotics Gate",
      label: "Robotics Scout",
      title: "Embodied AI & Robotics",
      subtitle: "Exploring frontier AI interacting with the physical world",
      content:
        "I am continuously learning about Embodied Intelligence, Robotics, Humanoid Robots, AI Infrastructure, Embodied AI Engineers, and Robotics Researchers. I want to understand not only the technology trends, but also the talent needs behind them.\n\nI do not want to simply recognize company names. I want to gradually understand their technical routes, commercialization scenarios, talent structures, and hiring needs.",
      tags: ["Embodied AI", "Robotics", "Humanoid Robots", "AI Infra"],
      cta: "Continue browsing",
    },
  },
  {
    id: "guild-master",
    type: "npc",
    variant: "guild-master",
    position: [-4.8, 0, 8],
    landmarkPosition: [-4.8, 0, 6.2],
    themeColor: "#a277ff",
    icon: "✦",
    discovered: false,
    modelId: "guild-master",
    fallbackType: "guild-master-procedural",
    animationProfile: "guild-greet",
    interactionStyle: "mentor",
    initialRotation: -3.03,
    externalLinks: [
      {
        label: {
          zh: "Leanovation Management Consulting",
          en: "Leanovation Management Consulting",
        },
        description: {
          zh: "访问 Leanovation 的 LinkedIn 公司主页，了解咨询实践与团队动态。",
          en: "Visit Leanovation's LinkedIn company page for consulting practice and team updates.",
        },
        url: "https://www.linkedin.com/company/leanovation-management-consulting-co-ltd/",
      },
    ],
    zh: {
      zone: "临诺公会",
      label: "公会负责人",
      title: "公会负责人",
      subtitle: "连接前沿科技公司与优秀候选人",
      content:
        "我目前在 Leanovation 担任具身智能方向 Associate Consultant，关注 AI、机器人和前沿科技公司的人才生态。我希望把行业研究、候选人沟通和长期信任关系结合起来。",
      tags: ["Leanovation", "Talent Consulting", "AI Hiring", "Candidate Mapping"],
      cta: "继续浏览",
    },
    en: {
      zone: "Leanovation Guild",
      label: "Leanovation Guild Master",
      title: "Leanovation Guild Master",
      subtitle: "Connecting frontier tech companies with outstanding talent",
      content:
        "I currently work as an Associate Consultant at Leanovation, focusing on talent ecosystems in Embodied Intelligence, Robotics, AI, and frontier technology companies. I aim to combine industry research, candidate communication, and long-term trust building.",
      tags: ["Leanovation", "Talent Consulting", "AI Hiring", "Candidate Mapping"],
      cta: "Continue browsing",
    },
  },
  {
    id: "insight-librarian",
    type: "npc",
    variant: "librarian",
    position: [7.7, 0, 10.95],
    landmarkPosition: [7.7, 0, 9.4],
    themeColor: "#ffb867",
    icon: "▤",
    discovered: false,
    modelId: "insight-librarian",
    fallbackType: "insight-librarian-procedural",
    animationProfile: "librarian-pages",
    interactionStyle: "warm",
    initialRotation: -2.82,
    featuredRepository: {
      name: "embodied_AI_daily",
      description: {
        zh: "持续整理具身智能领域的学习笔记、论文观察与每日探索。",
        en: "A growing collection of embodied AI learning notes, paper observations, and daily explorations.",
      },
      url: "https://github.com/VincentZJW/embodied_AI_daily",
    },
    zh: {
      zone: "行业笔记图书馆",
      label: "行业图书管理员",
      title: "行业笔记与研究",
      subtitle: "持续积累具身智能行业认知",
      content:
        "我会在这里持续整理具身智能日报、机器人公司研究、AI 人才市场观察和行业笔记。通过持续记录，我希望建立对行业、公司和人才生态的长期理解。",
      tags: ["Daily Notes", "Company Mapping", "AI Talent", "Industry Research"],
      cta: "继续浏览",
    },
    en: {
      zone: "Insight Library",
      label: "Insight Librarian",
      title: "Insights & Research Notes",
      subtitle: "Building long-term understanding of the Embodied AI ecosystem",
      content:
        "I use this section to organize my Embodied AI daily notes, robotics company research, AI talent market observations, and industry insights. Through continuous documentation, I aim to build long-term understanding of the industry, companies, and talent ecosystem.",
      tags: ["Daily Notes", "Company Mapping", "AI Talent", "Industry Research"],
      cta: "Continue browsing",
    },
  },
  {
    id: "career-fog-dragon",
    type: "boss",
    position: [-12.1, 0, 11.1],
    landmarkPosition: [-13.2, 0, 13],
    themeColor: "#9b8cff",
    icon: "◇",
    discovered: false,
    modelId: "career-fog-dragon",
    fallbackType: "career-fog-dragon-procedural",
    animationProfile: "fog-dragon-pulse",
    interactionStyle: "boss",
    secondaryCta: {
      zh: "和我交流",
      en: "Let's Connect",
    },
    extraSections: [
      {
        title: {
          zh: "雾中线索",
          en: "Clues in the Fog",
        },
        items: [
          {
            zh: "咨询训练让我习惯从模糊问题中寻找结构，而不是等待所有条件齐备。",
            en: "Consulting training taught me to find structure in ambiguous problems instead of waiting for perfect conditions.",
          },
          {
            zh: "数据能力帮助我验证判断、快速学习，也让我更坦然地修正方向。",
            en: "Data skills help me test assumptions, learn quickly, and adjust direction without defensiveness.",
          },
          {
            zh: "我希望在 AI、策略与产品交汇处，持续创造可落地的价值。",
            en: "I want to keep creating practical value where AI, strategy, and product thinking meet.",
          },
        ],
      },
      {
        title: {
          zh: "下一段旅程",
          en: "The Next Chapter",
        },
        items: [
          {
            zh: "保持开放，主动探索值得投入的行业、团队与问题。",
            en: "Stay open and actively explore industries, teams, and problems worth committing to.",
          },
          {
            zh: "在不确定性中保持行动，以持续积累代替一次性答案。",
            en: "Keep moving through uncertainty, building durable progress instead of chasing one definitive answer.",
          },
        ],
      },
    ],
    zh: {
      zone: "成长挑战",
      label: "职场迷雾",
      title: "职场迷雾：在不确定性中持续成长",
      subtitle: "在不确定性中保持清醒、好奇与行动",
      content:
        "作为一名刚刚踏入咨询行业的新手，我并不把未来的不确定性视为需要回避的阻碍。小镇中的职场迷雾龙，是那些暂时没有标准答案问题的象征：新的行业、新的团队、新的技术浪潮，以及每一次需要重新理解自己的时刻。\n\n我愿意带着好奇心进入迷雾，用结构化思考拆解复杂问题，用数据验证判断，用行动积累经验。方向可以在探索中逐渐清晰，重要的是持续学习、保持开放，并在变化里创造真实价值。",
      tags: ["咨询新手", "不确定性", "持续学习", "积极探索"],
      cta: "继续浏览",
    },
    en: {
      zone: "Growth Challenge",
      label: "Career Fog",
      title: "Career Fog: Growing Through Uncertainty",
      subtitle: "Stay clear-minded, curious, and active through uncertainty",
      content:
        "As a newcomer entering consulting, I do not see uncertainty as something to avoid. The town's Career Fog Dragon is a symbol for questions without immediate standard answers: new industries, new teams, new technology shifts, and the moments when I need to understand myself again.\n\nI want to enter the fog with curiosity, use structured thinking to break down complex problems, test judgment with data, and build experience through action. Direction can become clearer through exploration. What matters is learning continuously, staying open, and creating real value through change.",
      tags: ["Consulting Newcomer", "Uncertainty", "Continuous Learning", "Exploration"],
      cta: "Continue browsing",
    },
  },
  {
    id: "contact-portal",
    type: "portal",
    position: [14.2, 0, 3],
    landmarkPosition: [14.2, 0, 3],
    themeColor: "#4de8ff",
    icon: "◎",
    discovered: false,
    modelId: "contact-portal",
    fallbackType: "portal-procedural",
    animationProfile: "portal-guide",
    interactionStyle: "portal",
    zh: {
      zone: "联系方式",
      label: "联系 Vincent",
      title: "联系我",
      subtitle: "欢迎交流 AI、机器人和具身智能方向机会",
      content:
        "如果你正在关注 AI、机器人、具身智能方向的职业机会，或者希望交流行业人才信息，欢迎联系我。",
      tags: ["LinkedIn", "GitHub", "Email"],
      cta: "建立连接",
    },
    en: {
      zone: "Contact",
      label: "Connect with Vincent",
      title: "Connect With Me",
      subtitle: "Let's discuss AI, Robotics, and Embodied Intelligence opportunities",
      content:
        "If you are exploring opportunities in AI, Robotics, or Embodied Intelligence, or would like to discuss talent and market insights, feel free to connect with me.",
      tags: ["LinkedIn", "GitHub", "Email"],
      cta: "Connect",
    },
  },
];

export const collisionObstacles = [
  { position: [-11.3, -7.5] as const, radius: 2.35 },
  { position: [11.5, -7] as const, radius: 2.55 },
  { position: [-4.8, 6.2] as const, radius: 2.85 },
  { position: [7.7, 9.4] as const, radius: 2.72 },
  { position: [-13.2, 13] as const, radius: 3.8 },
  { position: [14.2, 3] as const, radius: 2.5 },
];

export function getNodeCopy(object: GameObject, language: Language) {
  return object[language];
}
