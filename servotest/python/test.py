import asyncio

from viam.robot.client import RobotClient
from viam.rpc.dial import Credentials, DialOptions
from viam.components.board import Board
from viam.components.servo import Servo


async def connect():
    creds = Credentials(
        type='robot-location-secret',
        payload='')
    opts = RobotClient.Options(
        refresh_interval=0,
        dial_options=DialOptions(credentials=creds)
    )
    return await RobotClient.at_address('steve-main.6xs7zv3bxz.viam.cloud', opts)

async def main():
    robot = await connect()
   
    # servo
    servo = Servo.from_robot(robot, "servo")
    servo_return_value = await servo.get_position()
    print(f"servo before get_position return value: {servo_return_value}")
    await servo.move(servo_return_value + 10)
    servo_return_value = await servo.get_position()
    print(f"servo after get_position return value: {servo_return_value}")

    # Don't forget to close the robot when you're done!
    await robot.close()

if __name__ == '__main__':
    asyncio.run(main())
