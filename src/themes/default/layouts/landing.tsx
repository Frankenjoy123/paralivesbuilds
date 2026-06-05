import { ReactNode } from 'react';

import { getThemeBlock } from '@/core/theme';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';

export default async function LandingLayout({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: HeaderType;
  footer: FooterType;
}) {
  const Header = await getThemeBlock('paralives-header');
  const Footer = await getThemeBlock('paralives-footer');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header header={header} />
      <main className="relative isolate min-h-screen overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
