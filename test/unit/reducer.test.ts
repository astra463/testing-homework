import { ApplicationState, createRootReducer } from '../../src/client/store';  // Подставьте свой путь к файлу с редьюсером
import { productsLoaded, productDetailsLoaded, addToCart, clearCart, checkoutComplete } from '../../src/client/store';  // Импортируйте все ваши action creators
import { CartState, Product, ProductShortInfo } from '../../src/common/types';

describe('Reducer tests', () => {
    test('PRODUCTS_LOADED action', () => {
        const initialState: ApplicationState = { details: {}, cart: {} };
        const products: ProductShortInfo[] = [{ id: 1, name: 'Product 1', price: 10 }];
        const state = createRootReducer(initialState)({details: {}, cart: {}}, productsLoaded(products));

        expect(state.products).toEqual(products);
    });

    test('PRODUCT_DETAILS_LOADED action', () => {
        const initialState: ApplicationState = { details: {}, cart: {} };
        const product: Product = { id: 1, name: 'Product 1', price: 10, description: '', material: '', color: '' };
        const state = createRootReducer(initialState)({details: {}, cart: {}}, productDetailsLoaded(product));

        expect(state.details[1]).toEqual(product);
    });

    test('ADD_TO_CART action', () => {
        const initialState: ApplicationState = { details: {}, cart: {} };
        const product: Product = { id: 1, name: 'Product 1', price: 10, description: '', material: '', color: '' };
        const state = createRootReducer(initialState)({details: {}, cart: {}}, addToCart(product));

        expect(state.cart[1].count).toBe(1);
    });

    test('CLEAR_CART action', () => {
        const initialCartState: CartState = { 1: { name: 'Product 1', price: 10, count: 1 } };
        const initialState: ApplicationState = { details: {}, cart: initialCartState };
        const state = createRootReducer(initialState)({details: {}, cart: {}}, clearCart());

        expect(state.cart).toEqual({});
    });

    test('CHECKOUT_COMPLETE action', () => {
        const initialCartState: CartState = { 1: { name: 'Product 1', price: 10, count: 1 } };
        const initialState: ApplicationState = { details: {}, cart: initialCartState, latestOrderId: undefined };
        const state = createRootReducer(initialState)({details: {}, cart: {}}, checkoutComplete(123));

        expect(state.latestOrderId).toBe(123);
        expect(state.cart).toEqual({});
    });
});
