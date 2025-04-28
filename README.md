PolyLib - Ứng dụng quản lý thư viện

PolyLib là một ứng dụng quản lý thư viện đa nền tảng, được phát triển bằng React Native, giúp bạn quản lý sách, thành viên và các giao dịch mượn trả sách một cách hiệu quả. Với giao diện người dùng thân thiện và tính năng mạnh mẽ, PolyLib mang đến trải nghiệm quản lý thư viện trực tuyến cho các nhà quản lý và người dùng.

Tính năng chính

Quản lý sách: Cho phép thêm, sửa  sách, đồng thời phân loại sách theo các thể loại khác nhau.

Quản lý mượn trả: Theo dõi các giao dịch mượn trả sách của thành viên, bao gồm ngày mượn và ngày trả.

Tìm kiếm thông minh: Hỗ trợ tìm kiếm sách và thành viên dễ dàng theo tên, thể loại hoặc tên thành viên.

Bảo mật người dùng: Tích hợp hệ thống đăng nhập và mật khẩu để bảo vệ thông tin người dùng và dữ liệu thư viện.

Công nghệ sử dụng

React Native: Phát triển ứng dụng đa nền tảng (Android và iOS) với React Native.

React Navigation: Điều hướng giữa các màn hình trong ứng dụng.

MongoDB: Cơ sở dữ liệu NoSQL để lưu trữ thông tin sách, thành viên và giao dịch mượn trả.

Mongoose: Thư viện Node.js để tương tác với MongoDB và định nghĩa các mô hình dữ liệu.

Express.js: Framework backend để xây dựng API, xử lý yêu cầu và kết nối với MongoDB.

Node.js: Môi trường chạy backend.

JSON Web Tokens (JWT): Cung cấp cơ chế xác thực người dùng bảo mật.

Cài đặt

Cài đặt Backend (MongoDB + Express.js)

Clone dự án backend về máy:
```bash
git clone https://github.com/Thangtn52751/PoilyLibAPI.git
```
Cài đặt các phụ thuộc của backend:
```bash
npm install
```
Chạy server backend:
```bash
nodemon server.js
```
Cài đặt Frontend (React Native)
Clone dự án frontend về máy:
```bash
git clone https://github.com/Thangtn52751/PolylibLibary.git
```
Cài đặt các phụ thuộc của frontend:
```bashg
cd PolyLib
npm install
```
Chạy ứng dụng trên thiết bị thật hoặc giả lập:
```bash
npx react-native run-android   # Đối với Android
npx react-native run-ios       # Đối với iOS (macOS)
```
Đóng góp
Nếu bạn muốn đóng góp vào dự án, vui lòng tạo một pull request với mô tả chi tiết về những thay đổi bạn đã thực hiện. Mọi đóng góp đều được hoan nghênh!

