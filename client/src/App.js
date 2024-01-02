import React, {useState} from 'react';
import './styles/App.css';
import ShoppingListList from "./components/ShoppingListList";
import MyButton from "./components/UI/buttons/MyButton";
import ShoppingListForm from "./components/ShoppingListForm";
import ShoppingListFilter from "./components/ShoppingListFilter";
import MyModal from "./components/UI/modal/MyModal";
import {useShoppingLists} from "./hooks/useShoppingLists";
import axios from "axios";

function App() {

    const [shoppingLists, setShoppingLists] = useState([]);
    const [modal, setModal] = useState(false);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const sortedAndSearchedShoppingLists = useShoppingLists(shoppingLists, filter.sort, filter.query);

    async function fetchShoppingLists(){
        try {
            const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTdkZjQ1ZjIzNTBmYjFmZDIzNmU3NTEiLCJ1c2VybmFtZSI6ImRndnNwYW1tZXIiLCJpYXQiOjE3MDQyMDg3MDAsImV4cCI6MTcwNDIxMjMwMH0.ClZvjP5472S7Ku3SkQ471fhLeSjow6CQ5W2HG_ti_hs';
            const response = await axios.get("http://localhost:3000/shoppingLists/all", {
                headers: {
                    Authorization: `${jwtToken}`, // Replace with your actual access token
                },
            });
            setShoppingLists(response.data);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    }

    const createShoppingList = (newShoppingList) => {
        setShoppingLists([...shoppingLists, newShoppingList]);
        setModal(false);
    }

    const deleteShoppingList = (shoppingList) => {
        setShoppingLists(shoppingLists.filter(p => p._id !== shoppingList._id));
    }

    return (
        <div className="App">
            <MyButton onClick={fetchShoppingLists}>get shopping lists</MyButton>
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
