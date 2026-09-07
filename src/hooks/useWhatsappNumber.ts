'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_WHATSAPP_NUMBER, sanitizeWhatsappNumber } from '@/lib/whatsapp';

export function useWhatsappNumber() {
  const [whatsapp, setWhatsapp] = useState(DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contact?.whatsapp) {
          setWhatsapp(sanitizeWhatsappNumber(data.contact.whatsapp));
        }
      })
      .catch(() => {});
  }, []);

  return whatsapp;
}
