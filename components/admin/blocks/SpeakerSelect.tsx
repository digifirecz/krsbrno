'use client';

import { useEffect, useState } from 'react';
import SearchSelect from '@/components/admin/blocks/SearchSelect';
import { getSermonSpeakers } from '@/lib/actions/sermons';
import type { SermonSpeaker } from '@/lib/sermons';

interface SpeakerSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

// Self-contained: loads the speaker list itself so forms just drop it in.
export default function SpeakerSelect({ value, onChange, id }: SpeakerSelectProps) {
  const [speakers, setSpeakers] = useState<SermonSpeaker[]>([]);

  useEffect(() => {
    let active = true;
    getSermonSpeakers()
      .then((rows) => active && setSpeakers(rows))
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
      options={speakers.map((s) => ({ value: s.id, label: s.name }))}
      emptyLabel="— bez řečníka —"
      searchPlaceholder="Hledat řečníka…"
    />
  );
}
