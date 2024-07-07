# Домашнее задание ШРИ: Автотесты

Привет! Написаны тесты на Jest и Testplane

## BUG_ID = 1 [Пойман]

Падает один интеграционный тест. Проблемы с отображением имени товара

```
name: Error
message: Expect $(`.ProductItem`).$(`.ProductItem-Name`) to be displayed
Expected: "displayed"
Received: "not displayed"
``` 

![скриншот ошибки из testplane gui](./screenshots/image.png)

## BUG_ID = 2 [Не пойман]

## BUG_ID = 3 [Пойман]

Падает 2 интеграционных теста. В ответе на запрос информации по конкретному товару приходит информация по товару с id = 0, но данные не отображаются.

```
name: Error
message: Can't call $ on element with selector ".ProductDetails" because element wasn't found
```

![скриншот ошибки из testplane gui](./screenshots/image-1.png)

## BUG_ID = 4 [Пойман]

Падает 1 интеграционный тест. Проблемы с навигационным меню

![скриншот ошибки из testplane gui](./screenshots//image-2.png)

## BUG_ID = 5 [Пойман]

Падает 1 интеграционный тест. Проблема с оформлением заказа

![скриншот ошибки из testplane gui](./screenshots/image-3.png)

## BUG_ID = 6 [Не пойман]
## BUG_ID = 7 [Не пойман]
## BUG_ID = 8 [Не пойман]


## BUG_ID = 9 [Пойман]

Падает 1 интеграционный скриншотный тест. Проблема с размерами кнопки заказа

![скриншот ошибки из testplane gui](./screenshots/image-5.png)


## BUG_ID = 10 [Пойман]

Падает 2 интеграционных теста. Проблема с валидностью полей. 

![скриншот ошибки из testplane gui](./screenshots/image-4.png)