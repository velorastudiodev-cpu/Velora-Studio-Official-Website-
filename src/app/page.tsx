import { BlueprintGrid } from "@/components/grid/BlueprintGrid";
import { DisciplineMatrix } from "@/components/sections/DisciplineMatrix";
import { EngineeringLedger } from "@/components/sections/EngineeringLedger";
import { HeroTelemetry } from "@/components/sections/HeroTelemetry";
import { ProjectMatrix } from "@/components/sections/ProjectMatrix";
import { StudioCTAConsole } from "@/components/sections/StudioCTAConsole";

// Core User Journey, top to bottom: identity → pillars → flagships → ledger → CTA.
export default function Home() {
  return (
    <main>
      <BlueprintGrid>
        <HeroTelemetry />
        <DisciplineMatrix />
        <ProjectMatrix />
        <EngineeringLedger />
        <StudioCTAConsole apiEnabled={Boolean(process.env.RESEND_API_KEY)} />
      </BlueprintGrid>
    </main>
  );
}
