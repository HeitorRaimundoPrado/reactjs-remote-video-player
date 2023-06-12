import React from 'react'
import ReactDOM from 'react-dom'
import '../../src/style/Search.scss'

export default function Search() {
    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <form onSubmit={handleSubmit}>
                <input type="submit"/>
                <input type="text"/>
                <button>
                <span className="material-symbols-outlined">
                    search
                </span>
                </button>
            </form>
        </>
    )
}