'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { MeatCut, MeatType } from '@/lib/meat-cuts-data';
import { saveMeatCutOverride } from '@/lib/firebase/firestore';

interface MeatCutEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  cut: MeatCut;
  meatType: MeatType;
  categoryKey: string;
  cutIndex: number;
  isHalal: boolean;
  onSave: (updatedCut: MeatCut) => void;
}

export default function MeatCutEditModal({
  isOpen,
  onClose,
  cut,
  meatType,
  categoryKey,
  cutIndex,
  isHalal,
  onSave,
}: MeatCutEditModalProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<MeatCut>(cut);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof MeatCut, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await saveMeatCutOverride(meatType, categoryKey, cutIndex, formData);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>부위 정보 수정</span>
            <span className="text-sm font-normal text-gray-500">
              {formData.ko} / {formData.en}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Peak Code */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="peakCode" className="text-right text-sm">
              Peak 코드
            </Label>
            <Input
              id="peakCode"
              value={formData.peakCode || ''}
              onChange={(e) => handleChange('peakCode', e.target.value)}
              className="col-span-3"
              placeholder="예: 0001"
            />
          </div>

          {/* Korean */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ko" className="text-right text-sm">
              {t('dictionary.korean')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ko"
              value={formData.ko}
              onChange={(e) => handleChange('ko', e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* English */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="en" className="text-right text-sm">
              {t('dictionary.english')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="en"
              value={formData.en}
              onChange={(e) => handleChange('en', e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Thai */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="th" className="text-right text-sm">
              {t('dictionary.thai')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="th"
              value={formData.th}
              onChange={(e) => handleChange('th', e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Myanmar */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="my" className="text-right text-sm">
              Myanmar
            </Label>
            <Input
              id="my"
              value={formData.my || ''}
              onChange={(e) => handleChange('my', e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Arabic (only for Halal) */}
          {isHalal && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ar" className="text-right text-sm">
                  {t('dictionary.arabic')} <span className="text-green-600">☪</span>
                </Label>
                <Input
                  id="ar"
                  value={formData.ar || ''}
                  onChange={(e) => handleChange('ar', e.target.value)}
                  className="col-span-3"
                  dir="rtl"
                  placeholder="아랍어"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arKo" className="text-right text-sm">
                  아랍어 발음
                </Label>
                <Input
                  id="arKo"
                  value={formData.arKo || ''}
                  onChange={(e) => handleChange('arKo', e.target.value)}
                  className="col-span-3"
                  placeholder="한국어 발음"
                />
              </div>
            </>
          )}

          {/* US Cut */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="us" className="text-right text-sm">
              {t('dictionary.us')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="us"
              value={formData.us}
              onChange={(e) => handleChange('us', e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Note */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right text-sm">
              {t('dictionary.note')}
            </Label>
            <Input
              id="note"
              value={formData.note || ''}
              onChange={(e) => handleChange('note', e.target.value)}
              className="col-span-3"
              placeholder="비고"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              t('common.save')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
