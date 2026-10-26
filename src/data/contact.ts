export const CONTACT = {
  /** E.164 without "+", the format wa.me expects. */
  whatsapp: "6285179854136",
  whatsappDisplay: "0851-7985-4136",
  email: "velorastudiodev@gmail.com",
} as const;

export const whatsappLink = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
