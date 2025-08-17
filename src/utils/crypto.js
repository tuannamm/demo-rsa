// Utility functions for RSA encryption and key management

// Create a random bytes array using Web Crypto API
export function getRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

// Convert from ArrayBuffer to hex string
export function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) =>
      ('00' + x.toString(16)).slice(-2)
    )
    .join('');
}

// Convert from hex string to ArrayBuffer
export function hex2buf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Derive key from passphrase using PBKDF2
export async function deriveKey(passphrase, salt) {
  try {
    console.log('Bắt đầu tạo khóa từ passphrase');

    // If no salt provided, generate a new one
    const useSalt = salt || getRandomBytes(16);
    console.log('Salt được sử dụng:', useSalt ? 'Có' : 'Không');

    // Convert passphrase to Uint8Array
    const encoder = new TextEncoder();
    const passphraseBytes = encoder.encode(passphrase);
    console.log('Đã chuyển đổi passphrase thành bytes');

    // Create a key from the passphrase
    console.log('Bắt đầu tạo khóa với PBKDF2...');
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passphraseBytes,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // Use PBKDF2 to derive a key
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: useSalt,
        iterations: 100000, // High number of iterations for security
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true, // extractable
      ['encrypt', 'decrypt']
    );

    // Export the key as raw bytes
    const rawKey = await window.crypto.subtle.exportKey(
      'raw',
      derivedKey
    );
    console.log('Đã tạo khóa thành công với PBKDF2');

    return {
      key: new Uint8Array(rawKey),
      salt: useSalt,
    };
  } catch (error) {
    console.error('Error deriving key:', error);
    throw error;
  }
}

// Encrypt data using AES-GCM
export async function encryptAES(data, key) {
  try {
    // Generate random IV
    const iv = getRandomBytes(12);

    // Create a new TextEncoder
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Create a crypto key from the derived key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      cryptoKey,
      dataBytes
    );

    // Convert the encrypted data to a hex string
    const encryptedHex = buf2hex(encryptedData);

    return {
      encryptedData: encryptedHex,
      iv: iv,
    };
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
}

// Decrypt data using AES-GCM
export async function decryptAES(encryptedData, key, iv) {
  try {
    // Convert the encrypted data from hex to ArrayBuffer
    const encryptedBytes = hex2buf(encryptedData);

    // Create a crypto key from the derived key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      cryptoKey,
      encryptedBytes
    );

    // Convert the decrypted data to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
}