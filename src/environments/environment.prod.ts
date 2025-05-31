export const environment = {
  production: true,
  apiUrl: '/api', // URL de la API en producción (relativa al dominio)
  // Configuración de Cloudinary para producción
  cloudinary: {
    cloudName: 'dggzv9eld',
    apiKey: '834626417328662',
    uploadUrl: 'https://api.cloudinary.com/v1_1/dggzv9eld/image/upload',
    uploadPreset: 'cargolinkimg'
  }
};
