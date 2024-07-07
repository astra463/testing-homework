import { createStore } from 'redux';
import { addToCart, createRootReducer, DEFAULT_STATE, Action, ApplicationState } from '../../src/client/store';
import { Product } from '../../src/common/types';
import { CartApi, LOCAL_STORAGE_CART_KEY } from '../../src/client/api';


// Мокирование localStorage для тестов
// const mockLocalStorage = (() => {
//     let store: { [key: string]: string } = {};
//     return {
//         getItem: (key: string) => store[key] || null,
//         setItem: (key: string, value: string) => store[key] = value,
//         clear: () => store = {}
//     };
// })();

// describe('Cart Reducer', () => {
//     let originalLocalStorage: Storage;

//     beforeAll(() => {
//         // Замена реального localStorage на мок
//         originalLocalStorage = global.localStorage;
//         (global as any).localStorage = mockLocalStorage;
//     });

//     afterAll(() => {
//         // Восстановление реального localStorage после тестов
//         (global as any).localStorage = originalLocalStorage;
//     });

//     beforeEach(() => {
//         localStorage.clear();
//     });

//     it('should add item to cart', () => {
//         const product: Product = { id: 1, name: 'Test Product', price: 100, description: '', material: '', color: '' };
//         const store = createStore(createRootReducer({}), DEFAULT_STATE);

//         store.dispatch(addToCart(product));

//         const state: ApplicationState = store.getState();
//         expect(state.cart[product.id].count).toBe(1);
//     });

//     it('should increase item count when adding the same item again', () => {
//         const product: Product = { id: 1, name: 'Test Product', price: 100, description: '', material: '', color: '' };
//         const store = createStore(createRootReducer({}), DEFAULT_STATE);

//         store.dispatch(addToCart(product));
//         store.dispatch(addToCart(product));

//         const state: ApplicationState = store.getState();
//         expect(state.cart[product.id].count).toBe(2);
//     });

//     it('should persist cart state to localStorage', () => {
//         const product: Product = { id: 1, name: 'Test Product', price: 100, description: '', material: '', color: '' };
//         const store = createStore(createRootReducer({}), DEFAULT_STATE);

//         // Создаем экземпляр CartApi и заменяем его метод setState
//         const cartApi = new CartApi();
//         jest.spyOn(cartApi, 'setState').mockImplementation((cart) => {
//             localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
//         });

//         store.dispatch(addToCart(product));
//         store.dispatch(addToCart(product));

//         // Принудительно вызываем setState для сохранения состояния в localStorage
//         cartApi.setState(store.getState().cart);

//         const state: ApplicationState = store.getState();
//         expect(state.cart[product.id].count).toBe(2);

//         const storedCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY) || '{}');
//         expect(storedCart[product.id].count).toBe(2);
//     });
// });

