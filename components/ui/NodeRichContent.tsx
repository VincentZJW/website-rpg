import type { GameObject } from "@/lib/game-data";
import type { Language } from "@/lib/translations";
import { CompanyRadar } from "@/components/ui/CompanyRadar";

type NodeRichContentProps = {
  object: GameObject;
  language: Language;
};

const sectionLabels = {
  featuredProjects: {
    zh: "项目作品",
    en: "Featured Projects",
  },
  featuredRepository: {
    zh: "精选仓库",
    en: "Featured Repository",
  },
  relatedLinks: {
    zh: "相关链接",
    en: "Related Links",
  },
} as const;

function ExternalIcon() {
  return (
    <span className="node-link-icon" aria-hidden="true">
      ↗
    </span>
  );
}

export function NodeRichContent({ object, language }: NodeRichContentProps) {
  if (
    !object.marketView &&
    !object.companyRadar?.length &&
    !object.featuredProjects?.length &&
    !object.featuredRepository &&
    !object.externalLinks?.length &&
    !object.extraSections?.length
  ) {
    return null;
  }

  return (
    <div className="node-rich-content">
      <CompanyRadar language={language} object={object} />

      {object.featuredProjects?.length ? (
        <section className="node-rich-section">
          <p className="node-rich-title">{sectionLabels.featuredProjects[language]}</p>
          {object.featuredProjectsIntro ? <p className="node-rich-intro">{object.featuredProjectsIntro[language]}</p> : null}
          <div className="node-link-grid">
            {object.featuredProjects.map((project) => (
              <a className="node-link-card" href={project.url} key={project.url} rel="noreferrer noopener" target="_blank">
                <strong>
                  {project.name}
                  <ExternalIcon />
                </strong>
                <span>{project.description[language]}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {object.featuredRepository ? (
        <section className="node-rich-section">
          <p className="node-rich-title">{sectionLabels.featuredRepository[language]}</p>
          <div className="node-link-grid">
            <a className="node-link-card" href={object.featuredRepository.url} rel="noreferrer noopener" target="_blank">
              <strong>
                {object.featuredRepository.name}
                <ExternalIcon />
              </strong>
              <span>{object.featuredRepository.description[language]}</span>
            </a>
          </div>
        </section>
      ) : null}

      {object.externalLinks?.length ? (
        <section className="node-rich-section">
          <p className="node-rich-title">{sectionLabels.relatedLinks[language]}</p>
          <div className="node-link-grid">
            {object.externalLinks.map((link) => (
              <a className="node-link-card" href={link.url} key={link.url} rel="noreferrer noopener" target="_blank">
                <strong>
                  {link.label[language]}
                  <ExternalIcon />
                </strong>
                <span>{link.description[language]}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {object.extraSections?.map((section) => (
        <section className="node-rich-section node-extra-section" key={section.title.en}>
          <p className="node-rich-title">{section.title[language]}</p>
          <ul>
            {section.items.map((item) => (
              <li key={item.en}>{item[language]}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
