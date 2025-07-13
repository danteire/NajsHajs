FROM python:3.12-alpine as base

# Setup env
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Install pipenv and compilation dependencies
RUN pip install poetry
RUN apk --upgrade add postgresql-dev gcc musl-dev jpeg-dev zlib-dev libffi-dev cairo-dev pango-dev gdk-pixbuf-dev python3-dev

# Install python dependencies in /.venv
COPY pyproject.toml poetry.lock ./

RUN pip install cryptography
RUN pip install -U pip
RUN poetry install

FROM base as test
COPY --from=base /.venv /.venv

RUN poetry install
ENV PATH="/.venv/bin:$PATH"

RUN addgroup -g 1000 -S appuser && \
    adduser -u 1000 -S appuser -G appuser

RUN mkdir -p /home/appuser/images && chmod 777 -R /home/appuser/images

WORKDIR /home/appuser
USER appuser

# Install application into container
COPY . .


FROM base AS runtime

# Copy virtual env from python-deps stage
COPY --from=base /.venv /.venv

# Create and switch to a new user
RUN addgroup -g 1000 -S appuser && \
    adduser -u 1000 -S appuser -G appuser
WORKDIR /home/appuser
USER appuser

RUN mkdir -p /home/appuser/images && chmod 777 -R /home/appuser/images

# Install application into container
COPY . .