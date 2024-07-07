# Домашнее задание ШРИ: Автотесты

Привет! Написаны тесты на Jest и Testplane

<details>## BUG_ID = 1 [Пойман]

<summary>Падает один интеграционный тест. Проблемы с отображением имени товара</summary>

```
name: Error
message: Expect $(`.ProductItem`).$(`.ProductItem-Name`) to be displayed
Expected: "displayed"
Received: "not displayed"
``` 

![скриншот ошибки из testplane gui](./screenshots/image.png)
</details>
<details>## BUG_ID = 2 [Не пойман]</details>

<details>## BUG_ID = 3 [Пойман]

<summary>Падает 2 интеграционных теста. В ответе на запрос информации по конкретному товару приходит информация по товару с id = 0, но данные не отображаются.</summary>

```
name: Error
message: Can't call $ on element with selector ".ProductDetails" because element wasn't found
```

![скриншот ошибки из testplane gui](./screenshots/image-1.png)
</details>

<details>## BUG_ID = 4 [Пойман]

<summary>Падает 1 интеграционный тест. Проблемы с навигационным меню</summary>

![скриншот ошибки из testplane gui](./screenshots//image-2.png)
</details>

<details>## BUG_ID = 5 [Пойман]

<summary>Падает 1 интеграционный тест. Проблема с оформлением заказа</summary>

![скриншот ошибки из testplane gui](./screenshots/image-3.png)
</details>

<details>## BUG_ID = 6 [Не пойман]</details>
<details>## BUG_ID = 7 [Не пойман]</details>
<details>## BUG_ID = 8 [Не пойман]</details>


<details>## BUG_ID = 9 [Пойман]

<summary>Падает 1 интеграционный скриншотный тест. Проблема с размерами кнопки заказа</summary>

![скриншот ошибки из testplane gui](./screenshots/image-5.png)
</details>

<details>## BUG_ID = 10 [Пойман]

<summary>Падает 2 интеграционных теста. Проблема с валидностью полей.</summary>

![скриншот ошибки из testplane gui](./screenshots/image-4.png)
</details>