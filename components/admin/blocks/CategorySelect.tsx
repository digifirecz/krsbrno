'use client';

import { useEffect, useState } from 'react';
import SearchSelect from '@/components/admin/blocks/SearchSelect';
import { getSermonCategories } from '@/lib/actions/sermons';
import type { SermonCategory } from '@/lib/sermons';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

// Self-contained: loads the category list itself so forms just drop it in.
export default function CategorySelect({ value, onChange, id }: CategorySelectProps) {
  const [cats, setCats] = useState<SermonCategory[]>([]);

  useEffect(() => {
    let active = true;
    getSermonCategories()
      .then((rows) => active && setCats(rows))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <SearchSelect
      id={id}
      value={value}
      onChange={onChange}
      options={cats.map((c) => ({ value: c.id, label: c.name }))}
      emptyLabel="— bez kategorie —"
      searchPlaceholder="Hledat kategorii…"
    />
  );
}
