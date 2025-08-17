import React, { useState } from 'react';
import PasswordInput from './PasswordInput';
import {
  deriveKey,
  encryptAES,
  decryptAES,
  generateRSAKeyPair,
  exportRSAPublicKey,
  exportRSAPrivateKey,
  encryptRSA,
  decryptRSA,
  importRSAPrivateKey,
} from '../utils/crypto';

function DemoTab() {
  // State for key management
  const [keySize, setKeySize] = useState('1024');
  const [passphrase, setPassphrase] = useState('');
  const [publicKey, setPublicKey] = useState(''); // PEM format for display
  const [publicKeyObj, setPublicKeyObj] = useState(null); // CryptoKey object
  const [privateKeyObj, setPrivateKeyObj] = useState(null); // CryptoKey object
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(null);
  const [salt, setSalt] = useState(null);
  const [iv, setIv] = useState(null);
  const [showKeyManagement, setShowKeyManagement] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState(''); // PEM format for display

  // State for passphrase change
  const [currentPassphrase, setCurrentPassphrase] = useState('');
  const [newPassphrase, setNewPassphrase] = useState('');
  const [passphraseMessage, setPassphraseMessage] = useState('');

  // State for encryption/decryption
  const [plainText, setPlainText] = useState(
    'Đây là tin nhắn mật. RSA bảo vệ thông tin của bạn!'
  );
  const [encryptedText, setEncryptedText] = useState('Chưa có dữ liệu mã hóa');
  const [cipherText, setCipherText] = useState('');
  const [decryptedText, setDecryptedText] = useState('Chưa có dữ liệu giải mã');
  const [decryptPassphrase, setDecryptPassphrase] = useState('');

  // Generate RSA key pair
  const generateKeys = async () => {
    try {
      console.log('Bắt đầu tạo khóa...');
      const passphraseValue = passphrase.trim();
      console.log('Passphrase:', passphraseValue ? 'Đã nhập' : 'Chưa nhập');

      // Validate passphrase
      if (!passphraseValue) {
        alert('Vui lòng nhập passphrase!');
        return;
      }

      console.log('Bắt đầu tạo cặp khóa RSA...');

      // Generate RSA key pair using Web Crypto API
      const keySizeValue = parseInt(keySize);
      console.log('Kích thước khóa:', keySizeValue);

      // Generate the key pair
      const keyPair = await generateRSAKeyPair(keySizeValue);
      console.log('Đã tạo cặp khóa RSA');

      // Export keys to PEM format for display
      const publicKeyPEM = await exportRSAPublicKey(keyPair.publicKey);
      const privateKeyPEM = await exportRSAPrivateKey(keyPair.privateKey);

      console.log(
        'Đã lấy khóa công khai và riêng tư:',
        publicKeyPEM ? 'Có' : 'Không',
        privateKeyPEM ? 'Có' : 'Không'
      );

      if (!publicKeyPEM || !privateKeyPEM) {
        throw new Error('Không thể tạo cặp khóa RSA');
      }

      console.log('Bắt đầu tạo khóa từ passphrase...');
      // Derive key from passphrase
      const derivedKeyData = await deriveKey(passphraseValue);
      const saltValue = derivedKeyData.salt;
      console.log('Đã tạo khóa từ passphrase, bắt đầu mã hóa khóa riêng tư...');

      // Encrypt private key with derived key
      const encryptionResult = await encryptAES(
        privateKeyPEM,
        derivedKeyData.key
      );
      const encryptedPrivateKeyValue = encryptionResult.encryptedData;
      const ivValue = encryptionResult.iv;
      console.log('Đã mã hóa khóa riêng tư thành công');

      // Update state
      setPublicKeyObj(keyPair.publicKey);
      setPrivateKeyObj(keyPair.privateKey);
      setPublicKey(publicKeyPEM);
      setPrivateKey(privateKeyPEM);
      setEncryptedPrivateKey(encryptedPrivateKeyValue);
      setSalt(saltValue);
      setIv(ivValue);
      setShowKeyManagement(true);
      setDecryptPassphrase(passphraseValue);

      console.log('Hoàn tất quá trình tạo khóa');
    } catch (error) {
      console.error('Error generating keys:', error);
      alert('Đã xảy ra lỗi khi tạo khóa: ' + error.message);
    }
  };

  // Toggle private key visibility
  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  // Change passphrase
  const changePassphrase = async () => {
    try {
      const currentPassphraseValue = currentPassphrase.trim();
      const newPassphraseValue = newPassphrase.trim();

      // Validate passphrases
      if (!currentPassphraseValue || !newPassphraseValue) {
        setPassphraseMessage(
          '<div class="warning-box">Vui lòng nhập cả passphrase hiện tại và passphrase mới!</div>'
        );
        return;
      }

      // Verify current passphrase
      try {
        // Derive key from current passphrase
        const derivedKeyData = await deriveKey(currentPassphraseValue, salt);

        // Try to decrypt the private key
        const decryptedPrivateKeyPEM = await decryptAES(
          encryptedPrivateKey,
          derivedKeyData.key,
          iv
        );

        // If successful, encrypt with new passphrase
        const newDerivedKeyData = await deriveKey(newPassphraseValue);
        const newEncryptionResult = await encryptAES(
          decryptedPrivateKeyPEM,
          newDerivedKeyData.key
        );

        // Update the stored values
        setEncryptedPrivateKey(newEncryptionResult.encryptedData);
        setIv(newEncryptionResult.iv);
        setSalt(newDerivedKeyData.salt);
        setDecryptPassphrase(newPassphraseValue);

        // Show success message
        setPassphraseMessage(
          '<div class="success-box">Passphrase đã được thay đổi thành công!</div>'
        );

        // Clear passphrase fields
        setCurrentPassphrase('');
        setNewPassphrase('');
      } catch (error) {
        console.error('Error verifying passphrase:', error);
        setPassphraseMessage(
          '<div class="warning-box">Passphrase hiện tại không đúng!</div>'
        );
      }
    } catch (error) {
      console.error('Error changing passphrase:', error);
      setPassphraseMessage(
        '<div class="warning-box">Lỗi khi thay đổi passphrase: ' +
          error.message +
          '</div>'
      );
    }
  };

  // Encrypt message
  const encryptMessage = async () => {
    try {
      if (!publicKeyObj) {
        alert('Vui lòng tạo cặp khóa trước!');
        return;
      }

      if (!plainText) {
        alert('Vui lòng nhập tin nhắn cần mã hóa!');
        return;
      }

      console.log('publicKeyObj:', publicKeyObj);
      console.log('plainText:', plainText);

      // Use Web Crypto API for RSA encryption
      const encrypted = await encryptRSA(plainText, publicKeyObj);
      setEncryptedText(encrypted);
      setCipherText(encrypted);
    } catch (error) {
      console.error('Error encrypting message:', error);
      alert('Lỗi khi mã hóa tin nhắn: ' + error.message);
    }
  };

  // Decrypt message
  const decryptMessage = async () => {
    try {
      const cipherTextValue = cipherText;
      const decryptPassphraseValue = decryptPassphrase.trim();

      if (!encryptedPrivateKey || !salt || !iv) {
        alert('Vui lòng tạo cặp khóa trước!');
        return;
      }

      if (!cipherTextValue) {
        alert('Vui lòng nhập tin nhắn đã mã hóa!');
        return;
      }

      if (!decryptPassphraseValue) {
        alert('Vui lòng nhập passphrase để giải mã!');
        return;
      }

      // Derive key from passphrase
      const derivedKeyData = await deriveKey(decryptPassphraseValue, salt);

      // Decrypt the private key
      try {
        // Get the private key PEM from encrypted storage
        const decryptedPrivateKeyPEM = await decryptAES(
          encryptedPrivateKey,
          derivedKeyData.key,
          iv
        );

        // Import the private key
        const privateKey = await importRSAPrivateKey(decryptedPrivateKeyPEM);

        // Decrypt the message using Web Crypto API
        const decrypted = await decryptRSA(cipherTextValue, privateKey);

        if (decrypted === false) {
          setDecryptedText(
            'Không thể giải mã. Vui lòng kiểm tra tin nhắn đã mã hóa.'
          );
        } else {
          setDecryptedText(decrypted);
        }
      } catch (error) {
        console.error('Error in decryption process:', error);
        setDecryptedText(
          'Không thể giải mã. Passphrase không đúng hoặc dữ liệu đã bị hỏng.'
        );
      }
    } catch (error) {
      console.error('Error decrypting message:', error);
      setDecryptedText('Lỗi khi giải mã: ' + error.message);
    }
  };

  return (
    <div>
      <div className="section">
        <h2>Bước 1: Thiết lập khóa và mật khẩu</h2>

        <div className="two-columns">
          <div className="column">
            <h3>Lựa chọn độ dài khóa:</h3>
            <select
              value={keySize}
              onChange={(e) => setKeySize(e.target.value)}
            >
              <option value="512">512 bit (demo - không an toàn)</option>
              <option value="1024">1024 bit (demo - không an toàn)</option>
              <option value="2048">2048 bit (đề xuất cho thực tế)</option>
            </select>

            <h3>Nhập passphrase bảo vệ khóa riêng tư:</h3>
            <PasswordInput
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Nhập passphrase để bảo vệ khóa riêng tư của bạn..."
              id="passphrase"
            />

            <button className="button-primary" onClick={generateKeys}>
              Tạo cặp khóa mới
            </button>
          </div>
          <div className="column">
            <div className="info-box">
              <p>
                <strong>Lưu ý:</strong> Trong demo này, chúng ta sử dụng:
              </p>
              <ul>
                <li>PBKDF2 để tạo khóa từ passphrase</li>
                <li>AES-GCM để mã hóa khóa riêng tư RSA</li>
                <li>Passphrase bảo vệ khóa riêng tư khỏi kẻ tấn công</li>
              </ul>
              <p>
                <strong>
                  Tuyệt đối không để lộ khóa riêng tư hoặc passphrase!
                </strong>
              </p>
            </div>
          </div>
        </div>

        {showKeyManagement && (
          <div>
            <div className="success-box">
              <p>
                Cặp khóa đã được tạo thành công và khóa riêng tư đã được mã hóa!
              </p>
            </div>

            <div className="two-columns">
              <div className="column">
                <h3>Khóa công khai (Public Key):</h3>
                <div className="key-display">{publicKey || 'Chưa có khóa'}</div>
              </div>
              <div className="column">
                <h3>Khóa riêng tư (Private Key):</h3>
                <div className="key-display">
                  Đã được mã hóa bằng passphrase
                </div>

                <button
                  className="button-secondary"
                  onClick={togglePrivateKeyVisibility}
                >
                  {showPrivateKey
                    ? 'Ẩn khóa riêng tư'
                    : 'Hiển thị khóa riêng tư'}
                </button>
                {showPrivateKey && (
                  <div className="key-display">
                    {privateKey ||
                      'Khóa riêng tư sẽ hiển thị ở đây sau khi xác thực'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Passphrase Change Section */}
        <div className="info-box" style={{ marginTop: '20px' }}>
          <h3>Đổi passphrase</h3>
          <p>
            Bạn có thể đổi passphrase mà không làm mất khả năng giải mã các tin
            nhắn cũ.
          </p>

          <div className="two-columns">
            <div className="column">
              <h4>Passphrase hiện tại:</h4>
              <PasswordInput
                value={currentPassphrase}
                onChange={(e) => setCurrentPassphrase(e.target.value)}
                placeholder="Nhập passphrase hiện tại..."
                id="current-passphrase"
              />
            </div>
            <div className="column">
              <h4>Passphrase mới:</h4>
              <PasswordInput
                value={newPassphrase}
                onChange={(e) => setNewPassphrase(e.target.value)}
                placeholder="Nhập passphrase mới..."
                id="new-passphrase"
              />
            </div>
          </div>

          <button className="button-warning" onClick={changePassphrase}>
            Đổi passphrase
          </button>
          {passphraseMessage && (
            <div dangerouslySetInnerHTML={{ __html: passphraseMessage }} />
          )}
        </div>
      </div>

      <div className="section">
        <h2>Bước 2: Mã hóa tin nhắn</h2>
        <p>Nhập tin nhắn và sử dụng khóa công khai để mã hóa.</p>

        <div className="two-columns">
          <div className="column">
            <h3>Tin nhắn gốc:</h3>
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Nhập tin nhắn cần mã hóa..."
            />
            <button className="button-primary" onClick={encryptMessage}>
              Mã hóa tin nhắn
            </button>
          </div>
          <div className="column">
            <h3>Tin nhắn đã mã hóa:</h3>
            <div className="key-display">{encryptedText}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Bước 3: Giải mã tin nhắn</h2>
        <p>Sử dụng khóa riêng tư để giải mã tin nhắn đã mã hóa.</p>

        <div className="two-columns">
          <div className="column">
            <h3>Tin nhắn đã mã hóa:</h3>
            <textarea
              value={cipherText}
              onChange={(e) => setCipherText(e.target.value)}
              placeholder="Dữ liệu đã mã hóa..."
            />

            <h3>Xác thực bằng passphrase:</h3>
            <PasswordInput
              value={decryptPassphrase}
              onChange={(e) => setDecryptPassphrase(e.target.value)}
              placeholder="Nhập passphrase để giải mã..."
              id="decrypt-passphrase"
            />

            <button className="button-primary" onClick={decryptMessage}>
              Giải mã tin nhắn
            </button>
          </div>
          <div className="column">
            <h3>Tin nhắn đã giải mã:</h3>
            <div className="key-display">{decryptedText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoTab;
