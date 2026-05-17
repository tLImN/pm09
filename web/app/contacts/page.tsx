import type { Metadata } from "next";
import ContactsPageClient from "@/components/ContactsPageClient";

export const metadata: Metadata = {
  title: "Контакты",
};

export default function ContactsPage() {
  return <ContactsPageClient />;
}