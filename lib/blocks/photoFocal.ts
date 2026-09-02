import type { CSSProperties } from 'react';
import type { BlockPhoto } from '@/lib/blocks/types';

// CSS object-position for a cropped (object-cover) rendering of this photo, or
// undefined to fall back to the browser default (center) when no focal point
// has been set in the admin.
export function focalObjectPosition(photo?: BlockPhoto | null): string | undefined {
  if (!photo || photo.focalX === undefined || photo.focalY === undefined) return undefined;
  return `${photo.focalX}% ${photo.focalY}%`;
}

// Full style for a cropped (object-cover) rendering of this photo, including
// the extra zoom set in the admin. The zoom is a transform anchored at the
// same point as object-position, so it crops further into whichever axis
// object-position alone couldn't touch — the photo file itself is untouched.
export function focalCropStyle(photo?: BlockPhoto | null): CSSProperties | undefined {
  const position = focalObjectPosition(photo);
  if (!position) return undefined;
  const zoom = photo?.zoom && photo.zoom > 1 ? photo.zoom : undefined;
  return {
    objectPosition: position,
    ...(zoom ? { transform: `scale(${zoom})`, transformOrigin: position } : {}),
  };
}
