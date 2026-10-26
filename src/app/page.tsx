import { HeroReel } from "@/components/sections/HeroReel";
import { PlanConfigurator } from "@/components/sections/PlanConfigurator";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { VerbPanels } from "@/components/sections/VerbPanels";
import { WorkPanels } from "@/components/sections/WorkPanels";

// The argument, in order: what this is (hero) → proof (work) → how (verbs) → your project (plan + band) → close.
export default function Home() {
  return (
    <>
      <main>
        <HeroReel />
        <WorkPanels />
        <VerbPanels />
        <PlanConfigurator />
      </main>
      <SiteFooter />
    </>
  );
}
