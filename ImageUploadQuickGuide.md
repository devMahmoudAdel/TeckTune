# Quick Developer Guide: TeckTune Image Upload System

## Overview

This is a simplified guide to the image upload system used in the TeckTune app. It explains how images are uploaded to Firebase Storage and associated with products.

## System Components

![Image Upload Flow](https://i.imgur.com/8YaA8rO.png)

1. **Configuration**: `firebase/config.js` - Sets up Firebase Storage
2. **Utility Functions**: `firebase/imageStorage.js` - Core image handling functions
3. **UI Integration**: `ProductForm.jsx` - User interface for image selection/upload

## How It Works (Simple)

1. User taps "Add Image" in product form
2. User selects image from gallery or takes photo with camera
3. App converts image to blob and uploads to Firebase Storage
4. Firebase returns a download URL
5. URL is saved with product data

## Key Functions

### 1. Selecting Images
```javascript
// In imageStorage.js
selectImage(useCamera) → Returns image data
```
- Call with `true` to use camera, `false` to use gallery
- Returns object with image URI and metadata

### 2. Uploading Images
```javascript
// In imageStorage.js
uploadImage(imageData, filename, progressCallback) → Returns URL
```
- Takes image data from selectImage()
- Optional progress callback for UI updates
- Returns URL and path for Firebase Storage

### 3. Deleting Images
```javascript
// In imageStorage.js
deleteImage(filePath) → Returns success/failure
```
- Deletes image from Firebase Storage
- Can accept URL or direct storage path

## Where Things Happen

### When uploading an image:
1. User interaction: `ProductForm.jsx` → `handleSelectImage()`
2. Image selection: `imageStorage.js` → `selectImage()`
3. Upload process: `imageStorage.js` → `uploadImage()`
4. Progress tracking: Updates through callback to ProductForm

## Common Issues & Fixes

### Issue: Upload stuck at certain percentage
- **Fix**: Check network connection, restart app

### Issue: Permission denied errors
- **Fix**: Check app permissions in device settings

### Issue: Images not showing after upload
- **Fix**: Verify Firebase Storage rules allow read access

## How to Make Changes

### To modify the image upload UI:
- Edit `ProductForm.jsx` - Look for the image picker modal and progress components

### To change upload behavior (compression, naming, etc.):
- Edit `imageStorage.js` - Modify the uploadImage() function 

### To change where images are stored:
- Edit `imageStorage.js` - Change the `filePath` variable in uploadImage()
- Current location: `products/${fileName}`

## Tips for Developers

1. Monitor uploads in the console with: `console.log("Upload progress: ${percent}%");`
2. After upload completes, check for: `Download URL: [url]` in console
3. Test on slow networks to ensure progress tracking works properly
4. When debugging, check these critical parts:
   - Blob creation (`Blob created with size: ${blob.size} bytes`)
   - Upload start (`Starting Firebase upload...`)
   - Download URL acquisition (`Upload completed, getting download URL...`)

## Need More?

For more detailed explanation, see the comprehensive documentation in `ImageUploadDocumentation.md`