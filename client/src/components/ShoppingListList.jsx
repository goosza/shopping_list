import React from 'react';
import ShoppingListItem from "./ShoppingListItem";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const ShoppingListList = ({shoppingLists, title, deleteShoppingList}) => {
    if (!shoppingLists.length){
        return (
            <h1 style={{textAlign: 'center'}}>
                No shopping lists
            </h1>
        )
    }
    return (
        <div>
            <h1 style={{textAlign: "center"}}>
                {title}
            </h1>
            <TransitionGroup>
                {shoppingLists.map((shoppingList, index) =>
                    <CSSTransition
                        key={shoppingList._id}
                        timeout={500}
                        classNames="shoppingList"
                    >
                        <ShoppingListItem deleteShoppingList={deleteShoppingList} number={index + 1} shoppingList={shoppingList}/>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
};

export default ShoppingListList;