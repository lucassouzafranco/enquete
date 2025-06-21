FROM python:3.10-slim
WORKDIR /app
COPY core_connection.py agregador.py db.py ./
COPY .env /app/.env
RUN pip install python-dotenv pika requests

CMD ["python", "agregador.py"]
