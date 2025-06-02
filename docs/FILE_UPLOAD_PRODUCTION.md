# Production File Upload Solution

## Overview

This document outlines the production-ready file upload system for the Davente marketplace, designed to work seamlessly with Vercel's serverless infrastructure.

## ⚠️ Previous Issues Resolved

### 1. **Ephemeral File System**
- **Problem**: Files saved to `public/uploads/` were lost on deployment/restart
- **Solution**: Migrated to Vercel Blob for persistent cloud storage

### 2. **4.5MB Payload Limit**
- **Problem**: Vercel serverless functions have a 4.5MB request/response limit
- **Solution**: Implemented dual upload strategy:
  - Server uploads: ≤4MB files via API routes
  - Client uploads: >4MB files directly to Blob storage

## Architecture

### Two Upload Methods

#### 1. Server Upload (≤4MB files)
```
User → React Component → API Route → Vercel Blob → Database
```

**API Route**: `/api/upload/image`
- Handles files up to 4MB
- Validates authentication
- Processes file through server
- Returns Blob URL

#### 2. Client Upload (>4MB files)
```
User → React Component → Vercel Blob (Direct) → Webhook → Database
```

**API Route**: `/api/upload/presigned`
- Generates secure upload tokens
- Files upload directly from browser to Blob
- Bypasses 4.5MB serverless limit
- Supports files up to 50MB

## Components

### 1. `ImageUpload` (Legacy - Small Files)
- For files ≤4MB
- Uses server upload method
- Simpler implementation
- Good for profile pictures

### 2. `LargeImageUpload` (New - Any Size)
- For files up to 50MB
- Uses client upload method
- Progress tracking
- Better for listing photos

## Environment Setup

### Required Environment Variables

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
```

### Vercel Dashboard Setup

1. Go to your project in Vercel Dashboard
2. Navigate to Storage tab
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add to your environment variables

## Usage Examples

### Small File Upload (Profile Pictures)

```tsx
import ImageUpload from '@/components/ui/ImageUpload';

<ImageUpload
  currentImage={user.picture}
  onImageChange={(url) => updateProfilePicture(url)}
  size="lg"
  shape="circle"
/>
```

### Large File Upload (Listing Photos)

```tsx
import LargeImageUpload from '@/components/ui/LargeImageUpload';

<LargeImageUpload
  currentImage={listing.mainImage}
  onImageChange={(url) => updateListingImage(url)}
  size="lg"
  shape="square"
  maxSizeMB={50}
/>
```

## File Validation

### Server Upload Validation
- File type: `image/*` only
- Max size: 4MB
- Authentication required
- Filename sanitization

### Client Upload Validation
- File type: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`
- Max size: 50MB (configurable)
- Authentication required
- Secure token generation

## Security Features

1. **Authentication Required**: All uploads require valid JWT tokens
2. **File Type Validation**: Only image files allowed
3. **Size Limits**: Enforced on both client and server
4. **Unique Filenames**: Prevents filename collisions
5. **Secure Tokens**: Client uploads use time-limited tokens

## File URL Structure

### Vercel Blob URLs
```
https://[store-id].public.blob.vercel-storage.com/[filename]
```

Example:
```
https://abc123def.public.blob.vercel-storage.com/avatar_123_1704067200_xyz789.jpg
```

## Migration from Local Storage

### Before (Local Storage - Development Only)
```typescript
// ❌ This doesn't work in production
const filePath = join(uploadDir, fileName);
await writeFile(filePath, buffer);
return `/uploads/${type}/${fileName}`;
```

### After (Vercel Blob - Production Ready)
```typescript
// ✅ Production ready
const blob = await put(fileName, file, {
  access: 'public',
  addRandomSuffix: false,
});
return blob.url;
```

## Performance Benefits

1. **CDN Integration**: Blob files served via Vercel's global CDN
2. **Optimized Delivery**: Automatic image optimization
3. **Concurrent Uploads**: Multiple files can upload simultaneously
4. **Progress Tracking**: Real-time upload progress for large files

## Cost Considerations

### Vercel Blob Pricing (As of 2024)
- **Free Tier**: 5GB storage + 100K operations
- **Pro Plan**: $0.023/GB storage + $0.40/1M simple operations
- **Bandwidth**: Included in Vercel plans

### Optimization Tips
1. Compress images before upload
2. Use appropriate file formats (WebP for web)
3. Implement image resizing for thumbnails
4. Clean up unused files periodically

## Testing

### Local Development
```bash
# Install dependencies
npm install @vercel/blob

# Pull environment variables
vercel env pull

# Test uploads
npm run dev
```

### Production Testing
1. Deploy to staging environment
2. Test both small and large file uploads
3. Verify file accessibility via CDN
4. Check upload progress tracking
5. Test error handling scenarios

## Troubleshooting

### Common Issues

1. **"BLOB_READ_WRITE_TOKEN not found"**
   - Ensure environment variable is set
   - Run `vercel env pull` for local development

2. **"413 Payload Too Large"**
   - File exceeds 4MB limit for server upload
   - Use `LargeImageUpload` component instead

3. **"Upload failed with 401"**
   - Check authentication token validity
   - Ensure user is logged in

4. **"Client upload not working on localhost"**
   - Use ngrok or similar tunneling service
   - Or test directly on Vercel preview deployments

## Next Steps

1. **Image Compression**: Add automatic image compression
2. **Multiple File Upload**: Support batch uploads
3. **File Management**: Admin interface for file management
4. **Usage Analytics**: Track storage usage and costs
5. **File Cleanup**: Automated cleanup of orphaned files

## Related Documentation

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [File Upload API Reference](./API_REFERENCE.md)
- [Component Documentation](./COMPONENTS.md) 