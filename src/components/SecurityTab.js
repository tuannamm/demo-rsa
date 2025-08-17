import React from 'react';

function SecurityTab() {
  return (
    <div className="section">
      <h2>Tính năng bảo mật nâng cao</h2>

      <div className="info-box">
        <h3>Bảo vệ khóa riêng tư</h3>
        <p>
          Trong thực tế, khóa riêng tư RSA
          <strong> không bao giờ</strong> được lưu trữ dưới dạng văn bản
          thuần túy. Thay vào đó, nó luôn được mã hóa bằng một khóa đối xứng
          (như AES), khóa này được tạo ra từ passphrase của người dùng.
        </p>
      </div>

      <div className="step">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3>PBKDF2 - Tạo khóa từ passphrase</h3>
          <p>
            PBKDF2 là một hàm dẫn xuất khóa (key derivation function) được
            sử dụng rộng rãi và được hỗ trợ bởi trình duyệt. Nó chuyển đổi
            passphrase của người dùng thành một khóa mã hóa với các đặc
            điểm:
          </p>
          <ul>
            <li>Chống lại tấn công brute-force và dictionary</li>
            <li>
              Sử dụng muối (salt) ngẫu nhiên để đảm bảo mỗi lần tạo khóa là
              duy nhất
            </li>
            <li>
              Sử dụng nhiều vòng lặp, làm chậm quá trình tạo khóa để ngăn
              chặn tấn công
            </li>
          </ul>
          <p>
            Khóa được tạo ra từ passphrase sẽ được sử dụng để mã hóa khóa
            riêng tư RSA.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-number">2</div>
        <div className="step-content">
          <h3>AES-GCM - Mã hóa khóa riêng tư</h3>
          <p>
            AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) là
            một thuật toán mã hóa đối xứng hiện đại với các đặc điểm:
          </p>
          <ul>
            <li>Mã hóa dữ liệu với tốc độ cao và độ an toàn cao</li>
            <li>Tích hợp tính toàn vẹn dữ liệu (authentication)</li>
            <li>
              Sử dụng một nonce (số được sử dụng một lần) để đảm bảo mỗi lần
              mã hóa là duy nhất
            </li>
          </ul>
          <p>
            Khóa riêng tư RSA được mã hóa bằng AES-GCM với khóa được tạo ra
            từ passphrase, đảm bảo chỉ người biết passphrase mới có thể truy
            cập khóa riêng tư.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-number">3</div>
        <div className="step-content">
          <h3>Thay đổi passphrase an toàn</h3>
          <p>Khi thay đổi passphrase, chúng ta thực hiện các bước sau:</p>
          <ol>
            <li>
              Xác thực passphrase hiện tại bằng cách giải mã khóa riêng tư
            </li>
            <li>
              Nếu xác thực thành công, tạo một khóa mới từ passphrase mới
              bằng PBKDF2
            </li>
            <li>Mã hóa lại khóa riêng tư bằng khóa mới và AES-GCM</li>
          </ol>
          <p>
            Quá trình này đảm bảo rằng người dùng vẫn có thể giải mã dữ liệu
            đã mã hóa trước đó, vì khóa riêng tư RSA không thay đổi, chỉ có
            lớp bảo vệ bên ngoài (passphrase) thay đổi.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecurityTab;