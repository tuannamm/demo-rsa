# Demo Mã hóa RSA Nâng cao - React Version

Đây là phiên bản React.js của demo mã hóa RSA nâng cao, được chuyển đổi từ HTML thuần túy trong khi vẫn giữ nguyên toàn bộ chức năng và flow của ứng dụng gốc.

## Tính năng

### 1. Tạo cặp khóa RSA với bảo vệ passphrase
- Tạo cặp khóa RSA với các độ dài khác nhau (512, 1024, 2048 bit)
- Bảo vệ khóa riêng tư bằng passphrase sử dụng PBKDF2 và AES-GCM
- Hiển thị/ẩn khóa riêng tư một cách an toàn

### 2. Mã hóa và giải mã tin nhắn
- Mã hóa tin nhắn bằng khóa công khai
- Giải mã tin nhắn bằng khóa riêng tư được bảo vệ bởi passphrase
- Xử lý lỗi khi passphrase không đúng

### 3. Quản lý passphrase
- Thay đổi passphrase mà không làm mất khả năng giải mã dữ liệu cũ
- Xác thực passphrase hiện tại trước khi thay đổi
- Thông báo trạng thái thay đổi passphrase

### 4. Giao diện giáo dục
- Tab "Giải thích" mô tả cách hoạt động của RSA
- Tab "Bảo mật Nâng cao" giải thích về PBKDF2, AES-GCM và bảo vệ khóa riêng tư
- Giao diện thân thiện với người dùng

## Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 14.x hoặc mới hơn)
- npm hoặc yarn

### Hướng dẫn cài đặt

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng ở chế độ development:**
   ```bash
   npm start
   ```
   Ứng dụng sẽ mở tại: http://localhost:3000

3. **Build ứng dụng cho production:**
   ```bash
   npm run build
   ```

## Cấu trúc dự án

```
src/
├── components/
│   ├── DemoTab.js          # Tab chính chứa demo RSA
│   ├── ExplanationTab.js   # Tab giải thích cách hoạt động RSA
│   ├── SecurityTab.js      # Tab bảo mật nâng cao
│   └── PasswordInput.js    # Component input password với toggle visibility
├── utils/
│   └── crypto.js          # Các hàm tiện ích cho mã hóa (PBKDF2, AES-GCM)
├── App.js                 # Component chính với tab navigation
├── index.js               # Entry point
└── index.css             # Styles (giữ nguyên từ HTML gốc)
```

## Công nghệ sử dụng

- **React 18.2.0** - Framework JavaScript
- **JSEncrypt 3.2.1** - Thư viện RSA encryption
- **Web Crypto API** - API mã hóa native của trình duyệt cho PBKDF2 và AES-GCM
- **Font Awesome** - Icons

## Tính năng bảo mật

- **PBKDF2**: Tạo khóa từ passphrase với 100,000 iterations và salt ngẫu nhiên
- **AES-GCM**: Mã hóa khóa riêng tư RSA với tính toàn vẹn dữ liệu
- **Quản lý passphrase an toàn**: Thay đổi passphrase mà không làm mất dữ liệu

## Lưu ý bảo mật

- ⚠️ **Chỉ sử dụng cho mục đích học tập và demo**
- ⚠️ **Không sử dụng khóa 512/1024 bit trong môi trường thực tế**
- ⚠️ **Luôn sử dụng khóa ít nhất 2048 bit cho ứng dụng thực tế**
- ⚠️ **Không bao giờ lưu trữ passphrase hoặc khóa riêng tư dưới dạng plain text**

## So sánh với phiên bản HTML gốc

Phiên bản React này giữ nguyên 100% chức năng và flow của phiên bản HTML gốc:

- ✅ Giao diện và styling giống hệt nhau
- ✅ Cùng logic mã hóa/giải mã RSA
- ✅ Cùng hệ thống bảo vệ khóa riêng tư
- ✅ Cùng tính năng thay đổi passphrase
- ✅ Cùng nội dung giáo dục về RSA và bảo mật

Ưu điểm của phiên bản React:
- 🔧 Dễ bảo trì và mở rộng
- 🧩 Component-based architecture
- 🎯 State management tốt hơn
- 📱 Responsive và hiệu năng tối ưu

## License

Dự án này được sử dụng cho mục đích học tập và nghiên cứu.