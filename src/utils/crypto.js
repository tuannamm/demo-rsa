// Utility functions for RSA encryption and key management using Web Crypto API

/**
 * Generate an RSA key pair
 * @param {number} keySize - Key size in bits (1024, 2048, 4096)
 * @returns {Promise<CryptoKeyPair>} - A promise that resolves to a CryptoKeyPair
 */
export async function generateRSAKeyPair(keySize = 2048) {
  try {
    // Generate an RSA key pair
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: keySize, // 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: 'SHA-256',
      },
      true, // whether the key is extractable
      ['encrypt', 'decrypt'] // key usages
    );

    return keyPair;
  } catch (error) {
    console.error('Error generating RSA key pair:', error);
    throw error;
  }
}

/**
 * Export RSA public key to PEM format
 * @param {CryptoKey} publicKey - The public key to export
 * @returns {Promise<string>} - A promise that resolves to a PEM-formatted public key
 */
export async function exportRSAPublicKey(publicKey) {
  try {
    // Export the key to SPKI format
    const spki = await window.crypto.subtle.exportKey('spki', publicKey);

    // Convert to base64
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(spki)));

    // Format as PEM
    return `-----BEGIN PUBLIC KEY-----\n${formatPEM(
      b64
    )}\n-----END PUBLIC KEY-----`;
  } catch (error) {
    console.error('Error exporting public key:', error);
    throw error;
  }
}

/**
 * Export RSA private key to PEM format
 * @param {CryptoKey} privateKey - The private key to export
 * @returns {Promise<string>} - A promise that resolves to a PEM-formatted private key
 */
export async function exportRSAPrivateKey(privateKey) {
  try {
    // Export the key to PKCS8 format
    const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', privateKey);

    // Convert to base64
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(pkcs8)));

    // Format as PEM
    return `-----BEGIN PRIVATE KEY-----\n${formatPEM(
      b64
    )}\n-----END PRIVATE KEY-----`;
  } catch (error) {
    console.error('Error exporting private key:', error);
    throw error;
  }
}

/**
 * Import RSA public key from PEM format
 * @param {string} pem - The PEM-formatted public key
 * @returns {Promise<CryptoKey>} - A promise that resolves to a CryptoKey
 */
export async function importRSAPublicKey(pem) {
  try {
    // Remove PEM header, footer and newlines
    const pemContents = pem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\n/g, '');

    // Convert from base64 to binary
    const binary = window.atob(pemContents);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Import the key
    return window.crypto.subtle.importKey(
      'spki',
      bytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
  } catch (error) {
    console.error('Error importing public key:', error);
    throw error;
  }
}

/**
 * Import RSA private key from PEM format
 * @param {string} pem - The PEM-formatted private key
 * @returns {Promise<CryptoKey>} - A promise that resolves to a CryptoKey
 */
export async function importRSAPrivateKey(pem) {
  try {
    // Remove PEM header, footer and newlines
    const pemContents = pem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');

    // Convert from base64 to binary
    const binary = window.atob(pemContents);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Import the key
    return window.crypto.subtle.importKey(
      'pkcs8',
      bytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );
  } catch (error) {
    console.error('Error importing private key:', error);
    throw error;
  }
}

/**
 * Encrypt data using RSA-OAEP
 * @param {string} data - The data to encrypt
 * @param {CryptoKey} publicKey - The public key to use for encryption
 * @returns {Promise<string>} - A promise that resolves to a base64-encoded encrypted string
 */
export async function encryptRSA(data, publicKey) {
  try {
    // Convert the data to bytes
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      dataBytes
    );

    // Convert to base64
    return window.btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  } catch (error) {
    console.error('Error encrypting data with RSA:', error);
    throw error;
  }
}

/**
 * Decrypt data using RSA-OAEP
 * @param {string} encryptedData - The base64-encoded encrypted data
 * @param {CryptoKey} privateKey - The private key to use for decryption
 * @returns {Promise<string>} - A promise that resolves to the decrypted string
 */
export async function decryptRSA(encryptedData, privateKey) {
  try {
    // Convert from base64 to binary
    const binary = window.atob(encryptedData);
    const encryptedBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      encryptedBytes[i] = binary.charCodeAt(i);
    }

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      encryptedBytes
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting data with RSA:', error);
    return false;
  }
}

/**
 * Format base64 string into PEM format (with line breaks)
 * @param {string} b64 - The base64 string to format
 * @returns {string} - The formatted string with line breaks
 */
function formatPEM(b64) {
  const lines = [];
  for (let i = 0; i < b64.length; i += 64) {
    lines.push(b64.substring(i, i + 64));
  }
  return lines.join('\n');
}

// Create a random bytes array using Web Crypto API
export function getRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

// Convert from ArrayBuffer to hex string
export function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
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
    const rawKey = await window.crypto.subtle.exportKey('raw', derivedKey);
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
