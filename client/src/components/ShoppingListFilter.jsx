import React, {useState} from 'react';
import MyInput from "./UI/input/MyInput";
import MySelect from "./UI/select/MySelect";

const ShoppingListFilter = ({filter, setFilter}) => {

    return (
        <div>
            <MyInput
                value={filter.query}
                placeholder="Search..."
                onChange={e => setFilter({...filter, query: e.target.value})}
            />
            <MySelect value={filter.sort}
                      onChange={selectedSort => setFilter({...filter, sort: selectedSort})}
                      defaultValue="Filter by"
                      options={[
                          {value: 'title', name: 'By name'},
                          {value: 'body', name: 'By description'}
                      ]}
            />
        </div>
    );
};

export default ShoppingListFilter;