import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room, RoomType, RoomStatus } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { HotelService } from '../../services/hotel.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.scss']
})
export class RoomManagementComponent implements OnInit {  rooms: Room[] = [];  roomForm: FormGroup;
  isEditing = false;
  selectedRoom: Room | null = null;
  roomTypes = Object.values(RoomType);
  roomStatuses = Object.values(RoomStatus);
  loading = false;
  error: string | null = null;
  hotelId: string | null = null;
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private hotelService: HotelService
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
  onSubmit(): void {
    if (this.roomForm.valid && this.hotelId) {
      const roomData = this.roomForm.value;
      
      // Si las amenidades están como string, convertirlas a string (la API espera un string)
      if (roomData.amenities && Array.isArray(roomData.amenities)) {
        roomData.amenities = roomData.amenities.join(', ');
      }

      if (this.isEditing && this.selectedRoom && this.selectedRoom.id) {
        // Actualizar habitación existente
        this.loading = true;
        this.roomService.updateRoom(this.hotelId, this.selectedRoom.id, roomData)
          .pipe(
            finalize(() => this.loading = false)
          )
          .subscribe({
            next: (updatedRoom) => {
              const index = this.rooms.findIndex(r => r.id === updatedRoom.id);
              if (index !== -1) {
                this.rooms[index] = updatedRoom;
              }
              this.resetForm();
            },
            error: (err) => {
              this.error = 'Error al actualizar la habitación: ' + err;
            }
          });
      } else {
        // Crear nueva habitación
        this.loading = true;
        this.roomService.createRoom(this.hotelId, roomData)
          .pipe(
            finalize(() => this.loading = false)
          )
          .subscribe({
            next: (newRoom) => {
              this.rooms.push(newRoom);
              this.resetForm();
            },
            error: (err) => {
              this.error = 'Error al crear la habitación: ' + err;
            }
          });
      }
    }
  }
  editRoom(room: Room): void {
    this.isEditing = true;
    this.selectedRoom = room;
    
    // Mapear los nombres de las propiedades al formulario
    this.roomForm.patchValue({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      price: room.price,
      description: room.description || '',
      amenities: typeof room.amenities === 'string' ? room.amenities : room.amenities.join(', '),
      state: room.state
    });
  }

  deleteRoom(roomId: string): void {
    if (!this.hotelId || !roomId) return;
    
    if (confirm('¿Está seguro de eliminar esta habitación?')) {
      this.loading = true;
      this.roomService.deleteRoom(this.hotelId, roomId)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.rooms = this.rooms.filter(room => room.id !== roomId);
          },
          error: (err) => {
            this.error = 'Error al eliminar la habitación: ' + err;
          }
        });
    }
  }

  resetForm(): void {
    this.roomForm.reset();
    this.isEditing = false;
    this.selectedRoom = null;
  }
}
