import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

interface Section {
  id: string;
  title: string;
  icon?: string;
}

export interface SiblingDeepDive {
  label: string;
  href: string;
}

interface DeepDiveLayoutProps {
  title: string;
  subtitle?: string;
  sections: Section[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: React.ReactNode;
  // Other deep dives in the same site, surfaced as TopNavigation utility
  // buttons so the reader can jump from one deep dive to another without
  // going back to the landing index. Hrefs are relative (e.g. "../efa/")
  // so the navigation works under any sub-path on GitHub Pages.
  siblings?: SiblingDeepDive[];
}

export function DeepDiveLayout({
  title,
  subtitle,
  sections,
  activeSection,
  onSectionChange,
  children,
  siblings = [],
}: DeepDiveLayoutProps) {
  const [navOpen, setNavOpen] = useState(true);

  const utilities = [
    ...siblings.map((s) => ({
      type: 'button' as const,
      text: s.label,
      href: s.href,
      // Not external — sibling deep dives live on the same Pages site, so
      // we want default in-tab navigation rather than the external-link icon.
      external: false,
    })),
    {
      type: 'button' as const,
      text: 'GitHub',
      href: 'https://github.com/cmanaha/tech-deep-dives',
      external: true,
    },
  ];

  return (
    <>
      <TopNavigation
        identity={{
          // Relative path back to the landing index that lists every deep
          // dive. Works on root-domain Pages and sub-path Pages alike.
          href: '../',
          title: 'Tech Deep Dives',
        }}
        utilities={utilities}
      />
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Deep Dives', href: '../' },
              { text: title, href: '#' },
            ]}
          />
        }
        navigation={
          <SideNavigation
            header={{ text: title, href: '#' }}
            items={sections.map((s) => ({
              type: 'link' as const,
              text: s.title,
              href: `#${s.id}`,
            }))}
            activeHref={`#${activeSection}`}
            onFollow={(e) => {
              e.preventDefault();
              const id = e.detail.href.replace('#', '');
              onSectionChange(id);
            }}
          />
        }
        navigationOpen={navOpen}
        onNavigationChange={({ detail }) => setNavOpen(detail.open)}
        content={children}
        toolsHide
      />
    </>
  );
}
