'use client';

import { useEffect, useState } from 'react';
import { getSocialLinks } from '@/lib/actions/socialLinks';
import type { SocialLink } from '@/lib/socialLinks';

/**
 * Social network icons/links shown in the footer, managed in /admin/nastaveni.
 * Returns null while loading.
 */
export function useSocialLinks(): SocialLink[] | null {
  const [links, setLinks] = useState<SocialLink[] | null>(null);

  useEffect(() => {
    let active = true;
    getSocialLinks()
      .then((fetched) => {
        if (active) setLinks(fetched);
      })
      .catch(() => {
        if (active) setLinks([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return links;
}
