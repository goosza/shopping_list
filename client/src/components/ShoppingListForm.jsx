import React, {useState} from 'react';
import MyInput from "./UI/input/MyInput";
import MyButton from "./UI/buttons/MyButton";

const ShoppingListForm = ({create}) => {

    const [shoppingList, setShoppingList] = useState({
        name: '',
        description: ''
    });

    const addNewShoppingList = (e) => {
        e.preventDefault();
        const newShoppingList = {
            ...shoppingList, _id: Date.now()
        }
        create(newShoppingList);
        setShoppingList({name: '', description: ''});
    }

    return (
        <div>
            <form>
                <MyInput type="text"
                         placeholder="Shopping list name"
                         value={shoppingList.name}
                         onChange={e => setShoppingList({...shoppingList, name: e.target.value})}/>
                <MyInput type="text" placeholder="Shopping list description"
                         value={shoppingList.description}
                         onChange={e => setShoppingList({...shoppingList, description: e.target.value})}/>
                <MyButton onClick={addNewShoppingList}>Create</MyButton>
            </form>
        </div>
    );
};

export default ShoppingListForm;