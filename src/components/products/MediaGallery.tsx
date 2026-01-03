'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, XCircle, BookOpen, GraduationCap, ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteDocument, COLLECTIONS } from '@/lib/firebase/firestore';
import { deleteFile } from '@/lib/firebase/storage';
import type { SpecMedia, MediaCategory } from '@/types';

interface MediaGalleryProps {
  media: SpecMedia[];
  peakCode: string;
  onMediaDeleted?: (mediaId: string) => void;
}

const categoryConfig: Record<
  MediaCategory,
  { icon: typeof CheckCircle; color: string; bgColor: string }
> = {
  approved: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
  rejected: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  reference: { icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  training: { icon: GraduationCap, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
};

export default function MediaGallery({ media, peakCode, onMediaDeleted }: MediaGalleryProps) {
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState<SpecMedia | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!selectedImage) return;

    setIsDeleting(true);
    try {
      // Delete from Storage if path exists
      if (selectedImage.file.url) {
        try {
          // Extract path from URL or use stored path
          const urlPath = selectedImage.file.url;
          if (urlPath.includes('firebase')) {
            // Try to delete from storage
            const pathMatch = urlPath.match(/o\/(.+?)\?/);
            if (pathMatch) {
              const storagePath = decodeURIComponent(pathMatch[1]);
              await deleteFile(storagePath);
            }
          }
        } catch (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }

      // Delete from Firestore
      await deleteDocument(COLLECTIONS.SPEC_MEDIA, selectedImage.id);

      // Notify parent
      onMediaDeleted?.(selectedImage.id);

      // Close dialogs
      setShowDeleteConfirm(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const categories: MediaCategory[] = ['approved', 'rejected', 'reference', 'training'];

  const getMediaByCategory = (category: MediaCategory) =>
    media.filter((m) => m.category === category);

  const getCategoryCount = (category: MediaCategory) =>
    getMediaByCategory(category).length;

  return (
    <>
      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          {categories.map((category) => {
            const config = categoryConfig[category];
            const count = getCategoryCount(category);
            const Icon = config.icon;

            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-background"
              >
                <div className="flex items-center gap-1">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className="text-xs font-medium">{count}</span>
                </div>
                <span className="text-xs">{t(`category.${category}`)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => {
          const categoryMedia = getMediaByCategory(category);
          const config = categoryConfig[category];

          return (
            <TabsContent key={category} value={category} className="mt-4">
              {categoryMedia.length === 0 ? (
                <Card className={`p-8 ${config.bgColor}`}>
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm">{t('common.noData')}</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {categoryMedia.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(item)}
                    >
                      {item.file.thumbnailUrl || item.file.url ? (
                        <Image
                          src={item.file.thumbnailUrl || item.file.url}
                          alt={`${peakCode} - ${category}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      {/* Defect Badge for rejected items */}
                      {category === 'rejected' && item.qualityInfo && (
                        <Badge
                          variant="destructive"
                          className="absolute bottom-1 left-1 text-[10px] px-1 py-0"
                        >
                          {item.qualityInfo.severity}
                        </Badge>
                      )}

                      {/* Tags indicator */}
                      {item.tags.length > 0 && (
                        <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
                          {item.tags.length} tags
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage && !showDeleteConfirm} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">
            {peakCode} - {t('product.media')}
          </DialogTitle>
          {selectedImage && (
            <div className="relative">
              <div className="relative aspect-[4/3]">
                {selectedImage.file.url ? (
                  <Image
                    src={selectedImage.file.url}
                    alt={peakCode}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={categoryConfig[selectedImage.category].bgColor}
                    variant="outline"
                  >
                    {t(`category.${selectedImage.category}`)}
                  </Badge>
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedImage.qualityInfo && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">{t('quality.defectType')}</p>
                    <p className="font-medium text-red-600">
                      {selectedImage.qualityInfo.defectType}
                    </p>
                  </div>
                )}

                {selectedImage.metadata.lotNumber && (
                  <p className="text-xs text-muted-foreground">
                    Lot: {selectedImage.metadata.lotNumber}
                  </p>
                )}

                {/* Delete Button */}
                <div className="pt-2 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent aria-describedby="delete-dialog-description">
          <DialogTitle>{t('common.deleteConfirm')}</DialogTitle>
          <DialogDescription id="delete-dialog-description">
            {t('media.deleteWarning')}
          </DialogDescription>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('common.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
