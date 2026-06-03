"use client";

import type { ReactNode } from "react";
import { LogoOrFallback } from "@/components/ui/LogoOrFallback";
import type { CompanyRadarEntry, CompanyRadarGroup, GameObject } from "@/lib/game-data";
import type { Language } from "@/lib/translations";

type CompanyRadarProps = {
  object: GameObject;
  language: Language;
};

const groupLabels: Record<CompanyRadarGroup, Record<Language, string>> = {
  china: {
    zh: "中国公司",
    en: "China-based Companies",
  },
  overseas: {
    zh: "海外代表",
    en: "Overseas Representatives",
  },
};

function CompanyCard({ company, language }: { company: CompanyRadarEntry; language: Language }) {
  const primaryName = language === "zh" && company.nameZh ? company.nameZh : company.name;
  const secondaryName = company.nameZh ? (language === "zh" ? company.name : company.nameZh) : null;
  const cardContent: ReactNode = (
    <>
      <LogoOrFallback
        alt={language === "zh" ? company.logoAltZh ?? `${primaryName} Logo` : company.logoAltEn ?? `${primaryName} logo`}
        fallbackIcon={company.fallbackIcon}
        logoPath={company.logoPath}
        logoUrl={company.logoUrl}
      />
      <span className="company-card-copy">
        <strong>
          {primaryName}
          {company.websiteUrl ? <span className="company-link-icon" aria-hidden="true">↗</span> : null}
        </strong>
        {secondaryName ? <small className="company-secondary-name">{secondaryName}</small> : null}
        <span className="company-region">{company.region[language]}</span>
        <span className="company-category">{company.category[language]}</span>
        <span className="company-description">{company.description[language]}</span>
      </span>
    </>
  );

  if (company.websiteUrl) {
    return (
      <a className="company-card company-card-link" href={company.websiteUrl} rel="noreferrer noopener" target="_blank">
        {cardContent}
      </a>
    );
  }

  return <article className="company-card">{cardContent}</article>;
}

export function CompanyRadar({ object, language }: CompanyRadarProps) {
  const companies = object.companyRadar ?? [];

  if (!object.marketView && !companies.length) return null;

  return (
    <>
      {object.marketView ? (
        <section className="node-rich-section market-view">
          <p className="node-rich-title">{object.marketView.title[language]}</p>
          <p>{object.marketView.content[language]}</p>
        </section>
      ) : null}

      {companies.length && object.companyRadarTitle && object.companyRadarIntro ? (
        <section className="node-rich-section company-radar">
          <p className="node-rich-title">{object.companyRadarTitle[language]}</p>
          <p className="node-rich-intro">{object.companyRadarIntro[language]}</p>
          {object.companyRadarDisclaimer ? <p className="company-radar-disclaimer">{object.companyRadarDisclaimer[language]}</p> : null}
          {(["china", "overseas"] as CompanyRadarGroup[]).map((group) => {
            const groupedCompanies = companies.filter((company) => company.group === group);
            if (!groupedCompanies.length) return null;
            return (
              <div className="company-radar-group" key={group}>
                <p>{groupLabels[group][language]}</p>
                <div className="company-radar-grid">
                  {groupedCompanies.map((company) => (
                    <CompanyCard company={company} key={company.name} language={language} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}
    </>
  );
}
