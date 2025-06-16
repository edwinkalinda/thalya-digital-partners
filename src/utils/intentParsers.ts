
import { DateTime } from 'luxon';

// Types d'appointments
export interface ClinicAppointment {
  phone_number: string;
  appointment_time: string;
  practitioner_type: string;
  reason: string;
  patient_name: string;
  notes?: string;
}

export interface DentistAppointment {
  appointment_type: string;
  appointment_time: string;
  duration_minutes: number;
  notes?: string;
  phone_number: string;
}

export interface HospitalAppointment {
  phone_number: string;
  appointment_time: string;
  department: string;
  doctor: string;
  patient_name: string;
  notes?: string;
}

export interface HotelBooking {
  phone_number: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  room_type: string;
  bed_preference: string;
  notes?: string;
}

// Parser pour clinique
export function parseClinicIntent(text: string, phoneNumber: string): { appointment: ClinicAppointment | null; confidence: number } {
  const lower = text.toLowerCase();

  const practitionerMatch = lower.match(/(?:with|see)?\s*(a\s)?(general practitioner|gp|nurse|doctor|specialist)/i);
  const practitioner_type = practitionerMatch ? practitionerMatch[2] : 'general practitioner';

  const reasonMatch = lower.match(/for\s+(.*?)(?:\.|$)/i);
  const reason = reasonMatch ? reasonMatch[1] : 'General consultation';

  const patientMatch = text.match(/(?:my name is|this is)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i);
  const patient_name = patientMatch ? patientMatch[1] : 'Unknown';

  const dateTimeMatch = text.match(/(next\s+\w+|\w+day|\w+\s\d{1,2})(?:\s+at\s+(\d{1,2}(?::\d{2})?\s*(am|pm)?))?/i);
  const now = DateTime.local();
  let appointment_time = now.plus({ days: 2 }).set({ hour: 10 }).toISO();

  if (dateTimeMatch) {
    try {
      let dayText = dateTimeMatch[1];
      let timeText = dateTimeMatch[2] || "10:00";
      const combined = dayText + " " + timeText;
      const parsed = DateTime.fromFormat(combined, "LLLL d h:mm a", { zone: "utc" }) || DateTime.fromFormat(combined, "cccc h:mm a", { zone: "utc" });
      if (parsed.isValid) {
        appointment_time = parsed.set({ year: now.year }).toISO();
      }
    } catch (e) {}
  }

  const appointment: ClinicAppointment = {
    phone_number: phoneNumber,
    appointment_time,
    practitioner_type,
    reason,
    patient_name,
    notes: text
  };

  const confidence = practitionerMatch && dateTimeMatch ? 0.9 : 0.6;
  return { appointment, confidence };
}

// Parser pour dentiste
export function parseDentistIntent(text: string, phoneNumber: string): { appointment: DentistAppointment | null; confidence: number } {
  const lower = text.toLowerCase();
  const types = ['cleaning', 'checkup', 'filling', 'whitening', 'consultation'];
  const type = types.find(t => lower.includes(t)) || 'consultation';

  let duration = 30;
  if (type === 'filling') duration = 45;
  if (type === 'whitening') duration = 60;

  const today = DateTime.local();
  let match = text.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(.*?)\b(\d{1,2})([:\.]?(\d{2}))?\s*(am|pm)?/i);

  let appointment_time = today.plus({ days: 1 }).toISO();

  if (match) {
    const [_, weekday, , hour, , minutes, meridian] = match;
    const dayIndex = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(weekday.toLowerCase());
    const currentWeekday = today.weekday % 7;
    const daysAhead = (dayIndex - currentWeekday + 7) % 7 || 7;

    let hr = parseInt(hour);
    if (meridian?.toLowerCase() === 'pm' && hr < 12) hr += 12;
    const min = parseInt(minutes || '0');

    appointment_time = today.plus({ days: daysAhead }).set({ hour: hr, minute: min }).toISO();
  }

  const appointment: DentistAppointment = {
    appointment_type: type,
    duration_minutes: duration,
    appointment_time,
    phone_number: phoneNumber,
    notes: text
  };

  const confidence = match ? 0.9 : 0.6;
  return { appointment, confidence };
}

// Parser pour hôpital
export function parseHospitalIntent(text: string, phoneNumber: string): { appointment: HospitalAppointment | null; confidence: number } {
  const lower = text.toLowerCase();

  const deptMatch = lower.match(/(?:department|for)\s+(cardiology|neurology|pediatrics|oncology|general|emergency)/i);
  const department = deptMatch ? deptMatch[1] : 'general';

  const doctorMatch = text.match(/(?:dr\.?\s*)([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
  const doctor = doctorMatch ? "Dr. " + doctorMatch[1] : 'Unspecified';

  const patientMatch = text.match(/(?:for|name is|i am)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i);
  const patient_name = patientMatch ? patientMatch[1] : 'Unknown';

  const dateTimeMatch = text.match(/(next\s+\w+|\w+day|\w+\s\d{1,2})(?:\s+at\s+(\d{1,2}(?::\d{2})?\s*(am|pm)?))?/i);
  const now = DateTime.local();
  let appointment_time = now.plus({ days: 2 }).set({ hour: 10 }).toISO();

  if (dateTimeMatch) {
    try {
      let dayText = dateTimeMatch[1];
      let timeText = dateTimeMatch[2] || "10:00";
      const combined = dayText + " " + timeText;
      const parsed = DateTime.fromFormat(combined, "LLLL d h:mm a", { zone: "utc" }) || DateTime.fromFormat(combined, "cccc h:mm a", { zone: "utc" });
      if (parsed.isValid) {
        appointment_time = parsed.set({ year: now.year }).toISO();
      }
    } catch (e) {}
  }

  const appointment: HospitalAppointment = {
    phone_number: phoneNumber,
    appointment_time,
    department,
    doctor,
    patient_name,
    notes: text
  };

  const confidence = deptMatch && dateTimeMatch ? 0.9 : 0.6;
  return { appointment, confidence };
}

// Parser pour hôtel
export function parseHotelIntent(text: string, phoneNumber: string): { booking: HotelBooking | null; confidence: number } {
  const lower = text.toLowerCase();

  const guestsMatch = lower.match(/(\d+)\s+(guests|people|adults)/);
  const guests = guestsMatch ? parseInt(guestsMatch[1]) : 2;

  const roomTypes = ['standard', 'deluxe', 'suite'];
  const room = roomTypes.find(t => lower.includes(t)) || 'standard';

  const beds = ['king', 'queen', 'twin'];
  const bed = beds.find(b => lower.includes(b)) || 'queen';

  const dateRegex = /(?:from|between)?\s*(\w+\s+\d{1,2})(?:\s*(?:to|until|through|\-|\–|\—)\s*(\w+\s+\d{1,2}))/i;
  const today = DateTime.local();
  let check_in_date = today.plus({ days: 2 }).toISODate();
  let check_out_date = today.plus({ days: 5 }).toISODate();

  const dateMatch = lower.match(dateRegex);
  if (dateMatch) {
    try {
      const fromDate = DateTime.fromFormat(dateMatch[1], "LLLL d", { zone: "utc" }).set({ year: today.year });
      const toDate = DateTime.fromFormat(dateMatch[2], "LLLL d", { zone: "utc" }).set({ year: today.year });

      if (fromDate.isValid && toDate.isValid && toDate > fromDate) {
        check_in_date = fromDate.toISODate();
        check_out_date = toDate.toISODate();
      }
    } catch (e) {}
  }

  const booking: HotelBooking = {
    phone_number: phoneNumber,
    check_in_date,
    check_out_date,
    guests,
    room_type: room,
    bed_preference: bed,
    notes: text
  };

  const confidence = dateMatch ? 0.9 : 0.6;
  return { booking, confidence };
}
