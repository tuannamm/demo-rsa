import React from 'react';

function ExplanationTab() {
  return (
    <div className="section">
      <h2>RSA hoạt động như thế nào?</h2>

      <div className="info-box">
        <p>
          RSA là một thuật toán mã hóa bất đối xứng, sử dụng cặp khóa: khóa
          công khai (public key) và khóa riêng tư (private key).
        </p>
      </div>

      <div className="step">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3>Tạo cặp khóa</h3>
          <p>
            Hai số nguyên tố lớn p và q được chọn ngẫu nhiên và được sử dụng
            để tính toán các tham số của khóa.
          </p>
          <p>
            Các tham số này bao gồm: n (tích của p và q), e (số mũ mã hóa)
            và d (số mũ giải mã).
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-number">2</div>
        <div className="step-content">
          <h3>Mã hóa tin nhắn</h3>
          <p>Sử dụng khóa công khai (e, n) để mã hóa tin nhắn M:</p>
          <p>C = M<sup>e</sup> mod n</p>
          <p>Trong đó C là tin nhắn đã mã hóa.</p>
        </div>
      </div>

      <div className="step">
        <div className="step-number">3</div>
        <div className="step-content">
          <h3>Giải mã tin nhắn</h3>
          <p>Sử dụng khóa riêng tư (d, n) để giải mã tin nhắn C:</p>
          <p>M = C<sup>d</sup> mod n</p>
          <p>Khôi phục lại tin nhắn ban đầu M.</p>
        </div>
      </div>

      <div className="visualization">
        <img
          src="https://i.imgur.com/nJR1ztT.png"
          alt="RSA Encryption/Decryption Process"
        />
      </div>
    </div>
  );
}

export default ExplanationTab;