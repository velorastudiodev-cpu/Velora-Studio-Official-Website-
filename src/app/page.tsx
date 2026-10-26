import { Founder } from "@/components/sections/Founder";
import { HeroReel } from "@/components/sections/HeroReel";
import { PlanConfigurator } from "@/components/sections/PlanConfigurator";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StudioIntro, Ticker } from "@/components/sections/StudioIntro";
import { VerbPanels } from "@/components/sections/VerbPanels";
import { WorkPanels } from "@/components/sections/WorkPanels";
import { headers } from "next/headers";
import { CONTACT } from "@/data/contact";
import { FOUNDER } from "@/data/studio";
import { SITE_URL } from "@/lib/site";

// What search engines read about the studio; every value is on the page too.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Velora Studio Dev",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/velora-logo.svg`,
  email: CONTACT.email,
  telephone: `+${CONTACT.whatsapp}`,
  areaServed: "ID",
  address: { "@type": "PostalAddress", addressLocality: FOUNDER.city, addressCountry: "ID" },
  founder: { "@type": "Person", name: FOUNDER.name, url: FOUNDER.portfolio },
  description: "Studio satu orang untuk desain UI/UX, website, dashboard, dan software.",
};

// The argument, in order: what this is (hero, studio) → who (founder) → proof (work) → how (verbs) → your project (plan + band) → close.
export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <>
      {/* "<" escaped so no string in the data can close the script element. */}
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main>
        <HeroReel />
        <StudioIntro />
        <Ticker />
        <Founder />
        <WorkPanels />
        <VerbPanels />
        <PlanConfigurator />
      </main>
      <SiteFooter />
    </>
  );
}
