import Game from '@/core/Game';

const game = Game({
  viewAgent: 'console',
  initialPatientState: {
    name: "John Smith",
    status: 'alive',
    systolic: 120,
    diastolic: 80,
    respiratoryRate: 6,
    o2Sat: 0.98,
    temperature: 36,
    atOffice: true,
  },
  patientReducers: {
    "SEND_HOME": (state) => {
      state.atOffice = false;
      return state;
    }
  }, 
  initialScheduledEvents: [
    {
      action: {
        type: "WRITE_LINE",
        payload: {
          type: "text",
          data: "John Smith comes to your office to establish care"
        }
      },
      delayMs: 0
    }
  ],
  patientOptions: [
    {
      name: "Send Him Home",
      isAvailable: (patient) => patient.atOffice === true,
      execute: (dispatch, scheduler) => {
        dispatch({ type: "SEND_HOME" });
        game.scribe.text("You sent him home!");
        scheduler.scheduleEvent({
          action: {
            type: "WRITE_LINE",
            payload: {
              type: "text",
              data: "John Smith arrived home safe and sound"
            }
          },
          delayMs: 250
        })
      }
    }
  ]
})