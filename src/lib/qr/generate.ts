import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generates a high-contrast base64 Data URL for a given payload string.
 */
export async function generateQRCodeDataURL(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  return await QRCode.toDataURL(text, {
    width: options?.width || 360,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.color?.dark || '#000000',
      light: options?.color?.light || '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });
}
