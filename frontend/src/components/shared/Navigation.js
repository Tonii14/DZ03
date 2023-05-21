import React from "react";
import '../../styles/index.css'

class Navigation  extends React.Component {
    constructor() {
        super()
        this.clearStorage = this.clearStorage.bind(this)
    }
        
    clearStorage(){
        localStorage.clear();
    }

    render() {
        return (
                <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse text-primary" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="/" onClick={() => this.clearStorage()}>Linije</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/passengers" onClick={() => this.clearStorage()}>Putnici</a>
                            </li>
                        </ul>
                    </div>
                    <h1 className="text-center mb-3 font">ZRAČNA LUKA</h1>   
                </nav>
        )
    }
}

export default Navigation ;