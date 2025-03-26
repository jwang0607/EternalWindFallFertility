import mongoose, { Document, Schema } from 'mongoose';

// Define the Doctor interface
interface IDoctor {
  id: string;
  name: string;
  hospital: string;
  specialization: string;
}

// Define the Appointment interface
export interface IAppointment extends Document {
  customerId: string;
  assignedDoctor: IDoctor;
  appointmentDate: Date;
  appointmentType: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Doctor Schema - embedded in appointments
const DoctorSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  }
});

// Appointment Schema
const AppointmentSchema: Schema = new Schema(
  {
    customerId: {
      type: String,
      required: [true, 'Customer ID is required'],
      ref: 'Customer'
    },
    assignedDoctor: {
      type: DoctorSchema,
      required: [true, 'Assigned doctor is required']
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    appointmentType: {
      type: String,
      required: [true, 'Appointment type is required'],
      enum: ['initial-consultation', 'follow-up', 'procedure', 'check-up']
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Create an index on customerId for faster queries
AppointmentSchema.index({ customerId: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema); 