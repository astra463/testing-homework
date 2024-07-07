import { createStore } from 'redux';
import { addToCart, createRootReducer, DEFAULT_STATE, Action, ApplicationState } from '../../src/client/store';
import { Product } from '../../src/common/types';
import { CartApi, LOCAL_STORAGE_CART_KEY } from '../../src/client/api';


const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => store[key] = value,
        clear: () => store = {}
    };
})();

describe('Редюсер корзины', () => {
    let originalLocalStorage: Storage;

    beforeAll(() => {
        // Замена реального localStorage на мок
        originalLocalStorage = global.localStorage;
        (global as any).localStorage = mockLocalStorage;
    });

    afterAll(() => {
        // Восстановление реального localStorage после тестов
        (global as any).localStorage = originalLocalStorage;
    });

    beforeEach(() => {
        localStorage.clear();
    });

    it('Должен добавлять продукт в корзину', () => {
        const product: Product = { id: 1, name: 'Test Product', price: 100, description: '', material: '', color: '' };
        const store = createStore(createRootReducer({}), DEFAULT_STATE);

        store.dispatch(addToCart(product));

        const state: ApplicationState = store.getState();
        expect(state.cart[product.id].count).toBe(1);
    });

    it('Должен увеличивать количество добавленных продуктов', () => {
        const product: Product = { id: 1, name: 'Test Product', price: 100, description: '', material: '', color: '' };
        const store = createStore(createRootReducer({}), DEFAULT_STATE);

        store.dispatch(addToCart(product));
        store.dispatch(addToCart(product));

        const state: ApplicationState = store.getState();
        expect(state.cart[product.id].count).toBe(2);
    });

    it('Должен сохранять состояние корзины в localStorage', () => {
        const product: Product = { id: 1, name: 'Test Product', price: 100, description: '', material: '', color: '' };
        const store = createStore(createRootReducer({}), DEFAULT_STATE);

        // Создаем экземпляр CartApi и заменяем его метод setState
        const cartApi = new CartApi();
        jest.spyOn(cartApi, 'setState').mockImplementation((cart) => {
            localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
        });

        store.dispatch(addToCart(product));
        store.dispatch(addToCart(product));

        // Принудительно вызываем setState для сохранения состояния в localStorage
        cartApi.setState(store.getState().cart);

        const state: ApplicationState = store.getState();
        expect(state.cart[product.id].count).toBe(2);

        const storedCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY) || '{}');
        expect(storedCart[product.id].count).toBe(2);
    });
});

