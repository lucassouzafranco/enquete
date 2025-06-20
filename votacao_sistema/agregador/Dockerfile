FROM python:3.10-slim
WORKDIR /app
COPY core_connection.py agregador.py ./
COPY .env /app/.env
RUN pip install python-dotenv pika requests
# RUN pip install pika

CMD ["python", "agregador.py"]
