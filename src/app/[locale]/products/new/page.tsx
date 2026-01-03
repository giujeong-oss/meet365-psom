'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ProductForm from '@/components/products/ProductForm';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import { ArrowLeft, Home, Package, Upload, Settings } from 'lucide-react';

export default function NewProductPage() {
  const t = useTranslations();

  const handleSubmit = async (data: unknown) => {
    // TODO: Save to Firestore when Firebase is configured
    // For now, just log and redirect
    // eslint-disable-next-line no-console
    console.log('New product data:', data);
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link href="/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-bold text-lg flex-1">{t('product.new')}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4">
        <ProductForm onSubmit={handleSubmit} />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-4 h-16">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">{t('nav.home')}</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center justify-center gap-1 text-primary">
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
