export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // URL base de tu API NestJS
  // Configuración de Cloudinary
  cloudinary: {
    cloudName: 'dggzv9eld',
    apiKey: '834626417328662',
    uploadUrl: 'https://api.cloudinary.com/v1_1/dggzv9eld/image/upload',
    uploadPreset: 'cargolinkimg'
  }
};