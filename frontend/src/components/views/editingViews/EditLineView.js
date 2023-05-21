import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Container } from 'react-bootstrap'
import { URL } from '../../shared/Constants'
import Navigation from '../../shared/Navigation'

class EditLineView extends React.Component {
    constructor() {
        super();
        this.state = {
            back: false,
            idLinije: "",
            naziv: "",
            kompanija: "",
            zracnaLukaDolaska: "",
            zracnaLukaPolaska: "",
            updateError: false,
            errorText: ""
        }
        this.return = this.return.bind(this)  
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this) 
    }

    componentDidMount() {
        var data = localStorage.getItem('linija');
        var linija = JSON.parse(data);
        //console.log(linija)
        //console.log(linija.naziv)

        this.setState({
            idLinije: linija.idLinije,
            naziv: linija.naziv,
            kompanija: linija.kompanija,
            zracnaLukaDolaska: linija.zracnaLukaDolaska,
            zracnaLukaPolaska: linija.zracnaLukaPolaska
        })
    }

    return() {
        localStorage.removeItem('linija');
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
            idLinije: this.state.idLinije,
            naziv: this.state.naziv,
            kompanija: this.state.kompanija,
            zracnaLukaDolaska: this.state.zracnaLukaDolaska,
            zracnaLukaPolaska: this.state.zracnaLukaPolaska
        }
        console.log(data)
        axios.post(URL + '/editLine', data)
            .then(response => {
                console.log(response.status)
                localStorage.removeItem('linija');
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
                            <h3 className="text-center w-25 pozadina">Uredi liniju</h3>
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
                                <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Uredi</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                        {this.state.updateError &&
                    <div className="mt-3 mx-5"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
                </div>
            </Container>
        );
    }
}

export default EditLineView;