import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Alert } from 'react-bootstrap'
import { URL } from '../../shared/Constants'
import Navigation from '../../shared/Navigation'

class AddPassengerView extends React.Component {
    constructor() {
        super();
        this.state = {
            back: false,
            idKorisnik: "",
            let: "",
            ime: "",
            prezime: "",
            klasaKarte: "",
            brojSjedala: "",
            prtljaga: "",
            errorText: "",
            addError: false
        }
        this.return = this.return.bind(this)  
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this) 
    }

    componentDidMount() {
        var data = localStorage.getItem('let');
        var idLeta = JSON.parse(data);
        //console.log(linija)
        //console.log(linija.naziv)

        this.setState({
            idLeta: idLeta
        })
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
            idLeta: this.state.idLeta,
            ime: this.state.ime,
            prezime: this.state.prezime,
            klasaKarte: this.state.klasaKarte,
            brojSjedala: this.state.brojSjedala,
            prtljaga: this.state.prtljaga
        }
        console.log(data)
        axios.post(URL + '/addPassenger', data)
            .then(response => {
                if (response.data !== "Mjesto zauzeto") {
                    console.log(response.status)
                    localStorage.removeItem('putnik');
                    localStorage.removeItem('let');
                    window.location = "/passengers"
                }else{
                    this.setState({
                        addError: true,
                        errorText: response.data
                    })
                }   
            })
            .catch(error => {
                console.log(error)
        })
    }

    render() {
        if (this.state.back) {
            localStorage.removeItem('let');
            return <Navigate to='/passengers' />
        }

        return (
            <Container className="Margin-top font">
                <br />
                <Navigation  />
                <hr />
                <div className="w-100">
                        <div className="d-flex justify-content-center font">
                            <h3 className="text-center w-25 pozadina">Dodaj novog putnika</h3>
                        </div>
                        <form onSubmit={this.handleSubmit} className="w-100 container">
                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Ime</label>
                                    <input type="text" required name="ime" value={this.state.ime} className="form-control" placeholder={this.state.ime} onChange={this.handleChange} />
                                </div>
                            </div>
                            
                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Prezime</label>
                                    <input type="text" required name="prezime" value={this.state.prezime} className="form-control" placeholder={this.state.prezime} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Klasa karte</label>
                                    <input type="text" required name="klasaKarte" value={this.state.klasaKarte} className="form-control" placeholder={this.state.klasaKarte} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Broj sjedala</label>
                                    <input type="text" required name="brojSjedala" value={this.state.brojSjedala} className="form-control" placeholder={this.state.brojSjedala} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Količina prtljage</label>
                                    <input type="text" required name="prtljaga" value={this.state.prtljaga} className="form-control" placeholder={this.state.prtljaga} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="my-2 col-md-12 text-center">
                                <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Dodaj</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                        {this.state.addError &&
                            <div className="mt-3 mx-5"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
                </div>
            </Container>
        );
    }
}

export default AddPassengerView;