// Firebase configuration and instances
export { db, storage, auth } from './config';

// Firestore helpers
export {
  COLLECTIONS,
  getDocument,
  getDocuments,
  addDocument,
  setDocument,
  deleteDocument,
  getProductSpec,
  getProductSpecs,
  getProductSpecsByPart,
  getSpecMedia,
  getMediaByBaseCode,
  getPartMaster,
  getPartsBySpecies,
  getSupplierMaster,
  getSuppliers,
  parsePeakCode,
  getBaseCode,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from './firestore';

// Storage helpers
export {
  STORAGE_PATHS,
  uploadFile,
  uploadFiles,
  deleteFile,
  getFileUrl,
  validateFile,
  compressImage,
} from './storage';
