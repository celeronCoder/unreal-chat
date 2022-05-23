/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APPWRITE_ADMIN_API_KEY: string;
	readonly VITE_APPWRITE_PROJECT_ID: string;
	readonly VITE_APPWRITE_API_ENDPOINT: string;
	readonly VITE_APPWRITE_COLLECTION_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
