import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { ProductSpec, SpecMedia, PartMaster, SupplierMaster } from '@/types/schema';

// Collection names
export const COLLECTIONS = {
  PRODUCT_SPECS: 'productSpecs',
  SPEC_MEDIA: 'specMedia',
  PART_MASTER: 'partMaster',
  SUPPLIER_MASTER: 'supplierMaster',
  MEAT_DICTIONARY: 'meatDictionary',
} as const;

// Generic CRUD helpers
export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

export async function getDocuments<T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...queryConstraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: WithFieldValue<T>
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

// ProductSpec specific functions
export async function getProductSpec(peakCode: string): Promise<ProductSpec | null> {
  return getDocument<ProductSpec>(COLLECTIONS.PRODUCT_SPECS, peakCode);
}

export async function getProductSpecs(
  species?: 'P' | 'B' | 'C',
  storage?: 'C' | 'F',
  tradeType?: '1' | '2'
): Promise<ProductSpec[]> {
  const constraints: QueryConstraint[] = [];

  if (tradeType) {
    constraints.push(where('tradeType', '==', tradeType));
  }
  if (species) {
    constraints.push(where('species', '==', species));
  }
  if (storage) {
    constraints.push(where('storage', '==', storage));
  }
  constraints.push(where('isActive', '==', true));
  constraints.push(orderBy('sortOrder', 'asc'));

  return getDocuments<ProductSpec>(COLLECTIONS.PRODUCT_SPECS, ...constraints);
}

export async function getProductSpecsByPart(partCode: string): Promise<ProductSpec[]> {
  return getDocuments<ProductSpec>(
    COLLECTIONS.PRODUCT_SPECS,
    where('partCode', '==', partCode),
    where('isActive', '==', true),
    orderBy('sortOrder', 'asc')
  );
}

// SpecMedia specific functions
export async function getSpecMedia(
  peakCode: string,
  category?: 'approved' | 'rejected' | 'reference' | 'training'
): Promise<SpecMedia[]> {
  const constraints: QueryConstraint[] = [
    where('peakCode', '==', peakCode),
  ];

  if (category) {
    constraints.push(where('category', '==', category));
  }
  constraints.push(orderBy('createdAt', 'desc'));

  return getDocuments<SpecMedia>(COLLECTIONS.SPEC_MEDIA, ...constraints);
}

export async function getMediaByBaseCode(
  baseCode: string,
  category?: 'approved' | 'rejected' | 'reference' | 'training'
): Promise<SpecMedia[]> {
  const constraints: QueryConstraint[] = [
    where('baseCode', '==', baseCode),
  ];

  if (category) {
    constraints.push(where('category', '==', category));
  }
  constraints.push(orderBy('createdAt', 'desc'));

  return getDocuments<SpecMedia>(COLLECTIONS.SPEC_MEDIA, ...constraints);
}

// PartMaster functions
export async function getPartMaster(partCode: string): Promise<PartMaster | null> {
  return getDocument<PartMaster>(COLLECTIONS.PART_MASTER, partCode);
}

export async function getPartsBySpecies(species: 'P' | 'B' | 'C'): Promise<PartMaster[]> {
  return getDocuments<PartMaster>(
    COLLECTIONS.PART_MASTER,
    where('species', '==', species),
    where('isActive', '==', true),
    orderBy('sortOrder', 'asc')
  );
}

// SupplierMaster functions
export async function getSupplierMaster(supplierCode: string): Promise<SupplierMaster | null> {
  return getDocument<SupplierMaster>(COLLECTIONS.SUPPLIER_MASTER, supplierCode);
}

export async function getSuppliers(): Promise<SupplierMaster[]> {
  return getDocuments<SupplierMaster>(
    COLLECTIONS.SUPPLIER_MASTER,
    where('isActive', '==', true)
  );
}

// Peak code parser utility
export function parsePeakCode(code: string): {
  tradeType: string;
  storage: string;
  species: string;
  supplierCode: string;
  partCode: string;
  variant: string | null;
} | null {
  const match = code.match(/^(\d)-([CF])([PBC])(\d{2})(\d{4})(.*)$/);
  if (!match) return null;

  return {
    tradeType: match[1],
    storage: match[2],
    species: match[3],
    supplierCode: match[4],
    partCode: match[5],
    variant: match[6]?.replace(/^-/, '') || null,
  };
}

// Generate base code from peak code
export function getBaseCode(peakCode: string): string {
  const match = peakCode.match(/^(\d-[CF][PBC]\d{2}\d{4})/);
  return match ? match[1] : peakCode;
}

// MeatDictionary functions
import type { MeatCut, MeatType } from '@/lib/meat-cuts-data';

export interface MeatCutDocument extends MeatCut {
  id: string;
  meatType: MeatType;
  categoryKey: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function getMeatCutOverrides(): Promise<MeatCutDocument[]> {
  return getDocuments<MeatCutDocument>(
    COLLECTIONS.MEAT_DICTIONARY,
    orderBy('updatedAt', 'desc')
  );
}

export async function saveMeatCutOverride(
  meatType: MeatType,
  categoryKey: string,
  cutIndex: number,
  cutData: MeatCut
): Promise<string> {
  const docId = `${meatType}_${categoryKey}_${cutIndex}`;
  const docRef = doc(db, COLLECTIONS.MEAT_DICTIONARY, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      ...cutData,
      meatType,
      categoryKey,
      updatedAt: serverTimestamp(),
    });
    return docId;
  } else {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(docRef, {
      ...cutData,
      meatType,
      categoryKey,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docId;
  }
}

export async function deleteMeatCutOverride(
  meatType: MeatType,
  categoryKey: string,
  cutIndex: number
): Promise<void> {
  const docId = `${meatType}_${categoryKey}_${cutIndex}`;
  await deleteDocument(COLLECTIONS.MEAT_DICTIONARY, docId);
}

// Re-export Firestore utilities
export { where, orderBy, limit, serverTimestamp, Timestamp };
