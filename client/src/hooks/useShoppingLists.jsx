import {useMemo} from "react";

export const useSortedShoppingLists = (shoppingLists, sort) => {
    return useMemo(() => {
        console.log('Sort posts function called.')
        if (sort) {
            return [...shoppingLists].sort((a, b) => a[sort].localeCompare(b[sort]));
        }
        return shoppingLists;
    }, [sort, shoppingLists]);
}

export const useShoppingLists = (shoppingLists, sort, query) => {
    const sortedShoppingLists = useSortedShoppingLists(shoppingLists, sort);

    return useMemo(() => {
        return sortedShoppingLists.filter(shoppingList => shoppingList.name.toLowerCase().includes(query.toLowerCase()));
    }, [query, sortedShoppingLists]);
}