import React from 'react';
import MyButton from "./UI/buttons/MyButton";

const ShoppingListItem = (props) => {
    return (
        <div className="shoppingList">
            <div className="shoppingList__content">
                <strong>{props.number}. {props.shoppingList.title}</strong>
                <div>
                    {props.shoppingList.body}
                </div>
            </div>
            <div className="shoppingList__btns">
                <MyButton onClick={() => props.deleteShoppingList(props.shoppingList)}>
                    Delete
                </MyButton>
            </div>
        </div>
    );
};

export default ShoppingListItem;