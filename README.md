# Pushti Bhai - E-commerce Platform

A modern, responsive e-commerce platform built with Next.js, featuring admin panel, multi-language support, and WhatsApp integration.

## 🎨 Customization Guide

### 1. Site Configuration (`lib/siteConfig.ts`)

This is your main configuration file. Edit it to customize:

- **Site Name & Description**: Change `siteName`, `siteDescription`, and `tagline`
- **Colors**: Update the `theme` object with your preferred hex colors
- **Contact Info**: Update phone, WhatsApp, email, and address
- **Delivery Areas**: Modify the `deliveryAreas` array
- **Business Hours**: Set your operating hours
- **Admin Credentials**: Change the default admin username/password

```typescript
export const siteConfig = {
  siteName: 'Your Store Name',
  theme: {
    primary: '#4CAF50',      // Your brand color
    primaryDark: '#388E3C',  // Darker shade
    // ... other colors
  },
  contact: {
    phone: '+880 1712-345678',
    whatsapp: '+8801712345678',
    // ... other contact info
  }
};
```

### 2. Logo Upload Instructions

To add your custom logo:

1. **Add your logo file** to the `public` folder:
   - Recommended formats: PNG, SVG, or JPG
   - Recommended size: 120x40px for header, 200x80px for footer
   - Example: Save as `public/logo.png`

2. **Update the logo path** in `lib/siteConfig.ts`:
   ```typescript
   logo: {
     path: '/logo.png', // Change this to your logo filename
     alt: 'Your Store Logo',
     width: 120,
     height: 40
   }
   ```

3. **Logo will automatically appear** in:
   - Navigation header
   - Hero section
   - Footer
   - Admin pages

### 3. Color Customization

Colors are managed through CSS custom properties. To change colors:

1. **Edit `lib/siteConfig.ts`** - Update the `theme` object with hex codes
2. **Colors automatically apply** to:
   - Buttons and links
   - Headers and navigation
   - Product cards
   - Admin interface

### 4. Contact Information

Update contact details in `lib/siteConfig.ts`:

- **Phone**: Displays with click-to-call functionality
- **WhatsApp**: Creates direct WhatsApp links with pre-filled messages
- **Email**: Opens default email client
- **Delivery Areas**: Shows service coverage
- **Business Hours**: Supports both English and Bangla

### 5. Multi-Language Support

The site supports English and Bangla:

- **Add new translations** in `lib/translations.ts`
- **Language toggle** appears in the navigation
- **All text switches instantly** when language is changed

## 📁 Key Files to Edit

### For Regular Updates:
- `lib/siteConfig.ts` - Site name, colors, contact info
- `lib/translations.ts` - Add new text translations
- `public/` - Upload logo and images

### For Advanced Customization:
- `components/Logo.tsx` - Logo display logic
- `components/ContactInfo.tsx` - Contact section layout
- `app/page.tsx` - Homepage content and structure
- `lib/theme.ts` - Theme utilities and CSS generation

## 🚀 Deployment

### Frontend (Vercel):
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Set environment variables if needed

### Backend Options:
- **Render**: Connect GitHub repo, auto-deploy
- **Railway**: Simple deployment with database
- **Vercel API Routes**: Already included (current setup)

### Database:
- **MongoDB Atlas**: Cloud database (recommended)
- **Current**: In-memory storage (demo only)

### Images:
- **Cloudinary**: Upload and manage product images
- **Current**: Direct URLs (basic setup)

## 🔧 Environment Variables

For production, create `.env.local`:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_URL=your_cloudinary_url
```

## 📱 Features

- ✅ Responsive design (mobile-first)
- ✅ Admin authentication system
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Multi-language support (EN/BN)
- ✅ WhatsApp integration
- ✅ Contact information display
- ✅ Customizable theme colors
- ✅ Logo upload support

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, CSS Custom Properties
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: React Context
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📞 Support

For customization help or technical support, contact the development team or refer to the documentation in each component file.