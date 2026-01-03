'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Upload, Settings, Home } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';

export default function HomePage() {
  const t = useTranslations();

  const menuItems = [
    {
      href: '/products',
      icon: Package,
      label: t('nav.products'),
      description: t('product.title'),
    },
    {
      href: '/upload',
      icon: Upload,
      label: t('nav.upload'),
      description: t('upload.title'),
    },
    {
      href: '/settings',
      icon: Settings,
      label: t('nav.settings'),
      description: t('nav.settings'),
    },
  ];

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">{t('common.appName')}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t('common.appName')}
          </h1>
          <p className="text-muted-foreground">
            {t('common.appDescription')}
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-colors hover:bg-accent cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Species Quick Access */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{t('common.filter')}</h2>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" className="gap-2" style={{ borderColor: '#f472b6' }}>
              <span className="text-lg">🐷</span>
              {t('species.pork')}
            </Button>
            <Button variant="outline" className="gap-2" style={{ borderColor: '#dc2626' }}>
              <span className="text-lg">🐄</span>
              {t('species.beef')}
            </Button>
            <Button variant="outline" className="gap-2" style={{ borderColor: '#fbbf24' }}>
              <span className="text-lg">🐔</span>
              {t('species.chicken')}
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-4 h-16">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">{t('nav.home')}</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
            <Package className="h-5 w-5" />
            <span className="text-xs">{t('nav.products')}</span>
          </Link>
          <Link href="/upload" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
            <Upload className="h-5 w-5" />
            <span className="text-xs">{t('nav.upload')}</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t('nav.settings')}</span>
          </Link>
        </div>
      </nav>
    </div>
    </AuthGuard>
  );
}
