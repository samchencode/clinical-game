import Game from "@/core/Game";

const game = Game({
  viewAgent: "vue",
  initialPatientState: {
    name: "John Smith",
    status: "alive",
    systolic: 120,
    diastolic: 80,
    respiratoryRate: 6,
    o2Sat: 0.98,
    temperature: 36,
    atOffice: true,
  },
});

game.scribe.text("John Smith comes to your office to establish care");

const option = {
  name: "Send him home",
  isAvailable: (p: any) => p.atOffice === true,
  execute(ctx: any) {
    ctx.scribe.text("You sent him home!");
    ctx.scheduler.scheduleEvent({
      delayMs: 1000,
      execute(state: any, ctx: any) {
        ctx.patient.setState({ atOffice: false });
        ctx.scribe.text("John got home safe!");
        ctx.status.end();
      },
    });
  },
};

game.options.setOptions([option]);