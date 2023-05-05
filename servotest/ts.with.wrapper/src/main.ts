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
  button().disabled = true;

  const servoClient = new VIAM.ServoClient(client, 'servo')
  servoClient.move(Number(positionInput().value));

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

  setInterval(async function () {
    console.log("updating position");
    const servoClient = new VIAM.ServoClient(client, 'servo')
    const position = await servoClient.getPosition();
    positionLabel().textContent = position.toString()
  }, 1000);

  // Make the button in our app do something interesting
  button().onclick = async () => {
    await run(client);
  };
  button().disabled = false;
}

main();
