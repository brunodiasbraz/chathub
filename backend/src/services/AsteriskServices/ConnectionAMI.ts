import AsteriskManager from "asterisk-manager";

export const ami = new AsteriskManager(5038, '10.101.1.92', 'dev004', 'asterisk', true);

ami.on("peerstatus", async (evt:any) => {
  console.log(evt);
});

ami.on("managerevent", async (event:any) => {
  console.log(JSON.stringify(event));
});

ami.keepConnected();
