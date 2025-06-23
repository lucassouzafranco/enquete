FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir flask python-dotenv pika
COPY . .

EXPOSE 5000
CMD ["python", "-u", "agregador.py"]
# CMD ["python", "-u", "agregador_to_db.py"]
