import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PSOM - Product Spec Operation Management',
  description: 'Meet365 제품 온톨로지 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
