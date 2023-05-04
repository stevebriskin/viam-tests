import * as VIAM from '@viamrobotics/sdk';
import { servoApi } from '@viamrobotics/sdk';
import { grpc } from '@improbable-eng/grpc-web';

async function connect(): Promise<VIAM.RobotClient> {
  const host = 'steve-main.6xs7zv3bxz.viam.cloud';

  return VIAM.createRobotClient({
    host,
    credential: {
      type: 'robot-location-secret',
      payload: '',
    },
    authEntity: host,
    signalingAddress: 'https://app.viam.com:443',
  });
}

function button() {
  return <HTMLButtonElement>document.getElementById('main-button');
}

function positionLabel() {
  return <HTMLLabelElement>document.getElementById('servo-position');
}

function positionInput() {
  return <HTMLInputElement>document.getElementById('servo-position-input');
}

// This function runs a motor component with a given named on your robot.
// Feel free to replace it whatever logic you want to test out!
async function run(client: VIAM.RobotClient) {
  // Replace with the name of a motor on your robot.
  const name = '<MOTOR NAME>';
  const mc = new VIAM.MotorClient(client, name);

  button().disabled = true;

  const m = new servoApi.MoveRequest()
  m.setName('servo')
  m.setAngleDeg(Number(positionInput().value))
  client.servoService.move(
    m,
    new grpc.Metadata(),
    (error, response) => {
      console.log("moved");
      console.log(error, response)
    }
  );

  button().disabled = false;
}

async function main() {
  // Connect to client
  let client: VIAM.RobotClient;
  try {
    client = await connect();
    console.log('connected!');
  } catch (error) {
    console.log(error);
    return;
  }

  setInterval(function() {
    console.log("updating position");
    const r = new servoApi.GetPositionRequest()
    r.setName('servo')
  
    client.servoService.getPosition(
      r,
      new grpc.Metadata(),
      (error, response) => {
        if(response != undefined) {
          positionLabel().textContent = response.getPositionDeg().toString()
        }
      }
    );
}, 1000);

  // Make the button in our app do something interesting
  button().onclick = async () => {
    await run(client);
  };
  button().disabled = false;
}

main();
