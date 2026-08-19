import { SignJWT, jwtVerify } from 'jose';

const DEFAULT_SECRET = process.env.QR_JWT_SECRET || 'sac-rotating-qr-fallback-super-secret-key-32-chars-min';

export interface QRTokenPayload {
  sessionId: string;
  clubId: string;
  nonce: string;
  timestamp: number;
}

/**
 * Creates a short-lived, signed JWT for rotating QR codes (default 20 seconds expiry).
 */
export async function generateQRToken(
  payload: QRTokenPayload,
  customSecret?: string,
  expiresInSeconds = 20
): Promise<string> {
  const secretKey = new TextEncoder().encode(customSecret || DEFAULT_SECRET);

  return await new SignJWT({
    sessionId: payload.sessionId,
    clubId: payload.clubId,
    nonce: payload.nonce || Math.random().toString(36).substring(2, 10),
    timestamp: payload.timestamp || Date.now(),
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(secretKey);
}

/**
 * Verifies a scanned QR JWT token and ensures it has not expired or been tampered with.
 */
export async function verifyQRToken(
  token: string,
  customSecret?: string
): Promise<{ valid: boolean; payload?: QRTokenPayload; error?: string }> {
  try {
    const secretKey = new TextEncoder().encode(customSecret || DEFAULT_SECRET);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    return {
      valid: true,
      payload: {
        sessionId: payload.sessionId as string,
        clubId: payload.clubId as string,
        nonce: payload.nonce as string,
        timestamp: payload.timestamp as number,
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid or expired QR token';
    return {
      valid: false,
      error: errorMessage,
    };
  }
}
