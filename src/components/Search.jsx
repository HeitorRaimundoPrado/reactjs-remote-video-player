import React from 'react'
import ReactDOM from 'react-dom'
import '../../src/style/Search.scss'

export default function Search() {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="submit"/>
                <input type="text"/>
                <button>
                  <img src="magnifying-glass-solid.svg" alt="search"/>
                </button>
            </form>
        </>
    )
}
