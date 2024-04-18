import os

import redis
from rq import Worker, Queue, Connection

listen = ['high', 'default', 'low']

redis_url = 'redis://:p8d6d79931eaef8f95d440ac4156f7a135d083e5c4fc85518ae6eb170d98ebd8f@ec2-34-194-199-53.compute-1.amazonaws.com:19949'

conn = redis.from_url(redis_url)


if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(map(Queue, listen))
        worker.work()