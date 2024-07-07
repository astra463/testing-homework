import * as actions from '../../src/client/store';
import { ProductShortInfo } from '../../src/common/types';

describe('actions', () => {
    it('should create an action to load products', () => {
        const expectedAction = { type: 'PRODUCTS_LOAD' };
        expect(actions.productsLoad()).toEqual(expectedAction);
    });

    it('should create an action to load products successfully', () => {
        const products: ProductShortInfo[] = [{ id: 1, name: 'Product 1', price: 100 }];
        const expectedAction = { type: 'PRODUCTS_LOADED', products };
        expect(actions.productsLoaded(products)).toEqual(expectedAction);
    });

});
