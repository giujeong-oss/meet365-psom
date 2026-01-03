'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Home,
  Package,
  Upload,
  Settings,
  Globe,
  Database,
  Info,
  User,
  LogOut,
  Shield,
} from 'lucide-react';

const ADMIN_EMAIL = 'giujeong@meet365.net';

export default function SettingsPage() {
  const t = useTranslations();
  const { user, signOut } = useAuth();

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            <Home className="h-5 w-5" />
          </Link>
          <Link href="/products" className="text-muted-foreground hover:text-primary">
            <Package className="h-5 w-5" />
          </Link>
          <h1 className="font-bold text-lg flex-1">{t('nav.settings')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4 space-y-4">
        {/* User Account */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('auth.account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              {user?.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              {t('auth.signOut')}
            </Button>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('language.select')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Firebase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project</span>
              <span className="font-mono">meet365-12ce8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-600">{t('auth.connected')}</span>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t('common.appName')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>0.1.0 (MVP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span>{t('common.appDescription')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/products/new"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
            >
              <Package className="h-4 w-4" />
              <span>{t('product.new')}</span>
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
            >
              <Upload className="h-4 w-4" />
              <span>{t('upload.title')}</span>
            </Link>
          </CardContent>
        </Card>

        {/* Admin Panel (Admin only) */}
        {user?.email === ADMIN_EMAIL && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                <Shield className="h-4 w-4" />
                {t('admin.devMenu')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-orange-600 mb-3">{t('admin.devMenuNote')}</p>
              <Link href="/admin">
                <Button variant="outline" className="w-full gap-2 border-orange-300">
                  <Database className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-4 h-16">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">{t('nav.home')}</span>
          </Link>
          <Link
            href="/products"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">{t('nav.products')}</span>
          </Link>
          <Link
            href="/upload"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">{t('nav.upload')}</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center justify-center gap-1 text-primary"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t('nav.settings')}</span>
          </Link>
        </div>
      </nav>
    </div>
    </AuthGuard>
  );
}
