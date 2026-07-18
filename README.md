# UNICHIC Landing Page

Thương hiệu thời trang nam cao cấp — Landing Page hoàn chỉnh.

## Cấu trúc dự án

```
unichic/
├── index.html      — Trang chủ (18 sections)
├── style.css       — Hệ thống CSS (design tokens + components)
├── main.js         — JavaScript (interactions + carousel)
└── images/         — Tất cả ảnh sản phẩm và editorial (23 ảnh)
```

## Mở trang

Chỉ cần mở file `index.html` trực tiếp bằng trình duyệt:
- Double-click vào `index.html`
- Hoặc kéo thả vào Chrome/Edge/Firefox

Không cần server, không cần cài đặt gì thêm.

## Thay thế nội dung thật

### Ảnh
Thay thế các file trong thư mục `images/` bằng ảnh thật của thương hiệu:
- `hero-banner.jpg` — Ảnh hero chính (tỷ lệ ~2.4:1)
- `brand-story.jpg` — Ảnh editorial thương hiệu (dọc)
- `category-ao.jpg`, `category-quan.jpg`, `category-phukien.jpg` — Ảnh danh mục
- `collection-business.jpg`, `collection-casual.jpg` — Ảnh bộ sưu tập
- `product-*.jpg` — Ảnh sản phẩm (nền #F2F2F2, tỷ lệ 4:5)
- `lookbook-*.jpg` — Ảnh lookbook/lifestyle

### Thông tin liên hệ
Tìm kiếm `[ĐIỀN THÔNG TIN]` trong `index.html` và thay thế:
- Hotline
- Email
- Địa chỉ
- Mức phí vận chuyển miễn phí
- Số ngày đổi hàng

### Giá và sản phẩm
Chỉnh sửa các `article.product-card` trong `index.html` với tên và giá thật.

## Tính năng

- ✅ Header sticky với border khi cuộn
- ✅ Announcement bar slider (mobile)
- ✅ Mobile menu drawer
- ✅ Search overlay (keyboard shortcut: `/`)
- ✅ Product carousel (swipe mobile)
- ✅ Lookbook drag-to-scroll
- ✅ Newsletter form với validation
- ✅ Cart counter demo
- ✅ Back-to-top button
- ✅ Scroll reveal animations
- ✅ Lazy loading ảnh
- ✅ Responsive: 375px → 1440px
- ✅ prefers-reduced-motion support
- ✅ Accessibility (ARIA labels, focus-visible)

## Màu sắc thương hiệu

```css
--brand-navy:      #1F2A44  /* Chủ đạo */
--brand-navy-dark: #162036  /* Hover */
--bg-product:      #F2F2F2  /* Nền ảnh sản phẩm */
--bg-section:      #F7F7F5  /* Nền section phụ */
```

## Font

- **UI chính:** Be Vietnam Pro (Google Fonts)
- **Logo:** Montserrat
