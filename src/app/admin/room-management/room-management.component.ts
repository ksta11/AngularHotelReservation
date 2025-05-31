import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room, RoomType, RoomStatus } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { HotelService } from '../../services/hotel.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.scss']
})
export class RoomManagementComponent implements OnInit {
  rooms: Room[] = [];
  roomForm: FormGroup;
  isEditing = false;
  selectedRoom: Room | null = null;
  roomTypes = Object.values(RoomType);
  roomStatuses = Object.values(RoomStatus);
  loading = false;
  error: string | null = null;
  hotelId: string | null = null;
  
  // Variables para la gestión de imágenes
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private hotelService: HotelService,
    private cloudinaryService: CloudinaryService
  ) {
    this.roomForm = this.fb.group({
      roomNumber: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      roomType: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      amenities: [''],
      state: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Obtenemos el ID del hotel desde localStorage
    this.hotelId = this.hotelService.getHotelIdFromStorage();
    if (this.hotelId) {
      this.loadRooms();
    } else {
      this.error = 'No se ha encontrado un hotel asociado a tu cuenta';
    }
  }

  loadRooms(): void {
    if (!this.hotelId) return;
    
    this.loading = true;
    this.roomService.getRooms(this.hotelId)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (rooms) => {
          this.rooms = rooms;
        },
        error: (err) => {
          this.error = 'Error al cargar las habitaciones: ' + err;
        }
      });
  }
  
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
      
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }
  
  editRoom(room: Room): void {
    this.selectedRoom = room;
    this.isEditing = true;
    
    // Si la habitación tiene una imagen, establecer la vista previa
    if (room.imageUrl) {
      this.imagePreview = room.imageUrl;
    } else {
      this.imagePreview = null;
    }
    
    // Comprobar si los amenities son un string o un array
    let amenitiesValue = '';
    if (Array.isArray(room.amenities)) {
      amenitiesValue = room.amenities.join(', ');
    } else {
      amenitiesValue = room.amenities;
    }

    this.roomForm.patchValue({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      price: room.price,
      description: room.description,
      amenities: amenitiesValue,
      state: room.state
    });
  }
  
  onSubmit(): void {
    if (this.roomForm.valid && this.hotelId) {
      this.loading = true;

      const formValues = this.roomForm.value;
      
      // Preparar datos de la habitación sin la imagen
      const roomData: Partial<Room> = {
        roomNumber: formValues.roomNumber,
        roomType: formValues.roomType,
        description: formValues.description,
        capacity: formValues.capacity,
        price: formValues.price,
        amenities: formValues.amenities,
        state: formValues.state
      };
      
      // Si estamos editando, incluir el ID
      if (this.isEditing && this.selectedRoom) {
        roomData.id = this.selectedRoom.id;
      }      // Si hay una imagen seleccionada, primero subir la imagen
      if (this.selectedImage) {
        const roomIdentifier = roomData.id || `${this.hotelId}-${roomData.roomNumber}`;
        
        this.cloudinaryService.uploadImage(this.selectedImage, 'rooms', roomIdentifier).subscribe({
          next: (response) => {
            if (response && response.imageUrl) {
              console.log('Imagen subida correctamente:', response);
              roomData.imageUrl = response.imageUrl;
              this.saveRoom(roomData);
            } else {
              console.error('Error: No se recibió la URL de la imagen');
              alert('Error: No se pudo subir la imagen. Por favor, inténtalo de nuevo.');
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
            this.loading = false;
          }
        });
      } else {
        // Si estamos editando y ya tenía una imagen, mantenerla
        if (this.isEditing && this.selectedRoom && this.selectedRoom.imageUrl && this.imagePreview) {
          roomData.imageUrl = this.selectedRoom.imageUrl;
          this.saveRoom(roomData);
        } else {
          // Preguntar si desea continuar sin imagen
          const confirmarSinImagen = window.confirm('¿Estás seguro de crear la habitación sin una imagen? Se recomienda añadir una imagen para mejor visibilidad.');
          if (confirmarSinImagen) {
            // Guardar sin imagen nueva
            this.saveRoom(roomData);
          } else {
            this.loading = false;
          }
        }
      }
    }
  }
  
  private saveRoom(roomData: Partial<Room>): void {
    if (!this.hotelId) return;

    // Lógica para crear o actualizar la habitación
    if (this.isEditing && this.selectedRoom && this.selectedRoom.id) {
      this.roomService.updateRoom(this.hotelId, this.selectedRoom.id, roomData).subscribe({
        next: (updatedRoom) => {
          console.log('Habitación actualizada:', updatedRoom);
          this.loadRooms();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al actualizar la habitación. ' + err;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.roomService.createRoom(this.hotelId, roomData).subscribe({
        next: (newRoom) => {
          console.log('Habitación creada:', newRoom);
          this.loadRooms();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al crear la habitación. ' + err;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
  
  deleteRoom(roomId: string): void {
    if (!this.hotelId) return;
    
    if (confirm('¿Está seguro de que desea eliminar esta habitación? Esta acción no se puede deshacer.')) {
      this.loading = true;
      
      this.roomService.deleteRoom(this.hotelId, roomId).subscribe({
        next: () => {
          console.log('Habitación eliminada correctamente');
          this.loadRooms();
        },
        error: (err) => {
          this.error = 'Error al eliminar la habitación. ' + err;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
  
  resetForm(): void {
    this.roomForm.reset();
    this.selectedImage = null;
    this.imagePreview = null;
    this.loading = false;
    this.isEditing = false;
    this.selectedRoom = null;
  }
}
