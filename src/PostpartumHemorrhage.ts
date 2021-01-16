import Game from "@/core/Game";

const patient = {
  name: "Jane",
  remainingBloodMl: 5000,
  ivAccess: false,
  fluidResuscitation: false,
  alert: true,
  bleeding: true,
  platelets: 5000,
  PT: 20,
  aPTT: 70,
  INR: 3.2,
};

const game = Game({
  viewAgent: "vue",
  initialPatientState: patient,
  conditionals: [
    {
      once: true,
      check: (p) =>
        p.remainingBloodMl < 4000 &&
        p.remainingBloodMl > 3000 &&
        p.alert === true,
      execute: (ctx) => {
        ctx.scribe.text("Jane is faint, disoriented, and confused");
        console.log(2)
        ctx.patient.setState({ alert: false });
      },
    },
    {
      once: true,
      check: (p) => p.remainingBloodMl < 2500,
      execute: (ctx) => {
        ctx.scribe.text("Jane has died from blood loss");
        ctx.options.setOptions([]);
        ctx.status.end();
      },
    },
  ],
});

let eLosingBlood: any;

game.scene.register("start", (ctx) => {
  eLosingBlood = loseBlood(ctx, 500);

  ctx.scribe.text("Jane is bleeding more than she should after delivery!");

  ctx.options.setOptions([
    {
      name: "get IV access",
      isAvailable: p => p.ivAccess === false,
      execute: (ctx) => {
        ctx.patient.setState({ ivAccess: true });
        ctx.scribe.text(
          "You secured IV access with 2 large bore IV's, wide open"
        );
      },
    },
    {
      name: "perform fluid resuscitation",
      isAvailable: (p) => p.ivAccess === true && p.fluidResuscitation === false,
      execute: (ctx) => {
        ctx.scheduler.cancelEvent(eLosingBlood.eventId);
        ctx.scribe.text(
          "You perform fluid resuscitation with whole IVF (LR, NS)"
        );
        eLosingBlood = loseBlood(ctx, 50);
        ctx.patient.setState({ fluidResuscitation: true })
      },
    },
    {
      name: "order stat labs",
      isAvailable: (p) => p.ivAccess === true,
      execute: (ctx) => {
        ctx.scribe.text("You ordered labs");
        scheduleLabs(ctx);
      },
    },
    {
      name: "evaluate birth canal tissues for trauma & retained tissue",
      execute: (ctx) => {
        ctx.scribe.text("You evaluate the birth canal.");
        ctx.scene.start("finale");
      },
    },
  ]);
});

game.scene.register("finale", (ctx) => {
  ctx.scribe.text("you notice trauma & retained tissue");

  ctx.options.setOptions(
    [
      "1-handed uterine massage",
      "2-handed uterine massage",
      "Bakri balloon",
      "oxytocin",
      "methergine",
      "misoprostol",
      "hemabate",
    ].map((x) => cureBy("Give " + x))
  );
});

// Utilities
const loseBlood = (ctx: any, amt: number) =>
  ctx.scheduler.scheduleEvent({
    delayMs: 1000,
    repeat: 10,
    execute: (ctx: any, { remainingBloodMl }: any) => {
      ctx.patient.setState({ remainingBloodMl: remainingBloodMl - amt });
    },
  });

const scheduleLabs = (ctx: any) =>
  ctx.scheduler.scheduleEvent({
    delayMs: 1000,
    execute: (ctx: any, patient: any) => {
      const { aPTT, PT, INR, platelets } = patient;
      ctx.scribe.text(`aPTT: ${aPTT}, PT: ${PT}, INR: ${INR} platelets: ${platelets}`);
    },
  });

const cureBy = (name: string) => ({
  name,
  execute: (ctx: any) => {
    ctx.scribe.text('you start the procedure... this will take 5 secs')
    ctx.options.setOptions([])
    ctx.scheduler.scheduleEvent({
      delayMs: 5050,
      execute: (ctx: any) => {
        if(ctx.status.hasEnded()) return
        ctx.patient.setState({ bleeding: false });
        ctx.scribe.text("the bleeding stopped!");
        ctx.status.end();
      }
    })
  },
});

// start game

game.scene.start("start");
