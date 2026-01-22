import { sql } from '@vercel/postgres';

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  token: string;
  rsvp_status: 'pending' | 'attending' | 'declined';
  plus_one_allowed: boolean;
  plus_one_name?: string;
  plus_one_attending: boolean;
  meal_preference?: string;
  plus_one_meal_preference?: string;
  message?: string;
  access_code?: string;
  checked_in: boolean;
  checked_in_at?: Date;
  created_at: Date;
  updated_at: Date;
}

function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        token VARCHAR(100) NOT NULL UNIQUE,
        rsvp_status VARCHAR(20) DEFAULT 'pending',
        plus_one_allowed BOOLEAN DEFAULT false,
        plus_one_name VARCHAR(255),
        plus_one_attending BOOLEAN DEFAULT false,
        meal_preference VARCHAR(100),
        plus_one_meal_preference VARCHAR(100),
        message TEXT,
        access_code VARCHAR(10) UNIQUE,
        checked_in BOOLEAN DEFAULT false,
        checked_in_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_token ON guests(token);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_email ON guests(email);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_access_code ON guests(access_code);
    `;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

export async function getGuestByToken(token: string): Promise<Guest | null> {
  try {
    const result = await sql`
      SELECT * FROM guests WHERE token = ${token}
    `;
    return result.rows[0] as Guest || null;
  } catch (error) {
    console.error('Error fetching guest:', error);
    return null;
  }
}

export async function getAllGuests(): Promise<Guest[]> {
  try {
    const result = await sql`
      SELECT * FROM guests ORDER BY created_at DESC
    `;
    return result.rows as Guest[];
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
}

export async function createGuest(data: {
  name: string;
  email: string;
  phone?: string;
  token: string;
  plus_one_allowed?: boolean;
}): Promise<Guest | null> {
  try {
    const result = await sql`
      INSERT INTO guests (name, email, phone, token, plus_one_allowed)
      VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.token}, ${data.plus_one_allowed || false})
      RETURNING *
    `;
    return result.rows[0] as Guest;
  } catch (error) {
    console.error('Error creating guest:', error);
    return null;
  }
}

export async function updateGuestRSVP(
  token: string,
  data: {
    rsvp_status: 'attending' | 'declined';
    plus_one_name?: string;
    plus_one_attending?: boolean;
    meal_preference?: string;
    plus_one_meal_preference?: string;
    message?: string;
  }
): Promise<Guest | null> {
  try {
    // Generate access code only when attending and doesn't have one yet
    let accessCode: string | null = null;
    if (data.rsvp_status === 'attending') {
      // Check if guest already has an access code
      const existing = await sql`SELECT access_code FROM guests WHERE token = ${token}`;
      if (!existing.rows[0]?.access_code) {
        // Generate unique access code
        let isUnique = false;
        while (!isUnique) {
          accessCode = generateAccessCode();
          const check = await sql`SELECT id FROM guests WHERE access_code = ${accessCode}`;
          if (check.rows.length === 0) {
            isUnique = true;
          }
        }
      }
    }

    const result = accessCode
      ? await sql`
          UPDATE guests
          SET
            rsvp_status = ${data.rsvp_status},
            plus_one_name = ${data.plus_one_name || null},
            plus_one_attending = ${data.plus_one_attending || false},
            meal_preference = ${data.meal_preference || null},
            plus_one_meal_preference = ${data.plus_one_meal_preference || null},
            message = ${data.message || null},
            access_code = ${accessCode},
            updated_at = CURRENT_TIMESTAMP
          WHERE token = ${token}
          RETURNING *
        `
      : await sql`
          UPDATE guests
          SET
            rsvp_status = ${data.rsvp_status},
            plus_one_name = ${data.plus_one_name || null},
            plus_one_attending = ${data.plus_one_attending || false},
            meal_preference = ${data.meal_preference || null},
            plus_one_meal_preference = ${data.plus_one_meal_preference || null},
            message = ${data.message || null},
            updated_at = CURRENT_TIMESTAMP
          WHERE token = ${token}
          RETURNING *
        `;
    return result.rows[0] as Guest || null;
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return null;
  }
}

export async function deleteGuest(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM guests WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error deleting guest:', error);
    return false;
  }
}

export async function getGuestStats() {
  try {
    const result = await sql`
      SELECT
        COUNT(*) as total_guests,
        COUNT(*) FILTER (WHERE rsvp_status = 'attending') as attending,
        COUNT(*) FILTER (WHERE rsvp_status = 'declined') as declined,
        COUNT(*) FILTER (WHERE rsvp_status = 'pending') as pending,
        COUNT(*) FILTER (WHERE plus_one_attending = true) as plus_ones,
        COUNT(*) FILTER (WHERE checked_in = true) as checked_in
      FROM guests
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

export async function getGuestByAccessCode(accessCode: string): Promise<Guest | null> {
  try {
    const result = await sql`
      SELECT * FROM guests WHERE access_code = ${accessCode.toUpperCase()}
    `;
    return result.rows[0] as Guest || null;
  } catch (error) {
    console.error('Error fetching guest by access code:', error);
    return null;
  }
}

export async function checkInGuest(accessCode: string): Promise<Guest | null> {
  try {
    const result = await sql`
      UPDATE guests
      SET
        checked_in = true,
        checked_in_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE access_code = ${accessCode.toUpperCase()} AND rsvp_status = 'attending'
      RETURNING *
    `;
    return result.rows[0] as Guest || null;
  } catch (error) {
    console.error('Error checking in guest:', error);
    return null;
  }
}
