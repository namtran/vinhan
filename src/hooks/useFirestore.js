import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Hook to get all documents from a collection with real-time updates
export function useCollection(collectionName, orderByField = null) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, collectionName);

    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Kết nối Firebase quá chậm. Vui lòng kiểm tra Firestore Rules.');
        setLoading(false);
      }
    }, 10000);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        clearTimeout(timeoutId);
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        clearTimeout(timeoutId);
        console.error('Firestore error:', err);
        let errorMessage = err.message;
        if (err.code === 'permission-denied') {
          errorMessage = 'Không có quyền truy cập. Vui lòng kiểm tra Firestore Rules trong Firebase Console.';
        }
        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [collectionName, orderByField]);

  return { documents, loading, error };
}

// Hook to get a single document
export function useDocument(collectionName, documentId) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDocument({ id: snapshot.id, ...snapshot.data() });
        } else {
          setDocument(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { document, loading, error };
}

// CRUD operations
export async function addDocument(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

// Set document with specific ID (create or overwrite)
export async function setDocumentWithId(collectionName, documentId, data) {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export async function updateDocument(collectionName, documentId, data) {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteDocument(collectionName, documentId) {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
}

// Get documents by field value
export async function getDocumentsByField(collectionName, field, value) {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
