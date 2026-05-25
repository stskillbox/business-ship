# Business Ship

Промо-лендинг мероприятия `Цифроход`.

## Что внутри

- [index.html](/Users/svetlana/Downloads/Archive/index.html) - основная страница сайта
- `/assets` - изображения, SVG и локальные вспомогательные файлы
- [scripts/typografize.js](/Users/svetlana/Downloads/Archive/scripts/typografize.js) - скрипт типографики для HTML-текста

## Локальный просмотр

Самый простой способ:

```bash
python3 -m http.server 8000
```

После запуска откройте [http://localhost:8000](http://localhost:8000).

## Типографика

Если нужно прогнать текст через `typograf`:

```bash
npm install
npm run typograf
```

Скрипт обновляет `index.html`.

## Публикация

Проект публикуется через GitHub Pages из ветки `main`.

Основной поток:

1. Внести правки в `index.html` и при необходимости в `/assets`.
2. Проверить страницу локально.
3. Закоммитить изменения в `main`.
4. Запушить в GitHub.

Публичный адрес:

[https://stskillbox.github.io/business-ship/](https://stskillbox.github.io/business-ship/)

## Примечания

- `index-dev.html` используется как локальный черновик и не коммитится.
- `node_modules/` игнорируется git.
