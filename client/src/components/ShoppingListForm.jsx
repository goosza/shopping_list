import React, {useState} from 'react';
import MyInput from "./UI/input/MyInput";
import MyButton from "./UI/buttons/MyButton";

const ShoppingListForm = ({create}) => {

    const [shoppingList, setShoppingList] = useState({
        title: '',
        body: ''
    });

    const addNewShoppingList = (e) => {
        e.preventDefault();
        const newShoppingList = {
            ...shoppingList, id: Date.now()
        }
        create(newShoppingList);
        setShoppingList({title: '', body: ''});
    }

    return (
        <div>
            <form>
                <MyInput type="text"
                         placeholder="Shopping list name"
                         value={shoppingList.title}
                         onChange={e => setShoppingList({...shoppingList, title: e.target.value})}/>
                <MyInput type="text" placeholder="Shopping list description"
                         value={shoppingList.body}
                         onChange={e => setShoppingList({...shoppingList, body: e.target.value})}/>
                <MyButton onClick={addNewShoppingList}>Create</MyButton>
            </form>
        </div>
    );
};

export default ShoppingListForm;