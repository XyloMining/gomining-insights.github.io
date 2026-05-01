import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getSiteSettings, updateSiteSettings } from "../_core/contentStore";
import { getSchedulerStatus } from "../_core/scheduler";

export const adminRouter = router({
  getSettings: publicProcedure.query(async () => getSiteSettings()),
  updateSettings: adminProcedure
    .input(
      z.object({
        showGoMiningNavLink: z.boolean(),
        showAds: z.boolean(),
        homeCtaText: z.string().min(1).max(140),
      })
    )
    .mutation(async ({ input }) => updateSiteSettings(input)),
  getSchedulerStatus: adminProcedure.query(async () => getSchedulerStatus()),
});
