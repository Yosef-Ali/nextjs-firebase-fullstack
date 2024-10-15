import admin from 'firebase-admin'

interface FirebaseAdminAppParams {
  projectId: string
  clientEmail: string
  privateKey: string
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n')
}

export function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app()
  }

  const params: FirebaseAdminAppParams = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
  }

  if (!params.projectId || !params.clientEmail || !params.privateKey) {
    throw new Error('Missing Firebase Admin configuration. Please check your environment variables.')
  }

  const privateKey = formatPrivateKey(params.privateKey)

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: params.projectId,
      clientEmail: params.clientEmail,
      privateKey: privateKey,
    }),
  })
}

export function getFirestore() {
  initializeFirebaseAdmin()
  return admin.firestore()
}