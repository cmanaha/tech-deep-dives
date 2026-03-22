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

interface DeepDiveLayoutProps {
  title: string;
  subtitle?: string;
  sections: Section[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: React.ReactNode;
}

export function DeepDiveLayout({
  title,
  subtitle,
  sections,
  activeSection,
  onSectionChange,
  children,
}: DeepDiveLayoutProps) {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <>
      <TopNavigation
        identity={{
          href: '/',
          title: 'Tech Deep Dives',
        }}
        utilities={[
          {
            type: 'button',
            text: 'GitHub',
            href: 'https://github.com/cmanaha/tech-deep-dives',
            external: true,
          },
        ]}
      />
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Deep Dives', href: '/' },
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
