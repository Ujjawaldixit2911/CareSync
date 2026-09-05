/**
 * Cloudinary Dynamic Image Transformation Utility
 * Supports automatic face detection cropping (g_face, c_thumb / c_fill),
 * auto quality, auto format, and fallback handling for doctors and testimonials.
 */

export const FALLBACK_DOCTOR_AVATARS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&h=400&crop=faces&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&h=400&crop=faces&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&h=400&crop=faces&q=80",
  "https://images.unsplash.com/photo-1594824813589-39938b8163f9?auto=format&fit=crop&w=400&h=400&crop=faces&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&h=400&crop=faces&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&crop=faces&q=80"
];

export const getCloudinaryUrl = (
  imageUrl, 
  {
    width = 400,
    height = 400,
    crop = 'thumb', // 'thumb', 'fill', 'crop'
    gravity = 'face', // 'face', 'center'
    quality = 'auto',
    fallbackIndex = 0
  } = {}
) => {
  if (!imageUrl || imageUrl === '/fallback-user.png' || imageUrl.includes('placeholder')) {
    return FALLBACK_DOCTOR_AVATARS[fallbackIndex % FALLBACK_DOCTOR_AVATARS.length];
  }

  // If already a Cloudinary image URL, inject face crop and transformations
  if (imageUrl.includes('res.cloudinary.com')) {
    const uploadSegment = '/upload/';
    const splitParts = imageUrl.split(uploadSegment);
    if (splitParts.length === 2) {
      const transformation = `c_${crop},g_${gravity},w_${width},h_${height},q_${quality},f_auto/`;
      return `${splitParts[0]}${uploadSegment}${transformation}${splitParts[1]}`;
    }
  }

  // If already an Unsplash URL, apply smart face crop parameters
  if (imageUrl.includes('images.unsplash.com')) {
    const base = imageUrl.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${width}&h=${height}&crop=faces&q=85`;
  }

  return imageUrl;
};
