import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Container } from 'react-bootstrap'
import { URL } from '../../shared/Constants'
import Navigation from '../../shared/Navigation'

class AddLineView extends React.Component {
    constructor() {
        super();
        this.state = {
            back: false,
            idLinije: "",
            naziv: "",
            kompanija: "",
            zracnaLukaDolaska: "",
            zracnaLukaPolaska: ""
        }
        this.return = this.return.bind(this)  
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this) 
    }

    return() {
        this.setState({
            back: true
        })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })
    }
    
    async handleSubmit(event) {
        event.preventDefault()
        let data = {
            naziv: this.state.naziv,
            kompanija: this.state.kompanija,
            zracnaLukaDolaska: this.state.zracnaLukaDolaska,
            zracnaLukaPolaska: this.state.zracnaLukaPolaska
        }
        console.log(data)
        axios.post(URL + '/addLine', data)
            .then(response => {
                console.log(response.status)
                window.location = "/"
            })
            .catch(error => {
                console.log(error)
        })
    }

    render() {
        if (this.state.back) {
            localStorage.removeItem('linija');
            return <Navigate to='/' />
        }

        return (
            <Container className="Margin-top font">
                <br />
                <Navigation  />
                <hr />
                <div className="w-100">
                        <div className="d-flex justify-content-center font">
                            <h3 className="text-center w-25 pozadina">Dodaj novu liniju</h3>
                        </div>
                        <form onSubmit={this.handleSubmit} className="w-100 container">
                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Naziv</label>
                                    <input type="text" required name="naziv" value={this.state.naziv} className="form-control" placeholder={this.state.naziv} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Zračna luka polaska</label>
                                    <input type="text" required name="zracnaLukaPolaska" value={this.state.zracnaLukaPolaska} className="form-control" placeholder={this.state.zracnaLukaPolaska} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Zračna luka dolaska</label>
                                    <input type="text" required name="zracnaLukaDolaska" value={this.state.zracnaLukaDolaska} className="form-control" placeholder={this.state.zracnaLukaDolaska} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Kompanija</label>
                                    <input type="text" required name="kompanija" value={this.state.kompanija} className="form-control" placeholder={this.state.kompanija} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="my-2 col-md-12 text-center">
                                <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Dodaj</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                </div>
            </Container>
        );
    }
}

export default AddLineView;