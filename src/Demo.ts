import Game from "@/core/Game";

const game = Game({
  viewAgent: "console",
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
  playerOptions: [
    {
      name: "Send him home",
      isAvailable: p => p.atOffice === true,
      execute(ctx) {
        ctx.scribe.text('You sent him home!');
        ctx.scheduler.scheduleEvent({
          delayMs: 1000,
          execute(state, ctx) {
            ctx.patient.setState({ atOffice: false });
            ctx.scribe.text("John got home safe!");
          },
        })
      },
    },
  ]
});

game.scribe.text("John Smith comes to your office to establish care");

