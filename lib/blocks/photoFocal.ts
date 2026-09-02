import type { BlockPhoto } from '@/lib/blocks/types';

// CSS object-position for a cropped (object-cover) rendering of this photo, or
// undefined to fall back to the browser default (center) when no focal point
// has been set in the admin.
export function focalObjectPosition(photo?: BlockPhoto | null): string | undefined {
  if (!photo || photo.focalX === undefined || photo.focalY === undefined) return undefined;
  return `${photo.focalX}% ${photo.focalY}%`;
}
