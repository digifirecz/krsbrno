'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';

type Props = ImageProps & {
  // What to render when the src is set but fails to load.
  //  'placeholder' (default) — neutral grey box with an icon, keeps the layout.
  //  'none' — render nothing, so a decorative slot just collapses / shows
  //           whatever sits behind it (e.g. the hero's hexagon accent).
  fallback?: 'placeholder' | 'none';
};

/**
 * next/image wrapper. Callers already skip rendering when there's no src at all
 * (empty photo = hidden). This only handles the other case: a src that's set but
 * fails to load (deleted file, bad path) — instead of the browser's broken-image
 * glyph we show a neutral placeholder, or nothing when fallback="none".
 */
export default function SafeImage({ fallback = 'placeholder', ...props }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (fallback === 'none') return null;
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 text-neutral-300 ${props.fill ? 'absolute inset-0 h-full w-full' : ''}`}
        style={props.fill ? undefined : { width: props.width, height: props.height }}
        aria-label={typeof props.alt === 'string' && props.alt ? props.alt : 'Obrázek není k dispozici'}
        role="img"
      >
        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
      </div>
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}
