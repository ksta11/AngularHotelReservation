// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // URL de la API en desarrollo
  cloudinary: {
    cloudName: 'dggzv9eld',
    apiKey: '834626417328662',
    uploadUrl: 'https://api.cloudinary.com/v1_1/dggzv9eld/image/upload',
    uploadPreset: 'cargolinkimg' // Cambiado al preset que funciona en tu implementación de Next.js
  }
};
