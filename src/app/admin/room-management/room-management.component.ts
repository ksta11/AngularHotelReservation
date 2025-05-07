import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room, RoomType, RoomStatus } from '../../models/room.model';

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

  constructor(private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      number: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      type: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      amenities: [''],
      status: ['', Validators.required],
      images: ['']
    });
  }

  ngOnInit(): void {
    // Aquí cargaríamos las habitaciones desde el servicio
    this.loadRooms();
  }

  loadRooms(): void {
    // Simulación de datos
    this.rooms = [
      {
        id: 1,
        number: '101',
        type: RoomType.SINGLE,
        capacity: 1,
        price: 50,
        description: 'Habitación individual con vista al mar',
        amenities: ['WiFi', 'TV', 'Aire acondicionado'],
        status: RoomStatus.AVAILABLE,
        images: []
      }
    ];
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomData = this.roomForm.value;
      if (this.isEditing && this.selectedRoom) {
        // Actualizar habitación existente
        const index = this.rooms.findIndex(r => r.id === this.selectedRoom?.id);
        if (index !== -1) {
          this.rooms[index] = { ...this.rooms[index], ...roomData };
        }
      } else {
        // Crear nueva habitación
        const newRoom: Room = {
          ...roomData,
          id: this.rooms.length + 1
        };
        this.rooms.push(newRoom);
      }
      this.resetForm();
    }
  }

  editRoom(room: Room): void {
    this.isEditing = true;
    this.selectedRoom = room;
    this.roomForm.patchValue(room);
  }

  deleteRoom(roomId: number): void {
    if (confirm('¿Está seguro de eliminar esta habitación?')) {
      this.rooms = this.rooms.filter(room => room.id !== roomId);
    }
  }

  resetForm(): void {
    this.roomForm.reset();
    this.isEditing = false;
    this.selectedRoom = null;
  }
}
