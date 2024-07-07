import { BASE_URL, BUG_ID } from "./constants";

const catalogUrl = BUG_ID
	? `${BASE_URL}/hw/store/catalog?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store/catalog`;
const cartUrl = BUG_ID
	? `${BASE_URL}/hw/store/cart?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store/cart`;
const homePageUrl = BUG_ID
	? `${BASE_URL}/hw/store?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store`;
const firstProductUrl = BUG_ID
	? `${BASE_URL}/hw/store/catalog/0?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store/catalog/0`;
const secondProductUrl = BUG_ID
	? `${BASE_URL}/hw/store/catalog/1?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store/catalog/1`;
const deliveryUrl = BUG_ID
	? `${BASE_URL}/hw/store/delivery?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store/delivery`;
const contactsUrl = BUG_ID
	? `${BASE_URL}/hw/store/contacts?bug_id=${BUG_ID}`
	: `${BASE_URL}/hw/store/contacts`;

describe("Каталог", () => {
	it("должен отображать товары в каталоге", async ({ browser }) => {
		await browser.url(catalogUrl);

		const products = await browser.$$(".ProductItem");

		await expect(products.length).toBeGreaterThan(
			0,
			"Товары в каталоге не найдены"
		);
	});

	it("каждый товар должен отображать название, цену и ссылку на страницу с подробной информацией", async ({
		browser,
	}) => {
		await browser.url(catalogUrl);

		const products = await browser.$$(".ProductItem");

		for (let product of products) {
			const productName = await product.$(".ProductItem-Name");
			const productPrice = await product.$(".ProductItem-Price");
			const productLink = await product.$(".ProductItem-DetailsLink");

			await expect(productName).toBeDisplayed();
			await expect(productPrice).toBeDisplayed();
			await expect(productLink).toBeDisplayed();

			const linkHref = await productLink.getAttribute("href");
			await expect(linkHref).toMatch(/\/hw\/store\/catalog\/\d+/);
		}
	});

	it("на странице с подробной информацией должны отображаться название товара, его описание, цена, цвет, материал и кнопка 'добавить в корзину'", async ({
		browser,
	}) => {
		await browser.url(catalogUrl);

		// Переходим на страницу деталей первого товара в списке
		await browser.url(secondProductUrl);

		const productDetails = await browser.$(".ProductDetails");

		const productName = await productDetails.$(".ProductDetails-Name");
		const productDescription = await productDetails.$(
			".ProductDetails-Description"
		);
		const productPrice = await productDetails.$(".ProductDetails-Price");
		const productColor = await productDetails.$(".ProductDetails-Color");
		const productMaterial = await productDetails.$(".ProductDetails-Material");
		const addToCartButton = await productDetails.$(".ProductDetails-AddToCart");

		await expect(productName).toBeDisplayed();
		await expect(productDescription).toBeDisplayed();
		await expect(productPrice).toBeDisplayed();
		await expect(productColor).toBeDisplayed();
		await expect(productMaterial).toBeDisplayed();
		await expect(addToCartButton).toBeDisplayed();

		const buttonText = await addToCartButton.getText();
		await expect(buttonText).toBe("Add to Cart");
	});

	it('Должно отображаться сообщение "Item in cart", если товар уже добавлен в корзину', async ({
		browser,
	}) => {
		await browser.url(catalogUrl);

		// Находим первый товар в списке и заходим на страницу с подробной информацией
		await browser.url(firstProductUrl);

		// Находим и кликаем по кнопке "Add to Cart"
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		// Проверяем, что сообщение "Item in cart" отображается на странице товара
		const cartBadge = await browser.$(".CartBadge");
		const isCartBadgeDisplayed = await cartBadge.isDisplayed();
		await expect(isCartBadgeDisplayed).toBe(true);

		// Возвращаемся на страницу каталога
		await browser.url(catalogUrl);

		// Проверяем, что сообщение "Item in cart" отображается на карточке товара в каталоге
		const catalogCartBadge = await browser.$(".CartBadge");
		const isCatalogCartBadgeDisplayed = await catalogCartBadge.isDisplayed();
		await expect(isCatalogCartBadgeDisplayed).toBe(true);
	});

	it("Проверяем, что в навигационном элементе количество товаров в корзине отображается правильно", async ({
		browser,
	}) => {
		await browser.url(catalogUrl);

		// Находим первый товар в списке и заходим на страницу с подробной информацией
		await browser.url(firstProductUrl);

		// Находим и кликаем по кнопке "Add to Cart"
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		// Проверяем, что в навигационном элементе количество товаров в корзине отображается правильно
		const cartNavLink = await browser.$('a.nav-link[href="/hw/store/cart"]');
		const cartText = await cartNavLink.getText();
		await expect(cartText).toContain("Cart (1)");
	});

	it("Содержимое корзины должно сохраняться между перезагрузками страницы", async ({
		browser,
	}) => {
		// Открываем страницу корзины
		await browser.url(cartUrl);

		// Очищаем корзину, если есть товары
		const clearCartButton = await browser.$(".Cart-Clear");
		const isClearCartButtonDisplayed = await clearCartButton.isDisplayed();
		if (isClearCartButtonDisplayed) {
			await clearCartButton.click();
		}

		// Убедимся, что корзина пуста
		const emptyCartMessage = await browser.$(".Cart .row.mb-4 .col");
		const isEmptyCartMessageDisplayed = await emptyCartMessage.isDisplayed();
		await expect(isEmptyCartMessageDisplayed).toBe(true);
		const emptyCartText = await emptyCartMessage.getText();
		await expect(emptyCartText).toContain("Cart is empty");

		// Переходим к первому товару и добавляем его в корзину
		await browser.url(firstProductUrl);
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		// Переходим обратно в корзину и проверяем, что товар добавлен
		await browser.url(cartUrl);

		// Проверяем, что содержимое корзины отображается корректно
		const cartTable = await browser.$(".Cart-Table");
		const cartRowsAfterAdd = await cartTable.$$("tbody tr");

		// Проверяем количество элементов в корзине
		await expect(cartRowsAfterAdd.length).toBe(
			1,
			"Ожидался один товар в корзине"
		);

		// Получаем тексты деталей первого товара на странице корзины
		const productName = await cartTable.$(".Cart-Name");
		const productPrice = await cartTable.$(".Cart-Price");
		const productCount = await cartTable.$(".Cart-Count");
		const productTotal = await cartTable.$(".Cart-Total");

		const expectedName = await productName.getText();
		const expectedPrice = await productPrice.getText();
		const expectedCount = await productCount.getText();
		const expectedTotal = await productTotal.getText();

		// Перезагружаем страницу
		await browser.refresh();

		// Повторно проверяем корзину после перезагрузки
		const refreshedCartTable = await browser.$(".Cart-Table");
		const refreshedCartRows = await refreshedCartTable.$$("tbody tr");

		// Проверяем количество элементов в корзине после перезагрузки
		await expect(refreshedCartRows.length).toBe(
			1,
			"Ожидался один товар в корзине после перезагрузки"
		);

		// Получаем тексты деталей товара после перезагрузки
		const refreshedProductName = await refreshedCartTable.$(".Cart-Name");
		const refreshedProductPrice = await refreshedCartTable.$(".Cart-Price");
		const refreshedProductCount = await refreshedCartTable.$(".Cart-Count");
		const refreshedProductTotal = await refreshedCartTable.$(".Cart-Total");

		// Проверяем, что данные товара корректны после перезагрузки
		await expect(await refreshedProductName.getText()).toBe(expectedName);
		await expect(await refreshedProductPrice.getText()).toBe(expectedPrice);
		await expect(await refreshedProductCount.getText()).toBe(expectedCount);
		await expect(await refreshedProductTotal.getText()).toBe(expectedTotal);
	});
});

describe("Корзина", () => {
	it("должна отображаться кнопка 'очистить корзину' после добавления товара в корзину", async ({
		browser,
	}) => {
		// Заходим на страницу первого товара
		await browser.url(firstProductUrl);

		// Добавляем первый товар в корзину
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		// Переходим на страницу корзины
		await browser.url(cartUrl);

		// Проверяем наличие кнопки "очистить корзину"
		const clearCartButton = await browser.$(".Cart-Clear");
		const isClearCartButtonDisplayed = await clearCartButton.isDisplayed();
		await expect(isClearCartButtonDisplayed).toBe(true);
	});

	it("после нажатия на кнопку 'очистить корзину' корзина должна стать пустой", async ({
		browser,
	}) => {
		// Заходим на страницу первого товара
		await browser.url(firstProductUrl);

		// Добавляем первый товар в корзину
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		// Переходим на страницу корзины
		await browser.url(cartUrl);

		// Проверяем, что корзина не пуста перед нажатием кнопки
		const cartTableBeforeClear = await browser.$(".Cart-Table");
		const cartRowsBeforeClear = await cartTableBeforeClear.$$("tbody tr");
		await expect(cartRowsBeforeClear.length).toBeGreaterThan(
			0,
			"Ожидалось, что корзина не пуста"
		);

		// Находим и нажимаем кнопку "очистить корзину"
		const clearCartButton = await browser.$(".Cart-Clear");
		await clearCartButton.click();

		// Проверяем, что корзина стала пустой после нажатия кнопки
		const cartEmptyMessage = await browser.$(".Cart");
		const cartEmptyText = await cartEmptyMessage.getText();
		await expect(cartEmptyText).toContain(
			"Cart is empty.",
			"Ожидалось, что корзина станет пустой после очистки"
		);
	});

	it("если корзина пустая, должна отображаться ссылка на каталог товаров", async ({
		browser,
	}) => {
		// Переходим на страницу корзины
		await browser.url(cartUrl);

		// Проверяем, что корзина пустая и отображается ссылка на каталог товаров
		const cartEmptyMessage = await browser.$(".Cart");
		const cartEmptyText = await cartEmptyMessage.getText();
		await expect(cartEmptyText).toContain(
			"Cart is empty. Please select products in the catalog."
		);

		const catalogLink = await browser.$('.Cart a[href="/hw/store/catalog"]');
		const isCatalogLinkDisplayed = await catalogLink.isDisplayed();
		await expect(isCatalogLinkDisplayed).toBe(true);
	});

	it("должна отображаться таблица с добавленными товарами в корзине", async ({
		browser,
	}) => {
		// Заходим на страницу первого товара
		await browser.url(firstProductUrl);

		// Получаем данные о первом товаре
		const productDetails = await browser.$(".ProductDetails");
		const productNameElement = await productDetails.$(".ProductDetails-Name");
		const productPriceElement = await productDetails.$(".ProductDetails-Price");

		const productName1 = await productNameElement.getText();
		const productPrice1 = await productPriceElement.getText();

		// Добавляем первый товар в корзину
		const addToCartButton = await productDetails.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		// Заходим на страницу второго товара
		await browser.url(secondProductUrl);

		// Получаем данные о втором товаре
		const productDetails2 = await browser.$(".ProductDetails");
		const productNameElement2 = await productDetails2.$(".ProductDetails-Name");
		const productPriceElement2 = await productDetails2.$(
			".ProductDetails-Price"
		);

		const productName2 = await productNameElement2.getText();
		const productPrice2 = await productPriceElement2.getText();

		// Добавляем второй товар в корзину
		const addToCartButton2 = await productDetails2.$(
			".ProductDetails-AddToCart"
		);
		await addToCartButton2.click();

		// Переходим на страницу корзины
		await browser.url(cartUrl);

		// Проверяем, что таблица с товарами отображается
		const cartTable = await browser.$(".Cart-Table");
		const cartRows = await cartTable.$$("tbody tr");

		// Проверяем количество элементов в корзине
		await expect(cartRows.length).toBe(2, "Ожидались два товара в корзине");

		// Проверяем детали первого товара
		const productNameElements = await cartTable.$$(".Cart-Name");
		const productPriceElements = await cartTable.$$(".Cart-Price");
		const productCountElements = await cartTable.$$(".Cart-Count");
		const productTotalElements = await cartTable.$$(".Cart-Total");

		// Проверяем, что данные товаров корректны
		await expect(await productNameElements[0].getText()).toBe(productName1);
		await expect(await productNameElements[1].getText()).toBe(productName2);
		await expect(await productPriceElements[0].getText()).toBe(productPrice1);
		await expect(await productPriceElements[1].getText()).toBe(productPrice2);

		// Проверяем количество и общую стоимость
		const productCount1 = await productCountElements[0].getText();
		const productCount2 = await productCountElements[1].getText();
		const productTotal1 = await productTotalElements[0].getText();
		const productTotal2 = await productTotalElements[1].getText();

		await expect(productCount1).toBe("1"); // Проверяем количество первого товара
		await expect(productCount2).toBe("1"); // Проверяем количество второго товара
		await expect(productTotal1).toMatch(/\$\d+/); // Проверяем формат общей стоимости первого товара
		await expect(productTotal2).toMatch(/\$\d+/); // Проверяем формат общей стоимости второго товара

		// Проверяем общую сумму заказа
		const orderPriceElement = await cartTable.$(".Cart-OrderPrice");
		const orderPriceText = await orderPriceElement.getText();
		const expectedTotalPrice =
			parseFloat(productPrice1.slice(1)) + parseFloat(productPrice2.slice(1));
		await expect(orderPriceText).toBe(`$${expectedTotalPrice}`);
	});

	it("Проверяется валидность полей", async ({ browser }) => {
    // Находим первый товар в списке и заходим на страницу с подробной информацией
    await browser.url(secondProductUrl);

    // Находим и кликаем по кнопке "Add to Cart"
    const addToCartButton = await browser.$(".ProductDetails-AddToCart");
    await addToCartButton.click();

    // Переходим на страницу корзины
    await browser.url(cartUrl);

    // Нажимаем на кнопку "Checkout" без заполнения полей
    const checkoutButton = await browser.$(".Form-Submit");
    await checkoutButton.click();

    // Определяем поля формы
    const nameField = await browser.$("#f-name");
    const phoneField = await browser.$("#f-phone");
    const addressField = await browser.$("#f-address");

    // Проверка валидности полей
    const isNameFieldInvalid = await nameField
        .getAttribute("class")
        .then((classes) => classes.includes("is-invalid"));
    const isPhoneFieldInvalid = await phoneField
        .getAttribute("class")
        .then((classes) => classes.includes("is-invalid"));
    const isAddressFieldInvalid = await addressField
        .getAttribute("class")
        .then((classes) => classes.includes("is-invalid"));

    expect(isNameFieldInvalid).toBe(true, "Поле 'Name' должно быть невалидным");
    expect(isPhoneFieldInvalid).toBe(true, "Поле 'Phone' должно быть невалидным");
    expect(isAddressFieldInvalid).toBe(true, "Поле 'Address' должно быть невалидным");
});

	it("Заказ оформляется успешно и пользователь видит страницу с подтверждением", async ({
		browser,
	}) => {
		// Находим первый товар в списке и заходим на страницу с подробной информацией
		await browser.url(secondProductUrl);

		// Находим и кликаем по кнопке "Add to Cart"
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		await browser.url(cartUrl);

		// Заполнение формы
		const nameField = await browser.$("#f-name");
		const phoneField = await browser.$("#f-phone");
		const addressField = await browser.$("#f-address");
		const checkoutButton = await browser.$(".Form-Submit");

		await nameField.setValue("Тестовое Имя");
		await phoneField.setValue("1234567890");
		await addressField.setValue("Тестовый Адрес, 123");

		// Оформление заказа
		await checkoutButton.click();

		// Ожидание появления сообщения о подтверждении заказа
		const successMessage = await browser.$(".Cart-SuccessMessage");
		await successMessage.waitForDisplayed({ timeout: 5000 });

		// Проверка, что сообщение о подтверждении заказа отображается
		const isOrderSuccessVisible = await successMessage.isDisplayed();
		expect(isOrderSuccessVisible).toBe(true);

		// Проверка содержимого сообщения
		const successMessageText = await successMessage.getText();
		expect(successMessageText).toContain("Well done!");
		expect(successMessageText).toContain("Order #");
		expect(successMessageText).toContain("has been successfully completed.");
	});
});

describe("Страницы", () => {
	it("В магазине должна быть главная страница", async ({ browser }) => {
		await browser.url(homePageUrl);
		const homePage = await browser.$(".Home");
		await homePage.waitForDisplayed();
		await homePage.assertView("plain");
	});

	it("В магазине должна быть страница каталога", async ({ browser }) => {
		await browser.url(catalogUrl);
		const catalog = await browser.$(".Catalog");
		await catalog.waitForDisplayed();
		await catalog.assertView("plain");
	});

	it("В магазине должна быть страница условия доставки", async ({
		browser,
	}) => {
		await browser.url(deliveryUrl);
		const deliveryPage = await browser.$(".Delivery");
		await deliveryPage.waitForDisplayed();
		await deliveryPage.assertView("plain");
	});

	it("В магазине должна быть страница условия контакты", async ({
		browser,
	}) => {
		await browser.url(contactsUrl);
		const contactsPage = await browser.$(".Contacts");
		await contactsPage.waitForDisplayed();
		await contactsPage.assertView("plain");
	});

	it("Страница товара отображается корректно", async ({
		browser,
	}) => {
		await browser.url(firstProductUrl);
		const productPage = await browser.$(".Product");
		await productPage.waitForDisplayed();
		await productPage.assertView("plain");
	});

	it("Страница успешного заказа отображается корректно", async ({
		browser,
	}) => {
		await browser.url(secondProductUrl);

		// Находим и кликаем по кнопке "Add to Cart"
		const addToCartButton = await browser.$(".ProductDetails-AddToCart");
		await addToCartButton.click();

		await browser.url(cartUrl);

		// Заполнение формы
		const nameField = await browser.$("#f-name");
		const phoneField = await browser.$("#f-phone");
		const addressField = await browser.$("#f-address");
		const checkoutButton = await browser.$(".Form-Submit");

		await nameField.setValue("Тестовое Имя");
		await phoneField.setValue("1234567890");
		await addressField.setValue("Тестовый Адрес, 123");

		// Оформление заказа
		await checkoutButton.click();
		
		const cartMessage = await browser.$(".Cart-SuccessMessage");
		await cartMessage.waitForDisplayed();
		await cartMessage.assertView("plain");
	});
});

describe("Проверка ссылок в шапке магазина", () => {
	it("должны отображаться ссылки на страницы магазина и корзину", async ({
		browser,
	}) => {
		await browser.url(homePageUrl);

		const navbar = await browser.$(".navbar");

		const navbarLinks = await navbar.$$(".navbar-nav a.nav-link");

		for (const link of navbarLinks) {
			const href = await link.getAttribute("href");
			const text = await link.getText();

			if (text === "Contacts") {
				expect(link).toHaveAttribute("aria-current", "page");
			}

			switch (text) {
				case "Catalog":
					expect(href).toEqual(`/hw/store/catalog`);
					break;
				case "Delivery":
					expect(href).toEqual(`/hw/store/delivery`);
					break;
				case "Cart":
					expect(href).toEqual(`/hw/store/cart`);
					break;
				default:
					break;
			}
		}
	});

	it("навигационное меню должно скрываться за 'гамбургером' при ширине менее 576px", async ({
		browser,
	}) => {
		await browser.url(homePageUrl);

		await browser.setWindowSize(575, 600);

		const navbarToggler = await browser.$(
			".Application-Toggler.navbar-toggler"
		);

		await navbarToggler.click();

		const applicationMenu = await browser.$(".Application-Menu");
		const isMenuVisible = await applicationMenu.isDisplayed();

		expect(isMenuVisible).toBe(true);
	});

	it("меню должно закрываться при выборе элемента", async ({ browser }) => {
		await browser.url(homePageUrl);

		await browser.setWindowSize(575, 600); // Устанавливаем ширину окна меньше 576px

		// Находим кнопку "гамбургер" и кликаем по ней
		const navbarToggler = await browser.$(
			".Application-Toggler.navbar-toggler"
		);
		await navbarToggler.click();

		// Нажимаем на элемент меню "Catalog"
		const catalogLink = await browser.$("a.nav-link[href='/hw/store/catalog']");
		await catalogLink.click();

		// Проверяем, что меню закрылось
		const applicationMenu = await browser.$(".Application-Menu");
		const isMenuVisible = await applicationMenu.isDisplayed();

		expect(isMenuVisible).toBe(false);
	});
});
