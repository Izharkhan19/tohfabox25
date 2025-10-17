import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
    search: string;
    category: string;
}

const initialState: FiltersState = { search: '', category: '' };

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => { state.search = action.payload; },
        setCategory: (state, action: PayloadAction<string>) => { state.category = action.payload; },
    },
});

export const { setSearch, setCategory } = filtersSlice.actions;
export default filtersSlice.reducer;