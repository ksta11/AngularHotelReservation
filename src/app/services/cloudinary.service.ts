import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly CLOUD_NAME: string;
  private readonly API_KEY: string;
  private readonly UPLOAD_URL: string;
  private readonly UPLOAD_PRESET: string;
  
  constructor(private http: HttpClient) {
    this.CLOUD_NAME = environment.cloudinary.cloudName;
    this.API_KEY = environment.cloudinary.apiKey;
    this.UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;
    this.UPLOAD_PRESET = environment.cloudinary.uploadPreset;
  }
  
  /**
   * Sube una imagen directamente a Cloudinary
   * @param file Archivo de imagen a subir
   * @param folder Carpeta donde se guardará (por ejemplo 'hotels' o 'rooms')
   * @param id ID opcional del hotel o habitación para nombrar el archivo
   * @returns Observable con la URL de la imagen subida
   */  uploadImage(file: File, folder: 'hotels' | 'rooms', id?: string): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Generación de timestamp para evitar caching de imágenes
    const timestamp = new Date().getTime();
    formData.append('timestamp', timestamp.toString());
    
    // Si se proporciona un ID, usar como nombre de archivo público
    if (id) {
      // Añadir timestamp para evitar problemas de caché al actualizar la imagen
      formData.append('public_id', `${folder}/${id.replace(/[^\w-]/g, '_')}_${timestamp}`);
    }      // No necesitamos configuraciones especiales aquí ya que
    // hemos modificado el interceptor para que no añada el token a las solicitudes a Cloudinary
    
    return this.http.post<any>(this.UPLOAD_URL, formData)
      .pipe(
        map(response => {
          console.log('Respuesta de Cloudinary:', response);
          return {
            imageUrl: response.secure_url
          };
        })
      );
  }

  /**
   * Genera una URL para una imagen de Cloudinary con transformaciones
   * @param imageUrl URL original de la imagen
   * @param width Ancho deseado
   * @param height Alto deseado
   * @param crop Método de recorte ('fill', 'scale', 'crop', etc.)
   * @returns URL transformada
   */
  getTransformedImageUrl(imageUrl: string, width?: number, height?: number, crop: string = 'fill'): string {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return imageUrl; // Retorna la URL original si no es una imagen de Cloudinary
    }
    
    const baseUrl = imageUrl.split('/upload/')[0];
    const imageId = imageUrl.split('/upload/')[1];
    
    let transformation = '/upload/';
    
    if (width || height) {
      transformation += 'c_' + crop + ',';
      
      if (width) {
        transformation += 'w_' + width + ',';
      }
      
      if (height) {
        transformation += 'h_' + height + ',';
      }
      
      // Eliminar la coma final
      transformation = transformation.slice(0, -1);
      transformation += '/';
    }
    
    return baseUrl + transformation + imageId;
  }

  /**
   * Obtiene URL de miniaturas para imágenes de Cloudinary
   * @param imageUrl URL original de la imagen
   * @returns URL de la miniatura
   */
  getThumbnailUrl(imageUrl: string): string {
    return this.getTransformedImageUrl(imageUrl, 100, 100);
  }

  /**
   * Obtiene URL para imagen de tamaño medio de Cloudinary
   * @param imageUrl URL original de la imagen
   * @returns URL de la imagen de tamaño medio
   */
  getMediumSizeUrl(imageUrl: string): string {
    return this.getTransformedImageUrl(imageUrl, 400, 300);
  }
}
