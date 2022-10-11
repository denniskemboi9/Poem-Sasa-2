import './App.css';
import { useState, useEffect } from 'react';
import Nav from "./components/Nav";
import Home from './components/Home';
import Create from './components/Create';
import Collection from './components/Collection';
import Like from './components/Like';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    const [poems, setPoems] = useState([]);

    const [likes, setLikes] = useState([]);
    const [collection, setCollection] = useState([]);



    const [user, setUser] = useState(localStorage.getItem('fuser') || null);

    const fetchLikes = async () => {
        const res = await fetch('https://shrouded-everglades-59715.herokuapp.com/users/' + user);
        const data = await res.json();
        if (data.likes) {
            setLikes([...likes, ...data.liked])
        }

    }

    // useCallback(fetchLikes,[likes]);
    useEffect(() => {
        fetchLikes();
    }, []);
    const fetchCollection = async () => {
        const res = await fetch('https://shrouded-everglades-59715.herokuapp.com/users/' + user);
        const data = await res.json();
        if (data.collection) {
            setCollection([...collection, ...data.collection])
        }


    }

    // useCallback(fetchCollection,[collection]);
    useEffect(() => {
        fetchCollection();
    }, []);

    useEffect(() => {
        if (!user) {
            let usr = Date.now();
            localStorage.setItem('fuser', usr);
            fetch("https://shrouded-everglades-59715.herokuapp.com/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: usr,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                });
            setUser(usr);
        }
        fetch("https://shrouded-everglades-59715.herokuapp.com/poems")
            .then((res) => res.json())
            .then((data) => {
                setPoems(data);

            });
        // fetchLiked()
        // fetchCollection()


    }, []);
    function addToCollection(id) {
        if (!collection.includes(id)) {
            fetch(`https://shrouded-everglades-59715.herokuapp.com/users/${user}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collection: [...collection, id]
                })
            })

        }
    }

    function addToLiked(id) {
        //patch to user where user = user
        //add title to liked
        console.log(id)
        let totalLikes = likes;
        if (likes.includes(id)) {
            //unlike
            totalLikes = likes.filter((item) => item !== id)
        } else {
            //like
            totalLikes = [...likes, id]
        }

        fetch(`https://shrouded-everglades-59715.herokuapp.com/users/${user}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                liked: totalLikes
            })
        })
            .then(res => res.json())
            .then(() => {
                setLikes(totalLikes)
            })

    }
    function handleAdd(e) {
        e.preventDefault();
        const newPoem = {
            title: e.target.title.value,
            content: e.target.content.value,
            poet: {
                name: e.target.name.value,
            }
        }
        fetch("https://shrouded-everglades-59715.herokuapp.com/poems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPoem),
        })
            .then((res) => res.json())
            .then((data) => {
                setPoems([...poems, data]);
            });
    }
    console.log(likes)
    const likedPoems = poems.filter(poem => likes.includes(poem.id))
    const collectionPoems = poems.filter(poem => collection.includes(poem.id))
    // console.log(likes)

    return (
        <div className="App">

            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/poem-gram/personal" element={<Collection poems={collectionPoems} />} />
                    <Route path="/poem-gram/liked" element={<Like poems={likedPoems} />} />
                    <Route path="/poem-gram/create" element={<Create handleAdd={handleAdd} />} />
                    <Route path="/poem-gram/" element={<Home poems={poems} addToCollection={addToCollection} addToLiked={addToLiked} likes={likes} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;