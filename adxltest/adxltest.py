import asyncio
import datetime
import time
import statistics

from viam.robot.client import RobotClient
from viam.rpc.dial import Credentials, DialOptions
from viam.components.motor import Motor
from viam.components.base import Base
from viam.components.encoder import Encoder
from viam.components.movement_sensor import MovementSensor
from viam.components.board import Board


async def connect():
    creds = Credentials(
        type='robot-location-secret',
    opts = RobotClient.Options(
        refresh_interval=0,
        dial_options=DialOptions(credentials=creds)
    )
    return await RobotClient.at_address('rovie-main.6xs7zv3bxz.viam.cloud', opts)

async def main():
    robot = await connect()

    # adxl
    adxl = MovementSensor.from_robot(robot, "adxl")
    
    timing_results = []
    for i in range(1000):
        start = time.time() * 1000
    
        adxl_return_value = await adxl.get_linear_acceleration()
        end = time.time() * 1000

        timing_results.append(end - start)
        #print(end - start)

    print(f'Mean: {statistics.mean(timing_results)}')
    print(f'StdDev: {statistics.stdev(timing_results)}')
    print(f'Hz: {1000/statistics.mean(timing_results)}')

    # Don't forget to close the robot when you're done!
    await robot.close()

if __name__ == '__main__':
    asyncio.run(main())

