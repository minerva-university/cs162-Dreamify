import os
import redis
from rq import Worker, Queue, Connection
from api import create_app  # Adjust the import according to your project structure

app = create_app()
app.logger.setLevel('INFO')

with app.app_context():
    app.logger.info("Application context initialized successfully.")


listen = ['high', 'default', 'low']

redis_url = os.getenv('REDIS_URL')

conn = redis.from_url(redis_url)

if __name__ == '__main__':
    with Connection(conn):
        try:
            worker = Worker(map(Queue, listen))
            worker.work()
        except Exception as e:
            app.logger.error('Failed to start the worker', exc_info=True)
