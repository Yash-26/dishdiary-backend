import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Verifying ID tokens only needs the project id (Google's public keys are used),
// so no service account file is required.
if (!getApps().length) {
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'dishdiary-fa4a6' });
}

export const adminAuth = getAuth();
