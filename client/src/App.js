import React, {useState} from 'react';
import './styles/App.css';
import ShoppingListList from "./components/ShoppingListList";
import MyButton from "./components/UI/buttons/MyButton";
import ShoppingListForm from "./components/ShoppingListForm";
import ShoppingListFilter from "./components/ShoppingListFilter";
import MyModal from "./components/UI/modal/MyModal";
import {usePosts} from "./hooks/usePosts";
import axios from "axios";

function App() {

    const [shoppingLists, setShoppingLists] = useState([
        {id: 1, title: 'aa', body: 'bb'},
        {id: 2, title: 'we', body: 'ab'},
        {id: 3, title: 'Jw', body: 'aa'}
    ])
    const [modal, setModal] = useState(false);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const sortedAndSearchedShoppingLists = usePosts(shoppingLists, filter.sort, filter.query);

    async function fetchShoppingLists(){
        const response = await axios.get("http://localhost:3000/shoppingLists/all");
        console.log(response.data);
    }

    const createShoppingList = (newShoppingList) => {
        setShoppingLists([...shoppingLists, newShoppingList]);
        setModal(false);
    }

    const deleteShoppingList = (shoppingList) => {
        setShoppingLists(shoppingLists.filter(p => p.id !== shoppingList.id));
    }

    return (
        <div className="App">
            <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
                Create shopping list
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <ShoppingListForm create={createShoppingList}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <ShoppingListFilter
                filter={filter}
                setFilter={setFilter}
            />
            <ShoppingListList deleteShoppingList={deleteShoppingList}
                              shoppingLists={sortedAndSearchedShoppingLists}
                              title="Shopping List list 1"
            />
        </div>
    );
}

export default App;
