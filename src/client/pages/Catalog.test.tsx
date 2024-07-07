import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios, { AxiosResponse } from 'axios'; // Убедитесь, что импортируете AxiosResponse для правильной типизации

// Мокируем axios
jest.mock('axios');

const mockProducts = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
];

describe('Catalog component', () => {
    let store;
    beforeEach(() => {
        const mockStore = configureStore([]);
        store = mockStore({
            products: mockProducts,
        });
    });

    it('renders products from API', async () => {
        // Заглушка для axios.get
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockProducts } as AxiosResponse<any>);

        const { getByText } = render(
            <Provider store={store}>
                <Catalog />
            </Provider>
        );

        // Ждем, пока компонент загрузит данные
        await waitFor(() => {
            expect(getByText('Product 1')).toBeInTheDocument();
            expect(getByText('Product 2')).toBeInTheDocument();
        });
    });
});
