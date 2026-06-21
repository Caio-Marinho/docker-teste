FROM python:3.13.14-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Variável de ambiente do PIP para ignorar o aviso de root globalmente no container
ENV PIP_ROOT_USER_ACTION=ignore

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir --root-user-action=ignore -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
