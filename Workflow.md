# Как работать над проектом

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз **Node.js**. Актуальная версия **Node.js** указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Разверните базу данных MongoDB

В проекте используется база данных **MongoDB** версии 4.2.

Если вы используете Docker, воспользуйтесь файлом `docker-compose.dev.yml`, расположенным в корне проекта, для быстрого разворачивания базы данных.

### Наполните базу данных

Запустите JSON-сервер с моковыми данными:

```bash
npm run mock:server
```

Сгенерируйте нужное количество предложений об аренде:

```bash
npm run cli -- --generate 10 ./mocks/mock-data.tsv http://localhost:3123/api
```

Импортируйте данные в базу данных, используя настройки подключения из файла `docker-compose`:

```bash
npm run cli -- --import ./mocks/mock-data.tsv admin test 127.0.0.1 six-cities secret
```

### Настройте переменные окружения

В корне проекта находится файл `.env.example`. Скопируйте его содержимое в файл `.env` и настройте значения переменных.

#### Переменные окружения

```bash
HOST=localhost - Имя хоста, на котором стартует сервер
PORT=4000 - Порт для входящих соединений
SALT=salt - Соль для хэширования паролей
DB_HOST=127.0.0.1 - IP-адрес сервера базы данных (MongoDB)
DB_USER=admin - Имя пользователя для подключения к базе данных
DB_PASSWORD=test - Пароль для подключения к базе данных
DB_PORT=27017 - Порт для подключения к базе данных (MongoDB)
DB_NAME=six-cities - Имя базы данных (MongoDB)
UPLOAD_DIRECTORY_PATH=upload - Директория для хранения загружаемых пользователями файлов (абсолютный путь)
STATIC_DIRECTORY_PATH=static - Директория для хранения статических файлов (абсолютный путь)
JWT_SECRET=secret - Секрет для подписи JWT-токена
```

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

#### Запустить проект в режиме разработки

```bash
npm run start:dev
```

#### Запустить тестовый REST API (JSON-server)

```bash
npm run mock:server
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

### Файл `specification/project.spec.yml`

В этом файле описана спецификация REST API в формате OpenAPI.

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.
