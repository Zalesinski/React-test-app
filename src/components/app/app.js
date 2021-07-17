import React, {Component} from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';

import './app.css';

let ids = [1, 2, 3];
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getId() {
    let id = random(1, 9999);
    while (ids.includes(id)) {
        id = random(1, 9999);
    }
    ids.push(id);
    return id;
}

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data : [
                {label: 'Going to learn React', important: true, like: true, id: 1},
                {label: 'Need some rest...', important: false, like: false, id: 2},
                {label: 'Working from home', important: false, like: false, id: 3}
            ],
            term: '',
            filter: 'all'
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onToggleImportant = this.onToggleImportant.bind(this);
        this.onToggleLiked = this.onToggleLiked.bind(this);
        this.onUpdateSearch = this.onUpdateSearch.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this);
 
    }

    deleteItem(id) {
        this.setState(({data}) => {
            const index = data.findIndex((elem) => elem.id === id);

            const before = data.slice(0, index);
            const after = data.slice(index + 1);

            const newArr = [...before, ...after];
            return {
                data: newArr
            }
        });
    }

    addItem(body) {
        const newItem = {
            label: body,
            important: false,
            id: getId()
        }

        this.setState(({data}) => {
            const newArr = [...data, newItem];
            return {
                data: newArr
            }
        });
    }

    toggle(id, item) {
        this.setState(({data}) => {
            const index =  data.findIndex(elem => elem.id === id);

            const old = data[index];
            const newItem = {...old, [item]: !old[item]};

            const newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];

            return {
                data: newArr
            }
        });
    }
    onToggleLiked(id) {
        this.toggle(id, 'like')
    }

    onToggleImportant(id) {
        this.toggle(id, 'important')
    }

    searchPost(items, term) {
        if(term.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.indexOf(term) > -1
        });
    }

    filterPost(items, filter) {
        if (filter === 'like') {
            return items.filter(item => item.like);
        } else {
            return items;
        }
    }

    onUpdateSearch(term) {
        this.setState({term});
    }

    onFilterSelect(filter) {
        this.setState({filter});
    }

    render() {
        const {data, term, filter} = this.state;

        const allPosts = data.length;
        const liked = data.filter(item => item.like).length;
        
        const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

        return (
            <div className="app">
                 <AppHeader
                 liked={liked}
                 allPosts={allPosts}
                 />
                 <div className="search-panel d-flex">
                    <SearchPanel
                    onUpdateSearch={this.onUpdateSearch}
                    />
                    <PostStatusFilter
                    filter={filter}
                    onFilterSelect={this.onFilterSelect}
                    />
                 </div>
                 <PostList 
                    posts={visiblePosts} 
                    onDelete={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleLiked={this.onToggleLiked}/>
                 <PostAddForm
                    onAdd={this.addItem}/>
            </div>
         )
    }
}
